import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { Id1Card } from "../app/components/molecules/Id1Card";

const meta: Meta<typeof Id1Card> = {
  title: "Molecules/Id1Card",
  component: Id1Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ISO/IEC 7810 ID-1 standard physical card molecule ($85.60\\text{ mm} \\times 53.98\\text{ mm}$) featuring 3D flip physics, procedural Guilloche security rosettes, dynamic holographic foil reflection, embedded microchip/NFC electronics, and transparent acrylic options.",
      },
    },
  },
  argTypes: {
    side: {
      control: "radio",
      options: ["front", "back"],
      description: "Active card face view",
      table: { category: "3D Flip & State" },
    },
    isFlipped: {
      control: "boolean",
      description: "Controlled 3D flipped state (rotates 180°)",
      table: { category: "3D Flip & State" },
    },
    flipOnClick: {
      control: "boolean",
      description: "Click card directly to toggle side with 3D flip animation",
      table: { category: "3D Flip & State" },
    },
    flipDirection: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "3D flip rotation axis",
      table: { category: "3D Flip & State" },
    },
    orientation: {
      control: "radio",
      options: ["landscape", "portrait"],
      description: "Card orientation (Landscape or Portrait)",
      table: { category: "Geometry & Substrate" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "responsive"],
      description: "Predefined standard dimension preset",
      table: { category: "Geometry & Substrate" },
    },
    transparent: {
      control: "boolean",
      description:
        "Glassmorphic transparent acrylic substrate with reverse ghosting",
      table: { category: "Geometry & Substrate" },
    },
    holographic: {
      control: "boolean",
      description: "Dynamic holographic foil reflection on Guilloche curves",
      table: { category: "Visual Effects" },
    },
    holoStrength: {
      control: { type: "range", min: 0.1, max: 1.5, step: 0.05 },
      description: "Holographic reflection intensity",
      table: { category: "Visual Effects" },
    },
    showGlare: {
      control: "boolean",
      description: "Show specular surface glare highlight",
      table: { category: "Visual Effects" },
    },
    showElectronics: {
      control: "boolean",
      description:
        "Render embedded security electronics layer (chip + NFC coil)",
      table: { category: "Security Layers" },
    },
    electronicsFinish: {
      control: "select",
      options: ["gold", "cyan-laser", "copper", "silver"],
      description: "Metallic conductive finish",
      table: { category: "Security Layers" },
    },
    chipPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "Position of the contact microchip module",
      table: { category: "Security Layers" },
    },
    showGuilloche: {
      control: "boolean",
      description: "Render procedural Guilloche security rosettes",
      table: { category: "Security Layers" },
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
      table: { category: "Security Layers" },
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
    chipPosition: "left",
    showChip: true,
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
    guillocheDensity: "medium",
    guillocheOpacity: 0.42,
    guillocheNoiseIntensity: 0.5,
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Id1Card>;

/**
 * 1. Default Interactive Physical Substrate
 * Standard ID-1 card with 3D flip physics, procedural guilloche, holographic foil, and gold electronics.
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
          Click card to flip 3D • Adjust properties in Controls below
        </Typography>
      </Box>
      <Id1Card {...args} />
    </Box>
  ),
};

/**
 * 2. Transparent Acrylic Substrate
 * Glassmorphic acrylic material exposing internal induction coils and mirrored reverse ghost print.
 */
export const TransparentAcrylic: Story = {
  args: {
    transparent: true,
    holographic: true,
    electronicsFinish: "cyan-laser",
    flipOnClick: true,
  },
};

/**
 * 3. Portrait Orientation
 * Vertical format with vertical (X-axis) 3D flip physics.
 */
export const PortraitOrientation: Story = {
  args: {
    orientation: "portrait",
    flipDirection: "vertical",
    flipOnClick: true,
    size: "md",
    guillocheVariant: "solarized-gold",
  },
};

/**
 * 4. Electronics Finishes
 * Comparison of metallic conductive finishes (Gold, Silver, Cyan Laser, Copper).
 */
export const ElectronicsFinishes: Story = {
  render: (args) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
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
          GOLD FINISH
        </Typography>
        <Id1Card {...args} size="md" electronicsFinish="gold" />
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
          SILVER FINISH
        </Typography>
        <Id1Card {...args} size="md" electronicsFinish="silver" />
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
          CYAN LASER FINISH
        </Typography>
        <Id1Card {...args} size="md" electronicsFinish="cyan-laser" />
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
          COPPER FINISH
        </Typography>
        <Id1Card {...args} size="md" electronicsFinish="copper" />
      </Box>
    </Box>
  ),
};

/**
 * 5. Holographic Spectrum Variants
 * Procedural Guilloche curves combined with dynamic holographic reflection themes.
 */
export const HolographicVariants: Story = {
  render: (args) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
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
          HOLO SPECTRUM
        </Typography>
        <Id1Card {...args} size="md" guillocheVariant="holo-spectrum" />
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
          CYBER CYAN
        </Typography>
        <Id1Card {...args} size="md" guillocheVariant="cyber-cyan" />
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
          SOLARIZED GOLD
        </Typography>
        <Id1Card {...args} size="md" guillocheVariant="solarized-gold" />
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
          COSMIC CRIMSON
        </Typography>
        <Id1Card {...args} size="md" guillocheVariant="cosmic-crimson" />
      </Box>
    </Box>
  ),
};

/**
 * 6. With Custom Content Slots
 * Demonstrates composing custom front and back content inside the card molecule slots.
 */
export const WithCustomContent: Story = {
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
        Click card to flip and inspect front and back content slots
      </Typography>
      <Id1Card
        {...args}
        frontContent={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
              p: 1,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: 2,
                  fontWeight: 900,
                  color: "primary.light",
                }}
              >
                APTISPACE
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                SECURE ACCESS PASS
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: "primary.main",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              ACTIVE
            </Typography>
          </Box>
        }
        backContent={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              gap: 1,
              p: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                letterSpacing: 1.5,
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              AUTHORIZED PERSONNEL ONLY
            </Typography>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 3, fontWeight: 800, color: "primary.light" }}
            >
              ISO/IEC 7810 ID-1
            </Typography>
          </Box>
        }
      />
    </Box>
  ),
};
