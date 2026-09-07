import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import FloatingActionButton from "~/components/atoms/FloatingActionButton";

const meta = {
  title: "Atoms/FloatingActionButton",
  component: FloatingActionButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    tooltip: { control: "text" },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof FloatingActionButton>;

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
      <FloatingActionButton {...args} />
    </Box>
  ),
  args: {
    tooltip: "Add Institution",
  },
};
