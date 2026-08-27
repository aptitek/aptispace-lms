import type { Meta, StoryObj } from "@storybook/react-vite";
import Galaxy from "../app/components/atoms/Galaxy";

const meta = {
  title: "Atoms/Galaxy",
  component: Galaxy,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    focal: {
      control: { type: "object" },
      description:
        "Sets the focal point of the galaxy effect as [x, y] coordinates from 0 to 1",
    },
    rotation: {
      control: { type: "object" },
      description:
        "Controls the rotation matrix of the galaxy as [x, y] rotation values",
    },
    starSpeed: {
      control: { type: "range", min: 0, max: 2, step: 0.05 },
      description: "Controls the speed of star movement and animation",
    },
    density: {
      control: { type: "range", min: 0.1, max: 5, step: 0.1 },
      description: "Controls the density of stars in the galaxy",
    },
    hueShift: {
      control: { type: "range", min: 0, max: 360, step: 1 },
      description:
        "Shifts the hue of all stars by the specified degrees (0-360)",
    },
    disableAnimation: {
      control: "boolean",
      description: "When true, stops all time-based animations",
    },
    speed: {
      control: { type: "range", min: 0, max: 5, step: 0.1 },
      description: "Global speed multiplier for all animations",
    },
    mouseInteraction: {
      control: "boolean",
      description: "Enables or disables mouse interaction with the galaxy",
    },
    glowIntensity: {
      control: { type: "range", min: 0, max: 2, step: 0.05 },
      description: "Controls the intensity of the star glow effect",
    },
    saturation: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description:
        "Controls color saturation of stars (0 = grayscale, 1 = full color)",
    },
    mouseRepulsion: {
      control: "boolean",
      description: "When true, stars are repelled by the mouse cursor",
    },
    twinkleIntensity: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description:
        "Controls how much stars twinkle (0 = no twinkle, 1 = maximum twinkle)",
    },
    rotationSpeed: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "Speed of automatic galaxy rotation",
    },
    repulsionStrength: {
      control: { type: "range", min: 0, max: 10, step: 0.5 },
      description:
        "Strength of mouse repulsion effect when mouseRepulsion is enabled",
    },
    autoCenterRepulsion: {
      control: { type: "range", min: 0, max: 10, step: 0.5 },
      description:
        "Creates repulsion from center of canvas. Overrides mouse repulsion when > 0",
    },
    transparent: {
      control: "boolean",
      description: "Makes the black background transparent, showing only stars",
    },
  },
} satisfies Meta<typeof Galaxy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: args.transparent ? "#0a0a14" : undefined,
      }}
    >
      <Galaxy {...args} />
    </div>
  ),
  args: {
    focal: [0.5, 0.5],
    rotation: [1.0, 0.0],
    starSpeed: 0.5,
    density: 1,
    hueShift: 140,
    disableAnimation: false,
    speed: 1.0,
    mouseInteraction: true,
    glowIntensity: 0.3,
    saturation: 0.0,
    mouseRepulsion: true,
    repulsionStrength: 2,
    twinkleIntensity: 0.3,
    rotationSpeed: 0.1,
    autoCenterRepulsion: 0,
    transparent: true,
  },
};

export const DeepSpaceVibrant: Story = {
  render: (args) => (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#030014",
      }}
    >
      <Galaxy {...args} />
    </div>
  ),
  args: {
    focal: [0.5, 0.5],
    rotation: [1.0, 0.0],
    starSpeed: 0.8,
    density: 1.8,
    hueShift: 240,
    disableAnimation: false,
    speed: 1.2,
    mouseInteraction: true,
    glowIntensity: 0.6,
    saturation: 0.9,
    mouseRepulsion: true,
    repulsionStrength: 6,
    twinkleIntensity: 0.5,
    rotationSpeed: 0.15,
    autoCenterRepulsion: 0,
    transparent: true,
  },
};

export const CosmicVortex: Story = {
  render: (args) => (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#050505",
      }}
    >
      <Galaxy {...args} />
    </div>
  ),
  args: {
    focal: [0.5, 0.5],
    rotation: [0.7, 0.7],
    starSpeed: 1.2,
    density: 2.2,
    hueShift: 310,
    disableAnimation: false,
    speed: 1.5,
    mouseInteraction: true,
    glowIntensity: 0.8,
    saturation: 1.0,
    mouseRepulsion: true,
    repulsionStrength: 4,
    twinkleIntensity: 0.7,
    rotationSpeed: 0.3,
    autoCenterRepulsion: 1.5,
    transparent: true,
  },
};
