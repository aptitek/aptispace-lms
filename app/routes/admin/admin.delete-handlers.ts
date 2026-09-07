import type React from "react";
import type { FetcherWithComponents } from "react-router";
import type { TFunction } from "i18next";
import type { UserCardData } from "~/components/molecules/UserCard/UserCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface UseAdminDeleteHandlersParams {
  fetcher: FetcherWithComponents<unknown>;
  t: TFunction;
  notifySuccess: (msg: string) => void;
  notifyError: (
    err: unknown,
    opts: {
      title: string;
      message: string;
      contextData?: Record<string, unknown>;
    },
  ) => void;
  selectedUser: UserCardData | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserCardData | null>>;
  selectedSchool: SchoolConfig | null;
  setSelectedSchool: React.Dispatch<React.SetStateAction<SchoolConfig | null>>;
  selectedSchoolForEdit: SchoolConfig | null;
  setSelectedSchoolForEdit: React.Dispatch<
    React.SetStateAction<SchoolConfig | null>
  >;
  selectedCohortForEdit: CohortConfig | null;
  setSelectedCohortForEdit: React.Dispatch<
    React.SetStateAction<CohortConfig | null>
  >;
}

export function useAdminDeleteHandlers({
  fetcher,
  t,
  notifySuccess,
  notifyError,
  selectedUser,
  setSelectedUser,
  selectedSchool,
  setSelectedSchool,
  selectedSchoolForEdit,
  setSelectedSchoolForEdit,
  selectedCohortForEdit,
  setSelectedCohortForEdit,
}: UseAdminDeleteHandlersParams) {
  const handleDeleteUser = async (user: UserCardData) => {
    const userName = `${user.firstName} ${user.familyName}`.trim();
    try {
      fetcher.submit(
        { intent: "delete-user", studentId: user.id },
        { method: "post" },
      );
      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
      }
      notifySuccess(
        t("common:userDeleted", {
          name: userName,
          defaultValue: `${userName} has been deleted successfully.`,
        }),
      );
    } catch (err: unknown) {
      notifyError(err, {
        title: t("errors:errorTitle", "System Diagnostic Alert"),
        message: t("common:userDeleteFailed", {
          defaultValue: "Failed to delete user.",
        }),
        contextData: {
          studentId: user.id,
          role: user.role,
          name: userName,
        },
      });
    }
  };

  const handleDeleteInstitution = async (school: SchoolConfig) => {
    const schoolName = school.name || school.slug || "";
    try {
      fetcher.submit(
        { intent: "delete-institution", institutionId: school.id },
        { method: "post" },
      );
      if (selectedSchoolForEdit?.id === school.id) {
        setSelectedSchoolForEdit(null);
      }
      if (selectedSchool?.id === school.id) {
        setSelectedSchool(null);
      }
      notifySuccess(
        t("common:institutionDeleted", {
          name: schoolName,
          defaultValue: `${schoolName} has been deleted successfully.`,
        }),
      );
    } catch (err: unknown) {
      notifyError(err, {
        title: t("errors:errorTitle", "System Diagnostic Alert"),
        message: t("common:institutionDeleteFailed", {
          defaultValue: "Failed to delete institution.",
        }),
        contextData: {
          institutionId: school.id,
          name: schoolName,
        },
      });
    }
  };

  const handleDeleteCohort = async (cohort: CohortConfig) => {
    if (!cohort.id) return;
    const cohortName = cohort.name || cohort.id || "";
    try {
      fetcher.submit(
        { intent: "delete-cohort", cohortId: cohort.id },
        { method: "post" },
      );
      if (selectedCohortForEdit?.id === cohort.id) {
        setSelectedCohortForEdit(null);
      }
      notifySuccess(
        t("common:cohortDeleted", {
          name: cohortName,
          defaultValue: `${cohortName} has been deleted successfully.`,
        }),
      );
    } catch (err: unknown) {
      notifyError(err, {
        title: t("errors:errorTitle", "System Diagnostic Alert"),
        message: t("common:cohortDeleteFailed", {
          defaultValue: "Failed to delete cohort.",
        }),
        contextData: {
          cohortId: cohort.id,
          name: cohortName,
        },
      });
    }
  };

  return {
    handleDeleteUser,
    handleDeleteInstitution,
    handleDeleteCohort,
  };
}
