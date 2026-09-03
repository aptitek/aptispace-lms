import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";

export const MissionCenterRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  width: "100%",
  paddingBottom: theme.spacing(4),
}));

export const MissionCenterHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

export const KpiGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: theme.spacing(2),
  width: "100%",
}));

export const KpiCard = styled(Card)<{ statuscolor?: string }>(({
  theme,
  statuscolor,
}) => {
  const accent = statuscolor || theme.palette.primary.main;
  return {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(accent, 0.25)}`,
    boxShadow: "none",
    position: "relative",
    overflow: "hidden",
    transition: theme.transitions.create(
      ["border-color", "transform", "box-shadow"],
      {
        duration: theme.transitions.duration.short,
      },
    ),
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      backgroundColor: accent,
    },
    "&:hover": {
      borderColor: accent,
      transform: "translateY(-2px)",
      boxShadow: `0 4px 16px ${alpha(accent, 0.12)}`,
    },
  };
});

export const SubTabsBar = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
}));

export const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  minHeight: "450px",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const CodePreBox = styled(Box)(({ theme }) => ({
  fontFamily: '"Fira Code", "Roboto Mono", monospace',
  fontSize: "0.8rem",
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
}));

export const NetworkMetaCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
}));
