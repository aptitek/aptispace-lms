import { styled, alpha } from "@mui/material/styles";

export const CardWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 880,
  margin: "0 auto",
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

export const HeaderBadgeRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

export const SimulationViewport = styled("div")(({ theme }) => ({
  width: "100%",
  height: 200,
  position: "relative",
  background:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.dark, 0.45)
      : alpha(theme.palette.primary.light, 0.25),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2.5),
  boxSizing: "border-box",
  overflow: "hidden",
  borderRadius: "inherit",
  [theme.breakpoints.down("sm")]: {
    height: 160,
    padding: theme.spacing(2),
  },
}));

export const TelemetryHudGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: theme.spacing(1.5),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const TelemetryMetric = styled("div")(({ theme }) => ({
  padding: theme.spacing(1.25, 1.75),
  borderRadius: Number(theme.shape.borderRadius) || 12,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  border: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25),
  backdropFilter: "blur(8px)",
}));

export const MetricLabel = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const MetricValue = styled("span")(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 700,
  fontFamily: "monospace",
  color: theme.palette.primary.main,
  letterSpacing: "-0.02em",
}));

export const ProgressContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
  width: "100%",
}));

export const ProgressLabelRow = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.825rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const ChecklistGroup = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(0.5),
}));

export const ChecklistRow = styled("div", {
  shouldForwardProp: (prop) => prop !== "isDone",
})<{ isDone: boolean }>(({ theme, isDone }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 1.75),
  borderRadius: Number(theme.shape.borderRadius) || 8,
  backgroundColor: isDone
    ? alpha(theme.palette.success.main, 0.12)
    : alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${isDone ? theme.palette.success.main : theme.palette.divider}`,
  transition: "all 0.2s ease-out",
}));

export const TerminalLogView = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1.25, 1.75),
  borderRadius: Number(theme.shape.borderRadius) || 8,
  fontFamily: "monospace",
  fontSize: "0.78rem",
  color: theme.palette.primary.light,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
}));

export const SimulationViewportContent = styled("div")({
  zIndex: 2,
  maxWidth: 360,
});

export const HudActiveTag = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  color: theme.palette.primary.light,
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
}));

export const ViewportTitle = styled("div")(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: 1.3,
}));

export const ViewportSubtext = styled("p")(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.25),
  lineHeight: 1.4,
}));

export const RocketIconBox = styled("div")(({ theme }) => ({
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiSvgIcon-root": {
    fontSize: "4.5rem",
    color: theme.palette.primary.main,
    filter: `drop-shadow(0 0 16px ${alpha(theme.palette.primary.main, 0.6)})`,
    [theme.breakpoints.down("sm")]: {
      fontSize: "3rem",
    },
  },
}));

export const FullWidthBox = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxSizing: "border-box",
  overflowY: "auto",
});

export const MissionDescription = styled("p")({
  margin: 0,
});
