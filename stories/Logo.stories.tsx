import type { Meta, StoryObj } from "@storybook/react-vite";
import Logo from "~/components/atoms/Logo/Logo";

const meta = {
  title: "Atoms/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: {
    size: "medium",
  },
};

export const Small: Story = {
  args: {
    size: "small",
  },
};

export const Large: Story = {
  args: {
    size: "large",
  },
};
