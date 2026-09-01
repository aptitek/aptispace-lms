import type {
  OnboardingProfile,
  SchoolConfig,
} from "../OnboardingCard/OnboardingCard.types";
import type {
  CompactStudentData,
  CompactCohortItem,
} from "../../molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { CohortWithInstitution } from "./StudentInspector.types";
import type { AuthUser } from "~/utils/auth";

export const DEFAULT_FALLBACK_SCHOOL: SchoolConfig = {
  id: "school-aptitek",
  name: "Aptitek",
  slug: "aptitek",
  logoUrl: "/aptitek-logo.svg",
  emailDomain: "aptitek.io",
};

export function studentToProfile(
  student: CompactStudentData,
): OnboardingProfile {
  return {
    firstName: student.firstName || "",
    familyName: (student.familyName || "").toUpperCase(),
    email: student.email || "",
    avatarUrl: student.avatarUrl || "",
    role: student.role || "student",
    githubUsername: student.githubUsername,
  };
}

export function studentToAuthUser(student: CompactStudentData): AuthUser {
  return {
    id: student.id,
    name: `${student.firstName} ${student.familyName}`.trim(),
    email: student.email,
    role: student.role || "student",
    avatarUrl: student.avatarUrl,
    githubUsername: student.githubUsername,
    isProfileComplete: student.isProfileComplete,
  };
}

export function isProfileIdentical(
  a: OnboardingProfile | null,
  b: OnboardingProfile,
): boolean {
  if (!a) return false;
  return (
    a.firstName === b.firstName &&
    a.familyName === b.familyName &&
    a.email === b.email &&
    a.avatarUrl === b.avatarUrl &&
    a.role === b.role &&
    a.githubUsername === b.githubUsername
  );
}

export function resolveUpdatedAuthUser(
  student: CompactStudentData,
  savedProfile: OnboardingProfile,
  accountPayload?: AuthUser,
): AuthUser {
  if (accountPayload) return accountPayload;
  return {
    id: student.id,
    name: `${savedProfile.firstName} ${savedProfile.familyName}`.trim(),
    email: savedProfile.email,
    avatarUrl: savedProfile.avatarUrl,
    role: savedProfile.role ?? student.role ?? "student",
    githubUsername: savedProfile.githubUsername ?? student.githubUsername,
    isProfileComplete: student.isProfileComplete,
  };
}

export async function saveStudentProfileApi(
  studentId: string,
  profile: OnboardingProfile,
): Promise<{ account?: AuthUser }> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateProfile",
      userId: studentId,
      firstName: profile.firstName,
      lastName: profile.familyName,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save profile changes.");
  }

  return (await response.json().catch(() => ({}))) as { account?: AuthUser };
}

export function parseCohortTimestamp(dateVal?: string | Date | null): number {
  if (!dateVal) return 0;
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export function extractCohortYear(
  dateVal?: string | Date | null,
  name?: string,
): string | null {
  if (dateVal) {
    const d = new Date(dateVal);
    const yr = d.getFullYear();
    if (!isNaN(yr)) return String(yr);
  }
  if (name) {
    const match = name.match(/\b(20\d{2})\b/);
    if (match) return match[1];
  }
  return null;
}

export function getCohortSchoolName(
  cohort: CohortWithInstitution,
  schoolMap: Map<string, SchoolConfig>,
): string {
  if (cohort.institutionId) {
    const school = schoolMap.get(cohort.institutionId);
    if (school?.name) return school.name;
  }
  return cohort.institutionName || "";
}

export function compareCohorts(
  a: CohortWithInstitution,
  b: CohortWithInstitution,
  schoolMap: Map<string, SchoolConfig>,
): number {
  const schoolA = getCohortSchoolName(a, schoolMap);
  const schoolB = getCohortSchoolName(b, schoolMap);
  const schoolCompare = schoolA.localeCompare(schoolB);
  if (schoolCompare !== 0) return schoolCompare;

  const timeA = parseCohortTimestamp(a.startDate);
  const timeB = parseCohortTimestamp(b.startDate);
  if (timeA !== timeB) return timeB - timeA;

  return a.name.localeCompare(b.name);
}

export function sortCohortsBySchoolAndDate(
  cohortList: CohortWithInstitution[],
  schoolMap: Map<string, SchoolConfig>,
): CohortWithInstitution[] {
  return [...cohortList].sort((a, b) => compareCohorts(a, b, schoolMap));
}

export function sortAssignedByDate(
  items: CompactCohortItem[],
): CompactCohortItem[] {
  return [...items].sort((a, b) => {
    const timeA = parseCohortTimestamp(a.startDate);
    const timeB = parseCohortTimestamp(b.startDate);
    if (timeA !== timeB) return timeB - timeA;
    return a.name.localeCompare(b.name);
  });
}

export function resolveAssignedCohorts(
  student: CompactStudentData,
): CompactCohortItem[] {
  if (student.cohorts && student.cohorts.length > 0) {
    return sortAssignedByDate(student.cohorts);
  }

  if (student.cohortId) {
    return [
      {
        id: student.cohortId,
        name: student.cohortName || "Cohort 2026",
        startDate: student.cohortStartDate,
        startYear: student.cohortStartYear,
        institutionId: student.institutionId,
        institutionName: student.institutionName,
      },
    ];
  }

  return [];
}
