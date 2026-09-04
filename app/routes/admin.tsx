import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useLoaderData,
  useFetcher,
  useRevalidator,
  useLocation,
  useNavigate,
  useOutletContext,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import Header from "~/components/organisms/Header/Header";
import Footer from "~/components/organisms/Footer/Footer";
import { authGuard } from "~/utils/session.server";
import {
  logout,
  loginAsAccount,
  resolveActiveUser,
  type AuthUser,
} from "~/utils/auth";
import { isUserProfileComplete } from "~/services/userService";
import { useStatusCenter } from "~/utils/statusCenterContext";
import type { EntityCardData } from "~/components/molecules/EntityCard/EntityCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import { loadAdminDashboardData } from "./admin.loader";
import { dispatchAdminAction } from "./admin.actions";
import {
  matchesUserFilters,
  buildCohortSubmitData,
  buildInstitutionSubmitData,
  mergeUpdatedUser,
  type CohortSavePayload,
} from "./admin.helpers";
import AdminTabsSection, { type AdminTabKey } from "./admin.tabs";
import AdminCohortsTabPanel from "./admin.cohorts-tab";
import { AdminMissionCenterTabPanel } from "./admin.mission-tab";
import { AdminUsersTabPanel } from "./admin.users-tab";
import { AdminCoursesTabPanel } from "./admin.courses-tab";
import { PageRoot, AdminMainWorkspace } from "./admin.styles";
import type { Route } from "./+types/admin";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context, { requiredRole: "admin" });
  if (!auth?.user || !isUserProfileComplete(auth.user)) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/onboarding" },
    });
  }

  const activeUser = resolveActiveUser(auth.user, auth.session);
  return loadAdminDashboardData(auth.db, activeUser, context);
}

export async function action({ request, context }: ActionFunctionArgs) {
  const auth = await authGuard(request, context, { requiredRole: "admin" });
  if (!auth?.user || !auth.db) {
    return { success: false, error: "Unauthorized" };
  }

  const actorUserId =
    auth.actorUserId ??
    auth.session.originalUserId ??
    auth.session.userId ??
    auth.user.id;

  const formData = await request.formData();
  const intent = formData.get("intent");
  return dispatchAdminAction({
    intent: typeof intent === "string" ? intent : null,
    formData,
    db: auth.db,
    actorUserId,
    session: auth.session,
  });
}

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "AptiSpace LMS • Admin Management" },
    {
      name: "description",
      content:
        "Administrative dashboard for student roster management, credentials, and institutional oversight.",
    },
  ];
}

function resolveTabFromPath(pathname: string): AdminTabKey {
  if (pathname.includes("/admin/cohorts")) return "cohorts";
  if (pathname.includes("/admin/mission-center")) return "mission-center";
  if (pathname.includes("/admin/courses")) return "courses";
  return "users";
}

interface AdminTabContentProps {
  activeTab: AdminTabKey;
  usersProps: React.ComponentProps<typeof AdminUsersTabPanel>;
  cohortsProps: React.ComponentProps<typeof AdminCohortsTabPanel>;
  missionCenterProps?: React.ComponentProps<typeof AdminMissionCenterTabPanel>;
}

function AdminTabContent({
  activeTab,
  usersProps,
  cohortsProps,
  missionCenterProps,
}: AdminTabContentProps) {
  if (activeTab === "cohorts") {
    return <AdminCohortsTabPanel {...cohortsProps} />;
  }
  if (activeTab === "mission-center" && missionCenterProps) {
    return <AdminMissionCenterTabPanel {...missionCenterProps} />;
  }
  if (activeTab === "courses") {
    return <AdminCoursesTabPanel />;
  }
  return <AdminUsersTabPanel {...usersProps} />;
}

