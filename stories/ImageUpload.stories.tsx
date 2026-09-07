import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ImageUpload from "../app/components/molecules/ImageUpload/ImageUpload";

import { ALL_35_M3_SHAPES } from "../app/components/atoms/Avatar";

const meta: Meta<typeof ImageUpload> = {
  title: "Molecules/ImageUpload",
  component: ImageUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Avatar/Image with Image-Only Click-to-Edit Modal mode, on-avatar instant reset badge, drag-and-drop, clipboard paste, URL input, full 35 Expressive Shapes catalog support, and read-only normal avatar support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["inline", "image-only"],
      description:
        "Display mode: inline side-by-side or image-only with modal edit",
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
      description: "MD3 shape preset",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Size preset of the MD3 avatar/image",
    },
    editable: {
      control: "boolean",
      description: "When false, renders as a normal read-only MD3 avatar/image",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

const sampleDefaultUrl =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

export const MD3ImageOnlyModal: Story = {
  args: {
    defaultValue: sampleDefaultUrl,
    mode: "image-only",
    shape: "circular",
    size: "lg",
    name: "Alex Mercer",
    helperText:
      "Click avatar to open simple edit modal. Notice on-avatar reset badge when changed.",
  },
  render: (args) => (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <ImageUpload {...args} />
      <Typography variant="caption" color="text.secondary">
        Image-Only Mode (Click avatar to open modal)
      </Typography>
    </Box>
  ),
};

function OnAvatarResetDemoStory() {
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  );

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Avatar is modified from default. Notice the reset button badge directly
        on the avatar.
      </Typography>
      <ImageUpload
        value={avatarUrl}
        defaultValue={sampleDefaultUrl}
        onChange={(newUrl) => setAvatarUrl(newUrl)}
        mode="image-only"
        size="lg"
        name="Alex Mercer"
      />
    </Box>
  );
}

export const MD3WithOnAvatarResetBadge: Story = {
  render: () => <OnAvatarResetDemoStory />,
};

export const ReadOnlyNormalAvatar: Story = {
  args: {
    value: sampleDefaultUrl,
    editable: false,
    shape: "circular",
    size: "lg",
    name: "Commander Shepard",
  },
  render: (args) => (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <ImageUpload {...args} />
      <Typography variant="caption" color="text.secondary">
        ReadOnly Mode: standard pristine MD3 avatar
      </Typography>
    </Box>
  ),
};

export const MD3InitialsFallback: Story = {
  args: {
    value: "",
    defaultValue: "",
    name: "Alex Mercer",
    shape: "circular",
    size: "lg",
    mode: "image-only",
  },
  render: (args) => (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <ImageUpload {...args} />
      <Typography variant="caption" color="text.secondary">
        Initials Fallback (AM) with Click-to-Edit Modal
      </Typography>
    </Box>
  ),
};

export const InlineUnifiedMode: Story = {
  args: {
    defaultValue: sampleDefaultUrl,
    mode: "inline",
    shape: "rounded",
    size: "md",
    name: "Alex Mercer",
    label: "Profile Photo",
    helperText: "Drag & drop image, paste, enter URL, or click upload to R2.",
  },
  render: (args) => (
    <Box sx={{ width: "500px", maxWidth: "100%", p: 2 }}>
      <ImageUpload {...args} />
    </Box>
  ),
};

export const BiometricBadgePortrait: Story = {
  args: {
    defaultValue: sampleDefaultUrl,
    mode: "inline",
    shape: "biometric",
    size: "md",
    label: "ISO/IEC 7810 ID-1 Biometric Avatar",
  },
  render: (args) => (
    <Box sx={{ width: "480px", maxWidth: "100%", p: 2 }}>
      <ImageUpload {...args} />
    </Box>
  ),
};

export const LandscapeLogoMode: Story = {
  args: {
    mode: "image-only",
    defaultValue: "/aptitek-logo.svg",
    name: "Aptitek Institute",
    shape: "landscape",
    size: "lg",
    width: "100%",
    height: 80,
    objectFit: "contain",
    editable: true,
  },
  render: (args) => (
    <Box sx={{ width: 320, p: 2 }}>
      <ImageUpload {...args} />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1, textAlign: "center" }}
      >
        Landscape Logo Mode (as used in InstitutionInspector)
      </Typography>
    </Box>
  ),
};
