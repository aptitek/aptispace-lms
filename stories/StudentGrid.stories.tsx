import type { Meta, StoryObj } from "@storybook/react-vite";
import StudentGrid from "~/components/molecules/StudentGrid/StudentGrid";

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

export const Default: Story = {
  args: {
    students: sampleStudents,
    title: "Enrolled Students",
  },
};

export const Empty: Story = {
  args: {
    students: [],
    title: "Enrolled Students",
  },
};
