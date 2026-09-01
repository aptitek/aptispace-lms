import type { Meta, StoryObj } from "@storybook/react-vite";
import StudentGrid from "../app/components/molecules/StudentGrid/StudentGrid";

const meta: Meta<typeof StudentGrid> = {
  title: "Molecules/StudentGrid",
  component: StudentGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StudentGrid>;

const sampleStudents = [
  {
    id: "std-001",
    firstName: "Alexandre",
    familyName: "MOREAU",
    email: "alexandre.moreau@aptitek.io",
    role: "student" as const,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    githubUsername: "amoreau",
    cohortName: "Cohort 2026",
    isProfileComplete: true,
  },
  {
    id: "std-002",
    firstName: "Thomas",
    familyName: "DUBOIS",
    email: "thomas.dubois@aptitek.io",
    role: "student" as const,
    githubUsername: "tdubois",
    cohortName: "Cohort 2026",
    isProfileComplete: false,
  },
  {
    id: "std-003",
    firstName: "Sophie",
    familyName: "LAURENT",
    email: "sophie.laurent@aptitek.io",
    role: "student" as const,
    cohortName: "Cohort 2026",
    isProfileComplete: true,
  },
  {
    id: "std-004",
    firstName: "Maxime",
    familyName: "LEROY",
    email: "maxime.leroy@aptitek.io",
    role: "student" as const,
    githubUsername: "mleroy",
    cohortName: "Cohort 2025",
    isProfileComplete: true,
  },
];

const sampleInstructors = [
  {
    id: "inst-001",
    firstName: "Sarah",
    familyName: "CONNOR",
    displayName: "Sarah CONNOR",
    email: "sarah.connor@aptitek.io",
    role: "instructor" as const,
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    githubUsername: "sconnor",
    cohortName: "Cohort 2026",
    isProfileComplete: true,
  },
  {
    id: "inst-002",
    firstName: "Marcus",
    familyName: "AURELIUS",
    displayName: "Marcus AURELIUS",
    email: "marcus.aurelius@aptitek.io",
    role: "instructor" as const,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    githubUsername: "maurelius",
    cohortName: "42 Common Core 2026",
    isProfileComplete: true,
  },
];

export const Default: Story = {
  args: {
    students: sampleStudents,
    title: "Enrolled Students",
  },
};

export const LoadingSkeleton: Story = {
  args: {
    students: [],
    isLoading: true,
    skeletonCount: 6,
    title: "Enrolled Students",
  },
};

export const EmptyWithStaticPlaceholders: Story = {
  args: {
    students: [],
    title: "Enrolled Students",
    emptyPlaceholderCount: 3,
  },
};

export const InstructorDirectory: Story = {
  args: {
    students: sampleInstructors,
    title: "Registered Instructors",
    userType: "instructor",
  },
};

export const LazyLoading: Story = {
  args: {
    students: sampleStudents,
    title: "Lazy Loading Students",
    lazy: true,
    pageSize: 2,
  },
};
