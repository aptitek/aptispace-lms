import type { Database } from "~/db/index";
import {
  getUserWithAffiliations,
  deleteUser,
  updateUser,
} from "~/services/userService";
import { logImpersonatedAudit } from "~/services/assessmentService";
import {
  updateErrorReportStatus,
  deleteErrorReport,
  clearResolvedErrorReports,
  logAdminAudit,
} from "~/services/missionCenterService";
import type { ErrorStatusType } from "~/types/missionCenter";
import {
  getErrorMessage,
  parseNullableString,
  handleAddCohortAction,
  handleRemoveCohortAction,
  handleCreateInstitutionAction,
  handleUpdateInstitutionAction,
  handleDeleteInstitutionAction,
  handleCreateCohortAction,
  handleUpdateCohortAction,
  handleDeleteCohortAction,
} from "./admin.cohort-actions";

export {
  getErrorMessage,
  handleAddCohortAction,
  handleRemoveCohortAction,
  handleCreateInstitutionAction,
  handleUpdateInstitutionAction,
  handleDeleteInstitutionAction,
  handleCreateCohortAction,
  handleUpdateCohortAction,
  handleDeleteCohortAction,
};

export type AdminSession = {
  userId?: string;
  originalUserId?: string;
  impersonating?: boolean;
} | null;

interface AuditUserDeletionParams {
  db: Database;
  session?: AdminSession;
  existingUser: Awaited<ReturnType<typeof getUserWithAffiliations>>;
  studentId: string;
  actorUserId: string;
}

async function auditUserDeletion({
  db,
  session,
  existingUser,
  studentId,
  actorUserId,
}: AuditUserDeletionParams) {
  if (!existingUser || !session?.impersonating || !session.originalUserId) {
    return;
  }
  const primaryAffil = existingUser.affiliations?.[0];
  await logImpersonatedAudit(db, session, {
    tableName: "users",
    recordId: studentId,
    action: "DELETE",
    targetUserId: studentId,
    oldValues: JSON.stringify({
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      displayName: existingUser.displayName,
      email: primaryAffil?.email || existingUser.githubEmail || undefined,
      githubId: existingUser.githubId,
      role: primaryAffil?.role,
      affiliations: existingUser.affiliations,
    }),
    newValues: JSON.stringify({
      deletedBy: actorUserId,
      deletedAt: new Date().toISOString(),
      reason: "User deletion confirmed via admin hold button",
    }),
  });
}

export async function handleDeleteUserAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
  session?: AdminSession,
) {
  const studentId = String(formData.get("studentId") || "");
  if (!studentId) {
    return { success: false, error: "Missing user ID" };
  }

  try {
    const existingUser = await getUserWithAffiliations(db, studentId);
    await auditUserDeletion({
      db,
      session,
      existingUser,
      studentId,
      actorUserId,
    });

    const deleted = await deleteUser(db, studentId);
    if (!deleted) {
      return { success: false, error: "User not found or already deleted" };
    }
    return { success: true };
  } catch (err) {
    console.error("[DeleteUser Error]:", err);
    return { success: false, error: "Failed to delete user" };
  }
}

function extractUserUpdates(formData: FormData) {
  const updates: Parameters<typeof updateUser>[2] = {};
  if (formData.has("githubId")) {
    const raw = String(formData.get("githubId") ?? "").trim();
    updates.githubId = raw || null;
  }
  if (formData.has("avatarUrl")) {
    updates.avatarUrl = parseNullableString(formData, "avatarUrl");
  }
  return updates;
}

function resolveUpdateUserError(err: unknown) {
  const message = getErrorMessage(err, "Failed to update user");
  const isUniqueViolation =
    message.includes("UNIQUE") || message.includes("constraint");
  return {
    success: false,
    error: isUniqueViolation
      ? "This GitHub ID is already assigned to another user."
      : message,
  };
}

