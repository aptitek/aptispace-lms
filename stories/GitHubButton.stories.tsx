import type { Meta, StoryObj } from "@storybook/react-vite";
import GitHubButton from "~/components/atoms/GitHubButton/GitHubButton";

const meta = {
  title: "Atoms/GitHubButton",
  component: GitHubButton,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    fullWidth: { control: "boolean" },
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof GitHubButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Sign in with GitHub",
    fullWidth: false,
  },
};

export const FullWidth: Story = {
  args: {
    label: "Continue with GitHub",
    fullWidth: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    fullWidth: false,
  },
};
