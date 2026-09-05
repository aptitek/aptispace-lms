import type {
  EntityCardData,
  CompactCohortItem,
} from "../../molecules/EntityCard/EntityCard.types";
import type { CohortWithInstitution } from "./StudentInspector.types";

import type { SchoolConfig } from "../../../types/institution";

export const DEFAULT_FALLBACK_SCHOOL: SchoolConfig = {
  id: "school-aptitek",
  name: "Aptitek",
  slug: "aptitek",
  logoUrl: "/aptitek-logo.svg",
  emailDomain: "aptitek.io",
};

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

  return (a.name || "").localeCompare(b.name || "");
}

export function sortCohortsBySchoolAndDate(
  cohortList: CohortWithInstitution[],
  schoolMap: Map<string, SchoolConfig>,
): CohortWithInstitution[] {
  return [...cohortList].sort((a, b) => compareCohorts(a, b, schoolMap));
}

export function sortAssignedByDate(
  cohortList: CompactCohortItem[],
): CompactCohortItem[] {
  return [...cohortList].sort((a, b) => {
    const timeA = parseCohortTimestamp(a.startDate);
    const timeB = parseCohortTimestamp(b.startDate);
    if (timeA !== timeB) return timeB - timeA;
    return a.name.localeCompare(b.name);
  });
}

export function resolveAssignedCohorts(
  student: EntityCardData,
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
