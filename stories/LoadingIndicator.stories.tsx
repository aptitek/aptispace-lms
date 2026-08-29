import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingIndicator } from "react-material-expressive";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const meta = {
  title: "Atoms/LoadingIndicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  argTypes: {
    contained: { control: "boolean" },
    className: { control: "text" },
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <LoadingIndicator {...args} />
    </Box>
  ),
};

export const Contained: Story = {
  args: {
    contained: true,
  },
  render: (args) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <LoadingIndicator {...args} />
    </Box>
  ),
};

export const ScaleVariants: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator className="!size-6 [&>svg]:!size-6" />
          <Typography variant="caption" sx={{ display: "block" }}>
            Small (24px)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator className="!size-9 [&>svg]:!size-9" />
          <Typography variant="caption" sx={{ display: "block" }}>
            Medium (36px)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator className="!size-12 [&>svg]:!size-12" />
          <Typography variant="caption" sx={{ display: "block" }}>
            Standard (48px)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator className="!size-16 [&>svg]:!size-16" />
          <Typography variant="caption" sx={{ display: "block" }}>
            Large (64px)
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
};
