import React, { useRef, type RefObject } from "react";
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
import { M3_SPRINGS, M3_MOTION_DURATIONS } from "~/tokens/motion";
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
  AccordionOverlay,
  MapOverlayControls,
  MapControlButton,
} from "./MapCard.styles";
import { AccordionPaperGL } from "./AccordionPaperGL";
import { useUnfoldLifecycle } from "./useUnfoldLifecycle";

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

// Zoom remains strictly consistent by maintaining scale: 1 across both states
const CANVAS_VARIANTS: Variants = {
  folded: {
    rotateX: 0,
    scale: 1,
    transformOrigin: "center center",
    transition: M3_SPRINGS.mapFold,
  },
  unfolded: {
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

interface AccordionOverlayContainerProps {
  isFolded: boolean;
  showOverlay: boolean;
  snapshotUrl: string | null;
  onUnfoldDone: () => void;
  onClick?: () => void;
}

const AccordionOverlayContainer: React.FC<AccordionOverlayContainerProps> = ({
  isFolded,
  showOverlay,
  snapshotUrl,
  onUnfoldDone,
  onClick,
}) => {
  if (!showOverlay) {
    return null;
  }

  const pointerEvents = isFolded ? "auto" : "none";

  return (
    <AccordionOverlay
      initial={false}
      animate={{ opacity: showOverlay ? 1 : 0 }}
      transition={{ duration: M3_MOTION_DURATIONS.s.medium1 }}
      $pointerEvents={pointerEvents}
      data-testid="accordion-overlay"
    >
      <AccordionPaperGL
        isFolded={isFolded}
        snapshotUrl={snapshotUrl}
        onUnfoldDone={onUnfoldDone}
        onClick={onClick}
      />
    </AccordionOverlay>
  );
};

interface MapControlsProps {
  isFolded: boolean;
  mapRef: RefObject<MapRef | null>;
  onToggleFold: () => void;
  onResetZoom: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  isFolded,
  mapRef,
  onToggleFold,
  onResetZoom,
}) => {
  const toggleTooltip = isFolded ? "Déplier la carte" : "Rejouer le dépliage";

  return (
    <MapOverlayControls data-testid="map-overlay-controls">
      <Tooltip title={toggleTooltip} arrow placement="left">
        <MapControlButton
          onClick={onToggleFold}
          size="small"
          aria-label="Toggle fold"
          data-testid="btn-toggle-fold"
        >
          <ReplayRoundedIcon sx={{ fontSize: 18 }} />
        </MapControlButton>
      </Tooltip>

      <Tooltip title="Zoom avant" arrow placement="left">
        <MapControlButton
          onClick={() => mapRef.current?.zoomIn()}
          size="small"
          aria-label="Zoom in"
          data-testid="btn-zoom-in"
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
        </MapControlButton>
      </Tooltip>

      <Tooltip title="Zoom arrière" arrow placement="left">
        <MapControlButton
          onClick={() => mapRef.current?.zoomOut()}
          size="small"
          aria-label="Zoom out"
          data-testid="btn-zoom-out"
        >
          <RemoveRoundedIcon sx={{ fontSize: 18 }} />
        </MapControlButton>
      </Tooltip>

      <Tooltip title="Réinitialiser" arrow placement="left">
        <MapControlButton
          onClick={onResetZoom}
          size="small"
          aria-label="Reset zoom"
          data-testid="btn-reset-zoom"
        >
          <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
        </MapControlButton>
      </Tooltip>
    </MapOverlayControls>
  );
};

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
  const effectiveCoords = coordinates ?? DEFAULT_CAMPUS_COORDINATES;
  const effectivePinLabel = pinLabel ?? roomPinLabel;

  const currentPinColor = pinColor ?? "var(--color-solarized-green, #859900)";

  const {
    isFolded,
    hasMovedTo3D,
    showOverlay,
    snapshotUrl,
    handleUnfoldDone,
    handleToggleFold,
    handleResetZoom,
    handleMapLoad,
  } = useUnfoldLifecycle({
    initialFolded,
    pitch,
    bearing,
    zoom,
    effectiveCoords,
    onFoldChange,
    mapRef,
  });

  const foldState = isFolded ? "folded" : "unfolded";
  const clickHandler = isFolded ? handleToggleFold : undefined;
  const currentPitch = hasMovedTo3D ? pitch : 0;
  const currentBearing = hasMovedTo3D ? bearing : 0;

  return (
    <MapPerspectiveWrapper
      $size={size}
      $orientation={orientation}
      $mapWidth={mapWidth}
      data-testid="map-perspective-wrapper"
    >
      <UnifiedMapCanvas
        animate={foldState}
        initial="folded"
        variants={CANVAS_VARIANTS}
        $isFolded={isFolded}
        data-testid="folding-paper-canvas"
        onClick={clickHandler}
      >
        <MapCanvasContainer data-testid="maplibre-container">
          <Map
            ref={mapRef}
            coordinates={effectiveCoords}
            zoom={zoom}
            initialPitch={0}
            initialBearing={0}
            pitch={currentPitch}
            bearing={currentBearing}
            enable3dBuildings={true}
            mapStyle={mapStyle}
            tileProviderKey={tileProviderKey}
            pinLabel={effectivePinLabel}
            pinColor={currentPinColor}
            pinAriaLabel={titleOsm}
            interactive={true}
            attributionControl={false}
            width="100%"
            height="100%"
            onLoad={handleMapLoad}
            data-testid="maplibre-gl-map"
          />
        </MapCanvasContainer>

        <AccordionOverlayContainer
          isFolded={isFolded}
          showOverlay={showOverlay}
          snapshotUrl={snapshotUrl}
          onUnfoldDone={handleUnfoldDone}
          onClick={clickHandler}
        />

        <PaperCreaseLayer $isFolded={false} data-testid="paper-crease-layer" />
      </UnifiedMapCanvas>

      {showControls && (
        <MapControls
          isFolded={isFolded}
          mapRef={mapRef}
          onToggleFold={handleToggleFold}
          onResetZoom={handleResetZoom}
        />
      )}
    </MapPerspectiveWrapper>
  );
}

export default MapCardViewport;
