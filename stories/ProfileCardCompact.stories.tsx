import type { Meta, StoryObj } from "@storybook/react-vite";
import ProfileCardCompact from "~/components/molecules/ProfileCardCompact/ProfileCardCompact";

const meta: Meta<typeof ProfileCardCompact> = {
  title: "Molecules/ProfileCardCompact",
  component: ProfileCardCompact,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProfileCardCompact>;

export const DefaultStudent: Story = {
  args: {
    student: {
      id: "student-001",
      firstName: "Alexandre",
      familyName: "MOREAU",
      email: "alexandre.moreau@aptitek.io",
      role: "student",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      githubUsername: "amoreau",
      cohortName: "Cohort 2026",
      cohortStartYear: "2026",
      isProfileComplete: true,
    },
    school: {
      id: "aptitek",
      name: "Aptitek",
      logoUrl: "/aptitek-logo.svg",
    },
    cohort: {
      id: "cohort-2026",
      name: "Cohort 2026",
      startYear: 2026,
    },
  },
};

export const PendingOnboarding: Story = {
  args: {
    student: {
      id: "student-002",
      firstName: "Thomas",
      familyName: "DUBOIS",
      email: "thomas.dubois@aptitek.io",
      role: "student",
      githubUsername: "tdubois",
      cohortName: "Cohort 2026",
      cohortStartYear: "2026",
      isProfileComplete: false,
    },
  },
};

export const WithoutGithub: Story = {
  args: {
    student: {
      id: "student-003-uuid-longer-example",
      firstName: "Sophie",
      familyName: "LAURENT",
      email: "sophie.laurent@aptitek.io",
      role: "student",
      cohortName: "Cohort 2025",
      cohortStartYear: "2025",
      isProfileComplete: true,
    },
  },
};

export const InstructorRole: Story = {
  args: {
    student: {
      id: "inst-001",
      firstName: "Marc",
      familyName: "BERTRAND",
      email: "marc.bertrand@aptitek.io",
      role: "instructor",
      githubUsername: "mbertrand",
      cohortName: "Staff Faculty",
      cohortStartYear: "2024",
      isProfileComplete: true,
    },
  },
};
