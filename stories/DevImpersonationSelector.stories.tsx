import type { Meta, StoryObj } from "@storybook/react-vite";
import DevImpersonationSelector from "~/components/molecules/DevImpersonationSelector/DevImpersonationSelector";

const meta = {
  title: "Molecules/DevImpersonationSelector",
  component: DevImpersonationSelector,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof DevImpersonationSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
