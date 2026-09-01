import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useLoaderData,
  useFetcher,
  useRevalidator,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Chip from "@mui/material/Chip";
import SchoolIcon from "@mui/icons-material/School";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ClassIcon from "@mui/icons-material/Class";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Header from "~/components/organisms/Header/Header";
import Footer from "~/components/organisms/Footer/Footer";
import StudentGrid from "~/components/molecules/StudentGrid/StudentGrid";
import StudentInspector from "~/components/organisms/StudentInspector/StudentInspector";
import { authGuard } from "~/utils/session.server";
import {
  logout,
  loginAsAccount,
  resolveActiveUser,
  type AuthUser,
} from "~/utils/auth";
import {
  getAllUsersWithAffiliations,
  isUserProfileComplete,
} from "~/services/userService";
import { getAllInstitutions, getAllCohorts } from "~/services/cohortService";
import type { CompactStudentData } from "~/components/molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { SchoolConfig } from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import { useStatusCenter } from "~/utils/statusCenterContext";
import {
  mapDbUserToStudent,
  resolveUserGlobalRole,
  getDefaultStudents,
  getDefaultInstructors,
  getDefaultSchools,
  getDefaultCohorts,
  handleAddCohortAction,
  handleRemoveCohortAction,
  handleDeleteUserAction,
  type DbUserWithAffil,
} from "./admin.helpers";
import {
  PageRoot,
  AdminMainWorkspace,
  StyledTabsContainer,
  StyledTab,
  TabPanelContainer,
  GridColumn,
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
  const db = auth.db;

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

  const mappedStudents = dbUsers
    .filter((u) => {
      const role = resolveUserGlobalRole(u);
      return role === "student" && u.id !== auth.user?.id;
    })
    .map(mapDbUserToStudent);

  const mappedInstructors = dbUsers
    .filter((u) => {
      const role = resolveUserGlobalRole(u);
      return role === "instructor";
    })
    .map(mapDbUserToStudent);

  const students =
    mappedStudents.length > 0 ? mappedStudents : getDefaultStudents();

  const instructors =
    mappedInstructors.length > 0 ? mappedInstructors : getDefaultInstructors();

  const schools: SchoolConfig[] =
    dbInstitutions.length > 0
      ? dbInstitutions.map((inst) => ({
          id: inst.id,
          name: inst.name,
          slug: inst.slug,
          logoUrl: inst.logoUrl,
        }))
      : getDefaultSchools();

  const cohorts: CohortWithInstitution[] =
    dbCohorts.length > 0
      ? dbCohorts.map((c) => ({
          id: c.id,
          name: c.name,
          institutionId: c.institutionId,
          description: c.description ?? undefined,
          startDate: c.startDate ? c.startDate.toISOString() : undefined,
          endDate: c.endDate ? c.endDate.toISOString() : undefined,
        }))
      : getDefaultCohorts();

  return {
    user: activeUser,
    students,
    totalStudents: students.length,
    instructors,
    totalInstructors: instructors.length,
    schools,
    cohorts,
  };
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

  if (intent === "add-cohort") {
    return handleAddCohortAction(formData, auth.db, actorUserId);
  }

  if (intent === "remove-cohort") {
    return handleRemoveCohortAction(formData, auth.db, actorUserId);
  }

  if (intent === "delete-user") {
    return handleDeleteUserAction(formData, auth.db, actorUserId, auth.session);
  }

  return { success: false, error: "Unknown action" };
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

interface AdminTabsSectionProps {
  activeTab: number;
  totalStudents: number;
  totalInstructors: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

function AdminTabsSection({
  activeTab,
  totalStudents,
  totalInstructors,
  onChange,
}: AdminTabsSectionProps) {
  const { t } = useTranslation(["common", "auth"]);

  return (
    <StyledTabsContainer>
      <Tabs
        value={activeTab}
        onChange={onChange}
        aria-label={t(
          "common:admin.tabs.aria",
          "Admin management navigation tabs",
        )}
        data-testid="admin-tabs"
      >
        <StyledTab
          icon={<SchoolIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>{t("common:admin.tabs.students", "Students")}</span>
              <Chip
                label={totalStudents}
                size="small"
                color="primary"
                sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
                data-testid="tab-students-count"
              />
            </Box>
          }
          id="admin-tab-0"
          aria-controls="admin-tabpanel-0"
          data-testid="tab-students"
        />
        <StyledTab
          icon={<SupervisorAccountIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>{t("common:admin.tabs.instructors", "Instructors")}</span>
              <Chip
                label={totalInstructors}
                size="small"
                color="primary"
                sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
                data-testid="tab-instructors-count"
              />
            </Box>
          }
          id="admin-tab-1"
          aria-controls="admin-tabpanel-1"
          data-testid="tab-instructors"
        />
        <StyledTab
          icon={<ClassIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={t("common:admin.tabs.cohorts", "Cohorts")}
          id="admin-tab-2"
          aria-controls="admin-tabpanel-2"
          disabled
          data-testid="tab-cohorts"
        />
        <StyledTab
          icon={<MenuBookIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={t("common:admin.tabs.courses", "Courses")}
          id="admin-tab-3"
          aria-controls="admin-tabpanel-3"
          disabled
          data-testid="tab-courses"
        />
      </Tabs>
    </StyledTabsContainer>
  );
}

export default function AdminManagement() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const { t } = useTranslation(["common", "auth", "errors"]);
  const { notifyError, notifySuccess } = useStatusCenter();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedStudent, setSelectedStudent] =
    useState<CompactStudentData | null>(null);

  const selectedStudentId = selectedStudent?.id;
  useEffect(() => {
    if (selectedStudentId) {
      const fresh =
        loaderData.students.find((s) => s.id === selectedStudentId) ||
        loaderData.instructors?.find((s) => s.id === selectedStudentId);
      if (fresh) {
        setSelectedStudent(fresh);
      }
    }
  }, [loaderData.students, loaderData.instructors, selectedStudentId]);

  const handleLogout = () => {
    void logout();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStudentClick = (student: CompactStudentData) => {
    setSelectedStudent(student);
  };

  const handleCloseInspector = () => {
    setSelectedStudent(null);
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
    setSelectedStudent((prev) => {
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

  const handleDeleteUser = async (student: CompactStudentData) => {
    const studentName = `${student.firstName} ${student.familyName}`.trim();
    try {
      fetcher.submit(
        { intent: "delete-user", studentId: student.id },
        { method: "post" },
      );
      if (selectedStudent?.id === student.id) {
        setSelectedStudent(null);
      }
      notifySuccess(
        t("common:userDeleted", {
          name: studentName,
          defaultValue: `${studentName} has been deleted successfully.`,
        }),
      );
    } catch (err: unknown) {
      notifyError(err, {
        title: t("errors:errorTitle", "System Diagnostic Alert"),
        message: t("common:userDeleteFailed", {
          defaultValue: "Failed to delete user.",
        }),
        contextData: {
          studentId: student.id,
          role: student.role,
          name: studentName,
        },
      });
    }
  };

  const handleImpersonate = async (student: CompactStudentData) => {
    const studentName = `${student.firstName} ${student.familyName}`.trim();
    try {
      await loginAsAccount({
        id: student.id,
        name: studentName,
        email: student.email,
        role: student.role ?? "student",
      });
      notifySuccess(
        t("auth:impersonationSuccess", {
          name: studentName,
          defaultValue: `Impersonation active: Logged in as ${studentName}.`,
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
          studentId: student.id,
          role: student.role,
          name: studentName,
        },
      });
    }
  };

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
          totalStudents={loaderData.totalStudents}
          totalInstructors={loaderData.totalInstructors}
          onChange={handleTabChange}
        />

        {activeTab === 0 && (
          <TabPanelContainer
            role="tabpanel"
            id="admin-tabpanel-0"
            aria-labelledby="admin-tab-0"
            data-testid="admin-tabpanel-students"
          >
            <GridColumn>
              <StudentGrid
                students={loaderData.students}
                onStudentClick={handleStudentClick}
                onImpersonate={handleImpersonate}
                onDelete={handleDeleteUser}
                title={t("common:studentGrid.title", "Registered Students")}
                testId="admin-student-grid"
              />
            </GridColumn>

            <StudentInspector
              student={selectedStudent}
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
          </TabPanelContainer>
        )}

        {activeTab === 1 && (
          <TabPanelContainer
            role="tabpanel"
            id="admin-tabpanel-1"
            aria-labelledby="admin-tab-1"
            data-testid="admin-tabpanel-instructors"
          >
            <GridColumn>
              <StudentGrid
                students={loaderData.instructors}
                onStudentClick={handleStudentClick}
                onImpersonate={handleImpersonate}
                onDelete={handleDeleteUser}
                title={t(
                  "common:instructorGrid.title",
                  "Registered Instructors",
                )}
                emptyMessage={t(
                  "common:instructorGrid.emptyMessage",
                  "No instructors found in directory",
                )}
                searchPlaceholder={t(
                  "common:instructorGrid.searchPlaceholder",
                  "Search by name, email, github...",
                )}
                searchAriaLabel={t(
                  "common:instructorGrid.searchAria",
                  "Search instructors",
                )}
                icon={
                  <SupervisorAccountIcon
                    sx={{ fontSize: 20, color: "primary.main" }}
                  />
                }
                userType="instructor"
                testId="admin-instructor-grid"
              />
            </GridColumn>

            <StudentInspector
              student={selectedStudent}
              schools={loaderData.schools}
              cohorts={loaderData.cohorts}
              onClose={handleCloseInspector}
              onAddCohort={handleAddCohort}
              onRemoveCohort={handleRemoveCohort}
              onStudentUpdated={handleStudentUpdated}
              onImpersonate={handleImpersonate}
              onDelete={handleDeleteUser}
              isSubmitting={fetcher.state !== "idle"}
              data-testid="admin-instructor-inspector"
            />
          </TabPanelContainer>
        )}
      </AdminMainWorkspace>

      <Footer />
    </PageRoot>
  );
}
