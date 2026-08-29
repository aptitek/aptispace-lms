import type { Meta, StoryObj } from "@storybook/react-vite";
import TextField from "@mui/material/TextField";

const meta = {
  title: "Atoms/TextField",
  component: TextField,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["filled", "outlined", "standard"],
    },
    size: {
      control: "select",
      options: ["small", "medium"],
    },
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
    label: "Pilot Identifier",
    variant: "outlined",
    placeholder: "e.g. CADET-8092",
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
