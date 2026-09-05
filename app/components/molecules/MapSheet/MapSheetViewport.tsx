import React from "react";
import Box from "@mui/material/Box";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import type { Variants } from "framer-motion";

import type {
  MapSheetOrientation,
  MapCoordinates,
  MapSheetSize,
  MapSheetMode,
  ExtendedMapView,
} from "./MapSheet.types";
import { buildOsmViewUrl } from "./MapSheet.utils";
import {
  PaperTopTape,
  MapPerspectiveWrapper,
  UnifiedMapCanvas,
  PaperCreaseLayer,
  CreaseLine,
  MapIframe,
  MapCompassBadge,
  FloatingWayfindingOverlay,
} from "./MapSheet.styles";
import { ViewportControls, ExtendedCompactButton } from "./MapSheetControls";

export interface MapSheetViewportProps {
  mode: MapSheetMode;
  extendedView?: ExtendedMapView;
  size: MapSheetSize;
  orientation: MapSheetOrientation;
  isFolded: boolean;
  initialFolded: boolean;
  osmEmbedUrl: string;
  coordinates: MapCoordinates;
  currentZoom: number;
  dmsCoords: string;
  showControls: boolean;
  allowFoldToggle: boolean;
  allowModeToggle?: boolean;
  onToggleFold: () => void;
  onToggleMode?: () => void;
  onToggleExtendedView?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  titleOsm: string;
  labelFolded: string;
  labelUnfolded: string;
  labelZoomIn: string;
  labelZoomOut: string;
  labelResetView: string;
  labelUnfoldMap: string;
  labelFoldMap: string;
  labelExpandMap?: string;
  labelCollapseMap?: string;
  labelFullMapView?: string;
  labelSplitView?: string;
  children?: React.ReactNode;
}

const UNFOLD_VARIANTS: Variants = {
  folded: {
    rotateY: -22,
    rotateX: 5,
    scale: 0.94,
    transformOrigin: "left center",
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 24,
    },
  },
  unfolded: {
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    transformOrigin: "center center",
    transition: {
      type: "spring" as const,
      stiffness: 180,
      damping: 20,
    },
  },
};

interface UnifiedMapMeshProps {
  isFolded: boolean;
  initialFolded: boolean;
  osmEmbedUrl: string;
  titleOsm: string;
  isCompact?: boolean;
}

function UnifiedMapMesh({
  isFolded,
  initialFolded,
  osmEmbedUrl,
  titleOsm,
  isCompact,
}: UnifiedMapMeshProps) {
  return (
    <UnifiedMapCanvas
      animate={isFolded ? "folded" : "unfolded"}
      initial={initialFolded ? "folded" : "folded"}
      variants={UNFOLD_VARIANTS}
      data-testid="folding-paper-mesh"
    >
      <MapIframe
        src={osmEmbedUrl}
        title={titleOsm}
        loading="lazy"
        data-testid="osm-iframe-main"
        $isCompact={isCompact}
      />
      <PaperCreaseLayer $isFolded={isFolded}>
        <CreaseLine $leftPercent={33.33} />
        <CreaseLine $leftPercent={66.66} />
      </PaperCreaseLayer>
    </UnifiedMapCanvas>
  );
}

function resolveViewportLabels(
  isExtended: boolean,
  isFull: boolean,
  isFolded: boolean,
  props: MapSheetViewportProps,
) {
  const foldButtonLabel = isFolded ? props.labelUnfoldMap : props.labelFoldMap;
  const modeToggleLabel = isExtended
    ? (props.labelCollapseMap ?? "Compact Map View")
    : (props.labelExpandMap ?? "Extended Full Map");
  const viewToggleLabel = isFull
    ? (props.labelSplitView ?? "Side-by-Side Steps")
    : (props.labelFullMapView ?? "Full Map View");
  const foldStatus = isFolded ? props.labelFolded : props.labelUnfolded;
  return { foldButtonLabel, modeToggleLabel, viewToggleLabel, foldStatus };
}

interface ExtendedOverlaysProps {
  dmsCoords?: string;
  scaleRatio: number;
  foldStatus: string;
  currentZoom: number;
  allowModeToggle?: boolean;
  onToggleMode?: () => void;
  modeToggleLabel: string;
}

function ExtendedOverlays({
  dmsCoords,
  scaleRatio,
  foldStatus,
  currentZoom,
  allowModeToggle,
  onToggleMode,
  modeToggleLabel,
}: ExtendedOverlaysProps) {
  return (
    <>
      <PaperTopTape data-testid="map-top-tape">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ExploreRoundedIcon sx={{ fontSize: "0.85rem" }} />
          <span>OSM • {dmsCoords}</span>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span>SCALE 1:{scaleRatio}</span>
          <span>•</span>
          <span>{foldStatus}</span>
        </Box>
      </PaperTopTape>

      <MapCompassBadge data-testid="map-compass-badge">
        <NavigationRoundedIcon
          sx={{
            fontSize: "0.95rem",
            color: "primary.main",
            transform: "rotate(-45deg)",
          }}
        />
        <span>{currentZoom}x ZOOM</span>
      </MapCompassBadge>

      {allowModeToggle !== false ? (
        <ExtendedCompactButton
          onToggleMode={onToggleMode}
          label={modeToggleLabel}
        />
      ) : null}
    </>
  );
}

export function MapSheetViewport(props: MapSheetViewportProps) {
  const isExtended = props.mode === "extended";
  const viewMode = props.extendedView || "full";
  const isFullMap = isExtended && viewMode === "full";
  const labels = resolveViewportLabels(
    isExtended,
    viewMode === "full",
    props.isFolded,
    props,
  );

  const osmHref = buildOsmViewUrl(props.coordinates, props.currentZoom);
  const scaleRatio = Math.round(5000 * Math.pow(2, 16 - props.currentZoom));

  return (
    <MapPerspectiveWrapper
      $orientation={props.orientation}
      $size={props.size}
      $mode={props.mode}
      $isFullMap={isFullMap}
    >
      {isExtended ? (
        <ExtendedOverlays
          dmsCoords={props.dmsCoords}
          scaleRatio={scaleRatio}
          foldStatus={labels.foldStatus}
          currentZoom={props.currentZoom}
          allowModeToggle={props.allowModeToggle}
          onToggleMode={props.onToggleMode}
          modeToggleLabel={labels.modeToggleLabel}
        />
      ) : null}

      <UnifiedMapMesh
        isFolded={props.isFolded}
        initialFolded={props.initialFolded}
        osmEmbedUrl={props.osmEmbedUrl}
        titleOsm={props.titleOsm}
        isCompact={!isExtended}
      />

      {isFullMap && props.children ? (
        <FloatingWayfindingOverlay data-testid="floating-wayfinding-overlay">
          {props.children}
        </FloatingWayfindingOverlay>
      ) : null}

      <ViewportControls
        showControls={props.showControls}
        isExtended={isExtended}
        viewMode={viewMode}
        labels={labels}
        osmHref={osmHref}
        props={props}
      />
    </MapPerspectiveWrapper>
  );
}

export default MapSheetViewport;
