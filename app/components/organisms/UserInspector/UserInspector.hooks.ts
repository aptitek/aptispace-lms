import { useState, useMemo } from "react";
import type { UserCardData } from "../../molecules/UserCard/UserCard.types";
import type { CohortWithInstitution } from "./UserInspector.types";
import {
  DEFAULT_FALLBACK_SCHOOL,
  sortCohortsBySchoolAndDate,
  resolveAssignedCohorts,
} from "./UserInspector.helpers";
import type { SchoolConfig, CohortConfig } from "../../../types/institution";

export function useInspectorCohortsState(
  targetUser: UserCardData | null,
  schools: SchoolConfig[] = [],
  cohorts: CohortWithInstitution[] = [],
  onAddCohort?: (params: {
    studentId: string;
    cohortId: string;
  }) => Promise<void> | void,
) {
  const [selectedCohortToAdd, setSelectedCohortToAdd] = useState<string>("");

  const schoolMap = useMemo(() => {
    const map = new Map<string, SchoolConfig>();
    for (const school of schools) {
      map.set(school.id, school);
    }
    return map;
  }, [schools]);

  const sortedCohorts = useMemo(() => {
    return sortCohortsBySchoolAndDate(cohorts, schoolMap);
  }, [cohorts, schoolMap]);

  const assignedCohorts = useMemo(() => {
    if (!targetUser) return [];
    return resolveAssignedCohorts(targetUser);
  }, [targetUser]);

  const assignedCohortIds = useMemo(() => {
    return new Set(assignedCohorts.map((c) => c.id));
  }, [assignedCohorts]);

  const availableToAdd = useMemo(() => {
    return sortedCohorts.filter((c) => c.id && !assignedCohortIds.has(c.id));
  }, [sortedCohorts, assignedCohortIds]);

  const activeSchool: SchoolConfig = useMemo(() => {
    if (!targetUser) return DEFAULT_FALLBACK_SCHOOL;
    const found = schools.find((s) => s.id === targetUser.institutionId);
    return found || schools[0] || DEFAULT_FALLBACK_SCHOOL;
  }, [targetUser, schools]);

  const activeCohort: CohortConfig | undefined = useMemo(() => {
    const primary = assignedCohorts[0];
    if (!primary) return undefined;
    const matched = cohorts.find((c) => c.id === primary.id);
    return (
      matched || {
        id: primary.id,
        name: primary.name,
        startDate: primary.startDate ? String(primary.startDate) : undefined,
      }
    );
  }, [assignedCohorts, cohorts]);

  const handleAdd = (cohortId?: string) => {
    const idToAdd = cohortId || selectedCohortToAdd;
    if (!idToAdd || !targetUser || !onAddCohort) return;
    void onAddCohort({
      studentId: targetUser.id,
      cohortId: idToAdd,
    });
    setSelectedCohortToAdd("");
  };

  return {
    selectedCohortToAdd,
    setSelectedCohortToAdd,
    schoolMap,
    sortedCohorts,
    assignedCohorts,
    availableToAdd,
    activeSchool,
    activeCohort,
    handleAdd,
  };
}
