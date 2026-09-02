import type { Database } from "~/db/index";
import { getAllUsersWithAffiliations } from "~/services/userService";
import { getAllInstitutions, getAllCohorts } from "~/services/cohortService";
import type { SchoolConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import {
  mapDbUserToStudent,
  getDefaultStudents,
  getDefaultInstructors,
  getDefaultSchools,
  getDefaultCohorts,
  type DbUserWithAffil,
} from "./admin.helpers";
import { getCohortDisplayName } from "~/utils/cohortFormat";
import type { AuthUser } from "~/utils/auth";

export async function loadAdminDashboardData(
  db: Database | null,
  activeUser: AuthUser | null,
) {
  let dbUsers: DbUserWithAffil[] = [];
  let dbInstitutions: Awaited<ReturnType<typeof getAllInstitutions>> = [];
  let dbCohorts: Awaited<ReturnType<typeof getAllCohorts>> = [];

  if (db) {
    try {
      [dbUsers, dbInstitutions, dbCohorts] = await Promise.all([
        getAllUsersWithAffiliations(db),
        getAllInstitutions(db),
        getAllCohorts(db),
      ]);
    } catch {
      dbUsers = [];
    }
  }

  let mappedUsers = dbUsers.map(mapDbUserToStudent);

  if (mappedUsers.length === 0) {
    mappedUsers = [...getDefaultStudents(), ...getDefaultInstructors()];
  }

  const schools: SchoolConfig[] =
    dbInstitutions.length > 0
      ? dbInstitutions.map((inst) => ({
          id: inst.id,
          name: inst.name,
          slug: inst.slug,
          type: inst.type,
          logoUrl: inst.logoUrl,
          emailDomain: inst.emailDomain ?? undefined,
          usernamePattern: inst.usernamePattern ?? undefined,
        }))
      : getDefaultSchools();

  const cohorts: CohortWithInstitution[] =
    dbCohorts.length > 0
      ? dbCohorts.map((c) => ({
          id: c.id,
          name: getCohortDisplayName(c),
          institutionId: c.institutionId,
          diploma: c.diploma,
          year: c.year,
          tags: c.tags,
          description: c.description ?? undefined,
          startDate: c.startDate ? c.startDate.toISOString() : undefined,
          endDate: c.endDate ? c.endDate.toISOString() : undefined,
        }))
      : getDefaultCohorts();

  const schoolStudentCounts: Record<string, number> = {};
  const cohortStudentCounts: Record<string, number> = {};

  mappedUsers.forEach((s) => {
    if (s.institutionId) {
      schoolStudentCounts[s.institutionId] =
        (schoolStudentCounts[s.institutionId] || 0) + 1;
    }
    s.cohorts?.forEach((c) => {
      cohortStudentCounts[c.id] = (cohortStudentCounts[c.id] || 0) + 1;
    });
  });

  return {
    user: activeUser,
    users: mappedUsers,
    totalUsers: mappedUsers.length,
    schools,
    cohorts,
    schoolStudentCounts,
    cohortStudentCounts,
  };
}
