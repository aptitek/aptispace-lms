import type { Meta, StoryObj } from "@storybook/react-vite";
import SchoolCardSkeleton from "../app/components/molecules/SchoolCard/SchoolCardSkeleton";

const meta: Meta<typeof SchoolCardSkeleton> = {
  title: "Molecules/SchoolCardSkeleton",
  component: SchoolCardSkeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SchoolCardSkeleton>;

export const LoadingShimmer: Story = {
  args: {
    variant: "shimmer",
    animated: true,
  },
};

export const StaticPlaceholder: Story = {
  args: {
    variant: "static",
    animated: false,
    opacity: 0.4,
  },
};

export const GhostAddSchool: Story = {
  args: {
    variant: "ghost",
    onClick: () => alert("Add Institution clicked"),
    tooltipTitle: "Add Institution",
  },
};
