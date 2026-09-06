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
  const email =
    primaryAffiliation?.email || user.githubEmail || "user@aptitek.io";
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
  const label = resolvedRole.charAt(0).toUpperCase() + resolvedRole.slice(1);
  return {
    targetUserId: userId || `dev-${resolvedRole}`,
    targetDisplayName: `${label} Persona`,
    targetUserEmail: `${resolvedRole}@aptitek.io`,
    targetUserRole: resolvedRole,
  };
}

async function ensureDefaultInstitution(db: Database) {
  let inst = await db.query.institutions.findFirst({
    where: (i, { eq }) => eq(i.slug, "aptitek"),
  });
  if (!inst) {
    const [created] = await db
      .insert(institutions)
      .values({
        name: "Aptitek",
        slug: "aptitek",
        type: "academic",
        logoUrl: "/aptitek-logo.svg",
      })
      .returning();
    inst = created;
  }
  return inst;
}

async function ensurePersonaExistsInDb(
  db: Database,
  target: ReturnType<typeof resolvePersonaFallback>,
) {
  const existing = await getUserById(db, target.targetUserId);
  if (!existing) {
    const inst = await ensureDefaultInstitution(db);
    const [first, ...rest] = target.targetDisplayName.split(" ");
    await createUser(db, {
      id: target.targetUserId,
      firstName: first || "Dev",
      lastName: rest.join(" ") || "User",
      displayName: target.targetDisplayName,
    });
    await createAffiliation(db, {
      userId: target.targetUserId,
      institutionId: inst.id,
      email: target.targetUserEmail,
      role: target.targetUserRole,
      isActive: true,
    });
  }
}

async function resolveDbTargetUser(
  db: Database,
  userId: string,
  role?: UserRole,
) {
  const dbUser = await getUserWithAffiliations(db, userId);
  if (dbUser) {
    return formatDbUserResult(dbUser, role);
  }
  return null;
}

async function resolveImpersonationTarget(
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
      restoredAdminId: targetAdminId,
      actorUserId,
      actorRole: "admin",
      isImpersonated: false,
    }),
  });
}

async function logTelemetryError(
  db: Database,
  requestUrl: string,
  session: SessionPayload | null,
  options: {
    message: string;
    stack?: string;
    severity?: "error" | "security";
    statusCode?: number;
    contextData?: string;
  },
) {
  try {
    const path = new URL(requestUrl).pathname;
    const actorId =
      session?.impersonating && session?.originalUserId
        ? session.originalUserId
        : (session?.userId ?? undefined);

    await db.insert(errorReports).values({
      message: options.message,
      stack: options.stack,
      severity: options.severity ?? "error",
      statusCode: options.statusCode ?? 500,
      source: "api.dev.impersonate",
      url: requestUrl,
      path,
      userId: actorId,
      contextData: options.contextData,
      status: "open",
    });
  } catch {
    // Silently continue if telemetry fails
  }
}

function resolveAdminIdentity(
  adminDbUser: Awaited<ReturnType<typeof getUserWithAffiliations>>,
  originalAdminId: string,
) {
  const fallbackAdminName =
    adminDbUser?.displayName ||
    extractUserFullName(adminDbUser ?? {}) ||
    "System Administrator";
  const primaryAffiliation = adminDbUser?.affiliations[0];
  const adminEmail =
    primaryAffiliation?.email || adminDbUser?.githubEmail || "admin@aptitek.io";

  return {
    id: originalAdminId,
    name: fallbackAdminName,
    email: adminEmail,
    role: "admin" as const,
    impersonating: false,
  };
}

async function createAdminSessionCookie(originalAdminId: string) {
  const now = Date.now();
  const sessionTokenData: SessionPayload = {
    userId: originalAdminId,
    role: "admin",
    impersonating: false,
    originalUserId: undefined,
    issuedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  };
  const token = await signSessionToken(sessionTokenData);
  return createSessionCookieHeader(token);
}

async function handleStopImpersonation(
  db: Database,
  currentSession: SessionPayload | null,
) {
  const originalAdminId = currentSession?.originalUserId;
  if (!originalAdminId) {
    return Response.json(
      { error: "No active impersonation session found." },
      { status: 400 },
    );
  }

  const adminDbUser = await getUserWithAffiliations(db, originalAdminId);
  const sessionCookie = await createAdminSessionCookie(originalAdminId);
  await auditStopImpersonation(db, currentSession, originalAdminId);

  const adminUser = resolveAdminIdentity(adminDbUser, originalAdminId);
  return Response.json(
    { success: true, user: adminUser },
    { status: 200, headers: { "Set-Cookie": sessionCookie } },
  );
}

async function createTargetSessionCookie(
  targetUserId: string,
  targetUserRole: UserRole,
  isActualAdmin: boolean,
  originalAdminId?: string,
) {
  const now = Date.now();
  const sessionTokenData: SessionPayload = {
    userId: targetUserId,
    role: targetUserRole,
    impersonating: isActualAdmin,
    originalUserId: isActualAdmin ? originalAdminId : undefined,
    issuedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  };
  const token = await signSessionToken(sessionTokenData);
  return createSessionCookieHeader(token);
}

function resolveAdminContext(session: SessionPayload | null) {
  if (!session) {
    return { isActualAdmin: false, originalAdminId: undefined };
  }
  const isActualAdmin =
    session.role === "admin" || Boolean(session.impersonating);
  const originalAdminId = session.originalUserId || session.userId;
  return { isActualAdmin, originalAdminId };
}

async function logStartImpersonationError(
  db: Database,
  requestUrl: string,
  currentSession: SessionPayload | null,
  context: {
    caughtError: unknown;
    payload: { userId?: string; personaId?: string; role?: UserRole };
  },
) {
  const err = context.caughtError instanceof Error ? context.caughtError : null;
  await logTelemetryError(db, requestUrl, currentSession, {
    message: err ? err.message : "Start impersonation failed",
    stack: err ? err.stack : undefined,
    statusCode: 500,
    contextData: JSON.stringify({ payload: context.payload }),
  });
}

async function handleStartImpersonation(
  db: Database,
  currentSession: SessionPayload | null,
  payload: { userId?: string; personaId?: string; role?: UserRole },
  requestUrl: string,
) {
  try {
    const target = await resolveImpersonationTarget(
      db,
      payload.userId,
      payload.personaId,
      payload.role,
    );

    const { isActualAdmin, originalAdminId } =
      resolveAdminContext(currentSession);

    if (isActualAdmin) {
      await auditImpersonation(
        db,
        currentSession,
        target.targetUserId,
        target.targetUserRole,
      );
    }

    const sessionCookie = await createTargetSessionCookie(
      target.targetUserId,
      target.targetUserRole,
      isActualAdmin,
      originalAdminId,
    );

    return Response.json(
      {
        success: true,
        user: {
          id: target.targetUserId,
          name: target.targetDisplayName,
          email: target.targetUserEmail,
          role: target.targetUserRole,
          impersonating: isActualAdmin,
        },
      },
      { status: 200, headers: { "Set-Cookie": sessionCookie } },
    );
  } catch (caughtError) {
    await logStartImpersonationError(db, requestUrl, currentSession, {
      caughtError,
      payload,
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

  if (request.method === "DELETE") {
    return handleStopImpersonation(db, currentSession);
  }

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    action?: string;
    userId?: string;
    personaId?: string;
    role?: UserRole;
  };

  if (payload.action === "stop" || payload.action === "revert") {
    return handleStopImpersonation(db, currentSession);
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
