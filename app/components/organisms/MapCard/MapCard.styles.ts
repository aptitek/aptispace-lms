import { styled, alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { motion } from "framer-motion";
import type { MapCardSize, MapCardOrientation } from "./MapCard.types";

interface StyledCardProps {
  $size: MapCardSize;
  $orientation: MapCardOrientation;
  $mapWidth?: "narrow" | "standard";
}

export const SIZE_METRICS: Record<
  MapCardSize,
  {
    maxWidth: number | string;
    minHeight: number;
    padding: number | string;
    fontSize: string;
    mapWidthNarrow: number;
    mapWidthStandard: string;
    infoFlex: string;
  }
> = {
  small: {
    maxWidth: 460,
    minHeight: 115,
    padding: "8px 12px",
    fontSize: "0.8rem",
    mapWidthNarrow: 155,
    mapWidthStandard: "1 1 0%",
    infoFlex: "1 1 auto",
  },
  medium: {
    maxWidth: 540,
    minHeight: 125,
    padding: "8px 12px",
    fontSize: "0.875rem",
    mapWidthNarrow: 175,
    mapWidthStandard: "1 1 0%",
    infoFlex: "1 1 auto",
  },
  large: {
    maxWidth: 640,
    minHeight: 145,
    padding: "12px 16px",
    fontSize: "0.95rem",
    mapWidthNarrow: 210,
    mapWidthStandard: "1 1 0%",
    infoFlex: "1 1 auto",
  },
};

/**
 * Main Card surface with tactile elevation and MD3 styling
 */
export const SheetCard = styled("article", {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$orientation",
})<StyledCardProps>(({ theme, $size }) => {
  const metrics = SIZE_METRICS[$size];

  return {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width:
      typeof metrics.maxWidth === "number" ? `${metrics.maxWidth}px` : "100%",
    maxWidth: "100%",
    minHeight: metrics.minHeight,
    borderRadius: "20px",
    backgroundColor: alpha(theme.palette.background.paper, 0.96),
    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    backgroundClip: "padding-box",
    boxShadow: `0 8px 24px -4px ${alpha(theme.palette.common.black, 0.08)}, 0 2px 6px -1px ${alpha(theme.palette.common.black, 0.04)}`,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    overflow: "hidden",
    boxSizing: "border-box",
    transition: "box-shadow 0.25s ease, border-color 0.25s ease",
    "&:hover": {
      boxShadow: `0 12px 32px -4px ${alpha(theme.palette.primary.main, 0.18)}, 0 4px 12px -2px ${alpha(theme.palette.common.black, 0.08)}`,
      borderColor: alpha(theme.palette.primary.main, 0.35),
    },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.paper, 0.94),
      borderColor: alpha(theme.palette.divider, 0.25),
      boxShadow: `0 10px 28px -6px ${alpha(theme.palette.common.black, 0.5)}`,
      "&:hover": {
        boxShadow: `0 14px 36px -6px ${alpha(theme.palette.primary.main, 0.28)}`,
      },
    }),
    "@media (max-width: 768px)": {
      flexDirection: "column",
      maxWidth: "100%",
      minHeight: "auto",
    },
  };
});

/**
 * Main body wrapper splitting Wayfinding and Map
 */
export const CardBodyWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$orientation",
})<StyledCardProps>(({ $size, $orientation }) => {
  const metrics = SIZE_METRICS[$size];
  const isHorizontal = $orientation === "horizontal";

  return {
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: "stretch",
    width: "100%",
    flex: "1 1 auto",
    minHeight: isHorizontal ? metrics.minHeight : "auto",
    boxSizing: "border-box",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  };
});

/**
 * Wayfinding panel hosting the prominent segmented chip and access segmented chip
 */
export const WayfindingContainer = styled("section", {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$orientation",
})<StyledCardProps>(({ $size }) => {
  const metrics = SIZE_METRICS[$size];

  return {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: metrics.padding,
    gap: 6,
    boxSizing: "border-box",
    minWidth: 0,
    backgroundColor: "transparent",
  };
});

/**
 * Section title / label above the chips
 */
export const WayfindingHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
});

export const WayfindingTitle = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
  userSelect: "none",
}));

/**
 * Container holding the chips with smooth spacing
 */
export const ChipsStack = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  width: "100%",
});

/**
 * Optional instruction block rendered beneath chips if instructions are long
 */
