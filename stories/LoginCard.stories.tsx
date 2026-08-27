import type { Meta, StoryObj } from "@storybook/react-vite";
import LoginCard from "~/components/organisms/LoginCard/LoginCard";

const meta = {
  title: "Organisms/LoginCard",
  component: LoginCard,
  tags: ["autodocs"],
  argTypes: {
    showDevTool: { control: "boolean" },
  },
} satisfies Meta<typeof LoginCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithDevTool: Story = {
  args: {
    showDevTool: true,
  },
};

export const ProductionMode: Story = {
  args: {
    showDevTool: false,
  },
};
