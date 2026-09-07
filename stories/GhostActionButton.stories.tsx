import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import GhostActionButton from "~/components/atoms/GhostActionButton";

const meta = {
  title: "Atoms/GhostActionButton",
  component: GhostActionButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    tooltip: { control: "text" },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof GhostActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tooltip: "Add item",
  },
};

export const CustomTooltip: Story = {
  args: {
    tooltip: "Add new cohort",
  },
};

export const InDashedContainer: Story = {
  render: (args) => (
    <Box
      sx={{
        width: 240,
        height: 140,
        border: "2px dashed",
        borderColor: "divider",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <GhostActionButton {...args} />
    </Box>
  ),
  args: {
    tooltip: "Add Institution",
  },
};
