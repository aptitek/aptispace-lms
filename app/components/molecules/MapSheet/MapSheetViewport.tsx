import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import ViewSidebarRoundedIcon from "@mui/icons-material/ViewSidebarRounded";
import type { Variants } from "framer-motion";

import Tooltip from "../../atoms/Tooltip";
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
  MapControlsToolbar,
  MapCompassBadge,
  FloatingWayfindingOverlay,
} from "./MapSheet.styles";

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

interface ModeControlsProps {
  allowModeToggle?: boolean;
  mode: MapSheetMode;
  extendedView?: ExtendedMapView;
  onToggleMode?: () => void;
  onToggleExtendedView?: () => void;
  modeToggleLabel: string;
  viewToggleLabel: string;
}

function ModeControls({
  allowModeToggle,
  mode,
  extendedView,
  onToggleMode,
  onToggleExtendedView,
  modeToggleLabel,
  viewToggleLabel,
}: ModeControlsProps) {
  const isExtended = mode === "extended";
  const isFull = extendedView === "full";

  return (
    <>
      {allowModeToggle && onToggleMode ? (
        <Tooltip arrow title={modeToggleLabel}>
          <IconButton
            size="small"
            onClick={onToggleMode}
            aria-label={modeToggleLabel}
            data-testid="mode-toggle-button"
          >
            {isExtended ? (
              <CloseFullscreenRoundedIcon fontSize="small" />
            ) : (
              <OpenInFullRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      ) : null}

      {isExtended && onToggleExtendedView ? (
        <Tooltip arrow title={viewToggleLabel}>
          <IconButton
            size="small"
            onClick={onToggleExtendedView}
            aria-label={viewToggleLabel}
            data-testid="extended-view-toggle-button"
          >
            {isFull ? (
              <ViewSidebarRoundedIcon fontSize="small" />
            ) : (
              <MapRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      ) : null}
    </>
  );
}

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  titleOsm: string;
  osmHref: string;
  labelZoomIn: string;
  labelZoomOut: string;
  labelResetView: string;
}

function ZoomControls({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  titleOsm,
  osmHref,
  labelZoomIn,
  labelZoomOut,
  labelResetView,
}: ZoomControlsProps) {
  return (
    <>
      <Tooltip arrow title={labelZoomIn}>
        <IconButton
          size="small"
          onClick={onZoomIn}
          aria-label={labelZoomIn}
          data-testid="zoom-in-button"
        >
          <AddRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip arrow title={labelZoomOut}>
        <IconButton
          size="small"
          onClick={onZoomOut}
          aria-label={labelZoomOut}
          data-testid="zoom-out-button"
        >
          <RemoveRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip arrow title={labelResetView}>
        <IconButton
          size="small"
          onClick={onResetZoom}
          aria-label={labelResetView}
          data-testid="zoom-reset-button"
        >
          <RestartAltRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip arrow title={titleOsm}>
        <IconButton
          size="small"
          component="a"
          href={osmHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={titleOsm}
          data-testid="osm-link-button"
        >
          <OpenInNewRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}

interface MapToolbarProps {
  allowFoldToggle: boolean;
  foldButtonLabel: string;
  isFolded: boolean;
  onToggleFold: () => void;
  allowModeToggle?: boolean;
  mode: MapSheetMode;
  extendedView?: ExtendedMapView;
  onToggleMode?: () => void;
  onToggleExtendedView?: () => void;
  modeToggleLabel: string;
  viewToggleLabel: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  titleOsm: string;
  osmHref: string;
  labelZoomIn: string;
  labelZoomOut: string;
  labelResetView: string;
}

function MapToolbar(props: MapToolbarProps) {
  return (
    <MapControlsToolbar data-testid="map-controls-toolbar">
      <ModeControls
        allowModeToggle={props.allowModeToggle !== false}
        mode={props.mode}
        extendedView={props.extendedView}
        onToggleMode={props.onToggleMode}
        onToggleExtendedView={props.onToggleExtendedView}
        modeToggleLabel={props.modeToggleLabel}
        viewToggleLabel={props.viewToggleLabel}
      />

      {props.allowFoldToggle ? (
        <Tooltip arrow title={props.foldButtonLabel}>
          <IconButton
            size="small"
            onClick={props.onToggleFold}
            aria-label={props.foldButtonLabel}
            data-testid="fold-toggle-button"
          >
            {props.isFolded ? (
              <MapRoundedIcon fontSize="small" />
            ) : (
              <ImportContactsRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      ) : null}

      <ZoomControls
        onZoomIn={props.onZoomIn}
        onZoomOut={props.onZoomOut}
        onResetZoom={props.onResetZoom}
        titleOsm={props.titleOsm}
        osmHref={props.osmHref}
        labelZoomIn={props.labelZoomIn}
        labelZoomOut={props.labelZoomOut}
        labelResetView={props.labelResetView}
      />
    </MapControlsToolbar>
  );
}

interface CompactExpandButtonProps {
  onToggleMode?: () => void;
  label: string;
}

function CompactExpandButton({
  onToggleMode,
  label,
}: CompactExpandButtonProps) {
  if (!onToggleMode) return null;
  return (
    <MapControlsToolbar
      data-testid="map-controls-toolbar"
      sx={{ top: 8, bottom: "auto", right: 8 }}
    >
      <Tooltip arrow title={label}>
        <IconButton
          size="small"
          onClick={onToggleMode}
          aria-label={label}
          data-testid="mode-toggle-button"
          sx={{ width: 26, height: 26, padding: "2px" }}
        >
          <OpenInFullRoundedIcon sx={{ fontSize: "0.95rem" }} />
        </IconButton>
      </Tooltip>
    </MapControlsToolbar>
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
      {/* Paper Surveyor Top Tape with DMS Coordinates - Extended Mode Only */}
      {isExtended ? (
        <PaperTopTape data-testid="map-top-tape">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ExploreRoundedIcon sx={{ fontSize: "0.85rem" }} />
            <span>OSM • {props.dmsCoords}</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span>SCALE 1:{scaleRatio}</span>
            <span>•</span>
            <span>{labels.foldStatus}</span>
          </Box>
        </PaperTopTape>
      ) : null}

      {/* Compass Rose Stamp - Extended Mode Only */}
      {isExtended ? (
        <MapCompassBadge data-testid="map-compass-badge">
          <NavigationRoundedIcon
            sx={{
              fontSize: "0.95rem",
              color: "primary.main",
              transform: "rotate(-45deg)",
            }}
          />
          <span>{props.currentZoom}x ZOOM</span>
        </MapCompassBadge>
      ) : null}

      <UnifiedMapMesh
        isFolded={props.isFolded}
        initialFolded={props.initialFolded}
        osmEmbedUrl={props.osmEmbedUrl}
        titleOsm={props.titleOsm}
        isCompact={!isExtended}
      />

      {/* Floating Wayfinding Deck in Full Map Mode */}
      {isFullMap && props.children ? (
        <FloatingWayfindingOverlay data-testid="floating-wayfinding-overlay">
          {props.children}
        </FloatingWayfindingOverlay>
      ) : null}

      {/* Map Controls: Full toolbar in extended mode, clean minimal expand button in compact mode */}
      {props.showControls ? (
        isExtended ? (
          <MapToolbar
            allowFoldToggle={props.allowFoldToggle}
            foldButtonLabel={labels.foldButtonLabel}
            isFolded={props.isFolded}
            onToggleFold={props.onToggleFold}
            allowModeToggle={props.allowModeToggle}
            mode={props.mode}
            extendedView={viewMode}
            onToggleMode={props.onToggleMode}
            onToggleExtendedView={props.onToggleExtendedView}
            modeToggleLabel={labels.modeToggleLabel}
            viewToggleLabel={labels.viewToggleLabel}
            onZoomIn={props.onZoomIn}
            onZoomOut={props.onZoomOut}
            onResetZoom={props.onResetZoom}
            titleOsm={props.titleOsm}
            osmHref={osmHref}
            labelZoomIn={props.labelZoomIn}
            labelZoomOut={props.labelZoomOut}
            labelResetView={props.labelResetView}
          />
        ) : props.allowModeToggle !== false ? (
          <CompactExpandButton
            onToggleMode={props.onToggleMode}
            label={labels.modeToggleLabel}
          />
        ) : null
      ) : null}
    </MapPerspectiveWrapper>
  );
}

export default MapSheetViewport;
