import { styled, alpha } from "@mui/material/styles";
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
    gap: isExtended ? 10 : 8,
    boxSizing: "border-box",
    minWidth: 0,
    overflow: "visible",
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
  gap: 8,
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
 * Dotted line connecting adjacent itinerary nodes
 */
export const TransitTrackLine = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 16,
  left: 13,
  bottom: 8,
  width: 2,
  borderLeft: `2px dashed ${alpha(theme.palette.primary.main, 0.35)}`,
  zIndex: 1,
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
    building: theme.palette.info.main,
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
    backgroundColor: alpha(color, 0.12),
    color: color,
    border: `1px solid ${alpha(color, 0.25)}`,
    flexShrink: 0,
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

/**
 * Expressive Room & Floor Chip: (3 | 02)
 */
export const RoomChipContainer = styled("div")(({ theme }) => {
  const color = theme.palette.secondary.main;
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 14px",
    borderRadius: "9px",
    backgroundColor: alpha(color, 0.08),
    border: `1px solid ${alpha(color, 0.32)}`,
    color: theme.palette.secondary.dark || color,
    fontSize: "0.95rem",
    fontWeight: 800,
    fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    width: "fit-content",
    boxShadow: `0 1px 3px ${alpha(color, 0.08)}`,
    lineHeight: 1.3,
    userSelect: "none",
    transition:
      "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      borderColor: color,
      boxShadow: `0 2px 8px ${alpha(color, 0.2)}`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(color, 0.14),
      borderColor: alpha(color, 0.45),
      color: theme.palette.secondary.light || color,
      boxShadow: `0 1px 5px ${alpha(color, 0.22)}`,
    }),
  };
});

/**
 * Room chip floor pill badge
 */
export const FloorPill = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  color: "inherit",
  fontWeight: 800,
  fontSize: "inherit",
  userSelect: "none",
});

/**
 * Vertical divider inside room chip
 */
export const ChipDivider = styled("span")(({ theme }) => ({
  color: alpha(theme.palette.secondary.main, 0.45),
  fontWeight: 500,
  fontSize: "inherit",
  margin: "0 2px",
  userSelect: "none",
}));

/**
 * Room chip room number badge
 */
export const RoomPill = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  color: "inherit",
  fontWeight: 800,
  fontSize: "inherit",
  letterSpacing: "0.02em",
  userSelect: "none",
});

/**
 * Tactical instruction box for door security codes and entrance notes
 */
export const InstructionBox = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: "4px 8px",
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.warning.main, 0.07),
  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
  marginTop: 2,
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    borderColor: alpha(theme.palette.warning.main, 0.25),
  }),
}));

/**
 * Door code display pill with one-click copy button
 */
export const DoorCodePill = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "2px 8px",
  borderRadius: "7px",
  backgroundColor: alpha(theme.palette.error.main, 0.08),
  border: `1px dashed ${alpha(theme.palette.error.main, 0.42)}`,
  fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontWeight: 800,
  fontSize: "0.78rem",
  letterSpacing: "0.04em",
  color: theme.palette.error.dark || theme.palette.error.main,
  width: "fit-content",
  lineHeight: 1.3,
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    borderColor: alpha(theme.palette.error.main, 0.5),
    color: theme.palette.error.light || theme.palette.error.main,
  }),
}));

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
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.default, 0.45),
    borderTopColor: alpha(theme.palette.divider, 0.2),
  }),
}));

/**
 * Address text container with truncated overflow protection
 */
export const AddressTextWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 6,
  minWidth: 0,
  flex: 1,
});

/**
 * Row holding wayfinding chips (Campus, Building, Room, Code)
 */
export const ChipsDeckRow = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 6,
  flexWrap: "wrap",
  minWidth: 0,
});

/**
 * Expressive Wayfinding Chip for Campus, Building, and Instructions
 */
export const WayfindingChip = styled("div", {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant?: "campus" | "building" | "instruction" }>(({
  theme,
  $variant = "campus",
}) => {
  const isCampus = $variant === "campus";
  const isInstruction = $variant === "instruction";
  const colorObj = isCampus
    ? theme.palette.success
    : isInstruction
      ? theme.palette.warning
      : theme.palette.info;
  const color = colorObj.main;

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 8px",
    borderRadius: "8px",
    backgroundColor: alpha(color, 0.08),
    border: `1px solid ${alpha(color, 0.3)}`,
    color: colorObj.dark || color,
    fontSize: "0.75rem",
    fontWeight: 700,
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    userSelect: "none",
    boxShadow: `0 1px 2px ${alpha(color, 0.06)}`,
    transition:
      "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      borderColor: color,
      boxShadow: `0 2px 6px ${alpha(color, 0.18)}`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(color, 0.14),
      borderColor: alpha(color, 0.42),
      color: colorObj.light || color,
    }),
    "& span": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  };
});
