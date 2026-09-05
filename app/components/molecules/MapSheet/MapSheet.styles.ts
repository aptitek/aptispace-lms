import { styled, alpha } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import { Progress } from "react-material-expressive";
export {
  DoorCodePill,
  ChipsDeckWrapper,
  ChipsDeckRow,
  WayfindingChip,
  AddressTextWrapper,
} from "./MapSheetChips.styles";
import type {
  MapSheetSize,
  MapSheetOrientation,
  MapSheetMode,
} from "./MapSheet.types";

interface StyledContainerProps {
  $size: MapSheetSize;
  $orientation: MapSheetOrientation;
  $mode: MapSheetMode;
}

export const SIZE_METRICS = {
  small: {
    minHeight: 124,
    maxHeight: 160,
    maxWidth: 460,
    fontSize: "0.72rem",
    iconSize: "0.85rem",
    padding: "8px 10px",
    gap: 0.75,
    chipScale: 0.82,
    mapFlex: "0 0 38%",
  },
  medium: {
    minHeight: 160,
    maxHeight: 210,
    maxWidth: 580,
    fontSize: "0.78rem",
    iconSize: "0.95rem",
    padding: "10px 12px",
    gap: 1,
    chipScale: 0.9,
    mapFlex: "0 0 40%",
  },
  large: {
    minHeight: 195,
    maxHeight: 250,
    maxWidth: 680,
    fontSize: "0.85rem",
    iconSize: "1.1rem",
    padding: "12px 14px",
    gap: 1.25,
    chipScale: 1,
    mapFlex: "0 0 42%",
  },
};

interface SheetDimensions {
  maxWidth: number | string;
  minHeight: number;
  height: number | string;
  maxHeight: number | string;
}

function getExtendedDimensions(isHorizontal: boolean): SheetDimensions {
  return {
    maxWidth: isHorizontal ? 920 : 560,
    minHeight: isHorizontal ? 380 : 320,
    height: isHorizontal ? 400 : "auto",
    maxHeight: "none",
  };
}

function getCompactDimensions(
  isHorizontal: boolean,
  metrics: { maxWidth: number; minHeight: number; maxHeight: number },
): SheetDimensions {
  return {
    maxWidth: isHorizontal ? metrics.maxWidth : 440,
    minHeight: metrics.minHeight,
    height: "auto",
    maxHeight: "none",
  };
}

function getSheetDimensions(
  isExtended: boolean,
  isHorizontal: boolean,
  metrics: { maxWidth: number; minHeight: number; maxHeight: number },
): SheetDimensions {
  if (isExtended) {
    return getExtendedDimensions(isHorizontal);
  }
  return getCompactDimensions(isHorizontal, metrics);
}

/**
 * Root card surface with tactile paper elevation, delicate borders, and solarized depth
 */
export const SheetCard = styled("article", {
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$orientation" && prop !== "$mode",
})<StyledContainerProps>(({ theme, $size, $orientation, $mode }) => {
  const metrics = SIZE_METRICS[$size];
  const isHorizontal = $orientation === "horizontal";
  const isExtended = $mode === "extended";
  const dimensions = getSheetDimensions(isExtended, isHorizontal, metrics);

  return {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: dimensions.maxWidth,
    minHeight: dimensions.minHeight,
    height: dimensions.height,
    maxHeight: dimensions.maxHeight,
    borderRadius: "16px",
    backgroundColor: alpha(theme.palette.background.paper, 0.96),
    border: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
    boxShadow: `0 8px 24px -6px rgba(0, 43, 54, 0.1), 0 1px 4px rgba(0, 0, 0, 0.04)`,
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    overflow: "hidden",
    boxSizing: "border-box",
    transition: "box-shadow 0.25s ease, border-color 0.25s ease",
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.paper, 0.94),
      borderColor: alpha(theme.palette.divider, 0.25),
      boxShadow: `0 10px 28px -6px rgba(0, 0, 0, 0.5), 0 0 0 1px ${alpha(theme.palette.divider, 0.12)}`,
    }),
    "&:hover": {
      boxShadow: `0 12px 30px -6px ${alpha(theme.palette.primary.main, 0.2)}`,
      borderColor: alpha(theme.palette.primary.main, 0.4),
      ...theme.applyStyles("dark", {
        boxShadow: `0 14px 36px -8px ${alpha(theme.palette.primary.main, 0.28)}`,
      }),
    },
    "@media (max-width: 768px)": {
      flexDirection: "column",
      maxWidth: "100%",
      height: "auto",
      maxHeight: "none",
    },
  };
});

// Re-export viewport styles
export * from "./MapSheetViewport.styles";

/**
 * Right / bottom side container presenting the wayfinding itinerary
 */
