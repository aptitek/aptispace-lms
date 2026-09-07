import { styled } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";

import type { SwitchSize, SwitchSizeConfig } from "~/components/atoms/Switch";
export type { SwitchSize, SwitchSizeConfig };
export { SWITCH_SIZE_CONFIGS as SIZE_CONFIGS } from "~/components/atoms/Switch";

export const SPRING_TRANSITION: Transition = M3_SPRINGS.celestialThumb;
export const PEEK_SPRING: Transition = M3_SPRINGS.celestialPeek;

export const filterDollarProp = (prop: PropertyKey) =>
  typeof prop === "string" && !prop.startsWith("$");

export { SwitchTrack } from "~/components/atoms/Switch";

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
  $cfg: SwitchSizeConfig;
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
  backgroundColor: $isDark
    ? theme.palette.primary.main
    : theme.palette.warning.main,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.12)",
  }),
}));

export const HorizonPeekWrapper = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{
  $position: "left" | "right";
  $cfg: SwitchSizeConfig;
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
