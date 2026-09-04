import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";

export const RootContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: theme.spacing(4, 3),
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1.5),
    gap: theme.spacing(2),
  },
}));

export const HeroCard = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3, 3.5),
  borderRadius: "24px",
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  backdropFilter: "blur(16px)",
  boxShadow: "0 12px 32px -10px rgba(0, 0, 0, 0.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2.5),
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    boxShadow: "0 16px 40px -12px rgba(0, 0, 0, 0.35)",
  }),
}));

export const CalendarFrame = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  backdropFilter: "blur(16px)",
  boxShadow: "0 16px 40px -12px rgba(0, 0, 0, 0.08)",
  overflow: "hidden",
  minHeight: "720px",
  "& .MuiEventCalendar-root": {
    borderRadius: "24px",
    border: "none",
  },
  "& .MuiEventCalendar-headerToolbarSidePanelToggle svg, & .MuiEventCalendar-preferencesMenuButton svg":
    {
      pointerEvents: "none",
    },
  "& .MuiEventCalendar-headerToolbar": {
    position: "relative",
    zIndex: 10,
    overflow: "visible !important",
  },
  "& .MuiEventCalendar-headerToolbarActions": {
    position: "relative",
    overflow: "visible !important",
  },
  "& .MuiEventCalendar-preferencesMenu": {
    position: "relative",
    overflow: "visible !important",
  },
  "& .MuiEventCalendar-preferencesMenuList": {
    position: "absolute !important",
    inset: "auto !important",
    top: "100% !important",
    right: "0 !important",
    left: "auto !important",
    bottom: "auto !important",
    width: "0 !important",
    height: "0 !important",
    overflow: "visible !important",
    zIndex: 1300,
  },
  "& .MuiEventCalendar-preferencesMenuList .MuiBackdrop-root": {
    position: "fixed !important",
    top: "-100vh !important",
    left: "-100vw !important",
    width: "300vw !important",
    height: "300vh !important",
  },
  "& .MuiEventCalendar-preferencesMenuList .MuiPopover-paper": {
    position: "absolute !important",
    top: "8px !important",
    right: "0 !important",
    left: "auto !important",
    bottom: "auto !important",
    transform: "none !important",
    margin: "0 !important",
    maxHeight: "none !important",
    maxWidth: "none !important",
    height: "auto !important",
    borderRadius: "16px",
    boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.3)",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    boxShadow: "0 20px 48px -12px rgba(0, 0, 0, 0.4)",
  }),
}));

export const FilterBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  padding: theme.spacing(1, 1.5),
  borderRadius: "16px",
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: "blur(12px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
}));

export const SoftDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "24px",
    padding: "8px",
    boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(20px)",
  },
}));
