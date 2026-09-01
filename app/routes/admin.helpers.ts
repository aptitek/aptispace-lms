import type { getAllUsersWithAffiliations } from "~/services/userService";
import type { CompactStudentData } from "~/components/molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { AuthUser, UserRole } from "~/utils/auth";

export type DbUserWithAffil = Awaited<
  ReturnType<typeof getAllUsersWithAffiliations>
>[number];
type AffilType = DbUserWithAffil["affiliations"][number] | undefined;

function resolveRole(affil: AffilType): UserRole {
  if (affil?.role) return affil.role;
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

export function mapDbUserToStudent(
  dbUser: DbUserWithAffil,
): CompactStudentData {
  const affil: AffilType = dbUser.affiliations[0];
  const role = resolveRole(affil);
  const displayName = resolveUserDisplayName(dbUser);
  const cohortName = resolveCohort(affil);
  const cohortStartDate = resolveCohortStartDate(affil);
  const cohortStartYear = resolveCohortYear(affil);
  const institutionName = resolveInstitution(affil);
  const isProfileComplete = checkProfileComplete(dbUser);

  return {
    id: dbUser.id,
    firstName: dbUser.firstName,
    familyName: dbUser.lastName,
    displayName,
    email: affil?.email ?? "",
    role,
    avatarUrl: undefined,
    githubUsername: dbUser.githubId ?? undefined,
    cohortName,
    cohortId: affil?.cohortId ?? null,
    cohortStartDate,
    cohortStartYear,
    institutionName,
    institutionId: affil?.institutionId ?? undefined,
    isProfileComplete,
  };
}

export function getDefaultStudents(): CompactStudentData[] {
  return [
    {
      id: "std-001",
      firstName: "Alexandre",
      familyName: "MOREAU",
      displayName: "Alexandre MOREAU",
      email: "alexandre.moreau@aptitek.io",
      role: "student",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      githubUsername: "amoreau",
      cohortName: "Cohort 2026",
      cohortStartYear: "2026",
      isProfileComplete: true,
    },
    {
      id: "std-002",
      firstName: "Thomas",
      familyName: "DUBOIS",
      displayName: "Thomas DUBOIS",
      email: "thomas.dubois@aptitek.io",
      role: "student",
      githubUsername: "tdubois",
      cohortName: "Cohort 2026",
      cohortStartYear: "2026",
      isProfileComplete: false,
    },
    {
      id: "std-003",
      firstName: "Sophie",
      familyName: "LAURENT",
      displayName: "Sophie LAURENT",
      email: "sophie.laurent@aptitek.io",
      role: "student",
      cohortName: "Cohort 2026",
      cohortStartYear: "2026",
      isProfileComplete: true,
    },
    {
      id: "std-004",
      firstName: "Maxime",
      familyName: "LEROY",
      displayName: "Maxime LEROY",
      email: "maxime.leroy@aptitek.io",
      role: "student",
      githubUsername: "mleroy",
      cohortName: "Cohort 2025",
      cohortStartYear: "2025",
      isProfileComplete: true,
    },
    {
      id: "std-005",
      firstName: "Camille",
      familyName: "ROUX",
      displayName: "Camille ROUX",
      email: "camille.roux@aptitek.io",
      role: "student",
      githubUsername: "croux",
      cohortName: "Cohort 2026",
      cohortStartYear: "2026",
      isProfileComplete: true,
    },
    {
      id: "std-006",
      firstName: "Lucas",
      familyName: "GARCIA",
      displayName: "Lucas GARCIA",
      email: "lucas.garcia@aptitek.io",
      role: "student",
      cohortName: "Cohort 2026",
      cohortStartYear: "2026",
      isProfileComplete: false,
    },
  ];
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
