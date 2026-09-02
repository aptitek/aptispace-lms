import {
  getUserWithAffiliations,
  deleteUser,
  type getAllUsersWithAffiliations,
} from "~/services/userService";
import { logImpersonatedAudit } from "~/services/assessmentService";
import type {
  EntityCardData,
  CompactCohortItem,
} from "~/components/molecules/EntityCard/EntityCard.types";
import type { AuthUser, UserRole } from "~/utils/auth";
import type { Database } from "~/db/index";

import {
  addStudentToCohort,
  removeStudentFromCohort,
  createInstitution,
  updateInstitution,
  createCohort,
  updateCohort,
} from "~/services/cohortService";

export type DbUserWithAffil = Awaited<
  ReturnType<typeof getAllUsersWithAffiliations>
>[number];
type AffilType = DbUserWithAffil["affiliations"][number] | undefined;

export function resolveUserGlobalRole(dbUser: DbUserWithAffil): UserRole {
  const affils = dbUser.affiliations || [];
  if (affils.some((a) => a.role === "admin")) return "admin";
  if (affils.some((a) => a.role === "instructor")) return "instructor";
  const primary = affils[0]?.role;
  if (primary) return primary;
  return "student";
}

function resolveUserDisplayName(dbUser: DbUserWithAffil): string {
  if (dbUser.displayName) return dbUser.displayName;
  const fullName = `${dbUser.firstName} ${dbUser.lastName}`.trim();
  return fullName;
}

function resolveCohort(affil: AffilType): string {
  if (affil?.cohort?.name) return affil.cohort.name;
  return "Cohort 2026";
}

function resolveCohortStartDate(affil: AffilType): Date | undefined {
  if (affil?.cohort?.startDate) {
    return new Date(affil.cohort.startDate);
  }
  return undefined;
}

function resolveCohortYear(affil: AffilType): string {
  if (affil?.cohort?.startDate) {
    const d = new Date(affil.cohort.startDate);
    const yr = d.getFullYear();
    if (!isNaN(yr)) return String(yr);
  }
  if (affil?.cohort?.name) {
    const match = affil.cohort.name.match(/\b(20\d{2})\b/);
    if (match) return match[1];
  }
  return "2026";
}

function resolveInstitution(affil: AffilType): string {
  if (affil?.institution?.name) return affil.institution.name;
  return "Aptitek";
}

function checkProfileComplete(dbUser: DbUserWithAffil): boolean {
  if (!dbUser.firstName) return false;
  if (!dbUser.lastName) return false;
  return true;
}

function getCohortTime(startDate?: Date | string | null): number {
  if (!startDate) return 0;
  return new Date(startDate).getTime() || 0;
}

function getSortedCohortAffils(dbUser: DbUserWithAffil) {
  return [...(dbUser.affiliations || [])]
    .filter((a) => a.cohortId && a.cohort)
    .sort((a, b) => {
      const dateA = getCohortTime(a.cohort?.startDate);
      const dateB = getCohortTime(b.cohort?.startDate);
      return dateB - dateA;
    });
}

function buildStudentCohorts(
  cohortAffils: ReturnType<typeof getSortedCohortAffils>,
) {
  return cohortAffils.map((a) => ({
    id: a.cohort!.id,
    name: a.cohort!.name,
    startDate: a.cohort?.startDate,
    startYear: resolveCohortYear(a),
    institutionId: a.institutionId,
    institutionName: a.institution?.name,
  }));
}

interface StudentCohortData {
  cohortName?: string;
  cohortId: string | null;
  cohortStartDate?: Date | string | null;
  cohortStartYear?: string | number | null;
  cohorts?: CompactCohortItem[];
}

function resolveStudentCohortDetails(
  primaryAffil: AffilType,
  isStudent: boolean,
  studentCohorts: CompactCohortItem[],
): StudentCohortData {
  if (!isStudent) {
    return {
      cohortName: undefined,
      cohortId: null,
      cohortStartDate: undefined,
      cohortStartYear: undefined,
      cohorts: undefined,
    };
  }

  return {
    cohortName: resolveCohort(primaryAffil),
    cohortId: primaryAffil?.cohortId ?? null,
    cohortStartDate: resolveCohortStartDate(primaryAffil),
    cohortStartYear: resolveCohortYear(primaryAffil),
    cohorts: studentCohorts,
  };
}

