import React, { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { motion, type HTMLMotionProps, type Transition } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
import {
  type SwitchSize,
  type SwitchSizeConfig as MeridianSizeConfig,
  SWITCH_SIZE_CONFIGS as MERIDIAN_SIZE_CONFIGS,
  FancyTrack as MeridianTrack,
  FancyThumb as FlightPuck,
  DisabledTooltipWrapper,
  ToggleWrapper,
  filterDollarProp,
} from "~/components/molecules/FancySwitch";

export type { SwitchSize, MeridianSizeConfig };
export {
  MERIDIAN_SIZE_CONFIGS,
  MeridianTrack,
  FlightPuck,
  DisabledTooltipWrapper,
  ToggleWrapper,
  filterDollarProp,
};

export const FLIGHT_SPRING: Transition = M3_SPRINGS.flightPuck;

export const FlightArcSvg = styled("svg")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
});

export const CountryMapZone = styled("div", {
  shouldForwardProp: filterDollarProp,
})<{
  $position: "left" | "right";
  $cfg: MeridianSizeConfig;
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

interface PeekingAirplaneProps extends HTMLMotionProps<"div"> {
  $cfg?: MeridianSizeConfig;
}

const CleanAirplaneDiv = forwardRef<HTMLDivElement, PeekingAirplaneProps>(
  ({ $cfg: _c, ...props }, ref) =>
    React.createElement(motion.div, { ref, ...props }),
);
CleanAirplaneDiv.displayName = "CleanAirplaneDiv";

export const PeekingAirplane = styled(CleanAirplaneDiv)<{
  $cfg: MeridianSizeConfig;
}>(({ theme, $cfg }) => ({
  position: "absolute",
  top: "50%",
  left: 0,
  width: $cfg.planeSize,
  height: $cfg.planeSize,
  marginTop: -$cfg.planeSize / 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3,
  pointerEvents: "none",
  color: theme.palette.primary.main,
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))",
  ...theme.applyStyles("dark", {
    color: theme.palette.common.white,
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))",
  }),
}));
