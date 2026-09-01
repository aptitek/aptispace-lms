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
import {
  getAllInstitutions,
  getAllCohorts,
  addStudentToCohort,
  removeStudentFromCohort,
} from "~/services/cohortService";
import type { Database } from "~/db/index";
import type { CompactStudentData } from "~/components/molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { SchoolConfig } from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import {
  mapDbUserToStudent,
  getDefaultStudents,
  getDefaultSchools,
  getDefaultCohorts,
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
      const primaryAffil = u.affiliations?.[0];
      return (
        primaryAffil?.role === "student" ||
        (!primaryAffil?.role && u.id !== auth.user?.id)
      );
    })
    .map(mapDbUserToStudent);

  const students =
    mappedStudents.length > 0 ? mappedStudents : getDefaultStudents();

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
    schools,
    cohorts,
  };
}

async function handleAddCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const studentId = String(formData.get("studentId") || "");
  const cohortId = String(formData.get("cohortId") || "");

  if (!studentId || !cohortId) {
    return { success: false, error: "Missing studentId or cohortId" };
  }

  try {
    await addStudentToCohort(db, {
      userId: studentId,
      cohortId,
      actorUserId,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to add student to cohort" };
  }
}

async function handleRemoveCohortAction(
  formData: FormData,
  db: Database,
  actorUserId: string,
) {
  const studentId = String(formData.get("studentId") || "");
  const cohortId = String(formData.get("cohortId") || "");

  if (!studentId || !cohortId) {
    return { success: false, error: "Missing studentId or cohortId" };
  }

  try {
    await removeStudentFromCohort(db, {
      userId: studentId,
      cohortId,
      actorUserId,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to remove student from cohort" };
  }
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
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

function AdminTabsSection({
  activeTab,
  totalStudents,
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
          label={t("common:admin.tabs.instructors", "Instructors")}
          id="admin-tab-1"
          aria-controls="admin-tabpanel-1"
          disabled
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
  const { t } = useTranslation(["common", "auth"]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedStudent, setSelectedStudent] =
    useState<CompactStudentData | null>(null);

  const selectedStudentId = selectedStudent?.id;
  useEffect(() => {
    if (selectedStudentId) {
      const fresh = loaderData.students.find((s) => s.id === selectedStudentId);
      if (fresh) {
        setSelectedStudent(fresh);
      }
    }
  }, [loaderData.students, selectedStudentId]);

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

  const handleImpersonate = async (student: CompactStudentData) => {
    try {
      await loginAsAccount({
        id: student.id,
        name: `${student.firstName} ${student.familyName}`.trim(),
        email: student.email,
        role: student.role ?? "student",
      });
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch {
      // Handled cleanly
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
              isSubmitting={fetcher.state !== "idle"}
              data-testid="admin-student-inspector"
            />
          </TabPanelContainer>
        )}
      </AdminMainWorkspace>

      <Footer />
    </PageRoot>
  );
}
