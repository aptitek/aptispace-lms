import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Id1Card from "../app/components/organisms/Id1Card/Id1Card";
import type { Id1CardCredential } from "../app/components/organisms/Id1Card/Id1Card.types";

const meta: Meta<typeof Id1Card> = {
  title: "Organisms/Id1Card",
  component: Id1Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ISO/IEC 7810 ID-1 standard identification credential card (85.60 mm × 53.98 mm, aspect ratio ~1.586). Features EMV microchip contact pads (ISO 7816), contactless RF wave symbol (ISO 14443), holographic optical seal, magnetic stripe (ISO 7811), and 3-line Machine Readable Zone (MRZ).",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["landscape", "portrait"],
      description:
        "Orientation of the ID-1 card (Landscape credit card format vs Portrait security pass)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "responsive"],
      description: "Size preset while maintaining exact ISO/IEC 7810 ratio",
    },
    isFlipped: {
      control: "boolean",
      description:
        "Whether the card is flipped to show the reverse side (magnetic stripe & MRZ)",
    },
    interactive: {
      control: "boolean",
      description: "Enable click-to-flip interaction",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Id1Card>;

export const StandardLandscape: Story = {
  args: {
    orientation: "landscape",
    size: "lg",
    interactive: true,
    showElectronics: true,
    showNfcAntenna: true,
    electronicsFinish: "gold",
    credential: {
      id: "APTI-7810-0942",
      name: "Commander Alex Mercer",
      callSign: "AETH-9042",
      role: "Lead Flight Commander",
      division: "Orbital Flight Dynamics",
      clearanceLevel: "LEVEL-5 COSMIC",
      issueDate: "2026-08",
      expiryDate: "2030-08",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      securityCode: "781",
    },
  },
};

export const DualInterfaceCyanLaser: Story = {
  args: {
    orientation: "landscape",
    size: "lg",
    interactive: true,
    showElectronics: true,
    showNfcAntenna: true,
    electronicsFinish: "cyan-laser",
    credential: {
      id: "APTI-7810-0942",
      name: "Commander Alex Mercer",
      callSign: "AETH-9042",
      role: "Lead Flight Commander",
      division: "Orbital Flight Dynamics",
      clearanceLevel: "LEVEL-5 COSMIC",
      issueDate: "2026-08",
      expiryDate: "2030-08",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      securityCode: "781",
    },
  },
};

export const FlippedMagneticBack: Story = {
  args: {
    orientation: "landscape",
    size: "lg",
    isFlipped: true,
    interactive: true,
    credential: {
      id: "APTI-7810-0942",
      name: "Commander Alex Mercer",
      callSign: "AETH-9042",
      role: "Lead Flight Commander",
      division: "Orbital Flight Dynamics",
      clearanceLevel: "LEVEL-5 COSMIC",
      issueDate: "2026-08",
      expiryDate: "2030-08",
      securityCode: "781",
    },
  },
};

export const PortraitBadge: Story = {
  args: {
    orientation: "portrait",
    size: "md",
    interactive: true,
    credential: {
      id: "APTI-7810-1049",
      name: "Dr. Elena Rostova",
      callSign: "NOVA-9",
      role: "Chief Xenobiologist",
      division: "Astrobiology & Habitats",
      clearanceLevel: "LEVEL-4 SCIENTIFIC",
      issueDate: "2026-08",
      expiryDate: "2030-08",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      securityCode: "942",
    },
  },
};

const EditorContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  maxWidth: "600px",
  width: "100%",
}));

const FormBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(1.5),
  color: theme.palette.text.primary,
  fontSize: "12px",
}));

const FormInput = styled("input")(({ theme }) => ({
  width: "100%",
  padding: "6px 10px",
  borderRadius: "6px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
}));

const FormLabel = styled("label")({
  display: "block",
  marginBottom: "4px",
  fontWeight: 700,
});

const InteractiveEditorComponent = () => {
  const [profile, setProfile] = useState<Id1CardCredential>({
    id: "APTI-7810-8821",
    name: "Cadet Maya Lin",
    callSign: "PHOENIX-7",
    role: "Propulsion Specialist",
    division: "Deep Space Propulsion",
    clearanceLevel: "LEVEL-3 ACTIVE",
    issueDate: "2026-08",
    expiryDate: "2029-08",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    securityCode: "419",
  });

  const [flipped, setFlipped] = useState(false);

  return (
    <EditorContainer>
      <Id1Card
        size="lg"
        credential={profile}
        isFlipped={flipped}
        onFlipChange={setFlipped}
      />

      <FormBox>
        <div>
          <FormLabel>Full Name</FormLabel>
          <FormInput
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <FormLabel>Call Sign</FormLabel>
          <FormInput
            type="text"
            value={profile.callSign}
            onChange={(e) =>
              setProfile({ ...profile, callSign: e.target.value })
            }
          />
        </div>
        <div>
          <FormLabel>Role</FormLabel>
          <FormInput
            type="text"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          />
        </div>
        <div>
          <FormLabel>Clearance Level</FormLabel>
          <FormInput
            type="text"
            value={profile.clearanceLevel}
            onChange={(e) =>
              setProfile({ ...profile, clearanceLevel: e.target.value })
            }
          />
        </div>
      </FormBox>
    </EditorContainer>
  );
};

export const LiveInteractiveEditor: Story = {
  render: () => <InteractiveEditorComponent />,
};
