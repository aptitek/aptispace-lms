import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PhysicCard from "../app/components/molecules/PhysicCard/PhysicCard";

const meta: Meta<typeof PhysicCard> = {
  title: "Components/Molecules/PhysicCard",
  component: PhysicCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof PhysicCard>;

const FrontPlaceholder = () => (
  <Box
    sx={{
      p: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      color: "white",
    }}
  >
    <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
      Student ID
    </Typography>
    <Box>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Name
      </Typography>
      <Typography variant="h6">Jane Doe</Typography>
    </Box>
  </Box>
);

const BackPlaceholder = () => (
  <Box
    sx={{
      p: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5",
      color: "text.primary",
    }}
  >
    <Typography variant="body1" align="center" gutterBottom>
      This card belongs to the institution.
      <br />
      If found, please return to the administration.
    </Typography>
    <Button variant="contained" sx={{ mt: 2 }}>
      Scan QR
    </Button>
  </Box>
);

export const Default: Story = {
  args: {
    ratio: "85.6/53.98", // standard ID card ratio
    sx: { width: 340 },
    frontContent: <FrontPlaceholder />,
    backContent: <BackPlaceholder />,
    elevation: 4,
  },
};

export const StaticCard: Story = {
  args: {
    ratio: "85.6/53.98",
    sx: { width: 340 },
    frontContent: <FrontPlaceholder />,
    interactive: false,
    elevation: 1,
  },
};

export const CustomContent: Story = {
  args: {
    sx: { width: 300, height: 400 },
    frontContent: (
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">🎲</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Hover to tilt
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click to flip
        </Typography>
      </Box>
    ),
    backContent: (
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="h3">🎉</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          You flipped it!
        </Typography>
      </Box>
    ),
    elevation: 8,
  },
};

export const HolographicFull: Story = {
  args: {
    sx: { width: 340, height: 480 },
    showHolo: true,
    frontContent: (
      <Box
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#8892b0",
          color: "white",
        }}
      >
        <Typography variant="h1">✨</Typography>
        <Typography
          variant="h5"
          sx={{ mt: 2, zIndex: 1, textShadow: "0px 1px 4px rgba(0,0,0,0.5)" }}
        >
          Full Foil
        </Typography>
      </Box>
    ),
    backContent: <BackPlaceholder />,
    elevation: 8,
  },
};

export const HolographicMasked: Story = {
  args: {
    sx: { width: 340, height: 480 },
    showHolo: true,
    // A radial gradient acting as a CSS mask (simulating a cutout around the dragon)
    holoMaskImage:
      "radial-gradient(circle at center, black 30%, transparent 60%)",
    frontContent: (
      <Box
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#64748b",
          color: "white",
        }}
      >
        <Typography variant="h1" sx={{ fontSize: "10rem" }}>
          🐉
        </Typography>
        <Typography
          variant="h5"
          sx={{ mt: 2, zIndex: 1, textShadow: "0px 2px 10px rgba(0,0,0,0.8)" }}
        >
          Masked Holo
        </Typography>
      </Box>
    ),
    backContent: <BackPlaceholder />,
    elevation: 8,
  },
};
