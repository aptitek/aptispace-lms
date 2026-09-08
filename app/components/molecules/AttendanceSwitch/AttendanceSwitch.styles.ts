import React, { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  type SwitchSize,
  type SwitchSizeConfig,
  SWITCH_SIZE_CONFIGS,
} from "~/components/molecules/FancySwitch";

export type { SwitchSize, SwitchSizeConfig };
export { SWITCH_SIZE_CONFIGS };

interface PeekingPedestrianProps extends HTMLMotionProps<"div"> {
  $size: number;
}

const CleanPedestrianDiv = forwardRef<HTMLDivElement, PeekingPedestrianProps>(
  ({ $size: _s, ...props }, ref) =>
    React.createElement(motion.div, { ref, ...props }),
);
CleanPedestrianDiv.displayName = "CleanPedestrianDiv";

export const PeekingPedestrianLayer = styled(CleanPedestrianDiv)<{
  $size: number;
}>(({ theme, $size }) => ({
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
