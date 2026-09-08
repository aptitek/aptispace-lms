import { styled } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";

export const HOUR_SPRING_TRANSITION: Transition = M3_SPRINGS.timeSheetHour;
export const MINUTE_SPRING_TRANSITION: Transition = M3_SPRINGS.timeSheetMinute;
export const DOT_SPRING_TRANSITION: Transition = M3_SPRINGS.timeSheetDot;

export const filterClockProp = (prop: PropertyKey) => prop !== "$size";

export const ClockSvg = styled("svg", {
  shouldForwardProp: filterClockProp,
})<{ $size: number }>(({ $size }) => ({
  width: $size,
  height: $size,
  display: "block",
  overflow: "visible",
}));

export const MotionHandGroupBase = styled(motion.g)(() => ({
  transformBox: "fill-box",
  transformOrigin: "50% 50%",
}));
