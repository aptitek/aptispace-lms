import type { Meta, StoryObj } from "@storybook/react-vite";
import ProfileCardSkeleton from "../app/components/molecules/ProfileCardCompact/ProfileCardSkeleton";

const meta: Meta<typeof ProfileCardSkeleton> = {
  title: "Molecules/ProfileCardSkeleton",
  component: ProfileCardSkeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProfileCardSkeleton>;

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
