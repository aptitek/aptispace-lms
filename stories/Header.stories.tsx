import type { Meta, StoryObj } from "@storybook/react-vite";
import Header from "~/components/organisms/Header/Header";

const meta = {
  title: "Organisms/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["subtle", "full"],
      description:
        "Display mode: subtle for logged-out floating toggles, full with logo & glassmorphism.",
    },
    logoSize: {
      control: "select",
      options: ["small", "medium"],
      description: "Size of the Logo when mode is full.",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subtle: Story = {
  args: {
    mode: "subtle",
  },
};

export const Full: Story = {
  args: {
    mode: "full",
    logoSize: "small",
  },
};

export const AuthenticatedWithLogout: Story = {
  args: {
    mode: "full",
    logoSize: "small",
    user: {
      id: "persona-admin",
      name: "Dr. Eleanor Vance",
      email: "admin@aptispace.internal",
      role: "admin",
    },
    onLogout: () => {
      console.warn("Logged out from story");
    },
  },
};

export const AdminWithTabs: Story = {
  args: {
    mode: "full",
    logoSize: "small",
    user: {
      id: "persona-admin",
      name: "Dr. Eleanor Vance",
      email: "admin@aptispace.internal",
      role: "admin",
    },
  },
};

export const StudentWithPlanningTab: Story = {
  args: {
    mode: "full",
    logoSize: "small",
    user: {
      id: "persona-student",
      name: "Arthur Dent",
      email: "arthur@galaxy.org",
      role: "student",
    },
  },
};
