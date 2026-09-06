import { styled, alpha, type Theme } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
import {
  Switch,
  type SwitchSize,
  type SwitchSizeConfig,
  SWITCH_SIZE_CONFIGS,
  filterDollarProp,
} from "~/components/atoms/Switch";

export type { SwitchSize };
export { SWITCH_SIZE_CONFIGS as SIZE_CONFIGS };

export const SPRING_TRANSITION: Transition = M3_SPRINGS.celestialThumb;
export const PEEK_SPRING: Transition = M3_SPRINGS.celestialPeek;

function getZenithTrackColors(theme: Theme, isDark: boolean) {
  const bgPaper = theme.palette.background.paper;
  const bgDefault = theme.palette.background.default;
  const primaryMain = theme.palette.primary.main;
  const warningMain = theme.palette.warning.main;

  if (isDark) {
    return {
      bg: bgDefault,
      gradient: `linear-gradient(180deg, ${bgPaper} 0%, ${bgDefault} 100%)`,
      shadow: `0 0 0 1px ${theme.palette.divider}`,
      hoverBorder: primaryMain,
      hoverShadow: `inset 0 1px 3px ${theme.palette.action.disabledBackground}, 0 0 12px ${primaryMain}`,
      focusBorder: primaryMain,
      focusShadow: `0 0 0 2px ${bgDefault}, 0 0 0 4px ${primaryMain}, 0 0 16px ${theme.palette.primary.light}`,
      rippleBg: theme.palette.action.hover,
    };
  }

  return {
    bg: bgPaper,
    gradient: `linear-gradient(180deg, ${bgDefault} 0%, ${bgPaper} 100%)`,
    shadow: `inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 8px ${theme.palette.action.hover}`,
    hoverBorder: warningMain,
    hoverShadow: `inset 0 1px 3px ${alpha(theme.palette.common.black, 0.15)}, 0 0 12px ${theme.palette.warning.light}`,
    focusBorder: warningMain,
    focusShadow: `0 0 0 2px ${bgDefault}, 0 0 0 4px ${warningMain}, 0 0 16px ${theme.palette.warning.light}`,
    rippleBg: theme.palette.action.selected,
  };
}

function getZenithThumbColors(theme: Theme, isDark: boolean) {
  if (isDark) {
    return {
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      shadow: `0 0 12px ${theme.palette.primary.main}, 0 0 0 1px rgba(255, 255, 255, 0.2)`,
    };
  }

  return {
    gradient: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
    shadow: `0 0 14px ${theme.palette.warning.light}, 0 2px 5px rgba(0, 0, 0, 0.2)`,
  };
}

export const ZenithBaseSwitch = styled(Switch, {
  shouldForwardProp: filterDollarProp,
})<{
  $isDark: boolean;
}>(({ theme, $isDark }) => {
  const track = getZenithTrackColors(theme, $isDark);
  const thumb = getZenithThumbColors(theme, $isDark);

  return {
    "&.md3-switch-track": {
      border: `2px solid ${theme.palette.divider}`,
      backgroundColor: track.bg,
      backgroundImage: track.gradient,
      boxShadow: track.shadow,

      "&:hover": {
        borderColor: track.hoverBorder,
        boxShadow: track.hoverShadow,
      },

      "&:focus-visible": {
        outline: "none",
        borderColor: track.focusBorder,
        boxShadow: track.focusShadow,
      },

      "& .md3-switch-thumb": {
        background: thumb.gradient,
        boxShadow: thumb.shadow,
      },

      "& .md3-switch-ripple": {
        backgroundColor: track.rippleBg,
      },
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

export const HorizonPeekWrapper = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "$cfg" && prop !== "$position",
})<{
  $cfg: SwitchSizeConfig;
  $position: "left" | "right";
}>(({ $cfg, $position }) => ({
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
