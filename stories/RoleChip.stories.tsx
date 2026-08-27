import type { Meta, StoryObj } from "@storybook/react-vite";
import RoleChip from "~/components/atoms/RoleChip/RoleChip";

const meta = {
  title: "Atoms/RoleChip",
  component: RoleChip,
  tags: ["autodocs"],
  argTypes: {
    role: {
      control: "select",
      options: ["admin", "student", "instructor"],
    },
    size: {
      control: "select",
      options: ["small", "medium"],
    },
    label: { control: "text" },
  },
} satisfies Meta<typeof RoleChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  args: {
    role: "admin",
    label: "Admin",
    size: "small",
  },
};

export const Student: Story = {
  args: {
    role: "student",
    label: "Student",
    size: "small",
  },
};

export const Instructor: Story = {
  args: {
    role: "instructor",
    label: "Instructor",
    size: "small",
  },
};
