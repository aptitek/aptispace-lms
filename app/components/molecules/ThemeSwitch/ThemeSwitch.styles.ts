import React, { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { motion, type HTMLMotionProps, type Transition } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
import {
  type SwitchSize,
  type SwitchSizeConfig,
  SWITCH_SIZE_CONFIGS,
  FancyTrack as SwitchTrack,
  FancyThumb as CelestialThumb,
  DisabledTooltipWrapper,
  ToggleWrapper,
  filterDollarProp,
} from "~/components/molecules/FancySwitch";

export type { SwitchSize, SwitchSizeConfig };
export {
  SWITCH_SIZE_CONFIGS as SIZE_CONFIGS,
  SwitchTrack,
  CelestialThumb,
  DisabledTooltipWrapper,
  ToggleWrapper,
  filterDollarProp,
};

export const SPRING_TRANSITION: Transition = M3_SPRINGS.celestialThumb;
export const PEEK_SPRING: Transition = M3_SPRINGS.celestialPeek;

export const ArcOverlaySvg = styled("svg")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
});

interface MotionDivProps extends HTMLMotionProps<"div"> {
  $position?: "left" | "right";
  $cfg?: SwitchSizeConfig;
  $isDark?: boolean;
}

const CleanMotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ $position: _p, $cfg: _c, $isDark: _d, ...props }, ref) =>
    React.createElement(motion.div, { ref, ...props }),
);
CleanMotionDiv.displayName = "CleanMotionDiv";

export const HorizonPeekWrapper = styled(CleanMotionDiv)<{
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

export const StateRippleLayer = styled(CleanMotionDiv)<{
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
