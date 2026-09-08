import { styled } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import {
  M3_SPRINGS,
  M3_MOTION_DURATIONS,
  M3_MOTION_EASINGS,
} from "~/tokens/motion";
import {
  type SwitchSize,
  type SwitchSizeConfig,
  SWITCH_SIZE_CONFIGS,
} from "~/components/atoms/Switch";

export type { SwitchSize, SwitchSizeConfig };
export { SWITCH_SIZE_CONFIGS };

export const DEFAULT_THUMB_SPRING: Transition = M3_SPRINGS.celestialThumb;
export const DEFAULT_PEEK_SPRING: Transition = M3_SPRINGS.celestialPeek;

export const filterDollarProp = (prop: PropertyKey) =>
  typeof prop === "string" && !prop.startsWith("$");

export const FancyTrack = styled(motion.button, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: SwitchSizeConfig;
  $checked: boolean;
  $disabled: boolean;
  $customBackground?: string;
  $customBorder?: string;
  $customShadow?: string;
}>(({
  theme,
  $cfg,
  $checked,
  $disabled,
  $customBackground,
  $customBorder,
  $customShadow,
}) => {
  const primary = theme.palette.primary.main;
  const outline = theme.palette.text.secondary;
  const surfaceContainerHighest =
    theme.palette.surfaceContainerHighest || theme.palette.background.paper;

  const defaultBorder = $checked
    ? `2px solid ${primary}`
    : `2px solid ${outline}`;
  const defaultBackground = $checked ? primary : surfaceContainerHighest;

  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    width: $cfg.width,
    height: $cfg.height,
    padding: 0,
    borderRadius: $cfg.borderRadius,
    cursor: $disabled ? "not-allowed" : "pointer",
    boxSizing: "border-box",
    border: $customBorder ? `2px solid ${$customBorder}` : defaultBorder,
    background: $customBackground || defaultBackground,
    boxShadow: $customShadow,
    opacity: $disabled ? 0.38 : 1,
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    transition:
      "background 0.25s ease, border-color 0.25s ease, opacity 0.2s ease, box-shadow 0.25s ease",

    "&:focus-visible": {
      outline: "none",
      borderColor: primary,
      boxShadow: `0 0 0 2px ${theme.palette.background.default}, 0 0 0 4px ${primary}`,
    },
  };
});

export const FancyThumb = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: SwitchSizeConfig;
  $customColor?: string;
  $customShadow?: string;
  $checked: boolean;
}>(({ theme, $cfg, $customColor, $customShadow, $checked }) => {
  const onPrimary =
    theme.palette.primary.contrastText || theme.palette.common.white;
  const defaultBg = $checked ? onPrimary : theme.palette.primary.main;

  return {
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
    background: $customColor || defaultBg,
    boxShadow: $customShadow || "0 1px 3px rgba(0, 0, 0, 0.22)",
    ...theme.applyStyles("dark", {
      boxShadow: $customShadow || "0 0 0 1px rgba(255, 255, 255, 0.14)",
    }),
  };
});

export const PeekingAnchor = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{
  $position?: "left" | "right" | "bottom" | "top";
  $cfg: SwitchSizeConfig;
}>(({ $position = "right", $cfg }) => ({
  position: "absolute",
  top: $position === "bottom" ? "auto" : $cfg.padY - 2,
  bottom: $position === "bottom" ? 0 : "auto",
  [$position === "left" ? "left" : "right"]: $cfg.padX - 2,
  width: $cfg.thumbSize,
  height: $cfg.thumbSize,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  pointerEvents: "none",
}));

export const DisabledTooltipWrapper = styled("span")({
  display: "inline-flex",
});

export const ToggleWrapper = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const TrackHoloZone = styled("div", {
  shouldForwardProp: filterDollarProp,
})<{
  $position: "left" | "right";
  $cfg: SwitchSizeConfig;
}>(({ $position, $cfg }) => ({
  position: "absolute",
  top: "50%",
  [$position === "left" ? "left" : "right"]: $cfg.padX + 1,
  transform: "translateY(-50%)",
  width: $cfg.thumbSize,
  height: $cfg.thumbSize,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  pointerEvents: "none",
}));

export const HoloGlyphWrapper = styled("div", {
  shouldForwardProp: filterDollarProp,
})<{
  $active: boolean;
  $activeColor: string;
  $isHovered?: boolean;
}>(({ theme, $active, $activeColor, $isHovered }) => {
  const restingOpacity = $active ? 0.5 : 0.32;
  const restingFilter = $active
    ? `drop-shadow(0 0 3px ${$activeColor})`
    : "none";

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: $active || $isHovered ? $activeColor : theme.palette.text.secondary,
    opacity: $isHovered ? ($active ? 1 : 0.8) : restingOpacity,
    transform: $isHovered ? "scale(1.15)" : "scale(1)",
    transition: `all ${M3_MOTION_DURATIONS.medium2}ms ${M3_MOTION_EASINGS.css.standard}`,
    filter: $isHovered
      ? `drop-shadow(0 0 5px ${$activeColor}) drop-shadow(0 0 2px ${$activeColor})`
      : restingFilter,
  };
});

export const CountryMapZone = styled("div", {
  shouldForwardProp: filterDollarProp,
})<{
  $position: "left" | "right";
  $cfg: SwitchSizeConfig;
}>(({ $position, $cfg }) => ({
  position: "absolute",
  top: "50%",
  [$position === "left" ? "left" : "right"]: 1,
  transform: "translateY(-50%)",
  width: $cfg.mapWidth,
  height: $cfg.mapHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  pointerEvents: "none",
}));

export const GlyphMotionCenter = styled(motion.div)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const PedestrianMirrorBox = styled("div", {
  shouldForwardProp: filterDollarProp,
})<{ $isMirrored: boolean }>(({ $isMirrored }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: $isMirrored ? "scaleX(-1)" : "scaleX(1)",
  transformOrigin: "center center",
  transition: `transform ${M3_MOTION_DURATIONS.short4}ms ${M3_MOTION_EASINGS.css.standard}`,
}));

export const PeekingCompanionLayer = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{ $size: number }>(({ theme, $size }) => ({
  position: "absolute",
  top: "50%",
  left: 0,
  width: $size,
  height: $size,
  marginTop: -$size / 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  pointerEvents: "none",
  color: theme.palette.text.primary,
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25))",
}));

export const InactiveDigitalSlot = styled("div", {
  shouldForwardProp: filterDollarProp,
})<{
  $position: "left" | "right";
  $cfg: SwitchSizeConfig;
}>(({ $position, $cfg }) => ({
  position: "absolute",
  top: "50%",
  [$position === "left" ? "left" : "right"]: $cfg.padX,
  transform: "translateY(-50%)",
  width: $cfg.thumbSize,
  height: $cfg.thumbSize,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  pointerEvents: "none",
}));

export const TransitClockWrapper = styled(motion.div)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
}));

export const ArcOverlaySvg = styled("svg")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
  color: theme.palette.text.secondary,
}));

export const StateRippleLayer = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: SwitchSizeConfig;
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
