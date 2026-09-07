import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HoloDecorator from "~/components/molecules/HoloDecorator/HoloDecorator";

const meta = {
  title: "Molecules/HoloDecorator",
  component: HoloDecorator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    active: { control: "boolean" },
    type: {
      control: "radio",
      options: ["text", "image"],
    },
  },
  args: {
    children: <span>Holo</span>,
  },
} satisfies Meta<typeof HoloDecorator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextHolo: Story = {
  render: () => (
    <Box
      className="physics-card"
      sx={{
        p: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <HoloDecorator active={true} type="text">
        <Typography
          variant="h3"
          sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
        >
          APTISPACE LMS
        </Typography>
      </HoloDecorator>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Holographic metallic reflection on headline text
      </Typography>
    </Box>
  ),
};

export const ImageMaskHolo: Story = {
  render: () => (
    <Box
      className="physics-card"
      sx={{
        p: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <HoloDecorator
        active={true}
        type="image"
        maskUrl="/aptitek-logo.svg"
        maskSize="contain"
      >
        <Box
          component="img"
          src="/aptitek-logo.svg"
          alt="Aptitek Logo"
          sx={{ height: 48, maxWidth: 180, display: "block" }}
        />
      </HoloDecorator>
      <Typography variant="body2" color="text.secondary">
        Holographic SVG mask overlay reflecting across the card surface
      </Typography>
    </Box>
  ),
};

export const InactiveComparison: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 3, p: 2 }}>
      <Box sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 2 }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, fontWeight: 700 }}
        >
          Holo Inactive:
        </Typography>
        <HoloDecorator active={false} type="text">
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            STANDARD TEXT
          </Typography>
        </HoloDecorator>
      </Box>

      <Box
        className="physics-card"
        sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 2 }}
      >
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, fontWeight: 700 }}
        >
          Holo Active:
        </Typography>
        <HoloDecorator active={true} type="text">
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            HOLO SHEEN TEXT
          </Typography>
        </HoloDecorator>
      </Box>
    </Box>
  ),
};
