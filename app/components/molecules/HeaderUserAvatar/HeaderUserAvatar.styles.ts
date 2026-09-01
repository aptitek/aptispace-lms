import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";

export const HeaderAvatarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$isOpen",
})<{ $size: number; $isOpen: boolean }>(({ $size }) => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  height: $size,
  width: $size + 44,
  minWidth: $size + 44,
  isolation: "isolate",
}));

export const HiddenSvgClipDefs = styled("svg")({
  position: "absolute",
  width: 0,
  height: 0,
  overflow: "hidden",
  pointerEvents: "none",
});

export const AvatarMorphTrigger = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$clipId",
})<{ $size: number; $clipId: string }>(({ theme, $size, $clipId }) => ({
  position: "relative",
  zIndex: 2,
  width: $size,
  height: $size,
  borderRadius: "0px",
  overflow: "hidden",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  clipPath: `url(#${$clipId})`,
  WebkitClipPath: `url(#${$clipId})`,
  backgroundColor: theme.palette.action.selected,
  cursor: "pointer",
  transition: theme.transitions.create(["transform", "filter"], {
    duration: 350,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  }),
  "&:hover, &:focus-visible": {
    transform: "scale(1.05)",
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    pointerEvents: "none",
  },
}));

export const AvatarInitialsFallback = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
  fontWeight: 700,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  userSelect: "none",
  "& svg": {
    width: "60%",
    height: "60%",
    fill: "currentColor",
  },
}));

export const SlidingPillTrack = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$isOpen" && prop !== "$size",
})<{ $isOpen: boolean; $size: number }>(({ theme, $isOpen, $size }) => ({
  position: "absolute",
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,
  height: $size,
  width: $isOpen ? $size + 44 : $size,
  borderRadius: 9999,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.94)
      : alpha(theme.palette.background.paper, 0.96),
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? `0 4px 16px ${alpha(theme.palette.common.black, 0.45)}`
      : `0 4px 16px ${alpha(theme.palette.common.black, 0.12)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: theme.spacing(0.5),
  boxSizing: "border-box",
  overflow: "hidden",
  opacity: $isOpen ? 1 : 0,
  pointerEvents: $isOpen ? "auto" : "none",
  transition: theme.transitions.create(["width", "opacity", "box-shadow"], {
    duration: 350,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  }),
}));

export const RoundLogoutButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "$isOpen",
})<{ $isOpen: boolean }>(({ theme, $isOpen }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  color: theme.palette.text.primary,
  backgroundColor: alpha(theme.palette.error.main, 0.1),
  border: `1px solid ${alpha(theme.palette.error.main, 0.25)}`,
  transform: $isOpen
    ? "translateX(0) scale(1)"
    : "translateX(-28px) scale(0.6)",
  opacity: $isOpen ? 1 : 0,
  pointerEvents: $isOpen ? "auto" : "none",
  transition: theme.transitions.create(
    ["transform", "opacity", "background-color", "border-color", "color"],
    {
      duration: 300,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    },
  ),
  "&:hover": {
    backgroundColor: alpha(theme.palette.error.main, 0.22),
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
    transform: "scale(1.1)",
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
}));
