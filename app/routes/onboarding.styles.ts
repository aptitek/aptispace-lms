import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

/* =========================================================================
 * Clean Minimalist Onboarding Workspace Layout
 * ========================================================================= */

export const CardWorkspaceContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(4),
  width: "100%",
  maxWidth: "1160px",
  margin: "0 auto",
  padding: theme.spacing(2),
  boxSizing: "border-box",
  zIndex: 2,
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    gap: theme.spacing(3),
  },
}));

export const FabDockPanel = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "center",
  gap: theme.spacing(2),
  minWidth: "280px",
  maxWidth: "340px",
  width: "100%",
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 12px 40px rgba(0, 0, 0, 0.35)`,
  boxSizing: "border-box",
  [theme.breakpoints.down("lg")]: {
    maxWidth: "540px",
  },
}));

export const RequirementsList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
}));

export const RequirementPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isComplete",
})<{ isComplete: boolean }>(({ theme, isComplete }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0.75, 1.5),
  borderRadius: "12px",
  fontSize: "0.825rem",
  fontWeight: 700,
  backgroundColor: isComplete
    ? alpha(theme.palette.success.main, 0.14)
    : alpha(theme.palette.text.secondary, 0.08),
  border: `1px solid ${
    isComplete
      ? alpha(theme.palette.success.main, 0.35)
      : alpha(theme.palette.divider, 0.5)
  }`,
  color: isComplete
    ? theme.palette.success.light || theme.palette.success.main
    : theme.palette.text.secondary,
  transition: "all 0.25s ease",
}));

export const M3ExtendedFab = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isReady",
})<{ isReady?: boolean }>(({ theme, isReady }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  height: "56px",
  borderRadius: "16px",
  padding: "0 24px",
  fontSize: "0.95rem",
  fontWeight: 800,
  letterSpacing: "0.02em",
  textTransform: "none",
  boxSizing: "border-box",
  transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
  boxShadow: isReady
    ? `0 6px 16px rgba(0, 0, 0, 0.35), 0 0 24px ${alpha(theme.palette.primary.main, 0.4)}`
    : "none",
  backgroundColor: isReady
    ? theme.palette.primary.main
    : alpha(theme.palette.action.disabledBackground, 0.2),
  color: isReady
    ? theme.palette.primary.contrastText || theme.palette.common.white
    : theme.palette.text.disabled,
  cursor: isReady ? "pointer" : "not-allowed",
  pointerEvents: "auto",

  "&:hover": {
    backgroundColor: isReady
      ? theme.palette.primary.light
      : alpha(theme.palette.action.disabledBackground, 0.2),
    transform: isReady ? "translateY(-2px) scale(1.02)" : "none",
    boxShadow: isReady
      ? `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 32px ${alpha(theme.palette.primary.light, 0.6)}`
      : "none",
  },

  "&:active": {
    transform: isReady ? "translateY(0px) scale(0.98)" : "none",
  },
}));
