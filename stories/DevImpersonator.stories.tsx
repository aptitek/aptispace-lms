import type { Meta, StoryObj } from "@storybook/react-vite";
import DevImpersonator from "~/components/molecules/DevImpersonator/DevImpersonator";
import type { AccountDefinition } from "~/utils/auth";

const mockAccounts: AccountDefinition[] = [
  {
    id: "user-admin-1",
    name: "Dr. Eleanor Vance",
    email: "admin@aptispace.internal",
    role: "admin",
    badge: "Admin",
    title: "System Administrator & Lead Instructor",
    isProfileComplete: true,
  },
  {
    id: "user-inst-1",
    name: "Cmdr. Daniel Foster",
    email: "d.foster@faculty.aptispace.io",
    role: "instructor",
    badge: "Instructor",
    title: "Astrophysics Instructor",
    isProfileComplete: true,
  },
  {
    id: "user-inst-2",
    name: "Prof. Sarah Connor",
    email: "s.connor@faculty.aptispace.io",
    role: "instructor",
    badge: "Instructor",
    title: "Orbital Mechanics Lead",
    isProfileComplete: true,
  },
  {
    id: "user-cadet-1",
    name: "Alex Mercer",
    email: "alex.mercer@cadet.aptispace.io",
    role: "student",
    badge: "Student",
    title: "Enrolled Cadet • Term 02",
    isProfileComplete: true,
  },
  {
    id: "user-cadet-2",
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
    currentUserId: "user-cadet-1",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    initialAccounts: mockAccounts,
  },
};
