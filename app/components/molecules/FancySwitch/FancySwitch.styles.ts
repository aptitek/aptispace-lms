import { styled } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
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
}>(({ theme, $cfg, $checked, $disabled, $customBackground, $customBorder }) => {
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
    backgroundColor: $customBackground || defaultBackground,
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

export const FancyThumb = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: SwitchSizeConfig;
  $customColor?: string;
  $checked: boolean;
}>(({ theme, $cfg, $customColor, $checked }) => {
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
    backgroundColor: $customColor || defaultBg,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.22)",
    ...theme.applyStyles("dark", {
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.14)",
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
