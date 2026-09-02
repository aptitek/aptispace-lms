import type { ActionFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import {
  getUserWithAffiliations,
  getUserById,
  createUser,
  createAffiliation,
} from "~/services/userService";
import { institutions, errorReports } from "~/db/schema";
import { logAudit } from "~/services/assessmentService";
import type { UserRole } from "~/utils/auth";
import {
  getSession,
  signSessionToken,
  createSessionCookieHeader,
  type SessionPayload,
} from "~/utils/session.server";

function isImpersonationPermitted(
  isDev: boolean,
  session: SessionPayload | null,
): boolean {
  if (isDev) return true;
  return Boolean(
    session && (session.role === "admin" || session.impersonating),
  );
}

function extractUserFullName(user: {
  firstName?: string | null;
  lastName?: string | null;
}): string {
  const first = user.firstName ? user.firstName.trim() : "";
  const last = user.lastName ? user.lastName.trim().toUpperCase() : "";
  return `${first} ${last}`.trim();
}

function formatDbUserResult(
  user: NonNullable<Awaited<ReturnType<typeof getUserWithAffiliations>>>,
  fallbackRole: UserRole = "student",
) {
  const primaryAffiliation = user.affiliations[0];
  const fullName = extractUserFullName(user);
  const email = primaryAffiliation?.email || "user@aptitek.io";
  const role = (primaryAffiliation?.role as UserRole) || fallbackRole;

  return {
    targetUserId: user.id,
    targetDisplayName: user.displayName || fullName || "User",
    targetUserEmail: email,
    targetUserRole: role,
  };
}

function resolvePersonaFallback(
  userId?: string,
  _personaId?: string,
  role?: UserRole,
) {
  const resolvedRole = role ?? "student";
  return {
    targetUserId: userId || `user-${resolvedRole}`,
    targetUserRole: resolvedRole,
    targetUserEmail: `${resolvedRole}@aptitek.io`,
    targetDisplayName: `${resolvedRole.charAt(0).toUpperCase() + resolvedRole.slice(1)} User`,
  };
}

async function resolveDbTargetUser(
  db: Database,
  targetId: string,
  fallbackRole?: UserRole,
) {
  const user = await getUserWithAffiliations(db, targetId);
  return user ? formatDbUserResult(user, fallbackRole) : null;
}

async function ensurePersonaExistsInDb(
  db: Database,
  fallback: ReturnType<typeof resolvePersonaFallback>,
) {
  const existing = await getUserById(db, fallback.targetUserId);
  if (!existing) {
    const [firstName, ...restName] = fallback.targetDisplayName.split(" ");
    const created = await createUser(db, {
      id: fallback.targetUserId,
      firstName: firstName || "Student",
      lastName: (restName.join(" ") || "USER").toUpperCase(),
      displayName: fallback.targetDisplayName,
    });

    let inst = await db.query.institutions.findFirst();
    if (!inst) {
      const now = new Date();
      const [newInst] = await db
        .insert(institutions)
        .values({
          name: "Aptitek",
          slug: "aptitek",
          type: "academic",
          logoUrl: "/aptitek-logo.svg",
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      inst = newInst;
    }

    await createAffiliation(db, {
      userId: created.id,
      institutionId: inst.id,
      email: fallback.targetUserEmail,
      role: fallback.targetUserRole,
    });
  }
}

async function resolveTargetUser(
  db: Database,
  userId?: string,
  personaId?: string,
  role?: UserRole,
) {
  if (userId) {
    const user = await resolveDbTargetUser(db, userId, role);
    if (user) return user;
  }

  const fallback = resolvePersonaFallback(userId, personaId, role);
  await ensurePersonaExistsInDb(db, fallback);

  const userFromDb = await resolveDbTargetUser(
    db,
    fallback.targetUserId,
    fallback.targetUserRole,
  );
  return userFromDb ?? fallback;
}

async function auditImpersonation(
  db: Database,
  session: SessionPayload | null,
  targetUserId: string,
  targetUserRole: UserRole,
) {
  const actorUserId =
    session?.impersonating && session?.originalUserId
      ? session.originalUserId
      : (session?.userId ?? "admin");

  await logAudit(db, {
    tableName: "impersonation_events",
    recordId: targetUserId,
    action: "UPDATE",
    userId: actorUserId,
    newValues: JSON.stringify({
      action: "START_IMPERSONATION",
      impersonatedUserId: targetUserId,
      impersonatedRole: targetUserRole,
      actorUserId,
      actorRole: session?.role ?? "admin",
      isImpersonated: true,
    }),
  });
}

async function auditStopImpersonation(
  db: Database,
  session: SessionPayload | null,
  targetAdminId: string,
) {
  const actorUserId =
    session?.impersonating && session?.originalUserId
      ? session.originalUserId
      : (session?.userId ?? targetAdminId);

  await logAudit(db, {
    tableName: "impersonation_events",
    recordId: targetAdminId,
    action: "UPDATE",
    userId: actorUserId,
    newValues: JSON.stringify({
      action: "STOP_IMPERSONATION",
      actorUserId,
      exitedUserId: session?.userId,
      isImpersonated: false,
    }),
  });
}

async function logTelemetryError(
  db: Database,
  requestUrl: string,
  session: SessionPayload | null,
  errorData: {
    message: string;
    stack?: string;
    severity?: "security" | "error";
    statusCode?: number;
    contextData?: string;
  },
) {
  try {
    await db.insert(errorReports).values({
      message: errorData.message.slice(0, 2000),
      stack: errorData.stack?.slice(0, 10000) ?? null,
      severity: errorData.severity ?? "error",
      statusCode: errorData.statusCode ?? 500,
      source: "api/auth/impersonate",
      url: requestUrl,
      userId: session?.userId ?? null,
      contextData: errorData.contextData,
      status: "open",
    });
  } catch {
    // Best-effort telemetry recording
  }
}

async function handleStopImpersonation(
  db: Database,
  currentSession: SessionPayload | null,
  requestUrl: string,
) {
  if (!currentSession) {
    return Response.json(
      { error: "No active session found", errorCode: "UNAUTHENTICATED" },
      { status: 401 },
    );
  }

  try {
    const targetAdminId =
      currentSession.originalUserId ?? currentSession.userId;
    await auditStopImpersonation(db, currentSession, targetAdminId);

    const adminDbUser = await getUserWithAffiliations(db, targetAdminId);

    const formattedAdmin = adminDbUser
      ? formatDbUserResult(adminDbUser, "admin")
      : {
          targetUserId: targetAdminId,
          targetDisplayName: "Administrator",
          targetUserEmail: "admin@aptitek.io",
          targetUserRole: "admin" as UserRole,
        };

    const now = Date.now();
    const sessionToken = await signSessionToken({
      userId: formattedAdmin.targetUserId,
      role: "admin",
      impersonating: false,
      issuedAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,
    });

    const sessionCookie = createSessionCookieHeader(sessionToken);

    return Response.json(
      {
        success: true,
        user: {
          id: formattedAdmin.targetUserId,
          name: formattedAdmin.targetDisplayName,
          email: formattedAdmin.targetUserEmail,
          role: "admin",
          impersonating: false,
        },
      },
      {
        status: 200,
        headers: { "Set-Cookie": sessionCookie },
      },
    );
  } catch (caughtError) {
    await logTelemetryError(db, requestUrl, currentSession, {
      message:
        caughtError instanceof Error
          ? caughtError.message
          : "Stop impersonation failed",
      stack: caughtError instanceof Error ? caughtError.stack : undefined,
      statusCode: 500,
    });
    return Response.json(
      {
        error: "Failed to exit impersonation mode.",
        errorCode: "SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}

interface ImpersonationPayload {
  userId?: string;
  personaId?: string;
  role?: UserRole;
}

function buildImpersonatedSessionPayload(
  targetUserId: string,
  targetUserRole: UserRole,
  currentSession: SessionPayload | null,
) {
  const isActualAdminImpersonation = Boolean(
    currentSession &&
    (currentSession.role === "admin" ||
      (currentSession.impersonating && currentSession.originalUserId)),
  );
  const now = Date.now();

  return {
    isActualAdminImpersonation,
    sessionTokenData: {
      userId: targetUserId,
      role: targetUserRole,
      impersonating: isActualAdminImpersonation,
      originalUserId: isActualAdminImpersonation
        ? (currentSession?.originalUserId ?? currentSession?.userId)
        : undefined,
      issuedAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,
    },
  };
}

async function handleStartImpersonation(
  db: Database,
  currentSession: SessionPayload | null,
  payload: ImpersonationPayload,
  requestUrl: string,
) {
  try {
    const { targetUserId, targetUserRole, targetUserEmail, targetDisplayName } =
      await resolveTargetUser(
        db,
        payload.userId,
        payload.personaId,
        payload.role,
      );

    await auditImpersonation(db, currentSession, targetUserId, targetUserRole);

    const { isActualAdminImpersonation, sessionTokenData } =
      buildImpersonatedSessionPayload(
        targetUserId,
        targetUserRole,
        currentSession,
      );

    const sessionToken = await signSessionToken(sessionTokenData);
    const sessionCookie = createSessionCookieHeader(sessionToken);

    return Response.json(
      {
        success: true,
        user: {
          id: targetUserId,
          name: targetDisplayName,
          email: targetUserEmail,
          role: targetUserRole,
          impersonating: isActualAdminImpersonation,
        },
      },
      {
        status: 200,
        headers: { "Set-Cookie": sessionCookie },
      },
    );
  } catch (caughtError) {
    await logTelemetryError(db, requestUrl, currentSession, {
      message:
        caughtError instanceof Error
          ? caughtError.message
          : "Start impersonation failed",
      stack: caughtError instanceof Error ? caughtError.stack : undefined,
      statusCode: 500,
      contextData: JSON.stringify({ payload }),
    });
    return Response.json(
      {
        error: "Failed to initiate impersonation session.",
        errorCode: "SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed. Only POST is supported." },
      { status: 405 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as {
    action?: string;
    userId?: string;
    personaId?: string;
    role?: UserRole;
  };

  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";
  const currentSession = await getSession(request);
  const db = getDatabaseFromContext(context);
  if (!db) {
    return Response.json(
      {
        error: "Database binding unavailable.",
        errorCode: "SERVICE_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  if (payload.action === "stop" || payload.action === "revert") {
    return handleStopImpersonation(db, currentSession, request.url);
  }

  if (!isImpersonationPermitted(isDev, currentSession)) {
    await logTelemetryError(db, request.url, currentSession, {
      message: "Security Infraction: Unauthorized impersonation attempt.",
      severity: "security",
      statusCode: 403,
      contextData: JSON.stringify({ payload }),
    });
    return Response.json(
      {
        error: "Forbidden: Impersonation is only allowed for Administrators",
        errorCode: "FORBIDDEN",
      },
      { status: 403 },
    );
  }

  return handleStartImpersonation(db, currentSession, payload, request.url);
}
