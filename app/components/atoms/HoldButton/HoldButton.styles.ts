import { styled, alpha } from "@mui/material/styles";
import Button, { type ButtonProps } from "@mui/material/Button";
import Box, { type BoxProps } from "@mui/material/Box";
import { motion } from "framer-motion";

const MotionBox = motion.create ? motion.create(Box) : motion(Box);

export const HoldButtonWrapper = styled(MotionBox)<BoxProps>(() => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "visible",
  verticalAlign: "middle",
}));

export const StyledHoldButton = styled(Button)<ButtonProps>(() => ({
  position: "relative",
  overflow: "hidden",
  zIndex: 1,
  width: "100%",
  height: "100%",
  minWidth: "unset",
}));

export const SvgBorderContainer = styled("svg", {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "offset",
})<{ color?: string; offset?: number }>(({ theme, color, offset = 0 }) => ({
  position: "absolute",
  top: -offset,
  left: -offset,
  width: `calc(100% + ${offset * 2}px)`,
  height: `calc(100% + ${offset * 2}px)`,
  overflow: "visible",
  pointerEvents: "none",
  zIndex: 3,
  // Intense MD3 glow/aura following the line
  filter: `drop-shadow(0 0 4px ${alpha(color || theme.palette.primary.main, 0.7)}) drop-shadow(0 0 8px ${alpha(color || theme.palette.primary.main, 0.4)})`,
}));

export const HiddenClipDefs = styled("svg")({
  position: "absolute",
  width: 0,
  height: 0,
  overflow: "hidden",
  pointerEvents: "none",
});
