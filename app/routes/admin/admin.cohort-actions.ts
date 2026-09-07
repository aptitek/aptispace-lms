import type { Database } from "~/db/index";
import {
  addStudentToCohort,
  removeStudentFromCohort,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  createCohort,
  updateCohort,
  deleteCohort,
} from "~/services/cohortService";

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

export function parseOptionalString(
  formData: FormData,
  key: string,
): string | undefined {
  const entry = formData.get(key);
  return entry ? String(entry) : undefined;
}

export function parseNullableString(
  formData: FormData,
  key: string,
): string | null | undefined {
  if (!formData.has(key)) return undefined;
  const entry = formData.get(key);
  if (entry === null || String(entry).trim() === "") return null;
  return String(entry).trim();
}

export function parseOptionalDate(
  formData: FormData,
  key: string,
): Date | undefined {
  const entry = formData.get(key);
  return entry ? new Date(String(entry)) : undefined;
}

export function parseNullableDate(
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

export async function handleDeleteInstitutionAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const institutionId = String(formData.get("institutionId") || "");
  if (!institutionId) {
    return { success: false, error: "Missing institution id" };
  }

  try {
    const deleted = await deleteInstitution(db, institutionId, actorUserId);
    if (!deleted) {
      return {
        success: false,
        error: "Institution not found or already deleted",
      };
    }
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to delete institution"),
    };
  }
}

export function parseCohortYear(
  formData: FormData,
  isRequired = false,
): number | null | undefined {
  if (!formData.has("year") && !isRequired) return undefined;
  const raw = formData.get("year");
  if (raw === null || raw === "") return null;
  const num = parseInt(String(raw), 10);
  return isNaN(num) ? null : num;
}

export function parseCohortTags(formData: FormData): string[] | undefined {
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

export async function handleDeleteCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const cohortId = String(formData.get("cohortId") || "");
  if (!cohortId) {
    return { success: false, error: "Missing cohort id" };
  }

  try {
    const deleted = await deleteCohort(db, cohortId, actorUserId);
    if (!deleted) {
      return {
        success: false,
        error: "Cohort not found or already deleted",
      };
    }
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to delete cohort"),
    };
  }
}
