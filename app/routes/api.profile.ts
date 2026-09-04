import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authGuard } from "~/utils/session.server";
import {
  getUserWithAffiliations,
  updateUser,
  updateUserAffiliation,
  isUserProfileComplete,
} from "~/services/userService";
import { logImpersonatedAudit } from "~/services/assessmentService";
import { resolveActiveUser } from "~/utils/auth";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  if (!auth?.user) {
    return Response.json(
      { error: "User profile not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const activeUser = resolveActiveUser(auth.user, auth.session);
  return Response.json({
    user: activeUser,
    isProfileComplete: isUserProfileComplete(auth.user),
  });
}

interface ProfileBody {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
}

function checkEditPermission(
  session: NonNullable<Awaited<ReturnType<typeof authGuard>>>["session"],
  targetUserId: string,
): Response | null {
  if (
    targetUserId !== session.userId &&
    session.role !== "admin" &&
    !session.impersonating
  ) {
    return Response.json(
      {
        error: "Forbidden: Cannot edit another user's profile",
        code: "FORBIDDEN",
      },
      { status: 403 },
    );
  }
  return null;
}

function resolveName(value?: string, fallback?: string | null): string {
  if (value !== undefined) return value.trim();
  if (fallback) return fallback.trim();
  return "";
}

function computeDisplayName(firstName: string, lastName: string): string {
  const parts = [firstName.trim(), lastName.trim().toUpperCase()].filter(
    Boolean,
  );
  return parts.join(" ");
}

function buildUserPayload(
  body: ProfileBody,
  fallbackUser?: Awaited<ReturnType<typeof getUserWithAffiliations>> | null,
) {
  const payload: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatarUrl?: string;
  } = {};
  if (body.firstName !== undefined) payload.firstName = body.firstName.trim();
  if (body.lastName !== undefined) payload.lastName = body.lastName.trim();
  if (body.avatarUrl !== undefined) payload.avatarUrl = body.avatarUrl;

  const f = resolveName(
    body.firstName,
    fallbackUser ? fallbackUser.firstName : "",
  );
  const l = resolveName(
    body.lastName,
    fallbackUser ? fallbackUser.lastName : "",
  );
  const displayName = computeDisplayName(f, l);
  if (displayName) {
    payload.displayName = displayName;
  }
  return payload;
}

async function auditIfAdmin(
  db: Parameters<typeof updateUser>[0],
  session: NonNullable<Awaited<ReturnType<typeof authGuard>>>["session"],
  targetUserId: string,
  body: ProfileBody,
) {
  if (session.impersonating || session.role === "admin") {
    await logImpersonatedAudit(db, session, {
      tableName: "users",
      recordId: targetUserId,
      action: "UPDATE",
      targetUserId,
      newValues: JSON.stringify({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        avatarUrl: body.avatarUrl,
      }),
    });
  }
}

async function applyUpdates(
  db: Parameters<typeof updateUser>[0],
  targetUserId: string,
  userPayload: ReturnType<typeof buildUserPayload>,
  email?: string,
) {
  if (Object.keys(userPayload).length > 0) {
    await updateUser(db, targetUserId, userPayload);
  }
  const trimmed = email?.trim();
  if (trimmed) {
    await updateUserAffiliation(db, targetUserId, {
      email: trimmed.toLowerCase(),
    });
  }
}

const ALLOWED_METHODS = new Set(["PATCH", "PUT", "POST"]);

function formatProfileResponse(
  updatedUser: Awaited<ReturnType<typeof getUserWithAffiliations>> | null,
  session: NonNullable<Awaited<ReturnType<typeof authGuard>>>["session"],
) {
  if (!updatedUser) {
    return { success: true, user: null, isProfileComplete: false };
  }
  return {
    success: true,
    user: resolveActiveUser(updatedUser, session),
    isProfileComplete: isUserProfileComplete(updatedUser),
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (!ALLOWED_METHODS.has(request.method)) {
    return Response.json(
      { error: "Method not allowed. Use PATCH.", code: "METHOD_NOT_ALLOWED" },
      { status: 405 },
    );
  }

  const auth = await authGuard(request, context);
  if (!auth || !auth.db || !auth.session) {
    return Response.json(
      { error: "Authentication required", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as ProfileBody;
  const targetUserId = body.userId || auth.session.userId;

  const permissionError = checkEditPermission(auth.session, targetUserId);
  if (permissionError) return permissionError;

  const userPayload = buildUserPayload(body, auth.user);
  await applyUpdates(auth.db, targetUserId, userPayload, body.email);
  await auditIfAdmin(auth.db, auth.session, targetUserId, body);

  const updatedUser = await getUserWithAffiliations(auth.db, targetUserId);
  return Response.json(formatProfileResponse(updatedUser, auth.session));
}
