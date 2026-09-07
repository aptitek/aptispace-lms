import type { Meta, StoryObj } from "@storybook/react-vite";
import UserGridSkeleton from "../app/components/organisms/UserGrid/UserGridSkeleton";

const meta: Meta<typeof UserGridSkeleton> = {
  title: "Organisms/UserGridSkeleton",
  component: UserGridSkeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof UserGridSkeleton>;

export const FullGridShimmer: Story = {
  args: {
    count: 6,
    showHeader: true,
    showSearch: true,
    variant: "shimmer",
    animated: true,
  },
};

export const StaticPlaceholders: Story = {
  args: {
    count: 6,
    showHeader: true,
    variant: "static",
    animated: false,
    opacity: 0.4,
  },
};

export const WithoutHeader: Story = {
  args: {
    count: 4,
    showHeader: false,
  },
};

export const LazyLoadingSentinel: Story = {
  args: {
    isLazy: true,
    count: 3,
  },
};
