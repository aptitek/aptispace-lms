import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { CompactStudentData } from "../../molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { CohortWithInstitution } from "./StudentInspector.types";
import type {
  OnboardingProfile,
  SchoolConfig,
  CohortConfig,
} from "../OnboardingCard/OnboardingCard.types";
import type { ProfileSaveStatus } from "./StudentInspector.components";
import type { AuthUser } from "../../../utils/auth";
import {
  DEFAULT_FALLBACK_SCHOOL,
  studentToProfile,
  isProfileIdentical,
  saveStudentProfileApi,
  resolveUpdatedAuthUser,
  sortCohortsBySchoolAndDate,
  resolveAssignedCohorts,
} from "./StudentInspector.helpers";

export function useInspectorProfileState(
  student: CompactStudentData | null,
  onStudentUpdated?: (updatedUser: AuthUser) => void,
) {
  const [activeStudent, setActiveStudent] = useState<CompactStudentData | null>(
    student,
  );
  const targetStudent = student || activeStudent;

  const [currentProfile, setCurrentProfile] = useState<OnboardingProfile>(() =>
    student
      ? studentToProfile(student)
      : studentToProfile({ id: "", firstName: "", familyName: "", email: "" }),
  );
  const [saveStatus, setSaveStatus] = useState<ProfileSaveStatus>("idle");
  const lastSavedProfileRef = useRef<OnboardingProfile>(currentProfile);

  useEffect(() => {
    if (student) {
      setActiveStudent(student);
      const initial = studentToProfile(student);
      setCurrentProfile(initial);
      lastSavedProfileRef.current = initial;
      setSaveStatus("idle");
    }
  }, [student]);

  const performSave = useCallback(
    async (profileToSave: OnboardingProfile) => {
      if (
        !targetStudent ||
        isProfileIdentical(lastSavedProfileRef.current, profileToSave)
      ) {
        return;
      }
      setSaveStatus("saving");
      try {
        const payload = await saveStudentProfileApi(
          targetStudent.id,
          profileToSave,
        );
        lastSavedProfileRef.current = { ...profileToSave };
        setSaveStatus("saved");
        if (onStudentUpdated) {
          onStudentUpdated(
            resolveUpdatedAuthUser(
              targetStudent,
              profileToSave,
              payload.account,
            ),
          );
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [targetStudent, onStudentUpdated],
  );

  const handleProfileChange = (nextProfile: OnboardingProfile) => {
    const avatarChanged = nextProfile.avatarUrl !== currentProfile.avatarUrl;
    setCurrentProfile(nextProfile);
    if (avatarChanged) {
      void performSave(nextProfile);
    }
  };

  const handleFieldBlur = (blurredProfile: OnboardingProfile) => {
    void performSave(blurredProfile);
  };

  return {
    targetStudent,
    currentProfile,
    saveStatus,
    handleProfileChange,
    handleFieldBlur,
  };
}

export function useInspectorCohortsState(
  targetStudent: CompactStudentData | null,
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