export const ItineraryContainer = styled("section", {
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$orientation" && prop !== "$mode",
})<StyledContainerProps>(({ theme, $size, $orientation, $mode }) => {
  const metrics = SIZE_METRICS[$size];
  const isHorizontal = $orientation === "horizontal";
  const isExtended = $mode === "extended";

  return {
    flex: isHorizontal ? (isExtended ? "1 1 48%" : "1 1 58%") : "1 1 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: isExtended ? "space-between" : "center",
    padding: metrics.padding,
    paddingBottom: isExtended ? 24 : undefined,
    gap: isExtended ? 10 : 8,
    boxSizing: "border-box",
    minWidth: 0,
    overflow: "visible",
    height: isExtended ? "100%" : "auto",
    backgroundColor: "transparent",
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.default, 0.25),
    }),
  };
});

/**
 * Vertical transit-style connector line linking steps
 */
export const TransitLineWrapper = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  minHeight: 250,
  minWidth: 0,
});

/**
 * Individual itinerary step item
 */
export const ItineraryStep = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
});

/**
 * Container wrapping the vertical wavy connector line linking itinerary nodes
 */
export const TransitTrackWrapper = styled("div")({
  position: "absolute",
  top: 14,
  left: 0,
  bottom: 14,
  width: 28,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 1,
});

/**
 * MD3 Expressive wavy progress indicator rotated 90 degrees to form the vertical itinerary transit line
 */
export const TransitTrackProgress = styled(Progress)(({ theme }) => ({
  position: "absolute",
  left: 14,
  top: 0,
  transform: "rotate(90deg) translateY(-5px)",
  transformOrigin: "0 0",
  width: "1000px !important",
  color: theme.palette.primary.main,
  filter: `drop-shadow(0 0 4px ${alpha(theme.palette.primary.main, 0.45)})`,
  "& .linearDeterminate": {
    overflow: "visible !important",
  },
  "& .text-primary": {
    color: "inherit !important",
  },
  "& .bg-secondary-container": {
    display: "none !important",
  },
  "& span.rounded-full": {
    display: "none !important",
  },
  "& .wavePhase": {
    animationDirection: "reverse !important",
  },
  "@media (prefers-reduced-motion: reduce)": {
    "& .wavePhase": {
      animation: "none !important",
    },
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.primary.light || theme.palette.primary.main,
    filter: `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.65)})`,
  }),
}));

/**
 * Container wrapping the horizontal wavy connector line linking chips in vertical view
 */
export const HorizontalTransitTrackWrapper = styled("div")({
  position: "absolute",
  left: 0,
  right: 0,
  top: "50%",
  transform: "translateY(-50%)",
  height: 20,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 0,
  maxWidth: "100%",
});

/**
 * MD3 Expressive wavy progress indicator running horizontally from left to right
 */
export const HorizontalTransitTrackProgress = styled(Progress)(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
  width: "100% !important",
  color: theme.palette.primary.main,
  opacity: 0.85,
  filter: `drop-shadow(0 0 4px ${alpha(theme.palette.primary.main, 0.45)})`,
  "& .linearDeterminate": {
    overflow: "visible !important",
  },
  "& .text-primary": {
    color: "inherit !important",
  },
  "& .bg-secondary-container": {
    display: "none !important",
  },
  "& span.rounded-full": {
    display: "none !important",
  },
  "& .wavePhase": {
    animationDirection: "reverse !important",
  },
  "@media (prefers-reduced-motion: reduce)": {
    "& .wavePhase": {
      animation: "none !important",
    },
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.primary.light || theme.palette.primary.main,
    filter: `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.65)})`,
  }),
}));

/**
 * Stylized icon node for itinerary waypoints
 */
export const StepIconBadge = styled("div", {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant?: "campus" | "building" | "room" | "instruction" }>(({
  theme,
  $variant = "campus",
}) => {
  const colorMap = {
    campus: theme.palette.success.main,
    building: theme.palette.primary.main,
    room: theme.palette.secondary.main,
    instruction: theme.palette.warning.main,
  };
  const color = colorMap[$variant];

  return {
    position: "relative",
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.paper,
    backgroundImage: `linear-gradient(${alpha(color, 0.15)}, ${alpha(color, 0.15)})`,
    color: color,
    border: `1px solid ${alpha(color, 0.3)}`,
    flexShrink: 0,
    boxShadow: `0 1px 3px ${alpha(color, 0.1)}`,
  };
});

/**
 * Step content containing labels, titles, and details
 */
export const StepContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  flex: 1,
});

const ROOM_CHIP_SIZE_METRICS: Record<
  MapSheetSize,
  { fontSize: string; padding: string; borderRadius: string; gap: number }
> = {
  small: {
    fontSize: "1.1rem",
    padding: "5px 12px",
    borderRadius: "10px",
    gap: 6,
  },
  medium: {
    fontSize: "1.35rem",
    padding: "7px 18px",
    borderRadius: "12px",
    gap: 8,
  },
  large: {
    fontSize: "1.65rem",
    padding: "9px 22px",
    borderRadius: "14px",
    gap: 8,
  },
};

