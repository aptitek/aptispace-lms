import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useLoaderData,
  useFetcher,
  useRevalidator,
  useLocation,
  useNavigate,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { AdminLayout } from "~/components/templates/AdminLayout";
import { authGuard } from "~/utils/session.server";
import {
  logout,
  loginAsAccount,
  resolveActiveUser,
  type AuthUser,
} from "~/utils/auth";
import { isUserProfileComplete } from "~/services/userService";
import { useStatusCenter } from "~/utils/statusCenterContext";
import { buildGithubAvatarUrl } from "~/utils/avatar";
import type { UserCardData } from "~/components/molecules/UserCard/UserCard.types";
import type { SchoolConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import { loadAdminDashboardData } from "./admin.loader";
import { dispatchAdminAction } from "./admin.actions";
import { matchesUserFilters, mergeUpdatedUser } from "./admin.helpers";
import AdminTabsSection, { type AdminTabKey } from "./admin.tabs";
import { AdminTabContent } from "./admin.tab-content";
import { useAdminDeleteHandlers } from "./admin.delete-handlers";
import { useAdminCohortEditorHandlers } from "./admin.cohort-editor-handlers";
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

interface UserPatchDetail {
  id: string;
  avatarUrl?: string;
  githubUsername?: string;
}

function patchUserCardData(
  user: UserCardData,
  detail: UserPatchDetail,
): UserCardData {
  if (user.id !== detail.id) return user;
  return {
    ...user,
    ...(detail.avatarUrl !== undefined && { avatarUrl: detail.avatarUrl }),
    ...(detail.githubUsername !== undefined && {
      githubUsername: detail.githubUsername,
    }),
  };
}

function patchUserList(
  userList: UserCardData[],
  detail: UserPatchDetail,
): UserCardData[] {
  return userList.map((u) => patchUserCardData(u, detail));
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
  const [selectedUser, setSelectedUser] = useState<UserCardData | null>(null);
  const [users, setUsers] = useState<UserCardData[]>(loaderData.users);

  useEffect(() => {
    setUsers(loaderData.users);
  }, [loaderData.users]);

  useEffect(() => {
    const handleGlobalUserUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<UserPatchDetail>;
      const detail = customEvent.detail;
      if (!detail?.id) return;

      setUsers((prev) => patchUserList(prev, detail));
      setSelectedUser((prev) =>
        prev ? patchUserCardData(prev, detail) : null,
      );
    };

    if (typeof window !== "undefined") {
      window.addEventListener("app:user-updated", handleGlobalUserUpdated);
      return () => {
        window.removeEventListener("app:user-updated", handleGlobalUserUpdated);
      };
    }
  }, []);

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
      const fresh = users.find((s) => s.id === selectedUserId);
      if (fresh) {
        setSelectedUser(fresh);
      }
    }
  }, [users, selectedUserId]);

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

  const handleUserClick = (user: UserCardData) => {
    setSelectedUser(user);
  };

  const {
    handleSchoolClick,
    handleCreateNewSchool,
    handleCohortClick,
    handleCreateNewCohort,
    handleSaveInstitution,
    handleSaveCohort,
  } = useAdminCohortEditorHandlers({
    fetcher,
    notifyError,
    selectedSchool,
    setSelectedSchool,
    selectedSchoolForEdit,
    setSelectedSchoolForEdit,
    selectedCohortForEdit,
    setSelectedCohortForEdit,
  });

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
    const newAvatarUrl = trimmed ? buildGithubAvatarUrl(trimmed) : undefined;
    const patchDetail: UserPatchDetail = {
      id: studentId,
      githubUsername: trimmed || undefined,
      avatarUrl: newAvatarUrl,
    };

    setSelectedUser((prev) =>
      prev ? patchUserCardData(prev, patchDetail) : null,
    );
    setUsers((prev) => patchUserList(prev, patchDetail));

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app:user-updated", { detail: patchDetail }),
      );
    }

    fetcher.submit(
      { intent: "update-user", studentId, githubId: trimmed },
      { method: "post" },
    );
  };

  const handleUpdateStudentAvatar = (studentId: string, avatarUrl: string) => {
    const patchDetail: UserPatchDetail = {
      id: studentId,
      avatarUrl,
    };

    setSelectedUser((prev) =>
      prev ? patchUserCardData(prev, patchDetail) : null,
    );
    setUsers((prev) => patchUserList(prev, patchDetail));

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app:user-updated", { detail: patchDetail }),
      );
    }

    fetcher.submit(
      { intent: "update-user", studentId, avatarUrl },
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

  const { handleDeleteUser, handleDeleteInstitution, handleDeleteCohort } =
    useAdminDeleteHandlers({
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
    });

  const handleImpersonate = async (user: UserCardData) => {
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
    return users.filter((user) =>
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
    users,
    roleFilter,
    schoolFilter,
    cohortFilter,
    searchQuery,
    startYearMin,
    startYearMax,
  ]);

  const hasInspectorOpen = Boolean(selectedUser);

  return (
    <AdminLayout
      user={loaderData.user}
      onLogout={handleLogout}
      tabs={
        <AdminTabsSection
          activeTab={activeTab}
          totalUsers={loaderData.totalUsers}
          openIssuesCount={loaderData.missionCenter?.openIssuesCount}
          onChange={handleTabChange}
        />
      }
    >
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
          onUpdateAvatar: handleUpdateStudentAvatar,
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
          onDeleteInstitution: handleDeleteInstitution,
          onDeleteCohort: handleDeleteCohort,
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
    </AdminLayout>
  );
}
