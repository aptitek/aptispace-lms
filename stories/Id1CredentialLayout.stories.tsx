import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  Id1CredentialLayout,
  FrontCredentialView,
  BackCredentialView,
  DEFAULT_CREDENTIAL,
} from "../app/components/organisms/Id1Card";

const meta: Meta<typeof Id1CredentialLayout> = {
  title: "Organisms/Id1Card/Id1CredentialLayout",
  component: Id1CredentialLayout,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**ID-1 Credential Visual Template (Identity Layout)**

Dedicated template component rendering the front and back face identity layouts:
- **Front Layout**: Full-sized ISO/IEC 19794-5:2011 biometric portrait avatar (35mm x 45mm, 7:9 ratio), Academy insignia header, clearance badge, cadet name, callsign, and metadata grid.
- **Back Layout**: ISO 7810 magnetic stripe bar, authorization signature panel with security code, and ICAO 9303 TD1 3-line MRZ machine readable zone.
- Designed to plug directly into \`Id1Card\` or function as a standalone credential layout preview.
        `,
      },
    },
  },
  argTypes: {
    side: {
      control: "radio",
      options: ["front", "back"],
      description: "Card face side to render",
    },
    isPortrait: {
      control: "boolean",
      description: "Render for portrait orientation",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Id1CredentialLayout>;

const CardSurfacePreview = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    position: "relative",
    width: isPortrait ? "280px" : "440px",
    aspectRatio: isPortrait ? "53.98 / 85.60" : "85.60 / 53.98",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "16px",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `0 16px 36px rgba(0,0,0,0.35)`,
    padding: theme.spacing(2),
    boxSizing: "border-box",
    overflow: "hidden",
  }),
);

export const FrontLandscape: Story = {
  args: {
    side: "front",
    isPortrait: false,
    credential: DEFAULT_CREDENTIAL,
  },
  render: (args) => (
    <CardSurfacePreview isPortrait={false}>
      <FrontCredentialView {...args} />
    </CardSurfacePreview>
  ),
};

export const BackLandscape: Story = {
  args: {
    side: "back",
    isPortrait: false,
    credential: DEFAULT_CREDENTIAL,
  },
  render: (args) => (
    <CardSurfacePreview isPortrait={false}>
      <BackCredentialView {...args} />
    </CardSurfacePreview>
  ),
};

export const FrontPortrait: Story = {
  args: {
    side: "front",
    isPortrait: true,
    credential: DEFAULT_CREDENTIAL,
  },
  render: (args) => (
    <CardSurfacePreview isPortrait={true}>
      <FrontCredentialView {...args} />
    </CardSurfacePreview>
  ),
};

export const SideBySideComparison: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, p: 2 }}>
      <CardSurfacePreview isPortrait={false}>
        <FrontCredentialView credential={DEFAULT_CREDENTIAL} />
      </CardSurfacePreview>
      <CardSurfacePreview isPortrait={false}>
        <BackCredentialView credential={DEFAULT_CREDENTIAL} />
      </CardSurfacePreview>
    </Box>
  ),
};