export const InstructionNote = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "8px 12px",
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  border: `1px dashed ${alpha(theme.palette.primary.main, 0.25)}`,
  color: theme.palette.text.primary,
  fontSize: "0.8rem",
  lineHeight: 1.35,
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderColor: alpha(theme.palette.primary.main, 0.35),
  }),
}));

function computeMapFlex(
  isHorizontal: boolean,
  isNarrow: boolean,
  metrics: { mapWidthNarrow: number; mapWidthStandard: string },
): string {
  if (!isHorizontal) {
    return "1 1 auto";
  }
  return isNarrow
    ? `0 0 ${metrics.mapWidthNarrow}px`
    : metrics.mapWidthStandard;
}

function computeMapWidth(
  isHorizontal: boolean,
  isNarrow: boolean,
  metrics: { mapWidthNarrow: number },
): string {
  if (!isHorizontal) {
    return "100%";
  }
  return isNarrow ? `${metrics.mapWidthNarrow}px` : "auto";
}

/**
 * 3D Perspective container wrapping the unfolding map canvas
 */
export const MapPerspectiveWrapper = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$orientation" && prop !== "$mapWidth",
})<StyledCardProps>(({ theme, $size, $orientation, $mapWidth = "narrow" }) => {
  const metrics = SIZE_METRICS[$size];
  const isHorizontal = $orientation === "horizontal";
  const isNarrow = $mapWidth === "narrow";

  return {
    position: "relative",
    flex: computeMapFlex(isHorizontal, isNarrow, metrics),
    width: computeMapWidth(isHorizontal, isNarrow, metrics),
    perspective: 1200,
    minHeight: isHorizontal ? 100 : 90,
    minWidth: 130,
    height: isHorizontal ? "auto" : 110,
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    overflow: "hidden",
    boxSizing: "border-box",
    borderLeft: isHorizontal
      ? `1px solid ${alpha(theme.palette.divider, 0.4)}`
      : "none",
    borderBottom: !isHorizontal
      ? `1px solid ${alpha(theme.palette.divider, 0.4)}`
      : "none",
    "@media (max-width: 768px)": {
      borderLeft: "none",
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
      height: 110,
      width: "100%",
      flex: "1 1 auto",
    },
  };
});

/**
 * Motion canvas that executes the 3D origami accordion unfolding animation
 */
export const UnifiedMapCanvas = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "$isFolded",
})<{ $isFolded?: boolean }>(({ $isFolded }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  overflow: "hidden",
  cursor: $isFolded ? "pointer" : "grab",
  "&:active": {
    cursor: $isFolded ? "pointer" : "grabbing",
  },
}));

/**
 * WebGL MapLibre container wrapping canvas with full-bleed dimensions
 */
export const MapCanvasContainer = styled("div")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  pointerEvents: "auto",
  "& .maplibregl-map": {
    width: "100% !important",
    height: "100% !important",
    fontFamily: "inherit",
  },
  "& .maplibregl-ctrl-attrib": {
    display: "none !important",
  },
  "& .maplibregl-ctrl-logo": {
    display: "none !important",
  },
});

/**
 * Embedded OpenStreetMap iframe - retained for backward compatibility
 */
export const MapIframe = styled("iframe")({
  position: "absolute",
  top: "-48px",
  left: "-48px",
  width: "calc(100% + 96px)",
  height: "calc(100% + 128px)",
  border: 0,
  display: "block",
  pointerEvents: "auto",
});

/**
 * Paper Creases overlay for realistic origami fold illusion
 */
export const PaperCreaseLayer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$isFolded",
})<{ $isFolded: boolean }>(({ $isFolded }) => ({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 3,
  opacity: $isFolded ? 0.75 : 0,
  transition: "opacity 0.4s ease",
  display: "flex",
  width: "100%",
  height: "100%",
}));

export const CreaseLine = styled("div", {
  shouldForwardProp: (prop) => prop !== "$leftPercent",
})<{ $leftPercent: number }>(({ $leftPercent }) => ({
  position: "absolute",
  left: `${$leftPercent}%`,
  top: 0,
  bottom: 0,
  width: 2,
  background: `linear-gradient(to right, rgba(0, 0, 0, 0.25), transparent 80%)`,
  boxShadow: `inset 1px 0 2px rgba(255, 255, 255, 0.3)`,
}));

/**
 * 3D Paper Accordion overlay container hosting the accordion panels
 */
