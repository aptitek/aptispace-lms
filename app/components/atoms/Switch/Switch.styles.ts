import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { M3_SHAPE_CORNERS } from "~/tokens/shapes";

export type SwitchSize = "small" | "medium" | "large";

export interface SwitchSizeConfig {
  width: number;
  height: number;
  borderRadius: number;
  thumbSize: number;
  thumbSizeUnchecked: number;
  thumbIconSize: number;
  travelX: number;
  padX: number;
  padY: number;
  stateLayerSize: number;
  // Shared decorative geometry
  peekIconSize: number;
  mapWidth: number;
  mapHeight: number;
  planeSize: number;
  flagSize: number;
  puckSize: number;
  arcPeakY: number;
  arcBaseY: number;
}

export const SWITCH_SIZE_CONFIGS: Record<SwitchSize, SwitchSizeConfig> = {
  small: {
    width: 46,
    height: 26,
    borderRadius: M3_SHAPE_CORNERS.full,
    thumbSize: 20,
    thumbSizeUnchecked: 16,
    thumbIconSize: 12,
    travelX: 20,
    padX: 3,
    padY: 3,
    stateLayerSize: 34,
    peekIconSize: 11,
    mapWidth: 18,
    mapHeight: 16,
    planeSize: 13,
    flagSize: 15,
    puckSize: 20,
    arcPeakY: 2,
    arcBaseY: 22,
  },
  medium: {
    width: 56,
    height: 32,
    borderRadius: 16,
    thumbSize: 24,
    thumbSizeUnchecked: 18,
    thumbIconSize: 15,
    travelX: 24,
    padX: 4,
    padY: 4,
    stateLayerSize: 42,
    peekIconSize: 13,
    mapWidth: 22,
    mapHeight: 20,
    planeSize: 16,
    flagSize: 18,
    puckSize: 24,
    arcPeakY: 3,
    arcBaseY: 27,
  },
  large: {
    width: 72,
    height: 40,
    borderRadius: 20,
    thumbSize: 30,
    thumbSizeUnchecked: 22,
    thumbIconSize: 18,
    travelX: 32,
    padX: 5,
    padY: 5,
    stateLayerSize: 52,
    peekIconSize: 15,
    mapWidth: 28,
    mapHeight: 25,
    planeSize: 21,
    flagSize: 23,
    puckSize: 30,
    arcPeakY: 4,
    arcBaseY: 34,
  },
} as const;

export const filterDollarProp = (prop: PropertyKey) =>
  typeof prop === "string" && !prop.startsWith("$");

export const SwitchTrack = styled(motion.button, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: SwitchSizeConfig;
  $checked: boolean;
  $disabled: boolean;
}>(({ theme, $cfg, $checked, $disabled }) => {
  const primary = theme.palette.primary.main;
  const outline = theme.palette.text.secondary;
  const surfaceContainerHighest =
    theme.palette.surfaceContainerHighest || theme.palette.background.paper;

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
    border: $checked ? `2px solid ${primary}` : `2px solid ${outline}`,
    backgroundColor: $checked ? primary : surfaceContainerHighest,
    opacity: $disabled ? 0.38 : 1,
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    transition:
      "background-color 0.25s ease, border-color 0.25s ease, opacity 0.2s ease, box-shadow 0.25s ease",

    "&:focus-visible": {
      outline: "none",
      borderColor: primary,
      boxShadow: `0 0 0 2px ${theme.palette.background.default}, 0 0 0 4px ${primary}`,
    },
  };
});

export const SwitchThumb = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: SwitchSizeConfig;
  $checked: boolean;
  $isPressed: boolean;
  $hasIcon: boolean;
}>(({ theme, $cfg, $checked, $hasIcon: _hasIcon }) => {
  const onPrimary =
    theme.palette.primary.contrastText || theme.palette.common.white;

  return {
    position: "absolute",
    top: $cfg.padY - 2,
    left: $cfg.padX - 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: $checked ? onPrimary : theme.palette.text.secondary,
    color: $checked
      ? theme.palette.primary.main
      : theme.palette.surfaceContainerHighest || theme.palette.background.paper,
    pointerEvents: "none",
    zIndex: 3,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
    ...theme.applyStyles("dark", {
      ...(!$checked && {
        backgroundColor:
          theme.palette.action.active || theme.palette.text.primary,
      }),
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.12)",
    }),
    svg: {
      width: $cfg.thumbIconSize,
      height: $cfg.thumbIconSize,
    },
  };
});

export const SwitchRippleLayer = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: SwitchSizeConfig;
  $checked: boolean;
}>(({ theme, $cfg, $checked }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: $cfg.stateLayerSize,
  height: $cfg.stateLayerSize,
  borderRadius: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: $checked
    ? theme.palette.primary.main
    : theme.palette.text.primary,
  opacity: 0.12,
  pointerEvents: "none",
  zIndex: 0,
}));
