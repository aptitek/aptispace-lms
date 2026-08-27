import type { Meta, StoryObj } from "@storybook/react-vite";
import LanguageToggle from "~/components/atoms/LanguageToggle/LanguageToggle";

const meta = {
  title: "Atoms/LanguageToggle",
  component: LanguageToggle,
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
} satisfies Meta<typeof LanguageToggle>;

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
