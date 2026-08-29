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
          "ISO/IEC 7810 ID-1 standard credential card ($85.60\\text{ mm} \\times 53.98\\text{ mm}$) featuring 3D flip physics, procedural Guilloche security curves, targeted holographic foil, and embedded electronics.",
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
      description: "Card layout orientation",
      table: { category: "Geometry & Material" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "responsive"],
      description: "Predefined standard dimension preset",
      table: { category: "Geometry & Material" },
    },
    transparent: {
      control: "boolean",
      description: "Glassmorphic transparent acrylic substrate with reverse ghosting",
      table: { category: "Geometry & Material" },
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
      description: "Render embedded security electronics layer (chip + NFC coil)",
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
    layout: {
      control: "select",
      options: ["aptispace", "french-id"],
      description: "Credential template format (AptiSpace Cadet or French CNIe)",
      table: { category: "Credential Content" },
    },
    credential: {
      control: "object",
      description: "Credential identity payload",
      table: { category: "Credential Content" },
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

const FRENCH_CREDENTIAL = {
  surname: "DUPONT",
  givenNames: "JULIE MARIE",
  sex: "F",
  nationality: "FRA",
  dateOfBirth: "15.03.1990",
  placeOfBirth: "PARIS (75)",
  documentNumber: "21AA12345",
  expiryDate: "15.03.2030",
  can: "123456",
  height: "1,75 m",
  address: "12 RUE DE LA PAIX\n75001 PARIS",
  issueDate: "16.03.2020",
  authority: "PRÉFECTURE DE POLICE",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
};

/**
 * 1. Interactive 3D Card (Default)
 * Click to flip between front credential and reverse magnetic stripe / MRZ zone.
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
 * 2. Side-by-Side Dual View
 * Simultaneous inspection of front identity face and reverse security face.
 */
export const SideBySide: Story = {
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
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
          FRONT (CREDENTIAL &amp; CHIP)
        </Typography>
        <Id1Card {...args} side="front" enableFlip={false} size="md" />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
          BACK (MAGSTRIPE &amp; MRZ)
        </Typography>
        <Id1Card {...args} side="back" enableFlip={false} size="md" />
      </Box>
    </Box>
  ),
};

/**
 * 3. Transparent Acrylic Substrate
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
 * 4. Portrait Personnel Badge
 * Vertical ID format with vertical (X-axis) 3D flip physics.
 */
export const PortraitBadge: Story = {
  args: {
    orientation: "portrait",
    flipDirection: "vertical",
    flipOnClick: true,
    size: "md",
    guillocheVariant: "solarized-gold",
  },
};

/**
 * 5. French National Identity Card (CNIe)
 * Official French national identity format complying with ICAO 9303 and ISO/IEC 7810.
 */
export const FrenchNationalId: Story = {
  args: {
    layout: "french-id",
    side: "front",
    flipOnClick: true,
    electronicsFinish: "silver",
    guillocheVariant: "cyber-cyan",
    credential: FRENCH_CREDENTIAL,
  },
};

/**
 * 6. Physical Security Substrate (Blank)
 * Security substrate without credential data, showing pure holographic foil, guilloche rosettes, and smart chip.
 */
export const PhysicalSubstrate: Story = {
  args: {
    showGlare: true,
    holographic: true,
    showElectronics: true,
    showGuilloche: true,
    flipOnClick: true,
    content: null,
  },
};
