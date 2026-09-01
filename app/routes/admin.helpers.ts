import type { getAllUsersWithAffiliations } from "~/services/userService";
import type { CompactStudentData } from "~/components/molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { AuthUser, UserRole } from "~/utils/auth";
import type { SchoolConfig } from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import type { Database } from "~/db/index";
import {
  addStudentToCohort,
  removeStudentFromCohort,
} from "~/services/cohortService";

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

  return {
    id: dbUser.id,
    firstName: dbUser.firstName,
    familyName: dbUser.lastName,
    displayName: resolveUserDisplayName(dbUser),
    email: primaryAffil?.email ?? "",
    role: resolveRole(primaryAffil),
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

export function getDefaultSchools(): SchoolConfig[] {
  return [
    {
      id: "school-aptitek",
      name: "Aptitek",
      slug: "aptitek",
      logoUrl: "/aptitek-logo.svg",
      emailDomain: "aptitek.io",
    },
    {
      id: "school-42",
      name: "42 Paris",
      slug: "42paris",
      logoUrl: "/aptitek-logo.svg",
      emailDomain: "42.fr",
    },
  ];
}

export function getDefaultCohorts(): CohortWithInstitution[] {
  return [
    {
      id: "cohort-2027",
      name: "Cohort 2027",
      institutionId: "school-aptitek",
      startDate: "2027-09-01",
      endDate: "2028-06-30",
    },
    {
      id: "cohort-2026",
      name: "Cohort 2026",
      institutionId: "school-aptitek",
      startDate: "2026-09-01",
      endDate: "2027-06-30",
    },
    {
      id: "cohort-42-2026",
      name: "42 Common Core 2026",
      institutionId: "school-42",
      startDate: "2026-10-01",
      endDate: "2027-09-30",
    },
    {
      id: "cohort-2025",
      name: "Cohort 2025",
      institutionId: "school-aptitek",
      startDate: "2025-09-01",
      endDate: "2026-06-30",
    },
  ];
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
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
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
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
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
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
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
      cohortId: "cohort-2025",
      cohortStartYear: "2025",
      cohorts: [
        {
          id: "cohort-2025",
          name: "Cohort 2025",
          startYear: "2025",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
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
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
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
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: false,
    },
  ];
}

export function getDefaultInstructors(): CompactStudentData[] {
  return [
    {
      id: "inst-001",
      firstName: "Sarah",
      familyName: "CONNOR",
      displayName: "Sarah CONNOR",
      email: "sarah.connor@aptitek.io",
      role: "instructor",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      githubUsername: "sconnor",
      cohortName: "Cohort 2026",
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
        {
          id: "cohort-2027",
          name: "Cohort 2027",
          startYear: "2027",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: true,
    },
    {
      id: "inst-002",
      firstName: "Marcus",
      familyName: "AURELIUS",
      displayName: "Marcus AURELIUS",
      email: "marcus.aurelius@aptitek.io",
      role: "instructor",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      githubUsername: "maurelius",
      cohortName: "42 Common Core 2026",
      cohortId: "cohort-42-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-42-2026",
          name: "42 Common Core 2026",
          startYear: "2026",
          institutionId: "school-42",
          institutionName: "42 Paris",
        },
      ],
      institutionId: "school-42",
      institutionName: "42 Paris",
      isProfileComplete: true,
    },
    {
      id: "inst-003",
      firstName: "Elena",
      familyName: "ROSTOVA",
      displayName: "Elena ROSTOVA",
      email: "elena.rostova@aptitek.io",
      role: "instructor",
      githubUsername: "erostova",
      cohortName: "Cohort 2025",
      cohortId: "cohort-2025",
      cohortStartYear: "2025",
      cohorts: [
        {
          id: "cohort-2025",
          name: "Cohort 2025",
          startYear: "2025",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: true,
    },
  ];
}

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
