import type { Meta, StoryObj } from "@storybook/react-vite";
import DevImpersonator from "~/components/molecules/DevImpersonator/DevImpersonator";

const meta = {
  title: "Molecules/DevImpersonator",
  component: DevImpersonator,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    onSelectPersona: { action: "persona-selected" },
  },
} satisfies Meta<typeof DevImpersonator>;

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
