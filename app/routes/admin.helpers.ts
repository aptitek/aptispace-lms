import {
  getUserWithAffiliations,
  deleteUser,
  type getAllUsersWithAffiliations,
} from "~/services/userService";
import { logImpersonatedAudit } from "~/services/assessmentService";
import type { CompactStudentData } from "~/components/molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { AuthUser, UserRole } from "~/utils/auth";
import type { Database } from "~/db/index";

import {
  addStudentToCohort,
  removeStudentFromCohort,
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

export function mapDbUserToStudent(
  dbUser: DbUserWithAffil,
): CompactStudentData {
  const cohortAffils = getSortedCohortAffils(dbUser);
  const studentCohorts = buildStudentCohorts(cohortAffils);
  const primaryAffil = cohortAffils[0] || dbUser.affiliations?.[0];
  const role = resolveUserGlobalRole(dbUser);

  return {
    id: dbUser.id,
    firstName: dbUser.firstName,
    familyName: dbUser.lastName,
    displayName: resolveUserDisplayName(dbUser),
    email: primaryAffil?.email ?? "",
    role,
    avatarUrl: undefined,
    githubUsername: dbUser.githubId ?? undefined,
    cohortName: resolveCohort(primaryAffil),
    cohortId: primaryAffil?.cohortId ?? null,
    cohortStartDate: resolveCohortStartDate(primaryAffil),
    cohortStartYear: resolveCohortYear(primaryAffil),
    cohorts: studentCohorts,
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

export function resolveModalUser(
  selectedStudent: CompactStudentData | null,
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
