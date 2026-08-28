import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import {
  MD3DeckCard,
  MD3CardHeader,
  MD3CardHeadline,
  MD3CardSubhead,
  MD3CardTitleGroup,
  MD3CardContent,
  MD3CardActions,
} from "../app/components/organisms/MD3DeckCard/MD3DeckCard";

const meta: Meta<typeof MD3DeckCard> = {
  title: "DeckFX/MD3DeckCard",
  component: MD3DeckCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: false },
    backContent: { control: false },
    layers: { control: false },
    variant: {
      control: { type: "select" },
      options: ["elevated", "filled", "outlined"],
      description: "Material Design 3 Card style variant",
    },
    elevation: {
      control: { type: "range", min: 0, max: 5, step: 1 },
      description: "MD3 elevation shadow depth level",
    },
    height: {
      control: { type: "range", min: 200, max: 600, step: 10 },
      description: "Card explicit height in px",
    },
    holographic: {
      control: { type: "boolean" },
      description: "Enable holographic foil sheen",
    },
    holoStrength: {
      control: { type: "range", min: 0, max: 2, step: 0.05 },
      description: "Intensity of the iridescent holographic foil",
    },
    maxTilt: {
      control: { type: "range", min: 0, max: 30, step: 1 },
      description: "Maximum 3D physics tilt angle in degrees",
    },
    scaleOnHover: {
      control: { type: "range", min: 1, max: 1.15, step: 0.01 },
      description: "Hover scale factor",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MD3DeckCard>;

/**
 * 1. MD3 Elevated Card Variant
 * Level 1/2 Surface Container elevation with subtle shadow and borderless surface.
 */
export const ElevatedCard: Story = {
  args: {
    variant: "elevated",
    elevation: 2,
    width: 360,
    height: 290,
    showGlare: true,
    maxTilt: 14,
    scaleOnHover: 1.03,
  },
  render: (args) => (
    <MD3DeckCard {...args}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <MD3CardHeader>
          <MD3CardTitleGroup>
            <Chip
              label="ELEVATED VARIANT"
              size="small"
              color="primary"
              variant="outlined"
            />
            <MD3CardHeadline sx={{ mt: 1 }}>Orbital Telemetry</MD3CardHeadline>
            <MD3CardSubhead>MD3 Surface Container Elevation</MD3CardSubhead>
          </MD3CardTitleGroup>
        </MD3CardHeader>
        <MD3CardContent>
          <p style={{ margin: 0 }}>
            Standard elevated Material Design 3 surface with subtle elevation
            shadowing and dynamic solarized background adaptation.
          </p>
        </MD3CardContent>
        <MD3CardActions>
          <Button size="small" variant="text">
            Dismiss
          </Button>
          <Button size="small" variant="contained">
            Acknowledge
          </Button>
        </MD3CardActions>
      </div>
    </MD3DeckCard>
  ),
};

/**
 * 2. MD3 Filled Card Variant
 * Level 0 elevation with distinct Surface Container Highest background fill.
 */
export const FilledCard: Story = {
  args: {
    variant: "filled",
    elevation: 0,
    width: 360,
    height: 290,
    showGlare: true,
    maxTilt: 14,
    scaleOnHover: 1.03,
  },
  render: (args) => (
    <MD3DeckCard {...args}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <MD3CardHeader>
          <MD3CardTitleGroup>
            <Chip
              label="FILLED VARIANT"
              size="small"
              color="secondary"
              variant="filled"
            />
            <MD3CardHeadline sx={{ mt: 1 }}>
              Cadet Propulsion Lab
            </MD3CardHeadline>
            <MD3CardSubhead>Tonal Surface Container Highest</MD3CardSubhead>
          </MD3CardTitleGroup>
        </MD3CardHeader>
        <MD3CardContent>
          <p style={{ margin: 0 }}>
            Filled variant features a distinct tonal container background with
            zero elevation shadow, creating modern clean contrast.
          </p>
        </MD3CardContent>
        <MD3CardActions>
          <Button size="small" variant="outlined">
            Details
          </Button>
          <Button size="small" variant="contained" color="secondary">
            Access Module
          </Button>
        </MD3CardActions>
      </div>
    </MD3DeckCard>
  ),
};

/**
 * 3. MD3 Outlined Card Variant
 * Defined by a 1px border stroke with flat elevation.
 */
export const OutlinedCard: Story = {
  args: {
    variant: "outlined",
    elevation: 0,
    width: 360,
    height: 290,
    showGlare: true,
    maxTilt: 14,
    scaleOnHover: 1.03,
  },
  render: (args) => (
    <MD3DeckCard {...args}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <MD3CardHeader>
          <MD3CardTitleGroup>
            <Chip label="OUTLINED VARIANT" size="small" variant="outlined" />
            <MD3CardHeadline sx={{ mt: 1 }}>
              Navigational Matrix
            </MD3CardHeadline>
            <MD3CardSubhead>1px MD3 Divider Stroke</MD3CardSubhead>
          </MD3CardTitleGroup>
        </MD3CardHeader>
        <MD3CardContent>
          <p style={{ margin: 0 }}>
            Outlined cards emphasize structural boundaries with clean strokes,
            ideal for high-density dashboard layouts.
          </p>
        </MD3CardContent>
        <MD3CardActions>
          <Button size="small" variant="text">
            Configure
          </Button>
          <Button size="small" variant="outlined">
            Sync Vectors
          </Button>
        </MD3CardActions>
      </div>
    </MD3DeckCard>
  ),
};

const cosmicLayers = [
  {
    id: "cosmic-bg",
    parallax: -10,
    content: (
      <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-950 to-teal-950" />
    ),
    holographic: {
      variant: "cosmic" as const,
      intensity: 1.2,
      patternUrl: "https://assets.codepen.io/605876/figma-texture.png",
      patternOpacity: 0.3,
    },
  },
  {
    id: "hero-icon",
    parallax: 22,
    content: (
      <div className="w-full h-full flex items-center justify-center pointer-events-none">
        <div className="text-6xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          🚀
        </div>
      </div>
    ),
  },
];

/**
 * 4. Multi-Layer Cosmic Holographic Card
 * Combines MD3 structure with Deck-FX holographic foil and 3D parallax depth.
 */
export const CosmicHolographicMD3Card: Story = {
  args: {
    variant: "elevated",
    elevation: 3,
    width: 380,
    height: 420,
    holographic: true,
    holoStrength: 0.9,
    showGlare: true,
    maxTilt: 20,
    scaleOnHover: 1.05,
    layers: cosmicLayers,
  },
  render: (args) => (
    <MD3DeckCard
      {...args}
      backContent={
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: 24,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <MD3CardHeadline>Warp Field Specifications</MD3CardHeadline>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
            Field output: 1.21 GW Warp Displacement. Quantum harmonics
            calibrated for interstellar transition.
          </p>
          <Button variant="outlined" startIcon={<SyncAltIcon />}>
            Return to Core
          </Button>
        </div>
      }
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <MD3CardHeader sx={{ position: "relative", zIndex: 2 }}>
          <MD3CardTitleGroup>
            <Chip
              label="COSMIC RARE"
              size="small"
              icon={<AutoAwesomeIcon />}
              sx={{
                bgcolor: "rgba(42, 161, 152, 0.2)",
                color: "#2aa198",
                borderColor: "#2aa198",
              }}
              variant="outlined"
            />
            <MD3CardHeadline sx={{ mt: 1, color: "#fff" }}>
              Hyperdrive Core
            </MD3CardHeadline>
            <MD3CardSubhead sx={{ color: "rgba(255,255,255,0.7)" }}>
              Tier V Exotic Artifact
            </MD3CardSubhead>
          </MD3CardTitleGroup>
        </MD3CardHeader>
        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <MD3CardActions sx={{ bgcolor: "rgba(0, 43, 54, 0.75)" }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<RocketLaunchIcon />}
            >
              Ignite Warp
            </Button>
          </MD3CardActions>
        </div>
      </div>
    </MD3DeckCard>
  ),
};
