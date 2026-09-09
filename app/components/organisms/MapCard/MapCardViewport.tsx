import React, { useState, useEffect, useRef } from "react";
import type { Variants } from "framer-motion";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import Tooltip from "@mui/material/Tooltip";

import {
  Map,
  type MapRef,
  DEFAULT_MAP_ZOOM,
  DEFAULT_MAP_PITCH,
  DEFAULT_MAP_BEARING,
} from "~/components/atoms/Map";
import { M3_SPRINGS } from "~/tokens/motion";
import type {
  MapCardSize,
  MapCardOrientation,
  MapCoordinates,
} from "./MapCard.types";
import { DEFAULT_CAMPUS_COORDINATES } from "./MapCard.utils";
import {
  MapPerspectiveWrapper,
  UnifiedMapCanvas,
  MapCanvasContainer,
  PaperCreaseLayer,
  CreaseLine,
  MapOverlayControls,
  MapControlButton,
} from "./MapCard.styles";

export interface MapCardViewportProps {
  coordinates?: MapCoordinates;
  zoom?: number;
  pitch?: number;
  bearing?: number;
  size?: MapCardSize;
  orientation?: MapCardOrientation;
  initialFolded?: boolean;
  showControls?: boolean;
  titleOsm?: string;
  mapStyle?: string | object;
  mapWidth?: "narrow" | "standard";
  tileProviderKey?: string;
  pinLabel?: string;
  pinColor?: string;
  roomPinLabel?: string;
  onFoldChange?: (isFolded: boolean) => void;
}

const UNFOLD_VARIANTS: Variants = {
  folded: {
    rotateY: -28,
    rotateX: 6,
    scale: 0.92,
    transformOrigin: "left center",
    transition: M3_SPRINGS.mapFold,
  },
  unfolded: {
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    transformOrigin: "center center",
    transition: M3_SPRINGS.mapUnfold,
  },
};

function normalizeViewportProps(props: MapCardViewportProps) {
  return {
    zoom: props.zoom ?? DEFAULT_MAP_ZOOM,
    pitch: props.pitch ?? DEFAULT_MAP_PITCH,
    bearing: props.bearing ?? DEFAULT_MAP_BEARING,
    size: props.size ?? "medium",
    orientation: props.orientation ?? "horizontal",
    initialFolded: Boolean(props.initialFolded),
    showControls: Boolean(props.showControls),
    titleOsm: props.titleOsm ?? "OpenStreetMap View",
    mapWidth: props.mapWidth ?? "narrow",
  };
}

export function MapCardViewport(props: MapCardViewportProps) {
  const {
    coordinates,
    mapStyle,
    tileProviderKey,
    pinLabel,
    pinColor,
    roomPinLabel,
    onFoldChange,
  } = props;

  const {
    zoom,
    pitch,
    bearing,
    size,
    orientation,
    initialFolded,
    showControls,
    titleOsm,
    mapWidth,
  } = normalizeViewportProps(props);

  const mapRef = useRef<MapRef | null>(null);

  const [isFolded, setIsFolded] = useState<boolean>(true);

  const effectiveCoords = coordinates ?? DEFAULT_CAMPUS_COORDINATES;
  const effectivePinLabel = pinLabel ?? roomPinLabel;

  // Unfolding sequence on mount: starts folded, then unfolds smoothly
  useEffect(() => {
    if (initialFolded) {
      setIsFolded(true);
      return;
    }

    setIsFolded(true);
    const timer = setTimeout(() => {
      setIsFolded(false);
      onFoldChange?.(false);
      setTimeout(() => {
        mapRef.current?.resize();
      }, 750);
      setTimeout(() => {
        mapRef.current?.resize();
      }, 1200);
    }, 300);

    return () => clearTimeout(timer);
  }, [initialFolded, onFoldChange]);

  const handleToggleFold = () => {
    setIsFolded((prev) => {
      const next = !prev;
      onFoldChange?.(next);
      if (!next) {
        setTimeout(() => {
          mapRef.current?.resize();
        }, 750);
        setTimeout(() => {
          mapRef.current?.resize();
        }, 1200);
      }
      return next;
    });
  };

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetZoom = () => {
    mapRef.current?.flyTo({
      center: [effectiveCoords.lon, effectiveCoords.lat],
      zoom,
      pitch,
      bearing,
    });
    setIsFolded(false);
  };

  return (
    <MapPerspectiveWrapper
      $size={size}
      $orientation={orientation}
      $mapWidth={mapWidth}
      data-testid="map-perspective-wrapper"
    >
      <UnifiedMapCanvas
        animate={isFolded ? "folded" : "unfolded"}
        initial="folded"
        variants={UNFOLD_VARIANTS}
        $isFolded={isFolded}
        data-testid="folding-paper-canvas"
        onClick={isFolded ? handleToggleFold : undefined}
      >
        <MapCanvasContainer data-testid="maplibre-container">
          <Map
            ref={mapRef}
            coordinates={effectiveCoords}
            zoom={zoom}
            pitch={pitch}
            bearing={bearing}
            mapStyle={mapStyle}
            tileProviderKey={tileProviderKey}
            pinLabel={effectivePinLabel}
            pinColor={pinColor ?? "var(--color-solarized-green, #859900)"}
            pinAriaLabel={titleOsm}
            interactive={true}
            attributionControl={false}
            width="100%"
            height="100%"
            onLoad={() => {
              setTimeout(() => {
                mapRef.current?.resize();
              }, 200);
              setTimeout(() => {
                mapRef.current?.resize();
              }, 500);
            }}
            data-testid="maplibre-gl-map"
          />
        </MapCanvasContainer>

        <PaperCreaseLayer $isFolded={isFolded} data-testid="paper-crease-layer">
          <CreaseLine $leftPercent={33.33} />
          <CreaseLine $leftPercent={66.66} />
        </PaperCreaseLayer>
      </UnifiedMapCanvas>

      {showControls && (
        <MapOverlayControls data-testid="map-overlay-controls">
          <Tooltip
            title={isFolded ? "Déplier la carte" : "Rejouer le dépliage"}
            arrow
            placement="left"
          >
            <MapControlButton
              onClick={handleToggleFold}
              size="small"
              aria-label="Toggle fold"
              data-testid="btn-toggle-fold"
            >
              <ReplayRoundedIcon sx={{ fontSize: 18 }} />
            </MapControlButton>
          </Tooltip>

          <Tooltip title="Zoom avant" arrow placement="left">
            <MapControlButton
              onClick={handleZoomIn}
              size="small"
              aria-label="Zoom in"
              data-testid="btn-zoom-in"
            >
              <AddRoundedIcon sx={{ fontSize: 18 }} />
            </MapControlButton>
          </Tooltip>

          <Tooltip title="Zoom arrière" arrow placement="left">
            <MapControlButton
              onClick={handleZoomOut}
              size="small"
              aria-label="Zoom out"
              data-testid="btn-zoom-out"
            >
              <RemoveRoundedIcon sx={{ fontSize: 18 }} />
            </MapControlButton>
          </Tooltip>

          <Tooltip title="Réinitialiser" arrow placement="left">
            <MapControlButton
              onClick={handleResetZoom}
              size="small"
              aria-label="Reset zoom"
              data-testid="btn-reset-zoom"
            >
              <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
            </MapControlButton>
          </Tooltip>
        </MapOverlayControls>
      )}
    </MapPerspectiveWrapper>
  );
}

export default MapCardViewport;
