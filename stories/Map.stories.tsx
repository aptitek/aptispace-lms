import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import { Map, type MapRef } from "~/components/atoms/Map";

const meta: Meta<typeof Map> = {
  title: "Atoms/Map",
  component: Map,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Atomic Map component powered by react-map-gl and maplibre-gl with built-in Solarized Light and Dark vector tile styling (OpenFreeMap/OpenMapTiles schema), tactical animated radar pin, custom dimensions, ref forwarding for camera controls, and full remote tile provider support (MapTiler, Stadia, Protomaps).",
      },
    },
  },
  argTypes: {
    latitude: {
      control: { type: "number", step: 0.001 },
      description: "Latitude in decimal degrees",
    },
    longitude: {
      control: { type: "number", step: 0.001 },
      description: "Longitude in decimal degrees",
    },
    zoom: {
      control: { type: "number", min: 1, max: 20, step: 0.5 },
      description: "Camera zoom level (default: 14.5)",
    },
    pitch: {
      control: { type: "range", min: 0, max: 85, step: 1 },
      description: "Camera pitch in degrees for 3D oblique tilt (default: 55)",
    },
    bearing: {
      control: { type: "range", min: -180, max: 180, step: 1 },
      description:
        "Camera bearing in degrees for 3D perspective angle (default: -25)",
    },
    themeMode: {
      control: "radio",
      options: ["light", "dark"],
      description:
        "Solarized palette theme mode (auto-resolved from context if undefined)",
    },
    showPin: {
      control: "boolean",
      description: "Whether to display the tactile marker pin",
    },
    pinLabel: {
      control: "text",
      description: "Text badge displayed above the marker pin",
    },
    pinColor: {
      control: "color",
      description: "Marker pin and radar pulse color",
    },
    interactive: {
      control: "boolean",
      description: "Whether user can drag, zoom, and pan the map",
    },
    width: {
      control: "text",
      description: "Container width (e.g. 420, '100%')",
    },
    height: {
      control: "text",
      description: "Container height (e.g. 260, '100%')",
    },
    borderRadius: {
      control: "text",
      description: "Border radius of the container",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    latitude: 48.7118,
    longitude: 2.1698,
    zoom: 14.5,
    pitch: 55,
    bearing: -25,
    pinLabel: "Campus Paris-Saclay",
    pinColor: "var(--color-solarized-green, #859900)",
    width: 440,
    height: 280,
    borderRadius: "16px",
    border: "1px solid rgba(0, 43, 54, 0.15)",
    boxShadow: "0 10px 30px rgba(0, 43, 54, 0.12)",
  },
};

export const Ortho3DView: Story = {
  args: {
    latitude: 48.7118,
    longitude: 2.1698,
    zoom: 14.5,
    pitch: 55,
    bearing: -25,
    pinLabel: "Campus Paris-Saclay (3D Ortho)",
    pinColor: "var(--color-solarized-green, #859900)",
    width: 480,
    height: 320,
    borderRadius: "16px",
    border: "1px solid rgba(0, 43, 54, 0.15)",
    boxShadow: "0 10px 30px rgba(0, 43, 54, 0.12)",
  },
};

export const SolarizedDark: Story = {
  args: {
    latitude: 48.9032,
    longitude: 2.3686,
    zoom: 14.5,
    pitch: 55,
    bearing: -25,
    themeMode: "dark",
    pinLabel: "Campus Condorcet",
    pinColor: "var(--color-solarized-green, #859900)",
    width: 440,
    height: 280,
    borderRadius: "16px",
    border: "1px solid rgba(88, 110, 117, 0.35)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
  },
};

export const CustomPinColor: Story = {
  args: {
    latitude: 48.8472,
    longitude: 2.3563,
    zoom: 16,
    pinLabel: "Campus Pierre et Marie Curie",
    pinColor: "#2aa198",
    width: 440,
    height: 280,
    borderRadius: "16px",
    border: "1px solid rgba(0, 43, 54, 0.15)",
    boxShadow: "0 10px 30px rgba(0, 43, 54, 0.12)",
  },
};

export const WithoutPin: Story = {
  args: {
    latitude: 48.8584,
    longitude: 2.2945,
    zoom: 15,
    showPin: false,
    width: 440,
    height: 280,
    borderRadius: "16px",
    border: "1px solid rgba(0, 43, 54, 0.15)",
    boxShadow: "0 10px 30px rgba(0, 43, 54, 0.12)",
  },
};

export const RemoteStyleUrl: Story = {
  args: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 14,
    mapStyle: "https://tiles.openfreemap.org/styles/positron",
    pinLabel: "Hôtel de Ville de Paris",
    width: 440,
    height: 280,
    borderRadius: "16px",
    border: "1px solid rgba(0, 43, 54, 0.15)",
    boxShadow: "0 10px 30px rgba(0, 43, 54, 0.12)",
  },
};

export const NonInteractivePreview: Story = {
  args: {
    latitude: 48.7118,
    longitude: 2.1698,
    zoom: 16,
    interactive: false,
    pinLabel: "Campus Paris-Saclay (Static)",
    width: 320,
    height: 180,
    borderRadius: "12px",
    border: "1px solid rgba(0, 43, 54, 0.12)",
    boxShadow: "0 4px 16px rgba(0, 43, 54, 0.1)",
  },
};

const ImperativeControlsDemoComponent: React.FC = () => {
  const mapRef = useRef<MapRef | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={() => mapRef.current?.zoomIn()}
        >
          Zoom +
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RemoveRoundedIcon />}
          onClick={() => mapRef.current?.zoomOut()}
        >
          Zoom -
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RestartAltRoundedIcon />}
          onClick={() =>
            mapRef.current?.flyTo({
              center: [2.1698, 48.7118],
              zoom: 16,
            })
          }
        >
          Reset
        </Button>
      </Box>

      <Map
        ref={mapRef}
        latitude={48.7118}
        longitude={2.1698}
        zoom={16}
        pinLabel="Campus Paris-Saclay"
        width={460}
        height={300}
        borderRadius="16px"
        border="1px solid rgba(0, 43, 54, 0.15)"
        boxShadow="0 10px 30px rgba(0, 43, 54, 0.12)"
      />
    </Box>
  );
};

export const ImperativeControlsDemo: Story = {
  render: () => <ImperativeControlsDemoComponent />,
};

export const LoadingSkeleton: Story = {
  args: {
    isLoading: true,
    latitude: 48.7118,
    longitude: 2.1698,
    width: 460,
    height: 300,
  },
};

export const NoWebGLFallback: Story = {
  args: {
    disableWebGL: true,
    latitude: 48.7118,
    longitude: 2.1698,
    pinLabel: "Campus Paris-Saclay",
    width: 460,
    height: 300,
  },
};
