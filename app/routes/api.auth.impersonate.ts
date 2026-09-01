import type { ActionFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import {
  getUserWithAffiliations,
  getUserById,
  createUser,
  createAffiliation,
} from "~/services/userService";
import { institutions } from "~/db/schema";
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
  if (session?.userId) {
    await logAudit(db, {
      tableName: "impersonation_events",
      recordId: targetUserId,
      action: "UPDATE",
      userId: session.userId,
      newValues: JSON.stringify({
        impersonatedUserId: targetUserId,
        impersonatedRole: targetUserRole,
        actorUserId: session.userId,
        actorRole: session.role,
      }),
    });
  }
}

async function handleStopImpersonation(
  db: Database,
  currentSession: SessionPayload | null,
) {
  if (!currentSession) {
    return new Response(JSON.stringify({ error: "No active session found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const targetAdminId = currentSession.originalUserId ?? currentSession.userId;
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

  return new Response(
    JSON.stringify({
      success: true,
      user: {
        id: formattedAdmin.targetUserId,
        name: formattedAdmin.targetDisplayName,
        email: formattedAdmin.targetUserEmail,
        role: "admin",
        impersonating: false,
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": sessionCookie,
      },
    },
  );
}

interface ImpersonationPayload {
  userId?: string;
  personaId?: string;
  role?: UserRole;
}

async function handleStartImpersonation(
  db: Database,
  currentSession: SessionPayload | null,
  payload: ImpersonationPayload,
) {
  const { targetUserId, targetUserRole, targetUserEmail, targetDisplayName } =
    await resolveTargetUser(
      db,
      payload.userId,
      payload.personaId,
      payload.role,
    );

  await auditImpersonation(db, currentSession, targetUserId, targetUserRole);

  const now = Date.now();
  const sessionToken = await signSessionToken({
    userId: targetUserId,
    role: targetUserRole,
    impersonating: true,
    originalUserId:
      currentSession?.originalUserId ?? currentSession?.userId ?? targetUserId,
    issuedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  });

  const sessionCookie = createSessionCookieHeader(sessionToken);

  return new Response(
    JSON.stringify({
      success: true,
      user: {
        id: targetUserId,
        name: targetDisplayName,
        email: targetUserEmail,
        role: targetUserRole,
        impersonating: true,
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": sessionCookie,
      },
    },
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
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
      { error: "Database binding unavailable." },
      { status: 503 },
    );
  }

  if (payload.action === "stop" || payload.action === "revert") {
    return handleStopImpersonation(db, currentSession);
  }

  if (!isImpersonationPermitted(isDev, currentSession)) {
    return new Response(
      JSON.stringify({
        error: "Forbidden: Impersonation is only allowed for Administrators",
        code: "FORBIDDEN",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return handleStartImpersonation(db, currentSession, payload);
}
