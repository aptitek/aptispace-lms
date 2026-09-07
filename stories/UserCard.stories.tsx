import type { Meta, StoryObj } from "@storybook/react-vite";
import UserCard from "~/components/molecules/UserCard/UserCard";

const meta: Meta<typeof UserCard> = {
  title: "Molecules/UserCard",
  component: UserCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof UserCard>;

export const DefaultStudent: Story = {
  args: {
    user: {
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
    user: {
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
    user: {
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
    user: {
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
    user: {
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

export const EditableGithub: Story = {
  args: {
    user: {
      id: "student-edit-gh",
      firstName: "Elena",
      familyName: "ROSTOVA",
      email: "elena.rostova@aptitek.io",
      role: "student",
      githubUsername: "erostova",
      cohortName: "Cohort 2026",
      isProfileComplete: true,
    },
    editableGithub: true,
    onUpdateGithub: (userId, newHandle) => {
      alert(`Updated user ${userId} GitHub handle to: ${newHandle}`);
    },
  },
};

export const WithActionButtons: Story = {
  args: {
    user: {
      id: "student-actions",
      firstName: "Lucas",
      familyName: "BERNARD",
      email: "lucas.bernard@aptitek.io",
      role: "student",
      cohortName: "Cohort 2026",
      isProfileComplete: true,
    },
    showImpersonate: true,
    onImpersonate: (u) => alert(`Impersonating: ${u.firstName}`),
    showDelete: true,
    onDelete: (u) => alert(`Delete requested: ${u.firstName}`),
  },
};

export const OutlinedVariant: Story = {
  args: {
    user: {
      id: "student-outlined",
      firstName: "Camille",
      familyName: "DUPONT",
      email: "camille.dupont@aptitek.io",
      role: "student",
      cohortName: "Cohort 2026",
      isProfileComplete: true,
    },
    variant: "outlined",
  },
};

export const InteractiveSelected: Story = {
  args: {
    user: {
      id: "student-selected",
      firstName: "Gabriel",
      familyName: "MOREL",
      email: "gabriel.morel@aptitek.io",
      role: "student",
      cohortName: "Cohort 2026",
      isProfileComplete: true,
    },
    interactive: true,
    isSelected: true,
    onClick: (u) => alert(`Clicked card: ${u.firstName}`),
  },
};