export const AccordionOverlay = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "$pointerEvents",
})<{ $pointerEvents?: "auto" | "none" }>(({ $pointerEvents = "none" }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  perspective: "1200px",
  zIndex: 4,
  pointerEvents: $pointerEvents,
}));

/**
 * Individual hinged panel in the accordion brochure (alternating right/left hinges)
 */
export const AccordionPanel = styled(motion.div, {
  shouldForwardProp: (prop) =>
    prop !== "$index" && prop !== "$totalPanels" && prop !== "$panel",
})<{ $index?: number; $totalPanels?: number; $panel?: string }>(({
  $index = 0,
  $totalPanels = 6,
}) => {
  const panelWidth = 100 / $totalPanels;
  const isEven = $index % 2 === 0;
  return {
    position: "absolute",
    top: 0,
    bottom: 0,
    height: "100%",
    left: `${$index * panelWidth}%`,
    width: `${panelWidth + 0.08}%`,
    overflow: "hidden",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    transformOrigin: isEven ? "right center" : "left center",
  };
});

/**
 * Inner wrapper sized at (totalPanels * 100)% width, horizontally shifted per panel
 */
export const AccordionPanelContent = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$index" && prop !== "$totalPanels" && prop !== "$panel",
})<{ $index?: number; $totalPanels?: number; $panel?: string }>(
  ({ $index = 0, $totalPanels = 6 }) => ({
    position: "absolute",
    top: 0,
    height: "100%",
    width: `${$totalPanels * 100}%`,
    pointerEvents: "none",
    left: `-${$index * 100}%`,
  }),
);

/**
 * Dynamic lighting shade simulating ambient occlusion & alternating fold shadows
 */
export const AccordionPanelShade = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "$index" && prop !== "$panel",
})<{ $index?: number; $panel?: string }>(({ $index = 0 }) => {
  const isEven = $index % 2 === 0;
  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 2,
    background: isEven
      ? "linear-gradient(to right, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.22) 100%)"
      : "linear-gradient(to right, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.02) 100%)",
  };
});

/**
 * High-definition crease line along the fold hinge with alternating mountain/valley appearance
 */
export const AccordionCreaseLine = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$leftPercent" && prop !== "$isMountain",
})<{ $leftPercent: number; $isMountain: boolean }>(
  ({ $leftPercent, $isMountain }) => ({
    position: "absolute",
    left: `${$leftPercent}%`,
    top: 0,
    bottom: 0,
    width: 2,
    zIndex: 5,
    pointerEvents: "none",
    background: $isMountain
      ? "linear-gradient(to right, rgba(255, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)"
      : "linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)",
    boxShadow: $isMountain
      ? "0 0 3px rgba(255, 255, 255, 0.25)"
      : "0 0 3px rgba(0, 0, 0, 0.2)",
  }),
);

// Backward-compatible aliases
export const TrifoldOverlay = AccordionOverlay;
export const TrifoldPanel = AccordionPanel;
export const TrifoldPanelContent = AccordionPanelContent;
export const TrifoldPanelShade = AccordionPanelShade;
export const TrifoldHingeLine = AccordionCreaseLine;

/**
 * Map overlay toolbar (controls for zoom in, zoom out, reset, replay fold)
 */
export const MapOverlayControls = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 12,
  top: 12,
  zIndex: 5,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "12px",
  padding: 4,
  border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    borderColor: alpha(theme.palette.divider, 0.2),
  }),
}));

export const MapControlButton = styled(IconButton)(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: "8px",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    color: theme.palette.primary.main,
  },
}));

/**
 * Bottom Footer Bar spanning the full width of the card
 */
export const FooterActionsBar = styled("footer")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "6px 12px",
  minHeight: 38,
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  width: "100%",
  boxSizing: "border-box",
  zIndex: 2,
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    borderTopColor: alpha(theme.palette.divider, 0.2),
  }),
}));

/**
 * Address info section in footer
 */
export const AddressContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 6,
  minWidth: 0,
  flex: "1 1 auto",
  overflow: "hidden",
});

export const AddressLabelText = styled("span")(({ theme }) => ({
  fontSize: "0.8rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

/**
 * Footer action buttons group
 */
export const FooterButtonsGroup = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 6,
  flexShrink: 0,
});

/**
 * Copy action button in footer
 */
export const CopyActionButton = styled(IconButton)(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: "8px",
  color: theme.palette.text.secondary,
  border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    color: theme.palette.primary.main,
    borderColor: alpha(theme.palette.primary.main, 0.4),
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));
