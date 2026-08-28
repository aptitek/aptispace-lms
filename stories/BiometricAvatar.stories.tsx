import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import BiometricAvatar from "../app/components/atoms/BiometricAvatar/BiometricAvatar";

const meta: Meta<typeof BiometricAvatar> = {
  title: "Atoms/BiometricAvatar",
  component: BiometricAvatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ISO/IEC 19794-5:2011 standard full-sized biometric portrait avatar (35mm x 45mm, 7:9 aspect ratio) with optical framing reticle.",
      },
    },
  },
  argTypes: {
    src: {
      control: "text",
      description: "Image URL for the biometric portrait",
    },
    alt: {
      control: "text",
      description: "Accessible image description",
    },
    isPortrait: {
      control: "boolean",
      description: "Render inside portrait-oriented container",
    },
    showReticle: {
      control: "boolean",
      description: "Show biometric corner alignment HUD brackets",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BiometricAvatar>;

const sampleAvatarUrl =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

export const Default: Story = {
  args: {
    src: sampleAvatarUrl,
    alt: "Cadet Alex Mercer",
    showReticle: true,
    height: "220px",
  },
  render: (args) => (
    <Box sx={{ p: 2 }}>
      <BiometricAvatar {...args} />
    </Box>
  ),
};

export const WithoutReticle: Story = {
  args: {
    src: sampleAvatarUrl,
    alt: "Cadet Alex Mercer",
    showReticle: false,
    height: "220px",
  },
  render: (args) => (
    <Box sx={{ p: 2 }}>
      <BiometricAvatar {...args} />
    </Box>
  ),
};

export const FallbackIcon: Story = {
  args: {
    showReticle: true,
    height: "220px",
  },
  render: (args) => (
    <Box sx={{ p: 2 }}>
      <BiometricAvatar {...args} />
    </Box>
  ),
};
