import type { Meta, StoryObj } from "@storybook/react-vite";
import UserCardSkeleton from "../app/components/molecules/UserCard/UserCardSkeleton";

const meta: Meta<typeof UserCardSkeleton> = {
  title: "Molecules/UserCardSkeleton",
  component: UserCardSkeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof UserCardSkeleton>;

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
