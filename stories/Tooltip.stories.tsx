import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@mui/material/Button";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";

const meta = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    arrow: { control: "boolean" },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Material Design 3 Tooltip with Solarized Tokens",
    arrow: true,
    placement: "top",
    children: <Button variant="contained">Hover for MD3 Tooltip</Button>,
  },
};

export const BottomPlacement: Story = {
  args: {
    title: "Action detail tooltip",
    arrow: true,
    placement: "bottom",
    children: <Button variant="outlined">Hover Me</Button>,
  },
};
