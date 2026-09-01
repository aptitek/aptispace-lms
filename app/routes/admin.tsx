import { useState } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
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
import ProfileCardModal from "~/components/organisms/ProfileCardModal/ProfileCardModal";
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
import type { CompactStudentData } from "~/components/molecules/ProfileCardCompact/ProfileCardCompact.types";
import {
  mapDbUserToStudent,
  getDefaultStudents,
  resolveModalUser,
  type DbUserWithAffil,
} from "./admin.helpers";
import {
  PageRoot,
  AdminMainWorkspace,
  StyledTabsContainer,
  StyledTab,
  TabPanelContainer,
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
  if (db) {
    try {
      dbUsers = await getAllUsersWithAffiliations(db);
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

  return {
    user: activeUser,
    students,
    totalStudents: students.length,
  };
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
  return (
    <StyledTabsContainer>
      <Tabs
        value={activeTab}
        onChange={onChange}
        aria-label="Admin management navigation tabs"
        data-testid="admin-tabs"
      >
        <StyledTab
          icon={<SchoolIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>Students</span>
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
          label="Instructors"
          id="admin-tab-1"
          aria-controls="admin-tabpanel-1"
          disabled
          data-testid="tab-instructors"
        />
        <StyledTab
          icon={<ClassIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label="Cohorts"
          id="admin-tab-2"
          aria-controls="admin-tabpanel-2"
          disabled
          data-testid="tab-cohorts"
        />
        <StyledTab
          icon={<MenuBookIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label="Courses"
          id="admin-tab-3"
          aria-controls="admin-tabpanel-3"
          disabled
          data-testid="tab-courses"
        />
      </Tabs>
    </StyledTabsContainer>
  );
}

interface StudentModalProps {
  isOpen: boolean;
  student: CompactStudentData | null;
  user: AuthUser | null;
  onClose: () => void;
}

function StudentModalWrapper({
  isOpen,
  student,
  user,
  onClose,
}: StudentModalProps) {
  if (!user) return null;

  return (
    <ProfileCardModal
      isOpen={isOpen}
      onClose={onClose}
      user={user}
      school={{
        id: student?.institutionId ?? "school-aptitek",
        name: student?.institutionName ?? "Aptitek",
        logoUrl: "/aptitek-logo.svg",
        emailDomain: "aptitek.io",
      }}
      cohort={{
        id: student?.cohortId ?? "cohort-2026",
        name: student?.cohortName ?? "Cohort 2026",
      }}
    />
  );
}

export default function AdminManagement() {
  const loaderData = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedStudent, setSelectedStudent] =
    useState<CompactStudentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleLogout = () => {
    void logout();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStudentClick = (student: CompactStudentData) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const modalUser = resolveModalUser(selectedStudent);

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
            <StudentGrid
              students={loaderData.students}
              onStudentClick={handleStudentClick}
              onImpersonate={handleImpersonate}
              title="Registered Students"
              testId="admin-student-grid"
            />
          </TabPanelContainer>
        )}
      </AdminMainWorkspace>

      <StudentModalWrapper
        isOpen={isModalOpen}
        student={selectedStudent}
        user={modalUser}
        onClose={handleCloseModal}
      />

      <Footer />
    </PageRoot>
  );
}
