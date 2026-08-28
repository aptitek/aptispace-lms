import type { Meta, StoryObj } from "@storybook/react-vite";
import OrbitalMissionCard from "../app/components/organisms/OrbitalMissionCard/OrbitalMissionCard";

const meta: Meta<typeof OrbitalMissionCard> = {
  title: "Organisms/OrbitalMissionCard",
  component: OrbitalMissionCard,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["elevated", "filled", "outlined"],
      description: "Material Design 3 Card variant",
    },
    elevation: {
      control: { type: "range", min: 0, max: 5, step: 1 },
      description: "MD3 elevation level",
    },
    height: {
      control: { type: "range", min: 450, max: 800, step: 10 },
      description: "Explicit card height in px",
    },
    holographic: {
      control: { type: "boolean" },
      description: "Enable Deck-FX holographic foil reflection",
    },
    holoVariant: {
      control: { type: "select" },
      options: ["default", "rainbow", "cosmic", "gold"],
      description: "Holographic foil spectrum variant",
    },
    holoStrength: {
      control: { type: "range", min: 0, max: 2, step: 0.05 },
      description: "Intensity of the holographic foil effect",
    },
    progress: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Simulation readiness progress percentage",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrbitalMissionCard>;

/**
 * 1. Default Page-Level Full Sized Card (Elevated with Cosmic Holo)
 * This is the primary standalone hero component rendered on the main page.
 */
export const DefaultFullSizedMission: Story = {
  args: {
    variant: "elevated",
    elevation: 2,
    height: 610,
    holographic: true,
    holoVariant: "cosmic",
    holoStrength: 0.85,
    missionCode: "ASTRO-402",
    title: "Atmospheric Re-entry Vectors & Orbital Sync",
    description:
      "Execute multi-burn deceleration burns and calculate retrograde descent trajectories through the upper thermosphere. Synchronize orbital telemetry with ground telemetry array.",
    progress: 76,
  },
};

/**
 * 2. Gold Edition Holographic Card
 * Rich golden iridescent shimmer variant with elevated surface.
 */
export const GoldEditionHolo: Story = {
  args: {
    variant: "elevated",
    elevation: 3,
    height: 610,
    holographic: true,
    holoVariant: "gold",
    holoStrength: 1.1,
    missionCode: "ASTRO-900",
    title: "Deep Space Astrogation & Gravitational Slingshot",
    description:
      "Master high-speed interplanetary trajectory mechanics using Jovian orbital resonance and relativistic flight adjustments.",
    progress: 92,
  },
};

/**
 * 3. Rainbow Holographic Variant
 * Classic spectrum iridescent foil with vibrant color dispersion.
 */
export const RainbowHoloVariant: Story = {
  args: {
    variant: "elevated",
    elevation: 2,
    height: 610,
    holographic: true,
    holoVariant: "rainbow",
    holoStrength: 0.9,
    missionCode: "EXO-301",
    title: "Exoplanetary Atmospheric Probe Deployment",
    description:
      "Deploy atmospheric sensor canisters into sub-orbital trajectories across gas giant magnetospheres.",
    progress: 45,
  },
};

/**
 * 4. Filled MD3 Variant
 * Tonal container without elevation shadow.
 */
export const FilledVariant: Story = {
  args: {
    variant: "filled",
    elevation: 0,
    height: 610,
    holographic: true,
    holoVariant: "cosmic",
    holoStrength: 0.7,
    missionCode: "SIM-104",
    title: "Orbital Rendezvous & Automated Docking",
    description:
      "Align docking axes with Station Alpha-7 and execute autonomous soft capture docking sequence.",
    progress: 60,
  },
};

/**
 * 5. Outlined MD3 Variant
 * Clean border stroke with crisp structural boundaries.
 */
export const OutlinedVariant: Story = {
  args: {
    variant: "outlined",
    elevation: 0,
    height: 610,
    holographic: true,
    holoVariant: "cosmic",
    holoStrength: 0.75,
    missionCode: "ENG-205",
    title: "Ion Engine Thermal Dispersion & Power Flow",
    description:
      "Monitor magnetic containment fields during maximum continuous thrust burn maneuvers.",
    progress: 84,
  },
};
