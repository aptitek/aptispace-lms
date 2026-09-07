import { styled } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";

import type {
  SwitchSize,
  SwitchSizeConfig as MeridianSizeConfig,
} from "~/components/atoms/Switch";
export type { SwitchSize, MeridianSizeConfig };
export { SWITCH_SIZE_CONFIGS as MERIDIAN_SIZE_CONFIGS } from "~/components/atoms/Switch";

export const FLIGHT_SPRING: Transition = M3_SPRINGS.flightPuck;

export const filterDollarProp = (prop: PropertyKey) =>
  typeof prop === "string" && !prop.startsWith("$");

export { SwitchTrack as MeridianTrack } from "~/components/atoms/Switch";

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

export const PeekingAirplane = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{
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

export const FlightPuck = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: MeridianSizeConfig;
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
  backgroundColor: theme.palette.primary.main,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.12)",
  }),
}));

export const StateRippleLayer = styled(motion.div, {
  shouldForwardProp: filterDollarProp,
})<{
  $cfg: MeridianSizeConfig;
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
  backgroundColor: theme.palette.text.primary,
  opacity: 0.12,
}));

export const ToggleWrapper = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const DisabledTooltipWrapper = styled("span")({
  display: "inline-flex",
});
