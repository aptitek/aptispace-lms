import type { Meta, StoryObj } from "@storybook/react-vite";
import { styled } from "@mui/material/styles";
import Electronics from "../app/components/atoms/Electronics/Electronics";

const meta: Meta<typeof Electronics> = {
  title: "Atoms/Electronics",
  component: Electronics,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ISO/IEC 7816 contact smart chip and ISO/IEC 14443 contactless NFC antenna coil layer with exact geometric offsets and perimeter spiral tracks.",
      },
    },
  },
  argTypes: {
    finish: {
      control: "select",
      options: ["gold", "silver", "copper", "cyan-laser"],
      description: "Conductive metal finish mapped to Solarized theme palette",
    },
    showNfcAntenna: {
      control: "boolean",
      description: "Show ISO 14443 outer NFC spiral perimeter antenna",
    },
    showChip: {
      control: "boolean",
      description: "Show ISO 7816-2 contact microchip pad at X=162.5, Y=244.9",
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

export const DualInterfaceGold: Story = {
  args: {
    finish: "gold",
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

export const CyanLaserFinish: Story = {
  args: {
    finish: "cyan-laser",
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
