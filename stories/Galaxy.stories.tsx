import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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

export const DefaultTheme: Story = {
  render: (args) => (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Galaxy {...args} />
    </div>
  ),
  args: {
    focal: [0.5, 0.5],
    rotation: [1.0, 0.0],
    starSpeed: 0.5,
    density: 1.2,
    speed: 1.0,
    mouseInteraction: true,
    glowIntensity: 0.4,
    mouseRepulsion: true,
    repulsionStrength: 3,
    twinkleIntensity: 0.4,
    rotationSpeed: 0.1,
    transparent: false,
  },
};

const customDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#04040c",
    },
    error: {
      main: "#f44336",
      light: "#ff4d4d",
    },
    warning: {
      main: "#ff944d",
      light: "#ffeb3b",
    },
    common: {
      white: "#f8fafc",
      black: "#04040c",
    },
  },
});

export const CustomMuiThemed: Story = {
  render: (args) => (
    <ThemeProvider theme={customDarkTheme}>
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        <Galaxy {...args} />
      </div>
    </ThemeProvider>
  ),
  args: {
    focal: [0.5, 0.5],
    rotation: [1.0, 0.0],
    starSpeed: 0.8,
    density: 1.8,
    speed: 1.2,
    mouseInteraction: true,
    glowIntensity: 0.6,
    mouseRepulsion: true,
    repulsionStrength: 6,
    twinkleIntensity: 0.5,
    rotationSpeed: 0.15,
    transparent: false,
  },
};

export const TransparentOverLay: Story = {
  render: (args) => (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(180deg, #0b0f19 0%, #1a1f35 100%)",
        position: "relative",
      }}
    >
      <Galaxy {...args} />
    </div>
  ),
  args: {
    focal: [0.5, 0.5],
    rotation: [0.7, 0.7],
    starSpeed: 1.0,
    density: 2.0,
    speed: 1.4,
    mouseInteraction: true,
    glowIntensity: 0.7,
    mouseRepulsion: true,
    repulsionStrength: 4,
    twinkleIntensity: 0.6,
    rotationSpeed: 0.2,
    transparent: true,
  },
};
