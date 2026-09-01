import type { Meta, StoryObj } from "@storybook/react-vite";
import StudentInspector from "../app/components/organisms/StudentInspector/StudentInspector";
import type { EntityCardData } from "../app/components/molecules/EntityCard/EntityCard.types";
import type { SchoolConfig } from "../app/components/organisms/OnboardingCard/OnboardingCard.types";
import type { CohortWithInstitution } from "../app/components/organisms/StudentInspector/StudentInspector.types";

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

const sampleStudent: EntityCardData = {
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
    {
      id: "cohort-2",
      name: "Cohort 2025 Alumni",
      startDate: "2025-09-01",
      startYear: "2025",
    },
  ],
  institutionId: "school-1",
  institutionName: "Aptitek Institute",
};

const meta: Meta<typeof StudentInspector> = {
  title: "Organisms/StudentInspector",
  component: StudentInspector,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof StudentInspector>;

export const Default: Story = {
  args: {
    student: sampleStudent,
    schools: mockSchools,
    cohorts: mockCohorts,
    onClose: () => {},
    onAddCohort: () => {},
    onRemoveCohort: () => {},
    onStudentUpdated: () => {},
    onImpersonate: () => {},
    onDelete: () => {},
  },
};

export const UnassignedStudent: Story = {
  args: {
    student: {
      ...sampleStudent,
      cohortId: null,
      cohortName: undefined,
      cohorts: [],
    },
    schools: mockSchools,
    cohorts: mockCohorts,
    onClose: () => {},
    onAddCohort: () => {},
    onRemoveCohort: () => {},
    onStudentUpdated: () => {},
    onDelete: () => {},
  },
};
