import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { Id1Card } from "../app/components/organisms/Id1Card";

const meta: Meta<typeof Id1Card> = {
  title: "Organisms/Id1Card",
  component: Id1Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ISO/IEC 7810 ID-1 standard card ($85.60\\text{ mm} \\times 53.98\\text{ mm}$) with 3D flip animation, targeted holographic masked foil, and physical electronics.",
      },
    },
  },
  argTypes: {
    // 3D Flip & Side
    side: {
      control: "radio",
      options: ["front", "back"],
      description: "Card face view",
      table: { category: "3D Flip & Side" },
    },
    isFlipped: {
      control: "boolean",
      description: "Controlled 3D flipped state (rotates 180°)",
      table: { category: "3D Flip & Side" },
    },
    flipOnClick: {
      control: "boolean",
      description: "Click card directly to toggle side with 3D flip animation",
      table: { category: "3D Flip & Side" },
    },
    flipDirection: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description:
        "3D flip rotation axis (horizontal Y-axis or vertical X-axis)",
      table: { category: "3D Flip & Side" },
    },
    flipDuration: {
      control: { type: "range", min: 0.2, max: 2, step: 0.05 },
      description: "Duration of flip animation in seconds",
      table: { category: "3D Flip & Side" },
    },
    enableFlip: {
      control: "boolean",
      description: "Enable 3D animated flip transitions",
      table: { category: "3D Flip & Side" },
    },

    // Layout & Appearance
    orientation: {
      control: "radio",
      options: ["landscape", "portrait"],
      description: "Card layout orientation",
      table: { category: "Layout & Appearance" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "responsive"],
      description: "Predefined standard size tokens",
      table: { category: "Layout & Appearance" },
    },
    transparent: {
      control: "boolean",
      description:
        "Glassmorphic transparent acrylic material with double-sided see-through",
      table: { category: "Layout & Appearance" },
    },
    transparentGhostOpacity: {
      control: { type: "range", min: 0.05, max: 0.8, step: 0.02 },
      description:
        "Ghosting opacity of the reverse side print seen through clear acrylic",
      table: { category: "Layout & Appearance" },
    },

    // Holographic & Lighting
    holographic: {
      control: "boolean",
      description: "Dynamic holographic foil reflection on Guilloche curves",
      table: { category: "Holographic & Lighting" },
    },
    holoStrength: {
      control: { type: "range", min: 0.1, max: 1.5, step: 0.05 },
      description: "Holographic reflection intensity",
      table: { category: "Holographic & Lighting" },
    },
    showGlare: {
      control: "boolean",
      description: "Show specular surface glare highlight",
      table: { category: "Holographic & Lighting" },
    },
    glareOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "Specular glare opacity",
      table: { category: "Holographic & Lighting" },
    },
    maxTilt: {
      control: { type: "range", min: 0, max: 40, step: 1 },
      description: "Maximum 3D parallax tilt angle on hover",
      table: { category: "Holographic & Lighting" },
    },
    scaleOnHover: {
      control: { type: "range", min: 1, max: 1.2, step: 0.01 },
      description: "Scale magnification factor on hover",
      table: { category: "Holographic & Lighting" },
    },
    shadow: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl"],
      description: "3D drop shadow preset",
      table: { category: "Holographic & Lighting" },
    },

    // Security Electronics
    showElectronics: {
      control: "boolean",
      description: "Render embedded security electronics layer",
      table: { category: "Security Electronics" },
    },
    electronicsFinish: {
      control: "select",
      options: ["gold", "cyan-laser", "copper", "silver"],
      description: "Metallic finish for conductive traces",
      table: { category: "Security Electronics" },
    },
    showChip: {
      control: "boolean",
      description: "Show ISO 7816 smart microchip module",
      table: { category: "Security Electronics" },
    },
    chipView: {
      control: "select",
      options: ["front", "back", "none"],
      description: "Chip module view override",
      table: { category: "Security Electronics" },
    },
    showNfcAntenna: {
      control: "boolean",
      description: "Show outer ISO 14443 NFC 4-turn perimeter antenna",
      table: { category: "Security Electronics" },
    },
    showInnerCoil: {
      control: "boolean",
      description: "Show inner inductive coupling coil",
      table: { category: "Security Electronics" },
    },
    electronicsOpacity: {
      control: { type: "range", min: 0.1, max: 1, step: 0.05 },
      description: "Electronics layer opacity",
      table: { category: "Security Electronics" },
    },

    // Guilloche Security
    showGuilloche: {
      control: "boolean",
      description: "Render procedural Guilloche security rosettes",
      table: { category: "Guilloche Security" },
    },
    guillocheVariant: {
      control: "select",
      options: [
        "holo-spectrum",
        "solarized-gold",
        "cyber-cyan",
        "cosmic-crimson",
        "deep-space",
      ],
      description: "Guilloche color theme and iridescent spectrum palette",
      table: { category: "Guilloche Security" },
    },
    guillocheDensity: {
      control: "select",
      options: ["low", "medium", "high"],
      description: "Density of spirograph curves",
      table: { category: "Guilloche Security" },
    },
    guillocheOpacity: {
      control: { type: "range", min: 0.1, max: 1, step: 0.05 },
      description: "Guilloche curve line opacity",
      table: { category: "Guilloche Security" },
    },
    guillocheNoiseIntensity: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "Harmonic pseudo-noise perturbation amplitude",
      table: { category: "Guilloche Security" },
    },
    guillocheSeed: {
      control: "text",
      description: "Cryptographic seed string for curve generation",
      table: { category: "Guilloche Security" },
    },

    // Credential Data
    credential: {
      control: "object",
      description: "Cadet identity data",
      table: { category: "Credential Data" },
    },
  },
  args: {
    side: "front",
    enableFlip: true,
    flipOnClick: true,
    flipDirection: "horizontal",
    orientation: "landscape",
    size: "lg",
    transparent: false,
    holographic: true,
    holoStrength: 0.75,
    showGlare: true,
    glareOpacity: 0.45,
    maxTilt: 16,
    scaleOnHover: 1.04,
    shadow: "xl",
    showElectronics: true,
    electronicsFinish: "gold",
    showChip: true,
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
    guillocheDensity: "medium",
    guillocheOpacity: 0.42,
    guillocheNoiseIntensity: 0.5,
    credential: {
      id: "APTI-7810-9402",
      name: "Alex Mercer",
      callSign: "AETH-9042",
      role: "Mission Specialist",
      division: "Orbital Flight Dynamics",
      clearanceLevel: "LEVEL-4 OMNI",
      expiryDate: "2030-08",
      securityCode: "781",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Id1Card>;

/**
 * 1. Default Interactive ID-1 Card (All controls active with click-to-flip)
 */
export const Default: Story = {
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "primary.light",
        }}
      >
        <TouchAppIcon fontSize="small" />
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, letterSpacing: "0.5px" }}
        >
          Click card to flip 3D • Adjust any control in the panel below
        </Typography>
      </Box>
      <Id1Card {...args} />
    </Box>
  ),
};

