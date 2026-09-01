import { useState, useMemo } from "react";
import type { EntityCardData } from "../../molecules/EntityCard/EntityCard.types";
import type { CohortWithInstitution } from "./StudentInspector.types";
import {
  DEFAULT_FALLBACK_SCHOOL,
  sortCohortsBySchoolAndDate,
  resolveAssignedCohorts,
} from "./StudentInspector.helpers";
import type { SchoolConfig, CohortConfig } from "../../../types/institution";

export function useInspectorCohortsState(
  targetStudent: EntityCardData | null,
  schools: SchoolConfig[],
  cohorts: CohortWithInstitution[],
  onAddCohort: (params: {
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
    if (!targetStudent) return [];
    return resolveAssignedCohorts(targetStudent);
  }, [targetStudent]);

  const assignedCohortIds = useMemo(() => {
    return new Set(assignedCohorts.map((c) => c.id));
  }, [assignedCohorts]);

  const availableToAdd = useMemo(() => {
    return sortedCohorts.filter((c) => c.id && !assignedCohortIds.has(c.id));
  }, [sortedCohorts, assignedCohortIds]);

  const activeSchool: SchoolConfig = useMemo(() => {
    if (!targetStudent) return DEFAULT_FALLBACK_SCHOOL;
    const found = schools.find((s) => s.id === targetStudent.institutionId);
    return found || schools[0] || DEFAULT_FALLBACK_SCHOOL;
  }, [targetStudent, schools]);

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

  const handleAdd = () => {
    if (!selectedCohortToAdd || !targetStudent) return;
    void onAddCohort({
      studentId: targetStudent.id,
      cohortId: selectedCohortToAdd,
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
