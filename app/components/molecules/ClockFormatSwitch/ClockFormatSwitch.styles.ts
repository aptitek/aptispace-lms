import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  type SwitchSize,
  type SwitchSizeConfig,
  SWITCH_SIZE_CONFIGS,
  filterDollarProp,
} from "~/components/molecules/FancySwitch";

export type { SwitchSize, SwitchSizeConfig };
export { SWITCH_SIZE_CONFIGS };

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
