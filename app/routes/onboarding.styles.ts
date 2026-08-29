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
