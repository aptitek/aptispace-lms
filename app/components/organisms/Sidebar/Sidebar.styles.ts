import { styled, alpha } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import Box from "@mui/material/Box";
import { FONT_FAMILIES, RECURSIVE_PRESETS } from "~/tokens/typography";
import {
  M3_SPRINGS,
  M3_MOTION_DURATIONS,
  M3_MOTION_EASINGS,
} from "~/tokens/motion";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";

export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const SIDEBAR_SPRING: Transition = M3_SPRINGS.expressive.spatial.default;

export const SidebarRail = styled(motion.aside, {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant?: "default" | "ghost" }>(({ theme, $variant }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  width: SIDEBAR_COLLAPSED_WIDTH,
  height: "100vh",
  zIndex: 1200,
  display: "flex",
  flexDirection: "column",
  backgroundColor:
    $variant === "ghost"
      ? "transparent"
      : theme.palette.surfaceContainer || theme.palette.background.paper,
  backdropFilter: $variant === "ghost" ? "none" : "blur(20px)",
  WebkitBackdropFilter: $variant === "ghost" ? "none" : "blur(20px)",
  borderRight:
    $variant === "ghost" ? "none" : `1px solid ${theme.palette.divider}`,
  boxSizing: "border-box",
  overflow: "visible",
  boxShadow:
    $variant === "ghost"
      ? "none"
      : `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
  ...theme.applyStyles("dark", {
    boxShadow:
      $variant === "ghost"
        ? "none"
        : `0 2px 10px ${alpha(theme.palette.common.black, 0.25)}`,
  }),
}));

export const SidebarHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "72px",
  minHeight: "72px",
  paddingLeft: theme.spacing(1.75),
  boxSizing: "border-box",
  width: "100%",
  position: "relative",
  overflow: "visible",
}));

export const LogoLink = styled(motion.a, {
  shouldForwardProp: (prop) => prop !== "$isHovered",
})<{ $isHovered?: boolean }>(({ theme, $isHovered }) => ({
  display: "inline-flex",
  alignItems: "center",
  height: 48,
  minWidth: 44,
  padding: $isHovered ? theme.spacing(0.5, 2, 0.5, 0.75) : theme.spacing(0.75),
  borderRadius: 9999,
  textDecoration: "none",
  userSelect: "none",
  cursor: "pointer",
  outline: "none",
  position: "relative",
  zIndex: 100,
  backgroundColor: $isHovered
    ? theme.palette.surfaceContainerHigh || theme.palette.background.paper
    : "transparent",
  backgroundClip: "padding-box",
  border: $isHovered
    ? `1px solid ${theme.palette.divider}`
    : "1px solid transparent",
  boxShadow: $isHovered
    ? `0 4px 16px ${alpha(theme.palette.common.black, 0.14)}`
    : "none",
  transition: theme.transitions.create(
    ["background-color", "border-color", "box-shadow", "padding"],
    {
      duration: M3_MOTION_DURATIONS.medium3,
      easing: M3_MOTION_EASINGS.css.standard,
    },
  ),
  "&:focus-visible": {
    borderRadius: M3_SHAPE_CORNER_STRINGS.full,
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
}));

export const LogoFaviconImg = styled("img")({
  width: 36,
  height: 36,
  minWidth: 36,
  minHeight: 36,
  objectFit: "contain",
  display: "block",
});

export const LogoTextReveal = styled(motion.div)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  lineHeight: 1,
  fontSize: "1.5rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  marginLeft: "10px",
});

export const AptiSpan = styled("span")(({ theme }) => ({
  fontFamily: FONT_FAMILIES.logo,
  fontWeight: "normal",
  fontStyle: "normal",
  color: theme.palette.success.main,
  letterSpacing: "0.02em",
  marginRight: "0.1em",
  display: "inline-block",
}));

export const SpaceSpan = styled("span")(({ theme }) => ({
  fontFamily: FONT_FAMILIES.display,
  fontVariationSettings: RECURSIVE_PRESETS.linear,
  fontWeight: 800,
  color: theme.palette.secondary.main,
  letterSpacing: "-0.03em",
  display: "inline-block",
}));

export const SidebarNav = styled("nav")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  boxSizing: "border-box",
  overflow: "visible",
  position: "relative",
});

export const SidebarBottomSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant?: "default" | "ghost" }>(({ theme, $variant }) => ({
  marginTop: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.25),
  padding: theme.spacing(2, 1.25),
  borderTop:
    $variant === "ghost"
      ? "none"
      : `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  boxSizing: "border-box",
  width: "100%",
  overflow: "visible",
  position: "relative",
}));

export const UserCardSlot = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "4px 2px",
  boxSizing: "border-box",
  overflow: "visible",
  position: "relative",
  zIndex: 40,
});

export const ToggleStackRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  width: "100%",
  flexWrap: "wrap",
}));

export const StatusCenterSlot = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  paddingTop: theme.spacing(0.75),
  borderTop: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
}));
