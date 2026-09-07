import type { Meta, StoryObj } from "@storybook/react-vite";
import CohortCardSkeleton from "../app/components/molecules/CohortCard/CohortCardSkeleton";

const meta: Meta<typeof CohortCardSkeleton> = {
  title: "Molecules/CohortCardSkeleton",
  component: CohortCardSkeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof CohortCardSkeleton>;

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

export const GhostAddCohort: Story = {
  args: {
    variant: "ghost",
    onClick: () => alert("Add Cohort clicked"),
    tooltipTitle: "Add Cohort",
  },
};