/**
 * 2. Standard Front Landscape Face
 */
export const StandardFrontLandscape: Story = {
  args: {
    side: "front",
    flipOnClick: false,
  },
};

/**
 * 3. Standard Back Landscape Face
 */
export const StandardBackLandscape: Story = {
  args: {
    side: "back",
    flipOnClick: false,
  },
};

/**
 * 4. Targeted Holographic Masked Foil on Guilloche Security Curves
 */
export const HolographicGuillocheFoil: Story = {
  args: {
    side: "front",
    holographic: true,
    holoStrength: 1.1,
    electronicsFinish: "cyan-laser",
    guillocheVariant: "cyber-cyan",
    flipOnClick: true,
  },
};

/**
 * 5. Side-by-Side Dual View (Simultaneous Front & Back Inspection)
 */
export const SideBySideDualView: Story = {
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 800, color: "text.secondary" }}
        >
          FRONT SIDE (CREDENTIAL &amp; CHIP)
        </Typography>
        <Id1Card {...args} side="front" enableFlip={false} size="md" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 800, color: "text.secondary" }}
        >
          BACK SIDE (MAGSTRIPE &amp; MRZ)
        </Typography>
        <Id1Card {...args} side="back" enableFlip={false} size="md" />
      </Box>
    </Box>
  ),
};

/**
 * 6. Transparent Frosted Acrylic Card (Front with Exposed Induction Coils)
 */
export const TransparentAcrylicFront: Story = {
  args: {
    side: "front",
    transparent: true,
    holographic: true,
    electronicsFinish: "cyan-laser",
    flipOnClick: true,
  },
};

/**
 * 7. Transparent Frosted Acrylic Card (Back with Exposed Silicon Die)
 */
export const TransparentAcrylicBack: Story = {
  args: {
    side: "back",
    transparent: true,
    holographic: true,
    electronicsFinish: "cyan-laser",
    flipOnClick: true,
  },
};

/**
 * 8. Portrait Orientation Personnel Badge (Vertical Flip Animation)
 */
export const PortraitOrientationBadge: Story = {
  args: {
    side: "front",
    orientation: "portrait",
    flipDirection: "vertical",
    flipOnClick: true,
    size: "md",
    guillocheVariant: "solarized-gold",
  },
};

/**
 * 9. Minimalist Blank Card
 */
export const MinimalistBlankCard: Story = {
  args: {
    side: "front",
    showGlare: true,
    holographic: false,
    showElectronics: false,
    showGuilloche: false,
    flipOnClick: false,
  },
};
