import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  ExpressiveCard,
  GhostFabOverlay,
  DashedSkeletonCard,
} from "~/components/atoms/ExpressiveCard";
import { GhostActionButton } from "~/components/atoms/GhostActionButton";

const meta = {
  title: "Atoms/ExpressiveCard",
  component: ExpressiveCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["elevated", "elevation", "outlined", "dashed"],
    },
    isInteractive: { control: "boolean" },
    isSelected: { control: "boolean" },
  },
} satisfies Meta<typeof ExpressiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: (
      <Box sx={{ p: 3, width: 280 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Elevated Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Default subtle MD3 container with smooth border and elevation styling.
        </Typography>
      </Box>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: (
      <Box sx={{ p: 3, width: 280 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Outlined Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Crisp outlined border container suitable for list items and grids.
        </Typography>
      </Box>
    ),
  },
};

export const Dashed: Story = {
  args: {
    variant: "dashed",
    children: (
      <Box sx={{ p: 3, width: 280 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Dashed Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Used for placeholder and drop zone states.
        </Typography>
      </Box>
    ),
  },
};

export const InteractiveAndSelected: Story = {
  args: {
    isInteractive: true,
    isSelected: true,
    children: (
      <Box sx={{ p: 3, width: 280 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Interactive Selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Clickable card with active primary outline border and focus outline.
        </Typography>
      </Box>
    ),
  },
};

export const DashedSkeletonWithGhostFab: Story = {
  render: () => (
    <Box sx={{ width: 280, height: 160, position: "relative" }}>
      <DashedSkeletonCard isInteractive={true}>
        <Box sx={{ p: 3, opacity: 0.4, textAlign: "center" }}>
          <Typography variant="body2">Empty Slot</Typography>
        </Box>
        <GhostFabOverlay>
          <GhostActionButton tooltip="Create new item" />
        </GhostFabOverlay>
      </DashedSkeletonCard>
    </Box>
  ),
};
