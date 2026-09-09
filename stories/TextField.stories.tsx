import type { Meta, StoryObj } from "@storybook/react-vite";
import TextField from "~/components/atoms/TextField";

const meta = {
  title: "Atoms/TextField",
  component: TextField,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["filled", "outlined", "standard", "search"],
    },
    size: {
      control: "select",
      options: ["compact", "small", "medium"],
    },
    compact: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOutlined: Story = {
  args: {
    label: "Student Identifier",
    variant: "outlined",
    placeholder: "e.g. STU-8092",
    size: "medium",
  },
};

export const FilledSmall: Story = {
  args: {
    label: "First Name",
    variant: "filled",
    defaultValue: "Alex",
    size: "small",
  },
};

export const WithError: Story = {
  args: {
    label: "Access Code",
    variant: "outlined",
    error: true,
    helperText: "Invalid security clearance token",
    defaultValue: "000-XX",
  },
};

export const CompactOutlined: Story = {
  args: {
    label: "Course ID",
    size: "compact",
    defaultValue: "CS-101",
    helperText: "32px height compact input",
  },
};

export const CompactSearch: Story = {
  args: {
    variant: "search",
    compact: true,
    placeholder: "Filter courses...",
    defaultValue: "Calculus",
  },
};
