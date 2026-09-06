import { styled, alpha } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { FONT_FAMILIES, RECURSIVE_PRESETS } from "~/tokens/typography";
import { M3_SPRINGS } from "~/tokens/motion";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";

export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const SIDEBAR_EXTENDED_WIDTH = 256;

export const SIDEBAR_SPRING: Transition = M3_SPRINGS.expressive.spatial.default;
export const TAB_SPRING: Transition = M3_SPRINGS.tabIndicator;

export const SidebarRail = styled(motion.aside, {
  shouldForwardProp: (prop) => prop !== "$isExtended" && prop !== "$variant",
})<{ $isExtended: boolean; $variant?: "default" | "auth" }>(
  ({ theme, $isExtended, $variant }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    height: "100vh",
    zIndex: 1200,
    display: "flex",
    flexDirection: "column",
    backgroundColor:
      $variant === "auth"
        ? alpha(
            theme.palette.surfaceContainer || theme.palette.background.paper,
            0.75,
          )
        : theme.palette.surfaceContainer || theme.palette.background.paper,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRight: `1px solid ${theme.palette.divider}`,
    boxSizing: "border-box",
    overflowX: "hidden",
    overflowY: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    boxShadow: $isExtended
      ? `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`
      : `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
    ...theme.applyStyles("dark", {
      boxShadow: $isExtended
        ? `0 12px 36px ${alpha(theme.palette.common.black, 0.55)}`
        : `0 2px 10px ${alpha(theme.palette.common.black, 0.25)}`,
    }),
  }),
);

export const SidebarHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "72px",
  minHeight: "72px",
  padding: theme.spacing(0, 2),
  boxSizing: "border-box",
  width: "100%",
}));

export const LogoLink = styled("a")({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  textDecoration: "none",
  userSelect: "none",
  cursor: "pointer",
  outline: "none",
  width: "100%",
  "&:focus-visible": {
    borderRadius: M3_SHAPE_CORNER_STRINGS.medium,
    outline: "2px solid currentColor",
    outlineOffset: "4px",
  },
});

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

export const SidebarNav = styled("nav")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
  padding: theme.spacing(1, 1.5),
  width: "100%",
  boxSizing: "border-box",
}));

export const SidebarTabWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
});

export const SidebarTabButton = styled(motion.button, {
  shouldForwardProp: (prop) => prop !== "$active" && prop !== "$isExtended",
})<{ $active?: boolean; $isExtended?: boolean }>(({ theme, $active }) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "44px",
  padding: theme.spacing(0, 1.5),
  borderRadius: M3_SHAPE_CORNER_STRINGS.full,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  outline: "none",
  textDecoration: "none",
  fontFamily: theme.typography.fontFamily,
  fontSize: "0.875rem",
  fontWeight: $active ? 700 : 500,
  letterSpacing: "0.015em",
  color: $active ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: "color 150ms ease, background-color 150ms ease",
  WebkitTapHighlightColor: "transparent",
  boxSizing: "border-box",

  "&:hover": {
    color: $active ? theme.palette.primary.main : theme.palette.text.primary,
    backgroundColor: $active
      ? "transparent"
      : alpha(theme.palette.text.primary, 0.04),
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  ...theme.applyStyles("dark", {
    color: $active ? theme.palette.primary.light : theme.palette.text.secondary,
    "&:hover": {
      color: $active ? theme.palette.primary.light : theme.palette.common.white,
      backgroundColor: $active
        ? "transparent"
        : alpha(theme.palette.common.white, 0.06),
    },
  }),
}));

export const TabActivePill = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  borderRadius: M3_SHAPE_CORNER_STRINGS.full,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
  pointerEvents: "none",

  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
    boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.22)}`,
  }),
}));

export const TabIconSlot = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  minWidth: "24px",
  height: "24px",
  lineHeight: 1,
});

export const TabLabelSlot = styled(motion.span)(({ theme }) => ({
  lineHeight: "1.2",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textAlign: "left",
  marginLeft: theme.spacing(1.5),
}));

export const SidebarBottomSection = styled(Box)(({ theme }) => ({
  marginTop: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.25),
  padding: theme.spacing(2, 1.25),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  boxSizing: "border-box",
  width: "100%",
}));

export const UserCardSlot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$isExtended",
})<{ $isExtended?: boolean }>(({ theme, $isExtended }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: $isExtended ? "space-between" : "center",
  width: "100%",
  padding: theme.spacing(0.5, 0.25),
  boxSizing: "border-box",
}));

export const UserDetailsText = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "$isExtended",
})<{ $isExtended?: boolean }>(({ theme, $isExtended }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  overflow: "hidden",
  whiteSpace: "nowrap",
  marginLeft: theme.spacing(1.25),
  flex: 1,
  pointerEvents: $isExtended ? "auto" : "none",
}));

export const UserNameHeading = styled("span")(({ theme }) => ({
  fontSize: "0.8125rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "110px",
}));

export const LogoutActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
  backgroundColor: alpha(theme.palette.error.main, 0.08),
  width: 32,
  height: 32,
  borderRadius: M3_SHAPE_CORNER_STRINGS.full,
  padding: 0,
  "&:hover": {
    backgroundColor: alpha(theme.palette.error.main, 0.18),
    transform: "scale(1.05)",
  },
  transition: "all 150ms cubic-bezier(0.2, 0, 0, 1)",
}));

export const AdminReturnActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: alpha(theme.palette.secondary.main, 0.08),
  width: 32,
  height: 32,
  borderRadius: M3_SHAPE_CORNER_STRINGS.full,
  padding: 0,
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.18),
    transform: "scale(1.05)",
  },
  transition: "all 150ms cubic-bezier(0.2, 0, 0, 1)",
}));

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
