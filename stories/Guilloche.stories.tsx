import type { Meta, StoryObj } from "@storybook/react-vite";
import { styled } from "@mui/material/styles";
import Guilloche from "../app/components/atoms/Guilloche/Guilloche";

const meta: Meta<typeof Guilloche> = {
  title: "Atoms/Guilloche",
  component: Guilloche,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Procedural Holographic Guilloche & Rosette Security Generator. Calculates deterministic hypotrochoid rosettes and undulating wave ribbons using multi-octave harmonic noise parameterized by a seed string.",
      },
    },
  },
  argTypes: {
    seed: {
      control: "text",
      description:
        "Deterministic seed string (e.g. Student ID, cryptographic key)",
    },
    variant: {
      control: "select",
      options: [
        "holo-spectrum",
        "solarized-gold",
        "cyber-cyan",
        "deep-space",
        "cosmic-crimson",
      ],
      description: "Color & gradient theme mapped to Solarized tokens",
    },
    density: {
      control: "radio",
      options: ["low", "medium", "high"],
      description: "Step count and curve resolution density",
    },
    showWaves: {
      control: "boolean",
      description: "Show top and bottom wave bands",
    },
    showRosettes: {
      control: "boolean",
      description: "Show central and peripheral rosettes",
    },
    showConcentricRings: {
      control: "boolean",
      description: "Show fine verification rings",
    },
    noiseIntensity: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "Perlin-like harmonic noise perturbation intensity",
    },
    opacity: {
      control: { type: "range", min: 0.1, max: 1, step: 0.05 },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Guilloche>;

const CardCanvas = styled("div")(({ theme }) => ({
  position: "relative",
  width: "540px",
  aspectRatio: "85.6 / 53.98",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 20px 40px rgba(0,0,0,0.6)`,
  overflow: "hidden",
}));

export const HoloSpectrum: Story = {
  args: {
    seed: "APTI-7810-0942",
    variant: "holo-spectrum",
    density: "medium",
    showWaves: true,
    showRosettes: true,
    showConcentricRings: true,
    noiseIntensity: 0.5,
    opacity: 0.6,
  },
  render: (args) => (
    <CardCanvas>
      <Guilloche {...args} />
    </CardCanvas>
  ),
};

export const CyberCyanVariant: Story = {
  args: {
    seed: "APTI-7810-CYBER-99",
    variant: "cyber-cyan",
    density: "high",
    showWaves: true,
    showRosettes: true,
    showConcentricRings: true,
    noiseIntensity: 0.65,
    opacity: 0.7,
  },
  render: (args) => (
    <CardCanvas>
      <Guilloche {...args} />
    </CardCanvas>
  ),
};

export const SolarizedGoldVariant: Story = {
  args: {
    seed: "GOLDEN-SECURITY-SEED-77",
    variant: "solarized-gold",
    density: "medium",
    showWaves: true,
    showRosettes: true,
    showConcentricRings: true,
    noiseIntensity: 0.4,
    opacity: 0.6,
  },
  render: (args) => (
    <CardCanvas>
      <Guilloche {...args} />
    </CardCanvas>
  ),
};

export const CosmicCrimsonVariant: Story = {
  args: {
    seed: "COSMIC-CLEARANCE-OMEGA",
    variant: "cosmic-crimson",
    density: "high",
    showWaves: true,
    showRosettes: true,
    showConcentricRings: true,
    noiseIntensity: 0.7,
    opacity: 0.65,
  },
  render: (args) => (
    <CardCanvas>
      <Guilloche {...args} />
    </CardCanvas>
  ),
};
