import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Id1Card } from "../app/components/molecules/Id1Card";

const meta: Meta<typeof Id1Card> = {
  title: "Molecules/Id1Card/HoloLayers",
  component: Id1Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Holographic image layers for Id1Card. Allows setting any graphic image as a holographic layer where the image alpha channel (or custom mask) reflects the iridescent foil.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Id1Card>;

import { toSvgDataUrl } from "../app/components/molecules/Id1Card/Id1Card.holo";

// Demo SVG assets for Holo Layer Stories
const DEMO_EMBLEM_SVG = toSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <circle cx="200" cy="200" r="160" fill="none" stroke="white" stroke-width="3" stroke-dasharray="8 6"/>
  <circle cx="200" cy="200" r="145" fill="none" stroke="white" stroke-width="1.5"/>
  <circle cx="200" cy="200" r="120" fill="none" stroke="white" stroke-width="2" stroke-dasharray="2 4"/>
  <polygon points="200,65 235,145 320,155 255,215 275,300 200,255 125,300 145,215 80,155 165,145" fill="none" stroke="white" stroke-width="4"/>
  <polygon points="200,105 222,155 275,160 235,198 248,250 200,222 152,250 165,198 125,160 178,155" fill="white" opacity="0.3"/>
  <circle cx="200" cy="200" r="35" fill="white" opacity="0.6"/>
  <path d="M 120 200 A 80 80 0 0 0 280 200" fill="none" stroke="white" stroke-width="2"/>
  <text x="200" y="345" font-family="monospace" font-size="14" font-weight="900" fill="white" text-anchor="middle" letter-spacing="4">APTISPACE • VERIFIED</text>
</svg>
`);

const DEMO_SEAL_MASK_SVG = toSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <polygon points="200,50 235,130 320,130 255,185 280,265 200,220 120,265 145,185 80,130 165,130" fill="white"/>
  <circle cx="200" cy="200" r="35" fill="none" stroke="white" stroke-width="6"/>
</svg>
`);

/**
 * 1. Holo Layer Emblem (Image Alpha Mask)
 * Sets an image directly as a holographic layer. The image graphic renders on the card substrate,
 * and its transparent alpha channel masks the iridescent holographic foil with specular glare and 3D tilt.
 */
export const HoloLayerEmblem: Story = {
  args: {
    showGuilloche: false,
    holographic: true,
    holoStrength: 1.0,
    holoVariant: "cyber-cyan",
    holoImage: DEMO_EMBLEM_SVG,
    holoImageOpacity: 0.9,
    holoImageBlendMode: "color-dodge",
  },
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "text.secondary" }}
      >
        Holo Layer: Security emblem image where alpha channel masks the
        holographic foil
      </Typography>
      <Id1Card {...args} size="md" />
    </Box>
  ),
};

/**
 * 2. Combined Guilloche & Holo Layer (Multi-Mask Compositing)
 * Combines procedural rosette Guilloche security curves and an emblem Holo Layer.
 * Both masks are merged so holographic foil shines across both geometric patterns simultaneously.
 */
export const CombinedGuillocheAndHoloLayer: Story = {
  args: {
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
    guillocheDensity: "medium",
    holographic: true,
    holoStrength: 0.85,
    holoImage: DEMO_EMBLEM_SVG,
    holoImageOpacity: 0.8,
    holoImageBlendMode: "screen",
  },
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "text.secondary" }}
      >
        Multi-mask Compositing: Guilloche curves + Holo Layer image reflecting
        foil simultaneously
      </Typography>
      <Id1Card {...args} size="md" />
    </Box>
  ),
};

/**
 * 3. Custom Mask Holo Layer
 * Uses a distinct dedicated mask (holoImageMask) to project a solid starburst holographic reflection
 * through a fine-line emblem graphic.
 */
export const CustomMaskHoloLayer: Story = {
  args: {
    showGuilloche: false,
    holographic: true,
    holoStrength: 1.2,
    holoVariant: "solarized-gold",
    holoImage: DEMO_EMBLEM_SVG,
    holoImageMask: DEMO_SEAL_MASK_SVG,
    holoImageOpacity: 0.95,
  },
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "text.secondary" }}
      >
        Custom Mask: Visual emblem rendered on substrate while separate
        starburst mask guides the holographic foil
      </Typography>
      <Id1Card {...args} size="md" />
    </Box>
  ),
};

/**
 * 4. Multi-Layer Front and Back Holographic Features
 * Demonstrates separate front access emblem and back authentication seals configured via holoLayers array.
 */
export const MultiLayerFrontAndBack: Story = {
  args: {
    flipOnClick: true,
    showGuilloche: true,
    guillocheVariant: "cosmic-crimson",
    holoLayers: [
      {
        id: "front-seal",
        src: DEMO_EMBLEM_SVG,
        side: "front",
        opacity: 0.85,
        blendMode: "color-dodge",
      },
      {
        id: "back-seal",
        src: DEMO_EMBLEM_SVG,
        maskUrl: DEMO_SEAL_MASK_SVG,
        side: "back",
        opacity: 0.75,
        blendMode: "screen",
      },
    ],
  },
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "text.secondary" }}
      >
        Click to flip: Front features fine-line emblem, back features solid
        masked authentication star
      </Typography>
      <Id1Card {...args} size="md" />
    </Box>
  ),
};
