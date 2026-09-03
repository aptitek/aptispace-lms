import type { Database } from "~/db/index";
import {
  getUserWithAffiliations,
  deleteUser,
  updateUser,
} from "~/services/userService";
import { logImpersonatedAudit } from "~/services/assessmentService";
import {
  addStudentToCohort,
  removeStudentFromCohort,
  createInstitution,
  updateInstitution,
  createCohort,
  updateCohort,
} from "~/services/cohortService";
import {
  updateErrorReportStatus,
  deleteErrorReport,
  clearResolvedErrorReports,
  logAdminAudit,
} from "~/services/missionCenterService";
import type { ErrorStatusType } from "~/types/missionCenter";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

function parseOptionalString(
  formData: FormData,
  key: string,
): string | undefined {
  const entry = formData.get(key);
  return entry ? String(entry) : undefined;
}

function parseNullableString(
  formData: FormData,
  key: string,
): string | null | undefined {
  if (!formData.has(key)) return undefined;
  const entry = formData.get(key);
  if (entry === null || String(entry).trim() === "") return null;
  return String(entry).trim();
}

function parseOptionalDate(formData: FormData, key: string): Date | undefined {
  const entry = formData.get(key);
  return entry ? new Date(String(entry)) : undefined;
}

function parseNullableDate(
  formData: FormData,
  key: string,
): Date | null | undefined {
  if (!formData.has(key)) return undefined;
  const entry = formData.get(key);
  return entry ? new Date(String(entry)) : null;
}

export async function handleAddCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const studentId = String(formData.get("studentId") || "");
  const cohortId = String(formData.get("cohortId") || "");

  if (!studentId || !cohortId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    await addStudentToCohort(db, { userId: studentId, cohortId, actorUserId });
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to add cohort"),
    };
  }
}

export async function handleRemoveCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const studentId = String(formData.get("studentId") || "");
  const cohortId = String(formData.get("cohortId") || "");

  if (!studentId || !cohortId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    await removeStudentFromCohort(db, {
      userId: studentId,
      cohortId,
      actorUserId,
    });
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to remove cohort"),
    };
  }
}

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

export async function handleCreateInstitutionAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const type = (parseOptionalString(formData, "type") || "academic") as
    "academic" | "company";
  const logoUrl = parseOptionalString(formData, "logoUrl");
  const emailDomain = parseOptionalString(formData, "emailDomain");
  const usernamePattern = parseOptionalString(formData, "usernamePattern");

  if (!name || !slug) {
    return { success: false, error: "Missing required fields for institution" };
  }

  try {
    const institution = await createInstitution(db, {
      name,
      slug,
      type,
      logoUrl,
      emailDomain,
      usernamePattern,
      actorUserId,
    });
    return { success: true, institution };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to create institution"),
    };
  }
}

export async function handleUpdateInstitutionAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const id = String(formData.get("id") || "");
  const name = parseOptionalString(formData, "name");
  const slug = parseOptionalString(formData, "slug");
  const type = parseOptionalString(formData, "type") as
    "academic" | "company" | undefined;
  const logoUrl = parseNullableString(formData, "logoUrl");
  const emailDomain = parseNullableString(formData, "emailDomain");
  const usernamePattern = parseNullableString(formData, "usernamePattern");

  if (!id) {
    return { success: false, error: "Missing institution id" };
  }

  try {
    const institution = await updateInstitution(db, id, {
      name,
      slug,
      type,
      logoUrl,
      emailDomain,
      usernamePattern,
      actorUserId,
    });
    return { success: true, institution };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to update institution"),
    };
  }
}

function parseCohortYear(
  formData: FormData,
  isRequired = false,
): number | null | undefined {
  if (!formData.has("year") && !isRequired) return undefined;
  const raw = formData.get("year");
  if (raw === null || raw === "") return null;
  const num = parseInt(String(raw), 10);
  return isNaN(num) ? null : num;
}

function parseCohortTags(formData: FormData): string[] | undefined {
  const raw = formData.get("tags");
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return undefined;
}

export async function handleCreateCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const institutionId = String(formData.get("institutionId") || "");
  const diploma = parseOptionalString(formData, "diploma");
  if (!institutionId || !diploma) {
    return {
      success: false,
      error: "Missing required fields for cohort (institution, diploma)",
    };
  }

  const year = parseCohortYear(formData, true) ?? null;
  const tags = parseCohortTags(formData);
  const description = parseOptionalString(formData, "description");
  const startDate = parseOptionalDate(formData, "startDate");
  const endDate = parseOptionalDate(formData, "endDate");

  try {
    const cohort = await createCohort(db, {
      institutionId,
      diploma,
      year,
      tags,
      description,
      startDate,
      endDate,
      actorUserId,
    });
    return { success: true, cohort };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to create cohort"),
    };
  }
}

export async function handleUpdateCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const id = String(formData.get("id") || "");
  if (!id) {
    return { success: false, error: "Missing cohort id" };
  }

  const description = formData.has("description")
    ? String(formData.get("description") ?? "")
    : undefined;
  const startDate = parseNullableDate(formData, "startDate");
  const endDate = parseNullableDate(formData, "endDate");
  const diploma = formData.has("diploma")
    ? parseOptionalString(formData, "diploma")
    : undefined;
  const year = parseCohortYear(formData);
  const tags = parseCohortTags(formData);

  try {
    const cohort = await updateCohort(db, id, {
      diploma,
      year,
      tags,
      description,
      startDate,
      endDate,
      actorUserId,
    });
    return { success: true, cohort };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to update cohort"),
    };
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
  "create-cohort": (fd, db, actor) => handleCreateCohortAction(fd, db, actor),
  "update-cohort": (fd, db, actor) => handleUpdateCohortAction(fd, db, actor),
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