/**
 * Expressive Room & Floor Chip: (3 | 02)
 */
export const RoomChipContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$size",
})<{ $size?: MapSheetSize }>(({ theme, $size = "medium" }) => {
  const color = theme.palette.secondary.main;
  const metrics =
    ROOM_CHIP_SIZE_METRICS[$size] ?? ROOM_CHIP_SIZE_METRICS.medium;

  return {
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    alignItems: "center",
    gap: metrics.gap,
    padding: metrics.padding,
    borderRadius: metrics.borderRadius,
    backgroundColor: alpha(theme.palette.background.paper, 0.92),
    border: `1.5px solid ${alpha(color, 0.42)}`,
    color: theme.palette.secondary.dark || color,
    fontSize: metrics.fontSize,
    fontWeight: 900,
    fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    width: "fit-content",
    boxShadow: `0 2px 8px ${alpha(color, 0.16)}`,
    lineHeight: 1.25,
    userSelect: "none",
    letterSpacing: "0.02em",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    transition:
      "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      borderColor: color,
      boxShadow: `0 4px 14px ${alpha(color, 0.3)}`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.paper, 0.94),
      borderColor: alpha(color, 0.55),
      color: theme.palette.secondary.light || color,
      boxShadow: `0 2px 10px ${alpha(color, 0.3)}`,
    }),
  };
});

/**
 * Room chip floor pill badge
 */
export const FloorPill = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  color: "inherit",
  fontWeight: 900,
  fontSize: "inherit",
  userSelect: "none",
  "& svg": {
    fontSize: "1.15em",
  },
});

/**
 * Vertical divider inside room chip
 */
export const ChipDivider = styled("span")(({ theme }) => ({
  color: alpha(theme.palette.secondary.main, 0.45),
  fontWeight: 400,
  fontSize: "inherit",
  margin: "0 3px",
  userSelect: "none",
  opacity: 0.7,
}));

/**
 * Room chip room number badge
 */
export const RoomPill = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  color: "inherit",
  fontWeight: 900,
  fontSize: "inherit",
  letterSpacing: "0.02em",
  userSelect: "none",
  "& svg": {
    fontSize: "1.15em",
  },
});

/**
 * Main content body containing the map viewport and the wayfinding itinerary
 */
export const CardBodyWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "$orientation" && prop !== "$size",
})<{ $orientation: MapSheetOrientation; $size?: MapSheetSize }>(({
  $orientation,
  $size = "medium",
}) => {
  const metrics = SIZE_METRICS[$size];
  return {
    display: "flex",
    flexDirection: $orientation === "horizontal" ? "row" : "column",
    alignItems: "stretch",
    width: "100%",
    flex: "1 1 auto",
    minHeight: $orientation === "horizontal" ? metrics.minHeight : "auto",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  };
});

/**
 * Full-width bottom action strip for directions, copy address, and navigation
 */
export const BottomActionsBar = styled("footer")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "8px 14px",
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.75),
  backdropFilter: "blur(8px)",
  width: "100%",
  boxSizing: "border-box",
  minWidth: 0,
  flexShrink: 0,
  overflow: "visible",
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.default, 0.45),
    borderTopColor: alpha(theme.palette.divider, 0.2),
  }),
}));

/**
 * Material Design 3 (MD3) Circular Floating Action Button for Navigation / Directions
 * Features circular container shape (borderRadius: 50%), elevated floating shadow,
 * smooth cubic-bezier transitions, and high-contrast styling.
 */
export const NavigationM3Fab = styled(Fab, {
  shouldForwardProp: (prop) => prop !== "$fabSize",
})<{ $fabSize?: "small" | "medium" | "large" }>(({
  theme,
  $fabSize = "medium",
}) => {
  const sizePx = $fabSize === "small" ? 38 : $fabSize === "large" ? 48 : 44;
  const topOffsetPx =
    $fabSize === "small" ? -19 : $fabSize === "large" ? -24 : -22;

  return {
    position: "absolute",
    right: 14,
    top: topOffsetPx,
    width: sizePx,
    height: sizePx,
    minHeight: sizePx,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    zIndex: 10,
    boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.45)}, 0 3px 8px ${alpha(theme.palette.common.black, 0.25)}`,
    transition: "all 0.25s cubic-bezier(0.2, 0, 0, 1)",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      transform: "scale(1.08)",
      boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.6)}, 0 4px 12px ${alpha(theme.palette.common.black, 0.35)}`,
    },
    "&:active": {
      transform: "scale(0.96)",
      boxShadow: `0 3px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    "&.Mui-focusVisible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 3,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 6px 20px rgba(0, 0, 0, 0.55), 0 0 20px ${alpha(theme.palette.primary.main, 0.45)}`,
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        boxShadow: `0 10px 28px rgba(0, 0, 0, 0.65), 0 0 28px ${alpha(theme.palette.primary.main, 0.7)}`,
      },
    }),
  };
});
