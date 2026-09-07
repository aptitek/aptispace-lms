import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import MapCard from "~/components/organisms/MapCard/MapCard";
import CalendarCard from "~/components/organisms/CalendarCard/CalendarCard";
import ClockCard from "~/components/organisms/ClockCard/ClockCard";

const meta: Meta<typeof MapCard> = {
  title: "Organisms/MapCard",
  component: MapCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Redesigned MapCard organism showcasing a prominent segmented chip (Campus | Building | Floor | Room) with individual icons, an optional access segmented chip (Digicode | Badge / Barrier | Instructions), a 3D origami paper unfolding OpenStreetMap viewport, and a footer with full address, copy button, and navigation FloatingActionButton.",
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "Dimensions and density scale of the card",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description:
        "Layout direction (horizontal side-by-side or vertical stacked)",
    },
    chipOrientation: {
      control: "radio",
      options: ["responsive", "horizontal", "vertical"],
      description: "Orientation mode of the wayfinding segmented chip",
    },
    campusName: {
      control: "text",
      description: "Name of the university, school, or campus",
    },
    buildingName: {
      control: "text",
      description: "Building, pavilion, or wing identifier",
    },
    room: {
      control: "text",
      description: "Room code automatically parsed into floor and room number",
    },
    roomName: {
      control: "text",
      description: "Optional custom room title or lecture hall name",
    },
    doorCode: {
      control: "text",
      description: "Keypad entrance code or door PIN",
    },
    accessType: {
      control: "select",
      options: ["code", "badge", "intercom", "key", "open"],
      description: "Type of security entrance barrier",
    },
    instructions: {
      control: "text",
      description: "Supplementary access directions or wayfinding notes",
    },
    address: {
      control: "text",
      description: "Full postal address shown in the bottom footer",
    },
    initialFolded: {
      control: "boolean",
      description: "Whether the paper map starts folded",
    },
    showControls: {
      control: "boolean",
      description: "Whether to display map zoom and fold replay controls",
    },
    zoom: {
      control: { type: "number", min: 10, max: 19, step: 1 },
      description: "OpenStreetMap zoom level",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MapCard>;

export const DefaultClassroom: Story = {
  args: {
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    doorCode: "*4829#",
    accessType: "code",
    instructions:
      "Badge RFID requis aux portes vitrées après 18h. Prendre l'ascenseur B au 3e étage.",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
};

export const NamedAmphitheater: Story = {
  args: {
    address: "12 Rue de l'Université, 75007 Paris, France",
    campusName: "Sorbonne Innovation Campus",
    buildingName: "Pavillon Poincaré",
    room: "204",
    roomName: "Amphithéâtre Henri Poincaré",
    doorCode: "3920A",
    accessType: "code",
    instructions:
      "Composer le code au digicode extérieur puis monter l'escalier d'honneur.",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.8584, lon: 2.2945 },
  },
};

export const BadgeAccessOnly: Story = {
  args: {
    address: "Boulevard Thomas Gobert, 91120 Palaiseau, France",
    campusName: "École Polytechnique Campus",
    buildingName: "Laboratoire Turing & Ada",
    room: "B-214",
    accessType: "badge",
    instructions:
      "Présenter la carte multiservices sur la borne sans contact jusqu'au bip vert.",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.7138, lon: 2.2104 },
  },
};

export const IntercomAccess: Story = {
  args: {
    address: "4 Place Jussieu, 75005 Paris, France",
    campusName: "Campus Pierre et Marie Curie",
    buildingName: "Tour Zamansky",
    room: "1408",
    accessType: "intercom",
    instructions:
      "Sonner à l'interphone 'Accueil Recherche'. Prendre la batterie d'ascenseurs C au 14e étage.",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.8472, lon: 2.3563 },
  },
};

export const GroundFloorOpenAccess: Story = {
  args: {
    address: "28 Rue des Saints-Pères, 75007 Paris, France",
    campusName: "Centre Rive Gauche",
    buildingName: "Aile Desargues",
    room: "004",
    accessType: "open",
    instructions:
      "Accès direct par le hall principal au rez-de-chaussée. Entièrement accessible PMR.",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.8552, lon: 2.3308 },
  },
};

export const InteractiveUnfoldingDemo: Story = {
  args: {
    address: "12 Rue de l'Université, 75007 Paris, France",
    campusName: "Sorbonne Innovation Campus",
    buildingName: "Pavillon Poincaré",
    room: "204",
    doorCode: "3920A",
    accessType: "code",
    instructions:
      "Cliquer sur la carte ou utiliser les contrôles pour observer le pliage origami 3D.",
    initialFolded: true,
    showControls: true,
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.8584, lon: 2.2945 },
  },
};

export const VerticalLayout: Story = {
  args: {
    address: "4 Place Jussieu, 75005 Paris, France",
    campusName: "Campus Jussieu",
    buildingName: "Barre 14-15",
    room: "305",
    doorCode: "*2048#",
    accessType: "code",
    instructions: "Interphone direct avec l'accueil.",
    orientation: "vertical",
    size: "medium",
    coordinates: { lat: 48.8465, lon: 2.355 },
  },
};

export const VerticalSegmentedWayfinding: Story = {
  args: {
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    doorCode: "*4829#",
    accessType: "code",
    instructions: "Badge RFID requis aux portes vitrées.",
    chipOrientation: "vertical",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
};

export const LargeDashboardView: Story = {
  args: {
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    roomName: "Salle de Séminaire 302",
    doorCode: "*4829#",
    accessType: "code",
    instructions:
      "Badge RFID requis aux portes vitrées. Ascenseur B au 3e étage.",
    size: "large",
    orientation: "horizontal",
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
};

export const CompleteClassScheduleTriad: Story = {
  render: () => {
    const baseDate = new Date();
    const startTime = new Date(baseDate.setHours(14, 0, 0, 0));
    const endTime = new Date(baseDate.setHours(16, 30, 0, 0));

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
          width: "100%",
          maxWidth: 880,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, textAlign: "center" }}>
          Class Session Schedule & Wayfinding Triad
        </Typography>

        {/* Date & Time Sheets Header */}
        <Box
          sx={{
            display: "flex",
            gap: 2.5,
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <CalendarCard
            date={baseDate}
            size="medium"
            headerColor="primary"
            showChip
          />
          <ClockCard
            startTime={startTime}
            endTime={endTime}
            size="medium"
            color="primary"
          />
        </Box>

        {/* Location & Wayfinding MapCard */}
        <MapCard
          address="Rue Noetzlin, 91190 Gif-sur-Yvette, France"
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          doorCode="*4829#"
          accessType="code"
          instructions="Badge étudiant requis à l'entrée vitrée. Ascenseur B au 3e étage."
          size="medium"
          orientation="horizontal"
          coordinates={{ lat: 48.7118, lon: 2.1698 }}
        />
      </Box>
    );
  },
};
