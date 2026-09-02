import { styled } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";

export type SwitchSize = "small" | "medium" | "large";

export const SIZE_CONFIGS = {
  small: {
    width: 46,
    height: 26,
    borderRadius: 13,
    thumbSize: 20,
    thumbIconSize: 13,
    peekIconSize: 11,
    travelX: 20,
    padX: 3,
    padY: 3,
    arcPeakY: 2,
    arcBaseY: 22,
    stateLayerSize: 34,
  },
  medium: {
    width: 56,
    height: 32,
    borderRadius: 16,
    thumbSize: 24,
    thumbIconSize: 15,
    peekIconSize: 13,
    travelX: 24,
    padX: 4,
    padY: 4,
    arcPeakY: 3,
    arcBaseY: 27,
    stateLayerSize: 42,
  },
  large: {
    width: 72,
    height: 40,
    borderRadius: 20,
    thumbSize: 30,
    thumbIconSize: 18,
    peekIconSize: 15,
    travelX: 32,
    padX: 5,
    padY: 5,
    arcPeakY: 4,
    arcBaseY: 34,
    stateLayerSize: 52,
  },
} as const;

export const SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 480,
  damping: 28,
  mass: 0.8,
};

export const PEEK_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 22,
  mass: 0.6,
};

const filterDollarProp = (prop: PropertyKey) =>
  typeof prop === "string" && !prop.startsWith("$");

export const SwitchTrack = styled(motion.button, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: (typeof SIZE_CONFIGS)[SwitchSize];
  $isDark: boolean;
  $disabled?: boolean;
}>(({ theme, $cfg, $isDark, $disabled }) => {
  const primaryMain = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const warningMain = theme.palette.warning.main;
  const warningLight = theme.palette.warning.light;
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
    backgroundColor: $isDark ? bgDefault : bgPaper,
    backgroundImage: $isDark
      ? `linear-gradient(180deg, ${bgPaper} 0%, ${bgDefault} 100%)`
      : `linear-gradient(180deg, ${bgDefault} 0%, ${bgPaper} 100%)`,
    boxShadow: $isDark
      ? `inset 0 1px 3px ${theme.palette.action.disabledBackground}, 0 0 8px ${theme.palette.action.hover}`
      : `inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 8px ${theme.palette.action.hover}`,
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    opacity: $disabled ? 0.45 : 1,
    WebkitTapHighlightColor: "transparent",
    boxSizing: "border-box",
    transition:
      "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.2s ease",

    "&:hover": {
      borderColor: $isDark ? primaryMain : warningMain,
      boxShadow: $isDark
        ? `inset 0 1px 3px ${theme.palette.action.disabledBackground}, 0 0 12px ${primaryMain}`
        : `inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 12px ${warningLight}`,
    },

    "&:focus-visible": {
      outline: "none",
      borderColor: $isDark ? primaryMain : warningMain,
      boxShadow: $isDark
        ? `0 0 0 2px ${bgDefault}, 0 0 0 4px ${primaryMain}, 0 0 16px ${primaryLight}`
        : `0 0 0 2px ${bgDefault}, 0 0 0 4px ${warningMain}, 0 0 16px ${warningLight}`,
    },
  };
});

export const ArcOverlaySvg = styled("svg")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
});

export const CelestialThumb = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: (typeof SIZE_CONFIGS)[SwitchSize];
  $isDark: boolean;
}>(({ theme, $cfg, $isDark }) => ({
  position: "absolute",
  top: $cfg.padY - 2,
  left: $cfg.padX - 2,
  width: $cfg.thumbSize,
  height: $cfg.thumbSize,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3,
  cursor: "inherit",
  background: $isDark
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
  boxShadow: $isDark
    ? `0 0 12px ${theme.palette.primary.main}, 0 2px 5px ${theme.palette.action.disabledBackground}`
    : `0 0 14px ${theme.palette.warning.light}, 0 2px 5px rgba(0, 0, 0, 0.2)`,
}));

export const HorizonPeekWrapper = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{
  $position: "left" | "right";
  $cfg: (typeof SIZE_CONFIGS)[SwitchSize];
}>(({ $position, $cfg }) => ({
  position: "absolute",
  top: $cfg.padY - 2,
  [$position === "left" ? "left" : "right"]: $cfg.padX - 2,
  width: $cfg.thumbSize,
  height: $cfg.thumbSize,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  pointerEvents: "none",
}));

export const StateRippleLayer = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: (typeof SIZE_CONFIGS)[SwitchSize];
  $isDark: boolean;
}>(({ theme, $cfg, $isDark }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: $cfg.stateLayerSize,
  height: $cfg.stateLayerSize,
  borderRadius: "50%",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
  zIndex: 0,
  backgroundColor: $isDark
    ? theme.palette.action.hover
    : theme.palette.action.selected,
}));

export const IconFlexWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const ToggleWrapper = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const DisabledTooltipWrapper = styled("span")({
  display: "inline-flex",
});
