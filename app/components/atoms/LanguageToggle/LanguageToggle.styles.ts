import { styled } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";

export type MeridianSize = "small" | "medium" | "large";

export const MERIDIAN_SIZE_CONFIGS = {
  small: {
    width: 54,
    height: 26,
    borderRadius: 13,
    puckSize: 20,
    flagSize: 15,
    planeSize: 14,
    mapWidth: 20,
    mapHeight: 18,
    travelX: 28, // 54 - 20 - 3 - 3 = 28
    padX: 3,
    padY: 3,
    stateLayerSize: 36,
    codeFontSize: "0.6rem",
  },
  medium: {
    width: 64,
    height: 32,
    borderRadius: 16,
    puckSize: 24,
    flagSize: 18,
    planeSize: 17,
    mapWidth: 24,
    mapHeight: 22,
    travelX: 32, // 64 - 24 - 4 - 4 = 32
    padX: 4,
    padY: 4,
    stateLayerSize: 44,
    codeFontSize: "0.7rem",
  },
  large: {
    width: 80,
    height: 40,
    borderRadius: 20,
    puckSize: 30,
    flagSize: 23,
    planeSize: 22,
    mapWidth: 30,
    mapHeight: 27,
    travelX: 40, // 80 - 30 - 5 - 5 = 40
    padX: 5,
    padY: 5,
    stateLayerSize: 54,
    codeFontSize: "0.85rem",
  },
} as const;

export const FLIGHT_SPRING: Transition = {
  type: "spring",
  stiffness: 440,
  damping: 26,
  mass: 0.75,
};

export const BEACON_SPRING: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 20,
  mass: 0.6,
};

const filterDollarProp = (prop: PropertyKey) =>
  typeof prop === "string" && !prop.startsWith("$");

export const MeridianTrack = styled(motion.button, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
  $disabled?: boolean;
}>(({ theme, $cfg, $disabled }) => {
  const primaryMain = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const bgPaper = theme.palette.background.paper;
  const bgDefault = theme.palette.background.default;

  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    width: $cfg.width,
    height: $cfg.height,
    padding: 0,
    borderRadius: $cfg.borderRadius,
    cursor: $disabled ? "not-allowed" : "pointer",
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: bgDefault,
    backgroundImage: `linear-gradient(180deg, ${bgPaper} 0%, ${bgDefault} 100%)`,
    boxShadow: `inset 0 1px 3px rgba(0, 0, 0, 0.4), 0 0 8px ${theme.palette.action.hover}`,
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    opacity: $disabled ? 0.45 : 1,
    WebkitTapHighlightColor: "transparent",
    boxSizing: "border-box",
    transition:
      "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.2s ease",

    "&:hover": {
      borderColor: primaryMain,
      boxShadow: `inset 0 1px 3px rgba(0, 0, 0, 0.4), 0 0 12px ${primaryMain}`,
    },

    "&:focus-visible": {
      outline: "none",
      borderColor: primaryMain,
      boxShadow: `0 0 0 2px ${bgDefault}, 0 0 0 4px ${primaryMain}, 0 0 16px ${primaryLight}`,
    },
  };
});

export const FlightArcSvg = styled("svg")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
});

export const CountryMapZone = styled("div")<{
  $position: "left" | "right";
  $cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
}>(({ $position, $cfg }) => ({
  position: "absolute",
  top: "50%",
  [$position === "left" ? "left" : "right"]: $cfg.padX + 1,
  transform: "translateY(-50%)",
  width: $cfg.mapWidth,
  height: $cfg.mapHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  pointerEvents: "none",
}));

export const FlightPuck = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
}>(({ theme, $cfg }) => ({
  position: "absolute",
  top: $cfg.padY - 2,
  left: $cfg.padX - 2,
  width: $cfg.puckSize,
  height: $cfg.puckSize,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 4,
  cursor: "inherit",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 2px 6px rgba(0, 0, 0, 0.4)`,
}));

export const AirplaneFlightContainer = styled(motion.div)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 5,
  pointerEvents: "none",
});

export const AirportCodeBadge = styled("span")<{
  $cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
}>(({ theme, $cfg }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: $cfg.codeFontSize,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
  userSelect: "none",
  zIndex: 2,
  lineHeight: 1,
}));

export const StateRippleLayer = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
}>(({ theme, $cfg }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: $cfg.stateLayerSize,
  height: $cfg.stateLayerSize,
  borderRadius: "50%",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
  zIndex: 0,
  backgroundColor: theme.palette.action.hover,
}));

export const ToggleWrapper = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));