export async function handleUpdateUserAction(
  formData: FormData,
  db: Database,
  _actorUserId: string,
) {
  const studentId = String(formData.get("studentId") || "");
  if (!studentId) {
    return { success: false, error: "Missing required studentId" };
  }

  try {
    const updates = extractUserUpdates(formData);
    const updated = await updateUser(db, studentId, updates);
    return { success: true, user: updated };
  } catch (err: unknown) {
    return resolveUpdateUserError(err);
  }
}

export async function handleUpdateErrorStatusAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const reportId = String(formData.get("reportId") || "");
  const status = String(formData.get("status") || "open") as ErrorStatusType;
  if (!reportId) {
    return { success: false, error: "Missing reportId" };
  }

  try {
    await updateErrorReportStatus(db, reportId, status);
    await logAdminAudit(db, {
      tableName: "error_reports",
      recordId: reportId,
      action: "UPDATE",
      actorUserId,
      newValues: { status },
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to update error status"),
    };
  }
}

export async function handleDeleteErrorReportAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const reportId = String(formData.get("reportId") || "");
  if (!reportId) {
    return { success: false, error: "Missing reportId" };
  }

  try {
    await deleteErrorReport(db, reportId);
    await logAdminAudit(db, {
      tableName: "error_reports",
      recordId: reportId,
      action: "DELETE",
      actorUserId,
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to delete error report"),
    };
  }
}

export async function handleClearResolvedErrorsAction(
  _formData: FormData,
  db: Database,
  actorUserId: string,
) {
  try {
    const cleared = await clearResolvedErrorReports(db);
    await logAdminAudit(db, {
      tableName: "error_reports",
      recordId: "bulk",
      action: "DELETE",
      actorUserId,
      newValues: { count: cleared.length },
    });
    return { success: true, count: cleared.length };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to clear error reports"),
    };
  }
}

export interface DispatchAdminActionParams {
  intent: string | null;
  formData: FormData;
  db: Database;
  actorUserId: string;
  session?: AdminSession;
}

type ActionHandler = (
  formData: FormData,
  db: Database,
  actorUserId: string,
  session?: AdminSession,
) => Promise<unknown>;

const ADMIN_ACTION_MAP: Record<string, ActionHandler> = {
  "add-cohort": (fd, db, actor) => handleAddCohortAction(fd, db, actor),
  "remove-cohort": (fd, db, actor) => handleRemoveCohortAction(fd, db, actor),
  "delete-user": (fd, db, actor, sess) =>
    handleDeleteUserAction(fd, db, actor, sess),
  "update-user": (fd, db, actor) => handleUpdateUserAction(fd, db, actor),
  "create-institution": (fd, db, actor) =>
    handleCreateInstitutionAction(fd, db, actor),
  "update-institution": (fd, db, actor) =>
    handleUpdateInstitutionAction(fd, db, actor),
  "delete-institution": (fd, db, actor) =>
    handleDeleteInstitutionAction(fd, db, actor),
  "create-cohort": (fd, db, actor) => handleCreateCohortAction(fd, db, actor),
  "update-cohort": (fd, db, actor) => handleUpdateCohortAction(fd, db, actor),
  "delete-cohort": (fd, db, actor) => handleDeleteCohortAction(fd, db, actor),
  "update-error-status": (fd, db, actor) =>
    handleUpdateErrorStatusAction(fd, db, actor),
  "delete-error-report": (fd, db, actor) =>
    handleDeleteErrorReportAction(fd, db, actor),
  "clear-resolved-errors": (fd, db, actor) =>
    handleClearResolvedErrorsAction(fd, db, actor),
};

export async function dispatchAdminAction({
  intent,
  formData,
  db,
  actorUserId,
  session,
}: DispatchAdminActionParams) {
  const handler = intent ? ADMIN_ACTION_MAP[intent] : undefined;
  if (handler) {
    return handler(formData, db, actorUserId, session);
  }
  return { success: false, error: "Unknown action" };
}
