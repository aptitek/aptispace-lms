import type { ActionFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import { getUserWithAffiliations } from "~/services/userService";
import { logAudit } from "~/services/assessmentService";
import { DEV_PERSONAS, type UserRole } from "~/utils/auth";
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

async function resolveTargetUser(
  db: Database | null,
  personaId?: string,
  role?: UserRole,
) {
  const targetPersona =
    DEV_PERSONAS.find((p) => p.id === personaId || p.role === role) ??
    DEV_PERSONAS[0];

  if (!db) {
    return {
      targetUserId: targetPersona.id,
      targetUserRole: targetPersona.role,
      targetUserEmail: targetPersona.email,
      targetDisplayName: targetPersona.name,
    };
  }

  const userFromDb = await getUserWithAffiliations(db, targetPersona.id);
  if (userFromDb) {
    return {
      targetUserId: userFromDb.id,
      targetDisplayName:
        userFromDb.displayName ??
        `${userFromDb.firstName} ${userFromDb.lastName}`,
      targetUserEmail: userFromDb.affiliations[0]?.email ?? targetPersona.email,
      targetUserRole: userFromDb.affiliations[0]?.role ?? targetPersona.role,
    };
  }

  return {
    targetUserId: targetPersona.id,
    targetUserRole: targetPersona.role,
    targetUserEmail: targetPersona.email,
    targetDisplayName: targetPersona.name,
  };
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
    await resolveTargetUser(db, payload.personaId, payload.role);

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
