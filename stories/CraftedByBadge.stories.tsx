import type { Meta, StoryObj } from "@storybook/react-vite";
import CraftedByBadge from "~/components/atoms/CraftedByBadge/CraftedByBadge";

const meta = {
  title: "Atoms/CraftedByBadge",
  component: CraftedByBadge,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium"],
    },
    href: { control: "text" },
  },
} satisfies Meta<typeof CraftedByBadge>;

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
