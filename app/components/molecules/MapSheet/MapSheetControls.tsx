import React from "react";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import ViewSidebarRoundedIcon from "@mui/icons-material/ViewSidebarRounded";

import Tooltip from "../../atoms/Tooltip";
import type { MapSheetMode, ExtendedMapView } from "./MapSheet.types";
import { MapControlsToolbar } from "./MapSheet.styles";

export interface ViewportLabels {
  foldButtonLabel: string;
  modeToggleLabel: string;
  viewToggleLabel: string;
  foldStatus: string;
}

export interface ViewportControlsTargetProps {
  allowFoldToggle: boolean;
  foldButtonLabel?: string;
  isFolded: boolean;
  onToggleFold: () => void;
  allowModeToggle?: boolean;
  mode: MapSheetMode;
  onToggleMode?: () => void;
  onToggleExtendedView?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  titleOsm: string;
  labelZoomIn: string;
  labelZoomOut: string;
  labelResetView: string;
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
  mode,
  extendedView,
  onToggleExtendedView,
  viewToggleLabel,
}: ModeControlsProps) {
  const isExtended = mode === "extended";
  const isFull = extendedView === "full";

  return (
    <>
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

export function MapToolbar(props: MapToolbarProps) {
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

export function CompactExpandButton({
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

interface ExtendedCompactButtonProps {
  onToggleMode?: () => void;
  label: string;
}

export function ExtendedCompactButton({
  onToggleMode,
  label,
}: ExtendedCompactButtonProps) {
  if (!onToggleMode) return null;
  return (
    <MapControlsToolbar
      data-testid="extended-compact-toolbar"
      sx={{
        top: 26,
        bottom: "auto",
        right: 8,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.92),
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
        zIndex: 6,
      }}
    >
      <Tooltip arrow title={label}>
        <IconButton
          size="small"
          onClick={onToggleMode}
          aria-label={label}
          data-testid="mode-toggle-button"
          sx={{ width: 26, height: 26, padding: "2px" }}
        >
          <CloseFullscreenRoundedIcon sx={{ fontSize: "0.95rem" }} />
        </IconButton>
      </Tooltip>
    </MapControlsToolbar>
  );
}

interface ViewportControlsProps {
  showControls?: boolean;
  isExtended: boolean;
  viewMode: "full" | "split";
  labels: ViewportLabels;
  osmHref: string;
  props: ViewportControlsTargetProps;
}

export function ViewportControls({
  showControls,
  isExtended,
  viewMode,
  labels,
  osmHref,
  props,
}: ViewportControlsProps) {
  if (!showControls) return null;

  if (isExtended) {
    return (
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
    );
  }

  if (props.allowModeToggle !== false) {
    return (
      <CompactExpandButton
        onToggleMode={props.onToggleMode}
        label={labels.modeToggleLabel}
      />
    );
  }

  return null;
}
