import type { Meta, StoryObj } from "@storybook/react-vite";
import BrandLogo from "~/components/atoms/BrandLogo/BrandLogo";

const meta = {
  title: "Atoms/BrandLogo",
  component: BrandLogo,
  tags: ["autodocs"],
  argTypes: {
    showSubtitle: { control: "boolean" },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: {
    showSubtitle: true,
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    showSubtitle: true,
    size: "large",
  },
};

export const Small: Story = {
  args: {
    showSubtitle: false,
    size: "small",
  },
};
