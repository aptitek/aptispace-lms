import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FullScreenModal from "../app/components/molecules/FullScreenModal/FullScreenModal";

const meta: Meta<typeof FullScreenModal> = {
  title: "Molecules/FullScreenModal",
  component: FullScreenModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared blur modal overlay matching the Status Center design, featuring backdrop blur (4px), spring motion, outside click exit, and Escape key dismissal.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FullScreenModal>;

function FullScreenModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <FullScreenModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        asCard
        maxWidth={520}
      >
        <Box
          sx={{
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Shared Modal Surface
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Shared between Status Center and Profile ID Card. Just a clean blur
            backdrop, spring entrance motion, and exit on outside click.
          </Typography>
        </Box>
      </FullScreenModal>
    </>
  );
}

export const Default: Story = {
  render: () => <FullScreenModalDemo />,
};