export function mapDbUserToStudent(dbUser: DbUserWithAffil): EntityCardData {
  const cohortAffils = getSortedCohortAffils(dbUser);
  const studentCohorts = buildStudentCohorts(cohortAffils);
  const primaryAffil = cohortAffils[0] || dbUser.affiliations?.[0];
  const role = resolveUserGlobalRole(dbUser);
  const isStudent = role === "student";
  const cohortDetails = resolveStudentCohortDetails(
    primaryAffil,
    isStudent,
    studentCohorts,
  );

  return {
    id: dbUser.id,
    firstName: dbUser.firstName,
    familyName: dbUser.lastName,
    displayName: resolveUserDisplayName(dbUser),
    email: primaryAffil?.email ?? "",
    role,
    avatarUrl: undefined,
    githubUsername: dbUser.githubId ?? undefined,
    ...cohortDetails,
    institutionName: resolveInstitution(primaryAffil),
    institutionId: primaryAffil?.institutionId ?? undefined,
    isProfileComplete: checkProfileComplete(dbUser),
  };
}

export {
  getDefaultSchools,
  getDefaultCohorts,
  getDefaultStudents,
  getDefaultInstructors,
} from "./admin.mock";

export async function handleAddCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const studentId = String(formData.get("studentId") || "");
  const cohortId = String(formData.get("cohortId") || "");

  if (!studentId || !cohortId) {
    return { success: false, error: "Missing studentId or cohortId" };
  }

  try {
    await addStudentToCohort(db, {
      userId: studentId,
      cohortId,
      actorUserId,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to add student to cohort" };
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
    return { success: false, error: "Missing studentId or cohortId" };
  }

  try {
    await removeStudentFromCohort(db, {
      userId: studentId,
      cohortId,
      actorUserId,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to remove student from cohort" };
  }
}

export async function handleDeleteUserAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
  session?: {
    userId?: string;
    originalUserId?: string;
    impersonating?: boolean;
  } | null,
) {
  const studentId = String(formData.get("studentId") || "");

  if (!studentId) {
    return { success: false, error: "Missing studentId" };
  }

  try {
    const existingUser = await getUserWithAffiliations(db, studentId);
    if (existingUser) {
      const primaryAffil = existingUser.affiliations?.[0];
      await logImpersonatedAudit(db, session, {
        tableName: "users",
        recordId: studentId,
        action: "DELETE",
        targetUserId: studentId,
        oldValues: JSON.stringify({
          id: existingUser.id,
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

export function resolveModalUser(
  selectedStudent: EntityCardData | null,
): AuthUser | null {
  if (!selectedStudent) return null;
  return {
    id: selectedStudent.id,
    name: `${selectedStudent.firstName} ${selectedStudent.familyName}`.trim(),
    email: selectedStudent.email,
    role: selectedStudent.role ?? "student",
    avatarUrl: selectedStudent.avatarUrl,
    githubUsername: selectedStudent.githubUsername,
    isProfileComplete: selectedStudent.isProfileComplete,
  };
}

export async function handleCreateInstitutionAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const logoUrl = parseOptionalString(formData, "logoUrl");

  if (!name || !slug) {
    return { success: false, error: "Missing required fields for institution" };
  }

  try {
    const institution = await createInstitution(db, {
      name,
      slug,
      logoUrl,
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
  const logoUrl = formData.has("logoUrl")
    ? parseOptionalString(formData, "logoUrl")
    : undefined;

  if (!id) {
    return { success: false, error: "Missing institution id" };
  }

  try {
    const institution = await updateInstitution(db, id, {
      name,
      slug,
      logoUrl,
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
  session?: {
    userId?: string;
    originalUserId?: string;
    impersonating?: boolean;
  } | null;
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

function matchesRole(user: EntityCardData, roleFilter: string): boolean {
  return roleFilter === "all" || user.role === roleFilter;
}

function matchesSchool(user: EntityCardData, schoolFilter: string): boolean {
  return schoolFilter === "all" || user.institutionId === schoolFilter;
}

function matchesCohort(user: EntityCardData, cohortFilter: string): boolean {
  return (
    cohortFilter === "all" ||
    Boolean(user.cohorts?.some((c) => c.id === cohortFilter))
  );
}

function matchesQuery(user: EntityCardData, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const searchStr =
    `${user.firstName} ${user.familyName} ${user.email} ${user.githubUsername || ""}`.toLowerCase();
  return searchStr.includes(q);
}

export interface UserFilterCriteria {
  role: string;
  school: string;
  cohort: string;
  query: string;
}

export function matchesUserFilters(
  user: EntityCardData,
  filters: UserFilterCriteria,
): boolean {
  return (
    matchesRole(user, filters.role) &&
    matchesSchool(user, filters.school) &&
    matchesCohort(user, filters.cohort) &&
    matchesQuery(user, filters.query)
  );
}
