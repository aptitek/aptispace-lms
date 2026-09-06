import type { Meta, StoryObj } from "@storybook/react-vite";
import Sidebar from "~/components/organisms/Sidebar/Sidebar";

const meta = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StudentDefault: Story = {
  args: {
    user: {
      id: "persona-student",
      name: "Arthur Dent",
      email: "arthur@galaxy.org",
      role: "student",
    },
  },
};

export const AdminWithTabs: Story = {
  args: {
    user: {
      id: "persona-admin",
      name: "Dr. Eleanor Vance",
      email: "admin@aptispace.internal",
      role: "admin",
    },
  },
};

export const ImpersonatedUser: Story = {
  args: {
    user: {
      id: "persona-student-imp",
      name: "Ford Prefect",
      email: "ford@galaxy.org",
      role: "student",
      impersonating: true,
    },
    onReturnToAdmin: () => {
      console.warn("Return to admin triggered");
    },
  },
};

export const AuthVariant: Story = {
  args: {
    variant: "auth",
    user: null,
  },
};
