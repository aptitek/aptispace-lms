import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import MapSheet from "~/components/organisms/MapSheet/MapSheet";
import CalendarSheet from "~/components/organisms/CalendarSheet/CalendarSheet";
import TimeSheet from "~/components/organisms/TimeSheet/TimeSheet";

const meta: Meta<typeof MapSheet> = {
  title: "Organisms/MapSheet",
  component: MapSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MapSheet molecule displaying OpenStreetMap (OSM) locations with an authentic 3D accordion paper map unfolding animation on load, alongside step-by-step wayfinding itinerary info (Campus, Building, Floor & Room Chip e.g. 302 = (3 | 02), and door code / access instructions).",
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "Dimensions and density of the map card",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Layout alignment (side-by-side or stacked)",
    },
    room: {
      control: "text",
      description: "Room code automatically parsed into floor and room chip",
    },
    roomName: {
      control: "text",
      description:
        "Optional custom room name or lecture hall title (e.g. Amphithéâtre Alan Turing)",
    },
    doorCode: {
      control: "text",
      description: "Keycode or door entry PIN",
    },
    accessType: {
      control: "select",
      options: ["code", "badge", "intercom", "key", "open"],
      description: "Type of security access barrier",
    },
    initialFolded: {
      control: "boolean",
      description: "Whether the paper map begins in folded accordion state",
    },
    allowFoldToggle: {
      control: "boolean",
      description: "Display fold/unfold replay button on the toolbar",
    },
    mode: {
      control: "radio",
      options: ["compact", "extended"],
      description:
        "Display mode: compact with wayfinding chips or extended full map",
    },
    extendedView: {
      control: "radio",
      options: ["full", "split"],
      description:
        "Layout style in extended mode: full map with overlay or side-by-side split view",
    },
    allowModeToggle: {
      control: "boolean",
      description: "Display mode toggle expand/collapse button on the toolbar",
    },
    showControls: {
      control: "boolean",
      description: "Display floating map zoom and fold controls",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MapSheet>;

export const DefaultClassroom: Story = {
  args: {
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    doorCode: "*4829#",
    instructions:
      "Badge RFID requis aux portes vitrées après 18h. Prendre l'ascenseur B au 3e étage, salle sur la droite.",
    accessType: "code",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
};

export const NamedAmphitheater: Story = {
  args: {
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    roomName: "Amphithéâtre Alan Turing",
    floor: 3,
    doorCode: "*4829#",
    instructions:
      "Badge RFID requis aux portes vitrées après 18h. Prendre l'ascenseur B au 3e étage.",
    accessType: "code",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
};

export const InteractiveUnfoldingDemo: Story = {
  args: {
    address: "12 Rue de l'Université, 75007 Paris, France",
    campusName: "Sorbonne Innovation Campus",
    buildingName: "Pavillon Poincaré",
    room: "204",
    doorCode: "3920A",
    instructions: "Composer le code au digicode extérieur puis appuyer sur V.",
    initialFolded: true,
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.8584, lon: 2.2945 },
  },
};

export const GroundFloorRoom: Story = {
  args: {
    address: "28 Rue des Saints-Pères, 75007 Paris, France",
    campusName: "Centre Rive Gauche",
    buildingName: "Aile Desargues",
    room: "004",
    doorCode: "#1029",
    instructions:
      "Accès direct par le hall principal au rez-de-chaussée. Accessible PMR.",
    accessType: "code",
    size: "medium",
    coordinates: { lat: 48.8552, lon: 2.3308 },
  },
};

export const HighRiseTowerRoom: Story = {
  args: {
    address: "Place Jussieu, 75005 Paris, France",
    campusName: "Campus Pierre et Marie Curie",
    buildingName: "Tour Zamansky",
    room: "1408",
    doorCode: "*9012#",
    instructions:
      "Prendre la batterie d'ascenseurs C (étages 10 à 24). Salle 08 en sortant à gauche.",
    accessType: "code",
    size: "medium",
    coordinates: { lat: 48.8472, lon: 2.3563 },
  },
};

export const BadgeAccessInstruction: Story = {
  args: {
    address: "Boulevard Thomas Gobert, 91120 Palaiseau, France",
    campusName: "École Polytechnique Campus",
    buildingName: "Laboratoire Turing & Ada",
    room: "B-214",
    doorCode: "BADGE-ONLY",
    instructions:
      "Présenter la carte multiservices sur la borne sans contact jusqu'au bip vert.",
    accessType: "badge",
    size: "medium",
    coordinates: { lat: 48.7138, lon: 2.2104 },
  },
};

export const CompactVertical: Story = {
  args: {
    address: "4 Place Jussieu, 75005 Paris",
    campusName: "Campus Jussieu",
    buildingName: "Barre 14-15",
    room: "305",
    doorCode: "*2048#",
    instructions: "Interphone direct avec l'accueil.",
    accessType: "intercom",
    orientation: "vertical",
    size: "small",
    coordinates: { lat: 48.8465, lon: 2.355 },
  },
};

export const VerticalViewWithHorizontalTrack: Story = {
  args: {
    address: "4 Place Jussieu, 75005 Paris, France",
    campusName: "Campus Pierre et Marie Curie",
    buildingName: "Barre 14-15",
    room: "305",
    doorCode: "*2048#",
    instructions: "Interphone direct avec l'accueil au rez-de-chaussée.",
    accessType: "intercom",
    orientation: "vertical",
    size: "medium",
    coordinates: { lat: 48.8465, lon: 2.355 },
  },
};

export const FrenchLocalized: Story = {
  args: {
    address: "Campus Universitaire, 91400 Orsay, France",
    campusName: "Faculté des Sciences d'Orsay",
    buildingName: "Bâtiment 333 (Informatique)",
    room: "302",
    doorCode: "*3821#",
    instructions:
      "Ascenseur nord jusqu'au 3ème étage. Digicode requis en dehors des heures de cours.",
    locale: "fr",
    size: "medium",
    coordinates: { lat: 48.7001, lon: 2.1754 },
  },
};

export const ExtendedModeFullMap: Story = {
  args: {
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    doorCode: "*4829#",
    instructions:
      "Badge RFID requis aux portes vitrées. Ascenseur B au 3e étage.",
    accessType: "code",
    mode: "extended",
    extendedView: "full",
    allowModeToggle: true,
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
};

export const ExtendedModeSplitView: Story = {
  args: {
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    doorCode: "*4829#",
    instructions:
      "Badge RFID requis aux portes vitrées. Ascenseur B au 3e étage.",
    accessType: "code",
    mode: "extended",
    extendedView: "split",
    allowModeToggle: true,
    size: "medium",
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
          maxWidth: 920,
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
          <CalendarSheet
            date={baseDate}
            size="medium"
            headerColor="primary"
            showChip
          />
          <TimeSheet
            startTime={startTime}
            endTime={endTime}
            size="medium"
            color="primary"
          />
        </Box>

        {/* Location & Wayfinding MapSheet */}
        <MapSheet
          address="Rue Noetzlin, 91190 Gif-sur-Yvette, France"
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          doorCode="*4829#"
          instructions="Badge étudiant requis à l'entrée vitrée. Ascenseur B au 3e étage."
          size="medium"
          orientation="horizontal"
          coordinates={{ lat: 48.7118, lon: 2.1698 }}
        />
      </Box>
    );
  },
};
