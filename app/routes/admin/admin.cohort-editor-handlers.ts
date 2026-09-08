import type React from "react";
import type { FetcherWithComponents } from "react-router";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import {
  buildCohortSubmitData,
  buildInstitutionSubmitData,
  type CohortSavePayload,
} from "./admin.helpers";

export interface UseAdminCohortEditorHandlersParams {
  fetcher: FetcherWithComponents<unknown>;
  notifyError: (err: unknown) => void;
  selectedSchool: SchoolConfig | null;
  setSelectedSchool: React.Dispatch<React.SetStateAction<SchoolConfig | null>>;
  selectedSchoolForEdit: SchoolConfig | null;
  setSelectedSchoolForEdit: React.Dispatch<
    React.SetStateAction<SchoolConfig | null>
  >;
  selectedCohortForEdit: CohortWithInstitution | null;
  setSelectedCohortForEdit: React.Dispatch<
    React.SetStateAction<CohortWithInstitution | null>
  >;
}

export function useAdminCohortEditorHandlers({
  fetcher,
  notifyError,
  selectedSchool,
  setSelectedSchool,
  selectedSchoolForEdit,
  setSelectedSchoolForEdit,
  selectedCohortForEdit,
  setSelectedCohortForEdit,
}: UseAdminCohortEditorHandlersParams) {
  const handleSchoolClick = (school: SchoolConfig) => {
    setSelectedSchool(school);
    setSelectedSchoolForEdit(school);
    setSelectedCohortForEdit(null);
  };

  const handleCreateNewSchool = () => {
    const draftSchool: SchoolConfig = {
      id: "",
      name: "",
      slug: "",
      logoUrl: "",
    };
    setSelectedSchoolForEdit(draftSchool);
    setSelectedSchool(null);
    setSelectedCohortForEdit(null);
  };

  const handleCohortClick = (cohort: CohortConfig) => {
    setSelectedCohortForEdit(cohort as CohortWithInstitution);
    setSelectedSchoolForEdit(null);
  };

  const handleCreateNewCohort = () => {
    if (!selectedSchool?.id) return;
    const draftCohort: CohortWithInstitution = {
      name: "",
      description: "",
      institutionId: selectedSchool.id,
    };
    setSelectedCohortForEdit(draftCohort);
    setSelectedSchoolForEdit(null);
  };

  const handleSaveInstitution = (payload: {
    id?: string;
    name: string;
    slug: string;
    type?: string;
    logoUrl?: string;
    emailDomain?: string;
    usernamePattern?: string;
  }) => {
    const submitPayload = buildInstitutionSubmitData(payload);
    fetcher.submit(submitPayload, { method: "post" });
    if (!payload.id) {
      setSelectedSchoolForEdit(null);
    } else if (selectedSchoolForEdit) {
      setSelectedSchoolForEdit((prev) =>
        prev ? { ...prev, ...payload } : null,
      );
    }
  };

  const handleSaveCohort = (payload: CohortSavePayload) => {
    const institutionId =
      selectedSchool?.id || selectedCohortForEdit?.institutionId;
    if (!institutionId) {
      notifyError(new Error("No institution selected"));
      return;
    }
    const submitPayload = buildCohortSubmitData(institutionId, payload);
    fetcher.submit(submitPayload, { method: "post" });
    if (!payload.id) {
      setSelectedCohortForEdit(null);
    } else if (selectedCohortForEdit) {
      setSelectedCohortForEdit((prev) =>
        prev
          ? {
              ...prev,
              ...payload,
              description: payload.description ?? "",
            }
          : null,
      );
    }
  };

  return {
    handleSchoolClick,
    handleCreateNewSchool,
    handleCohortClick,
    handleCreateNewCohort,
    handleSaveInstitution,
    handleSaveCohort,
  };
}
