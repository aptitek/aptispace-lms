import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authGuard } from "~/utils/session.server";
import {
  getUserWithAffiliations,
  updateUser,
  deleteUser,
  isUserProfileComplete,
} from "~/services/userService";
import { logImpersonatedAudit } from "~/services/assessmentService";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  const targetId = params.id;

  if (!targetId || !auth?.db) {
    return Response.json(
      { error: "Invalid user ID", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  // Allow self or admin
  if (
    auth.session.userId !== targetId &&
    auth.session.role !== "admin" &&
    !auth.session.impersonating
  ) {
    return Response.json(
      { error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const user = await getUserWithAffiliations(auth.db, targetId);
  if (!user) {
    return Response.json(
      { error: "User not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return Response.json({
    user,
    isProfileComplete: isUserProfileComplete(user),
  });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const auth = await authGuard(request, context, { requiredRole: "admin" });
  const targetId = params.id;

  if (!targetId || !auth?.db) {
    return Response.json(
      { error: "Invalid user ID", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  if (request.method === "DELETE") {
    const existing = await getUserWithAffiliations(auth.db, targetId);
    if (!existing) {
      return Response.json(
        { error: "User not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    await logImpersonatedAudit(auth.db, auth.session, {
      tableName: "users",
      recordId: targetId,
      action: "DELETE",
      targetUserId: targetId,
    });

    await deleteUser(auth.db, targetId);
    return Response.json({ success: true });
  }

  if (request.method === "PATCH" || request.method === "PUT") {
    const body = (await request.json().catch(() => ({}))) as {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      githubId?: string;
    };

    await logImpersonatedAudit(auth.db, auth.session, {
      tableName: "users",
      recordId: targetId,
      action: "UPDATE",
      targetUserId: targetId,
      newValues: JSON.stringify(body),
    });

    await updateUser(auth.db, targetId, body);
    const updated = await getUserWithAffiliations(auth.db, targetId);
    return Response.json({ success: true, user: updated });
  }

  return Response.json(
    { error: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 },
  );
}
