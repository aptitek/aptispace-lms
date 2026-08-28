import type { Meta, StoryObj } from "@storybook/react-vite";
import { styled } from "@mui/material/styles";
import MrzZone from "../app/components/atoms/MrzZone/MrzZone";

const meta: Meta<typeof MrzZone> = {
  title: "Atoms/MrzZone",
  component: MrzZone,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ICAO Doc 9303 / ISO/IEC 7810 TD-1 compliant Machine Readable Zone (MRZ) atom with 3-line 30-character optical layout and check-digit validation.",
      },
    },
  },
  argTypes: {
    showValidation: {
      control: "boolean",
      description: "Display ICAO 9303 checksum validation status pill",
    },
    compact: {
      control: "boolean",
      description:
        "Compact padding and font scaling for ID-1 card reverse integration",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MrzZone>;

const PreviewWrapper = styled("div")(({ theme }) => ({
  width: "500px",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: "8px",
  border: `1px solid ${theme.palette.divider}`,
}));

export const DefaultTD1: Story = {
  args: {
    showValidation: true,
    compact: false,
    cardData: {
      documentNumber: "0942",
      surname: "MERCER",
      givenNames: "ALEX",
      birthDate: "950412",
      expiryDate: "300828",
      sex: "M",
      issuingState: "APT",
      nationality: "APT",
    },
  },
  render: (args) => (
    <PreviewWrapper>
      <MrzZone {...args} />
    </PreviewWrapper>
  ),
};

export const CustomLines: Story = {
  args: {
    showValidation: true,
    compact: false,
    lines: [
      "IDUTO5207270M<<<<<<<<<<<<<<<<<",
      "7408122F1204159UTO<<<<<<<<<<<6",
      "ERIKSSON<<ANNA<MARIA<<<<<<<<<<",
    ],
  },
  render: (args) => (
    <PreviewWrapper>
      <MrzZone {...args} />
    </PreviewWrapper>
  ),
};

export const CompactCardReverseFormat: Story = {
  args: {
    showValidation: true,
    compact: true,
    cardData: {
      documentNumber: "7810",
      surname: "ROSTOVA",
      givenNames: "ELENA",
      birthDate: "921105",
      expiryDate: "300828",
      sex: "F",
      issuingState: "APT",
      nationality: "APT",
    },
  },
  render: (args) => (
    <PreviewWrapper>
      <MrzZone {...args} />
    </PreviewWrapper>
  ),
};
