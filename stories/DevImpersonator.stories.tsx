import type { Meta, StoryObj } from "@storybook/react-vite";
import DevImpersonator from "~/components/molecules/DevImpersonator/DevImpersonator";
import type { AccountDefinition } from "~/utils/auth";

const mockAccounts: AccountDefinition[] = [
  {
    id: "user-admin-1",
    name: "Eleanor Vance",
    email: "admin@aptitek.io",
    role: "admin",
    badge: "Admin",
    title: "System Administrator",
    isProfileComplete: true,
  },
  {
    id: "user-inst-1",
    name: "Daniel Foster",
    email: "d.foster@aptitek.io",
    role: "instructor",
    badge: "Instructor",
    title: "Lead Instructor",
    isProfileComplete: true,
  },
  {
    id: "user-inst-2",
    name: "Sarah Connor",
    email: "s.connor@aptitek.io",
    role: "instructor",
    badge: "Instructor",
    title: "Software Engineering Lead",
    isProfileComplete: true,
  },
  {
    id: "user-student-1",
    name: "Alex Mercer",
    email: "alex.mercer@aptitek.io",
    role: "student",
    badge: "Student",
    title: "Student",
    isProfileComplete: true,
  },
  {
    id: "user-student-2",
    name: "New Student (Pending Onboarding)",
    email: "",
    role: "student",
    badge: "Student",
    title: "Onboarding Pending • Unconfigured Profile",
    isProfileComplete: false,
  },
];

const meta = {
  title: "Molecules/DevImpersonator",
  component: DevImpersonator,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    onSelectAccount: { action: "account-selected" },
    onSelectPersona: { action: "persona-selected" },
    onAccountCreated: { action: "account-created" },
  },
} satisfies Meta<typeof DevImpersonator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
  },
};

export const WithManyAccounts: Story = {
  args: {
    loading: false,
    initialAccounts: mockAccounts,
    currentUserId: "user-student-1",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    initialAccounts: mockAccounts,
  },
};
