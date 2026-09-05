import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "../app/components/atoms/Avatar";
import { ALL_35_M3_SHAPES, M3_EXPRESSIVE_CATALOG } from "../app/tokens/shapes";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Universal Material Design 3 Avatar supporting the complete catalog of 35 Expressive Shapes (Circle, Square, Slanted, Arch, Semicircle, Oval, Pill, Triangle, Arrow, Fan, Diamond, Clamshell, Pentagon, Gem, Very sunny, Sunny, Cookies, Clovers, Bursts, Booms, Flower, Puffy, Ghost, Pixels, Bun, Heart) and standard scale tokens.",
      },
    },
  },
  argTypes: {
    src: {
      control: "text",
      description: "Image URL for the avatar portrait",
    },
    alt: {
      control: "text",
      description: "Accessible image description",
    },
    shape: {
      control: "select",
      options: [
        ...ALL_35_M3_SHAPES,
        "none",
        "extra-small",
        "small",
        "medium",
        "large",
        "extra-large",
        "full",
        "cut",
        "asymmetric",
        "biometric",
      ],
      description: "MD3 Shape preset",
    },
    showReticle: {
      control: "boolean",
      description: "Show biometric corner alignment HUD brackets",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const sampleAvatarUrl =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

export const Default: Story = {
  args: {
    src: sampleAvatarUrl,
    alt: "Alex Mercer",
    shape: "medium",
    height: "140px",
  },
  render: (args) => (
    <Box sx={{ p: 2 }}>
      <Avatar {...args} />
    </Box>
  ),
};

export const BiometricPortrait: Story = {
  args: {
    src: sampleAvatarUrl,
    alt: "Alex Mercer",
    shape: "biometric",
    showReticle: true,
    height: "180px",
  },
  render: (args) => (
    <Box sx={{ p: 2 }}>
      <Avatar {...args} />
    </Box>
  ),
};

export const Complete35ExpressiveShapesCatalog: Story = {
  render: () => {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 3,
          p: 3,
          maxWidth: 900,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "background.paper" : "#f1f0f7",
          borderRadius: 4,
        }}
      >
        {ALL_35_M3_SHAPES.map((shapeKey: string) => {
          const def = M3_EXPRESSIVE_CATALOG[shapeKey];
          const label = def?.label ?? shapeKey;

          return (
            <Box
              key={shapeKey}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "background.default"
                    : "#ffffff",
                boxShadow: 1,
              }}
            >
              <Avatar
                src={sampleAvatarUrl}
                alt={label}
                shape={shapeKey}
                height="90px"
                width="90px"
              />
              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: "text.primary",
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  },
};

export const HeartShape: Story = {
  args: {
    src: sampleAvatarUrl,
    alt: "Heart Avatar",
    shape: "heart",
    height: "140px",
    width: "140px",
  },
};

export const FlowerShape: Story = {
  args: {
    src: sampleAvatarUrl,
    alt: "Flower Avatar",
    shape: "flower",
    height: "140px",
    width: "140px",
  },
};

export const PixelCircleShape: Story = {
  args: {
    src: sampleAvatarUrl,
    alt: "Pixel Circle Avatar",
    shape: "pixel-circle",
    height: "140px",
    width: "140px",
  },
};

export const GhostIshShape: Story = {
  args: {
    src: sampleAvatarUrl,
    alt: "Ghost-ish Avatar",
    shape: "ghost-ish",
    height: "140px",
    width: "140px",
  },
};
