import type { Database } from "~/db/index";
import { getUserWithAffiliations, deleteUser } from "~/services/userService";
import { logImpersonatedAudit } from "~/services/assessmentService";
import {
  addStudentToCohort,
  removeStudentFromCohort,
  createInstitution,
  updateInstitution,
  createCohort,
  updateCohort,
} from "~/services/cohortService";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

function parseOptionalString(
  formData: FormData,
  key: string,
): string | undefined {
  const val = formData.get(key);
  return val ? String(val) : undefined;
}

function parseOptionalDate(formData: FormData, key: string): Date | undefined {
  const val = formData.get(key);
  return val ? new Date(String(val)) : undefined;
}

function parseNullableDate(
  formData: FormData,
  key: string,
): Date | null | undefined {
  if (!formData.has(key)) return undefined;
  const val = formData.get(key);
  return val ? new Date(String(val)) : null;
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
      email: primaryAffil?.email,
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
  const logoUrl = formData.has("logoUrl")
    ? parseOptionalString(formData, "logoUrl")
    : undefined;
  const emailDomain = formData.has("emailDomain")
    ? parseOptionalString(formData, "emailDomain")
    : undefined;
  const usernamePattern = formData.has("usernamePattern")
    ? parseOptionalString(formData, "usernamePattern")
    : undefined;

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

export async function handleCreateCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const institutionId = String(formData.get("institutionId") || "");
  const name = String(formData.get("name") || "");
  const description = parseOptionalString(formData, "description");
  const startDate = parseOptionalDate(formData, "startDate");
  const endDate = parseOptionalDate(formData, "endDate");

  if (!institutionId || !name) {
    return { success: false, error: "Missing required fields for cohort" };
  }

  try {
    const cohort = await createCohort(db, {
      institutionId,
      name,
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
  const name = parseOptionalString(formData, "name");
  const description = formData.has("description")
    ? parseOptionalString(formData, "description")
    : undefined;
  const startDate = parseNullableDate(formData, "startDate");
  const endDate = parseNullableDate(formData, "endDate");

  if (!id) {
    return { success: false, error: "Missing cohort id" };
  }

  try {
    const cohort = await updateCohort(db, id, {
      name,
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

export interface DispatchAdminActionParams {
  intent: string | null;
  formData: FormData;
  db: Database;
  actorUserId: string;
  session?: AdminSession;
}

export async function dispatchAdminAction({
  intent,
  formData,
  db,
  actorUserId,
  session,
}: DispatchAdminActionParams) {
  switch (intent) {
    case "add-cohort":
      return handleAddCohortAction(formData, db, actorUserId);
    case "remove-cohort":
      return handleRemoveCohortAction(formData, db, actorUserId);
    case "delete-user":
      return handleDeleteUserAction(formData, db, actorUserId, session);
    case "create-institution":
      return handleCreateInstitutionAction(formData, db, actorUserId);
    case "update-institution":
      return handleUpdateInstitutionAction(formData, db, actorUserId);
    case "create-cohort":
      return handleCreateCohortAction(formData, db, actorUserId);
    case "update-cohort":
      return handleUpdateCohortAction(formData, db, actorUserId);
    default:
      return { success: false, error: "Unknown action" };
  }
}
