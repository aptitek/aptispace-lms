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
      control: { type: "number", min: 10, max: 19, step: 0.5 },
      description: "Map zoom level (default: 14.5)",
    },
    pitch: {
      control: { type: "range", min: 0, max: 85, step: 1 },
      description: "Camera pitch in degrees for 3D tilt (default: 55)",
    },
    bearing: {
      control: { type: "range", min: -180, max: 180, step: 1 },
      description:
        "Camera bearing in degrees for 3D ortho perspective angle (default: -25)",
    },
    pinColor: {
      control: "color",
      description: "Custom pin and pulse color (default: solarized green)",
    },
    mapWidth: {
      control: "radio",
      options: ["narrow", "standard"],
      description: "Viewport width ratio for the map in horizontal orientation",
    },
    mapStyle: {
      control: "text",
      description:
        "Custom MapLibre style JSON specification or remote URL (e.g. MapTiler, Stadia, Protomaps)",
    },
    tileProviderKey: {
      control: "text",
      description: "Optional API key for MapTiler / Protomaps vector tiles",
    },
    editable: {
      control: "boolean",
      description:
        "Enable interactive in-place editing for chips, address, badge, and instructions",
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

export const SolarizedNarrowMap: Story = {
  args: {
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    doorCode: "*4829#",
    accessType: "code",
    instructions:
      "Carte vectorielle MapLibre avec palette Solarized et format étroit.",
    size: "medium",
    orientation: "horizontal",
    mapWidth: "narrow",
    showControls: true,
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
};

export const StandardMapWidth: Story = {
  args: {
    address: "12 Rue de l'Université, 75007 Paris, France",
    campusName: "Sorbonne Innovation Campus",
    buildingName: "Pavillon Poincaré",
    room: "204",
    roomName: "Amphithéâtre Henri Poincaré",
    doorCode: "3920A",
    accessType: "code",
    instructions: "Format standard élargi de la carte vectorielle.",
    size: "medium",
    orientation: "horizontal",
    mapWidth: "standard",
    showControls: true,
    coordinates: { lat: 48.8584, lon: 2.2945 },
  },
};

export const CustomStyleUrlExample: Story = {
  args: {
    address: "4 Place Jussieu, 75005 Paris, France",
    campusName: "Campus Pierre et Marie Curie",
    buildingName: "Tour Zamansky",
    room: "1408",
    accessType: "intercom",
    instructions:
      "Exemple utilisant une URL de style externe (OpenFreeMap, MapTiler, Stadia).",
    size: "medium",
    orientation: "horizontal",
    mapWidth: "narrow",
    mapStyle: "https://tiles.openfreemap.org/styles/positron",
    showControls: true,
    coordinates: { lat: 48.8472, lon: 2.3563 },
  },
};

export const LoadingSkeleton: Story = {
  args: {
    isLoading: true,
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    size: "medium",
    orientation: "horizontal",
  },
};

export const LoadingSkeletonVertical: Story = {
  args: {
    isLoading: true,
    address: "12 Rue de l'Université, 75007 Paris, France",
    campusName: "Sorbonne Innovation Campus",
    buildingName: "Pavillon Poincaré",
    size: "medium",
    orientation: "vertical",
  },
};

export const NoWebGLFallback: Story = {
  args: {
    disableWebGL: true,
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    doorCode: "*4829#",
    accessType: "code",
    instructions:
      "Affichage cartographique 2D de repli lorsque l'accélération matérielle WebGL/OpenGL est indisponible.",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
};

export const NoWebGLFallbackVertical: Story = {
  args: {
    disableWebGL: true,
    address: "12 Rue de l'Université, 75007 Paris, France",
    campusName: "Sorbonne Innovation Campus",
    buildingName: "Pavillon Poincaré",
    room: "204",
    doorCode: "3920A",
    accessType: "code",
    size: "medium",
    orientation: "vertical",
    coordinates: { lat: 48.8584, lon: 2.2945 },
  },
};

function MapCardEditableDemo(cardProps: React.ComponentProps<typeof MapCard>) {
  const [address, setAddress] = React.useState(cardProps.address);
  const [coordinates, setCoordinates] = React.useState(cardProps.coordinates);
  const [campus, setCampus] = React.useState(cardProps.campusName);
  const [building, setBuilding] = React.useState(cardProps.buildingName);
  const [room, setRoom] = React.useState(cardProps.room);
  const [doorCode, setDoorCode] = React.useState(cardProps.doorCode);
  const [hasBadge, setHasBadge] = React.useState(cardProps.hasBadge ?? true);
  const [instructions, setInstructions] = React.useState(cardProps.instructions);

  return (
    <Box sx={{ width: 680, maxWidth: "100%" }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Mode édition : autocomplétion d&apos;adresse avec centrage dynamique de la carte, puces éditables, badge et consignes.
      </Typography>
      <MapCard
        {...cardProps}
        editable
        address={address}
        coordinates={coordinates}
        campusName={campus}
        buildingName={building}
        room={room}
        doorCode={doorCode}
        hasBadge={hasBadge}
        instructions={instructions}
        onAddressChange={setAddress}
        onCoordinatesChange={setCoordinates}
        onCampusChange={setCampus}
        onBuildingChange={setBuilding}
        onRoomChange={setRoom}
        onDoorCodeChange={setDoorCode}
        onBadgeChange={setHasBadge}
        onInstructionsChange={setInstructions}
      />
    </Box>
  );
}

export const EditableMode: Story = {
  args: {
    editable: true,
    address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    campusName: "Campus Paris-Saclay",
    buildingName: "Bâtiment Alan Turing",
    room: "302",
    doorCode: "*4829#",
    hasBadge: true,
    instructions: "Badge RFID requis aux portes vitrées après 18h.",
    size: "medium",
    orientation: "horizontal",
    coordinates: { lat: 48.7118, lon: 2.1698 },
  },
  render: (args) => <MapCardEditableDemo {...args} />,
};

