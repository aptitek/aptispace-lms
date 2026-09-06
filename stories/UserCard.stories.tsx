import type { Meta, StoryObj } from "@storybook/react-vite";
import EntityCard from "~/components/molecules/EntityCard/EntityCard";

const meta: Meta<typeof EntityCard> = {
  title: "Molecules/EntityCard",
  component: EntityCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof EntityCard>;

export const DefaultStudent: Story = {
  args: {
    entity: {
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
    entity: {
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
    entity: {
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
    entity: {
      id: "inst-001",
      firstName: "Marc",
      familyName: "BERTRAND",
      email: "marc.bertrand@aptitek.io",
      role: "instructor",
      githubUsername: "mbertrand",
      isProfileComplete: true,
    },
  },
};

export const AdminRole: Story = {
  args: {
    entity: {
      id: "adm-001",
      firstName: "Ada",
      familyName: "LOVELACE",
      email: "ada.lovelace@aptitek.io",
      role: "admin",
      githubUsername: "adalovelace",
      isProfileComplete: true,
    },
  },
};
