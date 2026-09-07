import React, { useState, useEffect } from "react";
import type { Variants } from "framer-motion";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import Tooltip from "@mui/material/Tooltip";

import { M3_SPRINGS } from "~/tokens/motion";
import type {
  MapCardSize,
  MapCardOrientation,
  MapCoordinates,
} from "./MapCard.types";
import { buildOsmEmbedUrl } from "./MapCard.utils";
import {
  MapPerspectiveWrapper,
  UnifiedMapCanvas,
  MapIframe,
  PaperCreaseLayer,
  CreaseLine,
  MapOverlayControls,
  MapControlButton,
} from "./MapCard.styles";

export interface MapCardViewportProps {
  coordinates?: MapCoordinates;
  zoom?: number;
  size?: MapCardSize;
  orientation?: MapCardOrientation;
  initialFolded?: boolean;
  showControls?: boolean;
  titleOsm?: string;
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
    zoom: props.zoom ?? 16,
    size: props.size ?? "medium",
    orientation: props.orientation ?? "horizontal",
    initialFolded: Boolean(props.initialFolded),
    showControls: Boolean(props.showControls),
    titleOsm: props.titleOsm ?? "OpenStreetMap View",
  };
}

export function MapCardViewport(props: MapCardViewportProps) {
  const { coordinates, onFoldChange } = props;
  const { zoom, size, orientation, initialFolded, showControls, titleOsm } =
    normalizeViewportProps(props);

  const [isFolded, setIsFolded] = useState<boolean>(true);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);

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
    }, 150);

    return () => clearTimeout(timer);
  }, [initialFolded, onFoldChange]);

  const handleToggleFold = () => {
    setIsFolded((prev) => {
      const next = !prev;
      onFoldChange?.(next);
      return next;
    });
  };

  const handleZoomIn = () => {
    setCurrentZoom((z) => Math.min(z + 1, 19));
  };

  const handleZoomOut = () => {
    setCurrentZoom((z) => Math.max(z - 1, 10));
  };

  const handleResetZoom = () => {
    setCurrentZoom(zoom);
    setIsFolded(false);
  };

  const embedUrl = buildOsmEmbedUrl(coordinates, currentZoom);

  return (
    <MapPerspectiveWrapper
      $size={size}
      $orientation={orientation}
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
        <MapIframe
          src={embedUrl}
          title={titleOsm}
          loading="lazy"
          data-testid="osm-iframe"
        />

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
