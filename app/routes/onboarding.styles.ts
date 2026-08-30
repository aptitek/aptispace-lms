import { styled, alpha } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const OnboardingContainer = styled(Paper)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1.25fr",
  gap: theme.spacing(4),
  maxWidth: "1180px",
  width: "100%",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 30px 60px rgba(0, 0, 0, 0.3), 0 0 35px ${theme.palette.action.focus}`,
  boxSizing: "border-box",
  zIndex: 2,
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    maxWidth: "600px",
    padding: theme.spacing(2.5),
  },
}));

export const FormPanel = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

export const Title = styled(Typography)(({ theme }) => ({
  margin: 0,
  fontSize: "1.65rem",
  fontWeight: 800,
  color: theme.palette.text.primary,
  letterSpacing: "-0.01em",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& .badge-icon": {
    color: theme.palette.primary.light,
    fontSize: "1.8rem",
  },
}));

export const FormRoot = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const FormGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
}));

export const TwoColGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(1.5),
}));

export const PreviewPanel = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2.5),
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  borderRadius: "16px",
  border: `1px dashed ${theme.palette.divider}`,
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  padding: "6px 14px",
  borderRadius: "8px",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.primary.light,
  fontWeight: 700,
  fontSize: "0.825rem",
  textTransform: "none",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    borderColor: theme.palette.primary.main,
    transform: "translateY(-1px)",
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  width: "100%",
  padding: "12px 20px",
  borderRadius: "10px",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.background.default,
  fontWeight: 800,
  fontSize: "0.95rem",
  letterSpacing: "0.5px",
  textTransform: "none",
  marginTop: theme.spacing(1),
  boxShadow: `0 4px 14px ${theme.palette.action.focus}`,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    boxShadow: `0 6px 20px ${theme.palette.action.focus}`,
    transform: "translateY(-1px)",
  },
}));

/* =========================================================================
 * Material 3 Floating Action Button (FAB) & Requirement Indicators
 * ========================================================================= */

export const CardWorkspaceContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3.5),
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    gap: theme.spacing(2.5),
  },
}));

export const FabDockPanel = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "center",
  gap: theme.spacing(2),
  minWidth: "260px",
  maxWidth: "320px",
  padding: theme.spacing(2.5),
  backgroundColor: alpha(theme.palette.background.paper, 0.75),
  backdropFilter: "blur(12px)",
  borderRadius: "20px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.25)`,
  boxSizing: "border-box",
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    maxWidth: "540px",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export const RequirementsList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
}));

export const RequirementPill = styled(Box)<{ isComplete: boolean }>(
  ({ theme, isComplete }) => ({
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
  }),
);

export const M3ExtendedFab = styled(Button)<{ isReady?: boolean }>(
  ({ theme, isReady }) => ({
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
      ? theme.palette.primary.contrastText || "#ffffff"
      : theme.palette.text.disabled,
    cursor: isReady ? "pointer" : "not-allowed",
    pointerEvents: "auto", // Allow tooltip on disabled state

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
  }),
);
