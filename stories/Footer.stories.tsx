import type { Meta, StoryObj } from "@storybook/react-vite";
import Footer from "~/components/organisms/Footer/Footer";

const meta = {
  title: "Organisms/Footer",
  component: Footer,
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
