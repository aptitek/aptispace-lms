import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useLoaderData,
  useFetcher,
  useRevalidator,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import Header from "~/components/organisms/Header/Header";
import Footer from "~/components/organisms/Footer/Footer";
import UserGrid from "~/components/molecules/UserGrid/UserGrid";
import StudentInspector from "~/components/organisms/StudentInspector/StudentInspector";
import FilterBar from "~/components/molecules/FilterBar/FilterBar";
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
import { matchesUserFilters } from "./admin.helpers";
import AdminTabsSection from "./admin.tabs";
import AdminCohortsTabPanel from "./admin.cohorts-tab";
import {
  PageRoot,
  AdminMainWorkspace,
  TabPanelContainer,
  MainColumn,
  SideColumn,
} from "./admin.styles";
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
  return loadAdminDashboardData(auth.db, activeUser);
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

export default function AdminManagement() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const { t } = useTranslation(["common", "auth", "errors"]);
  const { notifyError, notifySuccess } = useStatusCenter();
  const [activeTab, setActiveTab] = useState<number>(0);
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
    const intent = payload.id ? "update-institution" : "create-institution";
    const data: Record<string, string> = {
      intent,
      name: payload.name,
      slug: payload.slug,
    };
    if (payload.id) data.id = payload.id;
    if (payload.type) data.type = payload.type;
    if (payload.logoUrl) data.logoUrl = payload.logoUrl;
    if (payload.emailDomain !== undefined)
      data.emailDomain = payload.emailDomain;
    if (payload.usernamePattern !== undefined)
      data.usernamePattern = payload.usernamePattern;
    fetcher.submit(data, { method: "post" });
    if (!payload.id) {
      setSelectedSchoolForEdit(null);
    }
  };

  const handleSaveCohort = (payload: {
    id?: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    if (!selectedSchool?.id) {
      notifyError(new Error("No institution selected"));
      return;
    }
    const intent = payload.id ? "update-cohort" : "create-cohort";
    const data: Record<string, string> = {
      intent,
      institutionId: selectedSchool.id,
      name: payload.name,
    };
    if (payload.id) data.id = payload.id;
    if (payload.description) data.description = payload.description;
    if (payload.startDate) data.startDate = payload.startDate;
    if (payload.endDate) data.endDate = payload.endDate;
    fetcher.submit(data, { method: "post" });
    if (!payload.id) {
      setSelectedCohortForEdit(null);
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

  const handleStudentUpdated = (updatedUser: AuthUser) => {
    setSelectedUser((prev) => {
      if (!prev || prev.id !== updatedUser.id) return prev;
      const parts = (updatedUser.name || "").trim().split(/\s+/);
      const firstName =
        parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] || "";
      const familyName =
        parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
      return {
        ...prev,
        firstName,
        familyName,
        displayName: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        role: updatedUser.role,
        githubUsername: updatedUser.githubUsername,
        isProfileComplete: updatedUser.isProfileComplete,
      };
    });
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

  const hasInspectorOpen = Boolean(selectedUser);

  return (
    <PageRoot>
      <Header
        mode="full"
        user={loaderData.user}
        onLogout={handleLogout}
        data-testid="admin-header"
      />

      <AdminMainWorkspace>
        <AdminTabsSection
          activeTab={activeTab}
          totalUsers={loaderData.totalUsers}
          onChange={handleTabChange}
        />

        {activeTab === 0 && (
          <TabPanelContainer
            hasSidePanel={hasInspectorOpen}
            role="tabpanel"
            id="admin-tabpanel-0"
            aria-labelledby="admin-tab-0"
            data-testid="admin-tabpanel-users"
          >
            <MainColumn>
              <FilterBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                schoolFilter={schoolFilter}
                onSchoolFilterChange={setSchoolFilter}
                schools={loaderData.schools}
                cohortFilter={cohortFilter}
                onCohortFilterChange={setCohortFilter}
                cohorts={loaderData.cohorts}
                startYearMin={startYearMin}
                onStartYearMinChange={setStartYearMin}
                startYearMax={startYearMax}
                onStartYearMaxChange={setStartYearMax}
              />
              <UserGrid
                students={filteredUsers}
                selectedStudentId={selectedUser?.id}
                onStudentClick={handleUserClick}
                onAddUser={handleCreateNewUser}
                onImpersonate={handleImpersonate}
                onDelete={handleDeleteUser}
                testId="admin-user-grid"
                showHeader={false}
              />
            </MainColumn>

            {hasInspectorOpen && (
              <SideColumn>
                <StudentInspector
                  student={selectedUser}
                  schools={loaderData.schools}
                  cohorts={loaderData.cohorts}
                  onClose={handleCloseInspector}
                  onAddCohort={handleAddCohort}
                  onRemoveCohort={handleRemoveCohort}
                  onStudentUpdated={handleStudentUpdated}
                  onImpersonate={handleImpersonate}
                  onDelete={handleDeleteUser}
                  isSubmitting={fetcher.state !== "idle"}
                  data-testid="admin-student-inspector"
                />
              </SideColumn>
            )}
          </TabPanelContainer>
        )}

        {activeTab === 1 && (
          <AdminCohortsTabPanel
            schools={loaderData.schools}
            cohorts={loaderData.cohorts}
            schoolStudentCounts={loaderData.schoolStudentCounts}
            cohortStudentCounts={loaderData.cohortStudentCounts}
            selectedSchool={selectedSchool}
            selectedSchoolForEdit={selectedSchoolForEdit}
            selectedCohortForEdit={selectedCohortForEdit}
            onSchoolClick={handleSchoolClick}
            onCohortClick={handleCohortClick}
            onCreateNewSchool={handleCreateNewSchool}
            onCreateNewCohort={handleCreateNewCohort}
            onCloseSchoolEdit={() => setSelectedSchoolForEdit(null)}
            onCloseCohortEdit={() => setSelectedCohortForEdit(null)}
            onSaveInstitution={handleSaveInstitution}
            onSaveCohort={handleSaveCohort}
            isSubmitting={fetcher.state !== "idle"}
          />
        )}
      </AdminMainWorkspace>

      <Footer />
    </PageRoot>
  );
}
