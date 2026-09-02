import type {
  EntityCardData,
  CompactCohortItem,
} from "~/components/molecules/EntityCard/EntityCard.types";
import type { AuthUser, UserRole } from "~/utils/auth";
import type { getAllUsersWithAffiliations } from "~/services/userService";
import {
  getDefaultStudents,
  getDefaultInstructors,
  getDefaultSchools,
  getDefaultCohorts,
} from "./admin.mock";

export {
  getDefaultStudents,
  getDefaultInstructors,
  getDefaultSchools,
  getDefaultCohorts,
};

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
  return `${dbUser.firstName} ${dbUser.lastName}`.trim();
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
    email: primaryAffil?.email || "",
    role,
    avatarUrl: dbUser.githubId
      ? `https://avatars.githubusercontent.com/u/${dbUser.githubId}?v=4`
      : undefined,
    githubUsername: undefined,
    isProfileComplete: checkProfileComplete(dbUser),
    institutionId: primaryAffil?.institutionId ?? undefined,
    institutionName: resolveInstitution(primaryAffil),
    ...cohortDetails,
  };
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

function matchesYear(
  user: EntityCardData,
  min?: number | null,
  max?: number | null,
): boolean {
  if (min == null && max == null) return true;
  const userYears: number[] = [];
  if (user.cohortStartDate) {
    const y = new Date(user.cohortStartDate).getFullYear();
    if (!isNaN(y)) userYears.push(y);
  }
  if (user.cohortStartYear) {
    const y = Number(user.cohortStartYear);
    if (!isNaN(y)) userYears.push(y);
  }
  if (user.cohorts) {
    user.cohorts.forEach((c) => {
      if (c.startDate) {
        const y = new Date(c.startDate).getFullYear();
        if (!isNaN(y)) userYears.push(y);
      } else if (c.startYear) {
        const y = Number(c.startYear);
        if (!isNaN(y)) userYears.push(y);
      }
    });
  }
  if (userYears.length === 0) return false;
  return userYears.some((yr) => {
    if (min != null && yr < min) return false;
    if (max != null && yr > max) return false;
    return true;
  });
}

export interface UserFilterCriteria {
  role: string;
  school: string;
  cohort: string;
  query: string;
  startYearMin?: number | null;
  startYearMax?: number | null;
}

export function matchesUserFilters(
  user: EntityCardData,
  filters: UserFilterCriteria,
): boolean {
  return (
    matchesRole(user, filters.role) &&
    matchesSchool(user, filters.school) &&
    matchesCohort(user, filters.cohort) &&
    matchesQuery(user, filters.query) &&
    matchesYear(user, filters.startYearMin, filters.startYearMax)
  );
}
