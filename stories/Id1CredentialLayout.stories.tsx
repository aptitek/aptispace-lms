import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  Id1CredentialLayout,
  FrontCredentialView,
  BackCredentialView,
  DEFAULT_CREDENTIAL,
} from "../app/components/organisms/Id1Card";
import { FRENCH_ID_SAMPLE_HOLDER } from "../app/components/organisms/Id1Card/FrenchIdCard.layout";

const meta: Meta<typeof Id1CredentialLayout> = {
  title: "Organisms/Id1Card/Id1CredentialLayout",
  component: Id1CredentialLayout,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Visual identity layout renderer for ID-1 cards. Supports the standard AptiSpace Cadet layout and the ICAO 9303 compliant French CNIe layout.",
      },
    },
  },
  argTypes: {
    side: {
      control: "radio",
      options: ["front", "back"],
      description: "Active layout side to render",
    },
    layout: {
      control: "radio",
      options: ["aptispace", "french-id"],
      description: "Credential layout format",
    },
    isPortrait: {
      control: "boolean",
      description: "Render in vertical portrait layout",
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

/**
 * 1. AptiSpace Academy Cadet Layout (Front & Back)
 */
export const AptiSpaceCadet: Story = {
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

/**
 * 2. French National Identity Card (CNIe Front & Back)
 */
export const FrenchNationalId: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, p: 2 }}>
      <CardSurfacePreview isPortrait={false}>
        <Id1CredentialLayout
          side="front"
          layout="french-id"
          credential={FRENCH_ID_SAMPLE_HOLDER}
        />
      </CardSurfacePreview>
      <CardSurfacePreview isPortrait={false}>
        <Id1CredentialLayout
          side="back"
          layout="french-id"
          credential={FRENCH_ID_SAMPLE_HOLDER}
        />
      </CardSurfacePreview>
    </Box>
  ),
};

/**
 * 3. Portrait Personnel Badge Layout
 */
export const PortraitLayout: Story = {
  render: () => (
    <CardSurfacePreview isPortrait={true}>
      <FrontCredentialView credential={DEFAULT_CREDENTIAL} isPortrait={true} />
    </CardSurfacePreview>
  ),
};