export default function AdminManagement() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "auth", "errors"]);
  const { notifyError, notifySuccess } = useStatusCenter();

  const activeTab = resolveTabFromPath(location.pathname);
  const [selectedUser, setSelectedUser] = useState<EntityCardData | null>(null);

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [cohortFilter, setCohortFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startYearMin, setStartYearMin] = useState<number | null>(null);
  const [startYearMax, setStartYearMax] = useState<number | null>(null);

  const [selectedSchool, setSelectedSchool] = useState<SchoolConfig | null>(
    null,
  );
  const [selectedSchoolForEdit, setSelectedSchoolForEdit] =
    useState<SchoolConfig | null>(null);
  const [selectedCohortForEdit, setSelectedCohortForEdit] =
    useState<CohortWithInstitution | null>(null);

  const selectedUserId = selectedUser?.id;
  useEffect(() => {
    if (selectedUserId) {
      const fresh = loaderData.users.find((s) => s.id === selectedUserId);
      if (fresh) {
        setSelectedUser(fresh);
      }
    }
  }, [loaderData.users, selectedUserId]);

  const selectedCohortEditId = selectedCohortForEdit?.id;
  useEffect(() => {
    if (selectedCohortEditId) {
      const fresh = loaderData.cohorts.find(
        (c) => c.id === selectedCohortEditId,
      );
      if (fresh) {
        setSelectedCohortForEdit(fresh);
      }
    }
  }, [loaderData.cohorts, selectedCohortEditId]);

  const selectedSchoolEditId = selectedSchoolForEdit?.id;
  useEffect(() => {
    if (selectedSchoolEditId) {
      const fresh = loaderData.schools.find(
        (s) => s.id === selectedSchoolEditId,
      );
      if (fresh) {
        setSelectedSchoolForEdit(fresh);
      }
    }
  }, [loaderData.schools, selectedSchoolEditId]);

  const handleLogout = () => {
    void logout();
  };

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newTabKey: AdminTabKey,
  ) => {
    navigate(`/admin/${newTabKey}`);
  };

  const handleUserClick = (user: EntityCardData) => {
    setSelectedUser(user);
  };

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
    const data = buildInstitutionSubmitData(payload);
    fetcher.submit(data, { method: "post" });
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
    const data = buildCohortSubmitData(institutionId, payload);
    fetcher.submit(data, { method: "post" });
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

  const handleCloseInspector = () => {
    setSelectedUser(null);
  };

  const handleAddCohort = (params: { studentId: string; cohortId: string }) => {
    fetcher.submit(
      {
        intent: "add-cohort",
        studentId: params.studentId,
        cohortId: params.cohortId,
      },
      { method: "post" },
    );
  };

  const handleRemoveCohort = (params: {
    studentId: string;
    cohortId: string;
  }) => {
    fetcher.submit(
      {
        intent: "remove-cohort",
        studentId: params.studentId,
        cohortId: params.cohortId,
      },
      { method: "post" },
    );
  };

  const handleUpdateStudentGithub = (studentId: string, githubId: string) => {
    const trimmed = githubId.trim();
    setSelectedUser((prev) => {
      if (!prev || prev.id !== studentId) return prev;
      return {
        ...prev,
        githubUsername: trimmed || undefined,
        avatarUrl: trimmed
          ? `https://avatars.githubusercontent.com/u/${trimmed}?v=4`
          : prev.avatarUrl,
      };
    });
    fetcher.submit(
      {
        intent: "update-user",
        studentId,
        githubId: trimmed,
      },
      { method: "post" },
    );
  };

  const handleStudentUpdated = (updatedUser: AuthUser) => {
    setSelectedUser((prev) =>
      prev && prev.id === updatedUser.id
        ? mergeUpdatedUser(prev, updatedUser)
        : prev,
    );
    revalidator.revalidate();
  };

  const handleDeleteUser = async (user: EntityCardData) => {
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

  const handleImpersonate = async (user: EntityCardData) => {
    const userName = `${user.firstName} ${user.familyName}`.trim();
    try {
      await loginAsAccount({
        id: user.id,
        name: userName,
        email: user.email,
        role: user.role ?? "student",
      });
      notifySuccess(
        t("auth:impersonationSuccess", {
          name: userName,
          defaultValue: `Impersonation active: Logged in as ${userName}.`,
        }),
      );
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (err: unknown) {
      notifyError(err, {
        title: t("errors:errorTitle", "System Diagnostic Alert"),
        message: t("errors:IMPERSONATION_FAILED", {
          defaultValue:
            "Failed to initiate impersonation session. Diagnostic recorded.",
        }),
        contextData: {
          studentId: user.id,
          role: user.role,
          name: userName,
        },
      });
    }
  };

  const handleCreateNewUser = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/onboarding";
    }
  };

  const filteredUsers = useMemo(() => {
    return loaderData.users.filter((user) =>
      matchesUserFilters(user, {
        role: roleFilter,
        school: schoolFilter,
        cohort: cohortFilter,
        query: searchQuery,
        startYearMin,
        startYearMax,
      }),
    );
  }, [
    loaderData.users,
    roleFilter,
    schoolFilter,
    cohortFilter,
    searchQuery,
    startYearMin,
    startYearMax,
  ]);

  const outletContext = useOutletContext<{ user?: AuthUser } | null>();
  const isNestedInShell = Boolean(outletContext);
  const hasInspectorOpen = Boolean(selectedUser);

  const workspaceContent = (
    <AdminMainWorkspace>
      <AdminTabsSection
        activeTab={activeTab}
        totalUsers={loaderData.totalUsers}
        openIssuesCount={loaderData.missionCenter?.openIssuesCount}
        onChange={handleTabChange}
      />
      <AdminTabContent
        activeTab={activeTab}
        usersProps={{
          searchQuery,
          onQueryChange: setSearchQuery,
          roleFilter,
          onRoleFilterChange: setRoleFilter,
          schoolFilter,
          onSchoolFilterChange: setSchoolFilter,
          schools: loaderData.schools,
          cohortFilter,
          onCohortFilterChange: setCohortFilter,
          cohorts: loaderData.cohorts,
          startYearMin,
          onStartYearMinChange: setStartYearMin,
          startYearMax,
          onStartYearMaxChange: setStartYearMax,
          filteredUsers,
          selectedUser,
          onUserClick: handleUserClick,
          onCreateNewUser: handleCreateNewUser,
          onImpersonate: handleImpersonate,
          onDeleteUser: handleDeleteUser,
          hasInspectorOpen,
          onCloseInspector: handleCloseInspector,
          onAddCohort: handleAddCohort,
          onRemoveCohort: handleRemoveCohort,
          onStudentUpdated: handleStudentUpdated,
          onUpdateGithub: handleUpdateStudentGithub,
          isSubmitting: fetcher.state !== "idle",
        }}
        cohortsProps={{
          schools: loaderData.schools,
          cohorts: loaderData.cohorts,
          schoolStudentCounts: loaderData.schoolStudentCounts,
          cohortStudentCounts: loaderData.cohortStudentCounts,
          selectedSchool,
          selectedSchoolForEdit,
          selectedCohortForEdit,
          onSchoolClick: handleSchoolClick,
          onCohortClick: handleCohortClick,
          onCreateNewSchool: handleCreateNewSchool,
          onCreateNewCohort: handleCreateNewCohort,
          onCloseSchoolEdit: () => setSelectedSchoolForEdit(null),
          onCloseCohortEdit: () => setSelectedCohortForEdit(null),
          onSaveInstitution: handleSaveInstitution,
          onSaveCohort: handleSaveCohort,
          isSubmitting: fetcher.state !== "idle",
        }}
        missionCenterProps={
          loaderData.missionCenter
            ? {
                missionCenter: loaderData.missionCenter,
                onRefresh: () => {
                  revalidator.revalidate();
                  notifySuccess(
                    t("common:admin.missionCenter.diagnosticsRefreshed", {
                      defaultValue: "Diagnostic telemetry refreshed",
                    }),
                  );
                },
                fetcher,
              }
            : undefined
        }
      />
    </AdminMainWorkspace>
  );

  if (isNestedInShell) {
    return workspaceContent;
  }

  return (
    <PageRoot>
      <Header
        mode="full"
        user={loaderData.user}
        onLogout={handleLogout}
        data-testid="admin-header"
      />
      {workspaceContent}
      <Footer />
    </PageRoot>
  );
}
