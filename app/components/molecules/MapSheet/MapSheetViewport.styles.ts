import { styled, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import type {
  MapSheetSize,
  MapSheetOrientation,
  MapSheetMode,
} from "./MapSheet.types";
import { SIZE_METRICS } from "./MapSheet.styles";

/**
 * Top decorative binder strip styled like an authentic surveyor's map header
 */
export const PaperTopTape = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 10px",
  fontSize: "0.625rem",
  fontFamily:
    'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  letterSpacing: "0.06em",
  color: alpha(theme.palette.text.secondary, 0.7),
  backgroundColor: alpha(theme.palette.background.default, 0.75),
  borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.35)}`,
  zIndex: 4,
  pointerEvents: "none",
  userSelect: "none",
}));

interface PerspectiveMetrics {
  flex: string;
  minHeight: number | string;
}

interface PerspectiveConfig {
  isExtended: boolean;
  isHorizontal: boolean;
  isFullMap: boolean;
  mapFlex: string;
  minHeightMetric: number;
}

function getPerspectiveMetrics(config: PerspectiveConfig): PerspectiveMetrics {
  if (config.isFullMap) {
    return {
      flex: "1 1 100%",
      minHeight: 400,
    };
  }
  if (config.isExtended) {
    return {
      flex: config.isHorizontal ? "1 1 54%" : "1 1 auto",
      minHeight: config.isHorizontal ? 340 : 260,
    };
  }
  return {
    flex: config.isHorizontal ? config.mapFlex : "1 1 auto",
    minHeight: config.isHorizontal ? config.minHeightMetric : 160,
  };
}

/**
 * 3D Perspective container providing realistic accordion depth for the paper map
 */
export const MapPerspectiveWrapper = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$orientation" &&
    prop !== "$size" &&
    prop !== "$mode" &&
    prop !== "$isFullMap",
})<{
  $orientation: MapSheetOrientation;
  $size: MapSheetSize;
  $mode: MapSheetMode;
  $isFullMap?: boolean;
}>(({ theme, $orientation, $size, $mode, $isFullMap = false }) => {
  const metrics = SIZE_METRICS[$size];
  const isHorizontal = $orientation === "horizontal";
  const isExtended = $mode === "extended";
  const perspectiveMetrics = getPerspectiveMetrics({
    isExtended,
    isHorizontal,
    isFullMap: $isFullMap,
    mapFlex: metrics.mapFlex,
    minHeightMetric: metrics.minHeight,
  });

  return {
    position: "relative",
    flex: perspectiveMetrics.flex,
    perspective: 1200,
    perspectiveOrigin: "center center",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: perspectiveMetrics.minHeight,
    height: isHorizontal ? "100%" : perspectiveMetrics.minHeight,
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.background.default,
    }),
    "@media (max-width: 768px)": {
      flex: "none",
      height: isExtended ? 240 : 170,
    },
  };
});

/**
 * Single unified map canvas container with 3D paper folding transform
 */
export const UnifiedMapCanvas = styled(motion.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  minHeight: 140,
  flex: "1 1 auto",
  overflow: "hidden",
  transformStyle: "preserve-3d",
  willChange: "transform, filter",
});

/**
 * Layer displaying tactile fold creases and lighting highlights
 * when folded or unfolding, smoothly fading out once the map is flat.
 */
export const PaperCreaseLayer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$isFolded",
})<{ $isFolded: boolean }>(({ $isFolded }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  pointerEvents: "none",
  zIndex: 3,
  opacity: $isFolded ? 1 : 0,
  transition: "opacity 0.4s ease",
  background: `linear-gradient(
    to right,
    rgba(0, 0, 0, 0.06) 0%,
    transparent 31%,
    rgba(0, 0, 0, 0.16) 33.33%,
    rgba(255, 255, 255, 0.2) 34%,
    transparent 36%,
    transparent 64%,
    rgba(0, 0, 0, 0.16) 66.66%,
    rgba(255, 255, 255, 0.2) 67.33%,
    transparent 69%,
    rgba(0, 0, 0, 0.05) 100%
  )`,
}));

/**
 * Framer motion 3D paper folding mesh container
 */
export const FoldingPaperMesh = styled(motion.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  minHeight: 140,
  flex: "1 1 auto",
  display: "flex",
  transformStyle: "preserve-3d",
  willChange: "transform, filter",
});

/**
 * Individual accordion panel with simulated paper texture, lighting gradient, and fold crease
 */
export const AccordionPanel = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "$panelIndex",
})<{ $panelIndex: number }>(({ theme, $panelIndex }) => ({
  position: "relative",
  flex: 1,
  height: "100%",
  minHeight: 140,
  overflow: "hidden",
  transformStyle: "preserve-3d",
  transformOrigin:
    $panelIndex === 0
      ? "right center"
      : $panelIndex === 2
        ? "left center"
        : "center center",
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    $panelIndex === 1
      ? "inset 6px 0 10px -5px rgba(0,0,0,0.18), inset -6px 0 10px -5px rgba(0,0,0,0.18)"
      : "none",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.paper,
  }),
}));

/**
 * Vertical crease line between folded panels
 */
export const CreaseLine = styled("div", {
  shouldForwardProp: (prop) => prop !== "$leftPercent",
})<{ $leftPercent: number }>(({ theme, $leftPercent }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: `${$leftPercent}%`,
  width: 2,
  zIndex: 3,
  pointerEvents: "none",
  background: `linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(255,255,255,0.4) 50%, rgba(0,0,0,0.15) 100%)`,
  ...theme.applyStyles("dark", {
    background: `linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(42,161,152,0.3) 50%, rgba(0,0,0,0.3) 100%)`,
  }),
}));

/**
 * Map Iframe Embed styling with paper-like contrast and responsive filling
 */
export const MapIframe = styled("iframe", {
  shouldForwardProp: (prop) => prop !== "$isCompact",
})<{ $isCompact?: boolean }>(({ theme, $isCompact }) => ({
  position: "absolute",
  top: -10,
  left: -10,
  width: "calc(100% + 20px)",
  height: $isCompact ? "calc(100% + 95px)" : "calc(100% + 75px)",
  border: 0,
  display: "block",
  filter: "contrast(1.03) saturate(0.95)",
  pointerEvents: $isCompact ? "none" : "auto",
  ...theme.applyStyles("dark", {
    filter: "invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)",
  }),
}));

/**
 * Floating toolbar anchored to the map viewport for interactive controls
 */
export const MapControlsToolbar = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 8,
  right: 8,
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 6px",
  borderRadius: "10px",
  backgroundColor: alpha(theme.palette.background.paper, 0.88),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
  zIndex: 5,
}));

/**
 * Stamp badge indicating paper map scale and compass heading
 */
export const MapCompassBadge = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 26,
  left: 8,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 7px",
  borderRadius: "16px",
  backgroundColor: alpha(theme.palette.background.paper, 0.88),
  backdropFilter: "blur(8px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
  zIndex: 5,
  fontSize: "0.625rem",
  fontWeight: 700,
  fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  color: theme.palette.text.primary,
}));

/**
 * Glassmorphic floating card anchored inside the full map view in extended mode
 */
export const FloatingWayfindingOverlay = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 8,
  left: 8,
  right: 8,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: "8px 12px",
  borderRadius: "12px",
  backgroundColor: alpha(theme.palette.background.paper, 0.92),
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  zIndex: 5,
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    borderColor: alpha(theme.palette.divider, 0.2),
  }),
}));
