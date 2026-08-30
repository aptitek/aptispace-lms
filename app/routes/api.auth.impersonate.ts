import type { ActionFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import { getUserWithAffiliations } from "~/services/userService";
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
  return Boolean(session && session.role === "admin");
}

function formatDbUserResult(
  user: NonNullable<Awaited<ReturnType<typeof getUserWithAffiliations>>>,
  fallbackRole?: UserRole,
) {
  const primaryAffiliation = user.affiliations[0];
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return {
    targetUserId: user.id,
    targetDisplayName: user.displayName || fullName || "User",
    targetUserEmail: primaryAffiliation?.email ?? "user@aptitek.io",
    targetUserRole:
      (primaryAffiliation?.role as UserRole) ?? fallbackRole ?? "student",
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

async function resolveTargetUser(
  db: Database | null,
  userId?: string,
  personaId?: string,
  role?: UserRole,
) {
  if (db && userId) {
    const userFromDb = await getUserWithAffiliations(db, userId);
    if (userFromDb) {
      return formatDbUserResult(userFromDb, role);
    }
  }

  const fallback = resolvePersonaFallback(userId, personaId, role);
  if (!db) {
    return fallback;
  }

  const userFromDb = await getUserWithAffiliations(db, fallback.targetUserId);
  if (userFromDb) {
    return formatDbUserResult(userFromDb, fallback.targetUserRole);
  }

  return fallback;
}

async function auditImpersonation(
  db: Database | null,
  session: SessionPayload | null,
  targetUserId: string,
  targetUserRole: UserRole,
) {
  if (db && session?.userId) {
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

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    userId?: string;
    personaId?: string;
    role?: UserRole;
  };

  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";
  const currentSession = await getSession(request);
  const db = getDatabaseFromContext(context);

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
    originalUserId: currentSession?.userId ?? targetUserId,
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
