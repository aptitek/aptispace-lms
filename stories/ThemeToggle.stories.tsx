import type { Meta, StoryObj } from "@storybook/react-vite";
import ThemeToggle from "~/components/atoms/ThemeToggle/ThemeToggle";

const meta = {
  title: "Atoms/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium"],
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
  },
};
