import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { motion, type Transition } from "framer-motion";

export const MD3_TAB_SPRING: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

export const NavContainer = styled("nav")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  position: "relative",
  padding: "3px",
  gap: "3px",
  borderRadius: "24px",
  backgroundColor: alpha(theme.palette.text.primary, 0.04),
  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  transition: theme.transitions.create(["background-color", "border-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
  }),
  [theme.breakpoints.down("sm")]: {
    padding: "2px",
    gap: "2px",
    borderRadius: "20px",
  },
}));

export const TabItemWrapper = styled(Box)({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
});

export const TabButton = styled(motion.button, {
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active?: boolean }>(({ theme, $active }) => ({
  position: "relative",
  zIndex: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  height: "32px",
  padding: "0 14px",
  borderRadius: "20px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  outline: "none",
  textDecoration: "none",
  fontFamily: theme.typography.fontFamily,
  fontSize: "0.8125rem",
  fontWeight: $active ? 700 : 500,
  letterSpacing: "0.01em",
  color: $active ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: "color 150ms ease, font-weight 150ms ease",
  WebkitTapHighlightColor: "transparent",

  "&:hover": {
    color: $active ? theme.palette.primary.main : theme.palette.text.primary,
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  ...theme.applyStyles("dark", {
    color: $active ? theme.palette.primary.light : theme.palette.text.secondary,
    "&:hover": {
      color: $active ? theme.palette.primary.light : theme.palette.common.white,
    },
  }),

  [theme.breakpoints.down("sm")]: {
    height: "28px",
    padding: "0 10px",
    fontSize: "0.75rem",
    gap: "4px",
  },
}));

export const ActivePillIndicator = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  borderRadius: "18px",
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
  pointerEvents: "none",

  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
    boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.22)}`,
  }),

  [theme.breakpoints.down("sm")]: {
    borderRadius: "16px",
  },
}));

export const TabIconSlot = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
});

export const TabLabelSlot = styled("span")({
  whiteHeight: 1,
  lineHeight: "1.2",
});
