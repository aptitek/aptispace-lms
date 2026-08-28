import type { Meta, StoryObj } from "@storybook/react-vite";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Electronics from "../app/components/atoms/Electronics/Electronics";

const meta: Meta<typeof Electronics> = {
  title: "Atoms/Electronics",
  component: Electronics,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**ISO/IEC 7816 Smart Card Chip & ISO/IEC 14443 NFC Antenna Coil Layer**

- **Front Contact View**: Standard ISO 7816 8-pin contact pads (C1-C8) with isolation grooves.
- **Back Encapsulated Die View**: Reverse silicon die encapsulation module (milled cavity pocket, black epoxy globe, central silicon microcontroller die, and gold wire bonding leads).
- **Physical Symmetry**: Symmetrical horizontal flip between front (left-aligned) and back (right-aligned), matching the exact spatial volume inside the plastic substrate.
- **Optional Toggles**: Toggle individual antenna coils, inner coupling inductors, or chip modules.
        `,
      },
    },
  },
  argTypes: {
    finish: {
      control: "select",
      options: ["gold", "silver", "copper", "cyan-laser"],
      description: "Conductive metal finish mapped to theme palette",
    },
    side: {
      control: "radio",
      options: ["front", "back"],
      description: "Card side (Front contact pads or Back encapsulated die)",
    },
    chipView: {
      control: "select",
      options: ["front", "back", "none"],
      description: "Explicit chip view override",
    },
    showNfcAntenna: {
      control: "boolean",
      description: "Show ISO 14443 outer NFC spiral perimeter antenna",
    },
    showChip: {
      control: "boolean",
      description: "Show smart microchip module",
    },
    showInnerCoil: {
      control: "boolean",
      description: "Show inner inductive coupling coil",
    },
    opacity: {
      control: { type: "range", min: 0.1, max: 1, step: 0.05 },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Electronics>;

const CardPreviewHolder = styled("div")(({ theme }) => ({
  position: "relative",
  width: "540px",
  aspectRatio: "85.6 / 53.98",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
  overflow: "hidden",
}));

export const FrontContactPads: Story = {
  args: {
    finish: "gold",
    side: "front",
    showNfcAntenna: true,
    showChip: true,
    showInnerCoil: true,
    opacity: 0.9,
  },
  render: (args) => (
    <CardPreviewHolder>
      <Electronics {...args} />
    </CardPreviewHolder>
  ),
};

export const BackEncapsulatedDie: Story = {
  args: {
    finish: "gold",
    side: "back",
    showNfcAntenna: true,
    showChip: true,
    showInnerCoil: true,
    opacity: 0.9,
  },
  render: (args) => (
    <CardPreviewHolder>
      <Electronics {...args} />
    </CardPreviewHolder>
  ),
};

export const SideBySideElectronicsSymmetry: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, p: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: "text.secondary" }}
        >
          FRONT ELECTRONICS (CONTACT PADS ON LEFT)
        </Typography>
        <CardPreviewHolder sx={{ width: "420px" }}>
          <Electronics side="front" finish="gold" opacity={0.9} />
        </CardPreviewHolder>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: "text.secondary" }}
        >
          BACK ELECTRONICS (ENCAPSULATED DIE ON RIGHT)
        </Typography>
        <CardPreviewHolder sx={{ width: "420px" }}>
          <Electronics side="back" finish="gold" opacity={0.9} />
        </CardPreviewHolder>
      </Box>
    </Box>
  ),
};

export const CyanLaserFinish: Story = {
  args: {
    finish: "cyan-laser",
    side: "front",
    showNfcAntenna: true,
    showChip: true,
    showInnerCoil: true,
    opacity: 0.95,
  },
  render: (args) => (
    <CardPreviewHolder>
      <Electronics {...args} />
    </CardPreviewHolder>
  ),
};

export const CopperFinish: Story = {
  args: {
    finish: "copper",
    side: "front",
    showNfcAntenna: true,
    showChip: true,
    showInnerCoil: true,
    opacity: 0.9,
  },
  render: (args) => (
    <CardPreviewHolder>
      <Electronics {...args} />
    </CardPreviewHolder>
  ),
};

export const NfcAntennaOnly: Story = {
  args: {
    finish: "gold",
    side: "front",
    showNfcAntenna: true,
    showChip: false,
    showInnerCoil: true,
    opacity: 0.85,
  },
  render: (args) => (
    <CardPreviewHolder>
      <Electronics {...args} />
    </CardPreviewHolder>
  ),
};
