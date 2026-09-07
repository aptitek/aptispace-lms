import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import UserInspector from "~/components/organisms/UserInspector/UserInspector";
import type { UserCardData } from "~/components/molecules/UserCard/UserCard.types";
import type { SchoolConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/UserInspector/UserInspector.types";

const mockSchools: SchoolConfig[] = [
  {
    id: "school-1",
    name: "Aptitek Institute",
    slug: "aptitek",
    logoUrl: "/aptitek-logo.svg",
    emailDomain: "aptitek.io",
  },
  {
    id: "school-2",
    name: "École 42 Paris",
    slug: "42paris",
    logoUrl: "/aptitek-logo.svg",
    emailDomain: "42.fr",
  },
];

const mockCohorts: CohortWithInstitution[] = [
  {
    id: "cohort-1",
    name: "Cohort 2026 Alpha",
    institutionId: "school-1",
    startDate: "2026-09-01",
    endDate: "2027-06-30",
  },
  {
    id: "cohort-2",
    name: "Cohort 2025 Alumni",
    institutionId: "school-1",
    startDate: "2025-09-01",
    endDate: "2026-06-30",
  },
  {
    id: "cohort-3",
    name: "42 Common Core 2026",
    institutionId: "school-2",
    startDate: "2026-10-01",
    endDate: "2027-09-30",
  },
];

const sampleStudent: UserCardData = {
  id: "student-1",
  firstName: "Elena",
  familyName: "ROSTOVA",
  displayName: "Elena ROSTOVA",
  email: "elena.rostova@aptitek.io",
  role: "student",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  githubUsername: "erostova",
  cohortId: "cohort-1",
  cohortName: "Cohort 2026 Alpha",
  cohorts: [
    {
      id: "cohort-1",
      name: "Cohort 2026 Alpha",
      startDate: "2026-09-01",
      startYear: "2026",
    },
  ],
  institutionId: "school-1",
  institutionName: "Aptitek Institute",
};

const sampleInstructor: UserCardData = {
  id: "inst-1",
  firstName: "Sarah",
  familyName: "CONNOR",
  displayName: "Sarah CONNOR",
  email: "sarah.connor@aptitek.io",
  role: "instructor",
  avatarUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  githubUsername: "sconnor",
  institutionId: "school-1",
  institutionName: "Aptitek Institute",
};

const sampleAdmin: UserCardData = {
  id: "adm-1",
  firstName: "Eleanor",
  familyName: "VANCE",
  displayName: "Eleanor VANCE",
  email: "eleanor.vance@aptitek.io",
  role: "admin",
  githubUsername: "evance",
};

const meta = {
  title: "Organisms/UserInspector",
  component: UserInspector,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 440, maxWidth: "100%", p: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof UserInspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StudentWithCohorts: Story = {
  args: {
    user: sampleStudent,
    schools: mockSchools,
    cohorts: mockCohorts,
    onClose: () => alert("Close"),
    onAddCohort: (payload) => alert(`Add cohort: ${JSON.stringify(payload)}`),
    onRemoveCohort: (payload) =>
      alert(`Remove cohort: ${JSON.stringify(payload)}`),
    onUpdateGithub: (userId, gh) => alert(`Updated GitHub: ${gh}`),
    onImpersonate: (u) => alert(`Impersonate: ${u.firstName}`),
    onDelete: (u) => alert(`Delete: ${u.firstName}`),
  },
};

export const InstructorInspector: Story = {
  args: {
    user: sampleInstructor,
    schools: mockSchools,
    cohorts: mockCohorts,
    onClose: () => alert("Close"),
    onImpersonate: (u) => alert(`Impersonate: ${u.firstName}`),
  },
};

export const AdminInspector: Story = {
  args: {
    user: sampleAdmin,
    schools: mockSchools,
    cohorts: mockCohorts,
    onClose: () => alert("Close"),
  },
};

export const SubmittingState: Story = {
  args: {
    user: sampleStudent,
    schools: mockSchools,
    cohorts: mockCohorts,
    isSubmitting: true,
    onClose: () => {},
  },
};
