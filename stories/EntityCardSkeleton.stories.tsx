import type { Meta, StoryObj } from "@storybook/react-vite";
import EntityCardSkeleton from "../app/components/molecules/EntityCard/EntityCardSkeleton";

const meta: Meta<typeof EntityCardSkeleton> = {
  title: "Molecules/EntityCardSkeleton",
  component: EntityCardSkeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof EntityCardSkeleton>;

export const ShimmerAnimated: Story = {
  args: {
    variant: "shimmer",
    animated: true,
  },
};

export const StaticEmptyPlaceholder: Story = {
  args: {
    variant: "static",
    animated: false,
    opacity: 0.35,
  },
};

export const GhostAddUserCard: Story = {
  args: {
    isGhost: true,
    onClick: () => alert("Add User clicked!"),
    tooltipTitle: "Add User",
  },
};
