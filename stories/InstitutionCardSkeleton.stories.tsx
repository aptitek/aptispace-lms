import type { Meta, StoryObj } from "@storybook/react-vite";
import InstitutionCardSkeleton from "../app/components/molecules/InstitutionCard/InstitutionCardSkeleton";

const meta: Meta<typeof InstitutionCardSkeleton> = {
  title: "Molecules/InstitutionCardSkeleton",
  component: InstitutionCardSkeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof InstitutionCardSkeleton>;

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

export const GhostAddInstitution: Story = {
  args: {
    variant: "ghost",
    onClick: () => alert("Add Institution clicked"),
    tooltipTitle: "Add Institution",
  },
};
