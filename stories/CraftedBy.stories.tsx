import type { Meta, StoryObj } from "@storybook/react-vite";
import CraftedBy from "~/components/atoms/CraftedBy/CraftedBy";

const meta = {
  title: "Atoms/CraftedBy",
  component: CraftedBy,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium"],
    },
    href: { control: "text" },
  },
} satisfies Meta<typeof CraftedBy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "small",
    href: "https://aptitek.io",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    href: "https://aptitek.io",
  },
};
