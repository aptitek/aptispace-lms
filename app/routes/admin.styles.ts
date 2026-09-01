import { styled, alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import { SOLARIZED_BASE } from "~/tokens/theme";

export const PageRoot = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxSizing: "border-box",
}));

export const AdminMainWorkspace = styled("main")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: theme.spacing(4, 3, 8),
  boxSizing: "border-box",
  gap: theme.spacing(3.5),

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 2, 6),
    gap: theme.spacing(2.5),
  },
}));

export const AdminHeroHeader = styled("section")(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    width: "100%",
    borderRadius: "20px",
    padding: theme.spacing(3.5, 4),
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.base02, 0.7)
      : alpha(theme.palette.background.paper, 0.85),
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${
      isDark
        ? alpha(SOLARIZED_BASE.base01, 0.3)
        : alpha(SOLARIZED_BASE.base01, 0.2)
    }`,
    boxShadow: isDark
      ? `0 8px 32px -4px ${alpha(SOLARIZED_BASE.base03, 0.7)}, inset 0 1px 0 ${alpha(
          theme.palette.common.white,
          0.05,
        )}`
      : `0 8px 24px -4px ${alpha(SOLARIZED_BASE.base03, 0.08)}, inset 0 1px 0 ${alpha(
          theme.palette.common.white,
          0.8,
        )}`,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    boxSizing: "border-box",

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2.5, 2),
    },
  };
});

export const HeroTopRow = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "12px",
});

export const HeroTitleArea = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.35rem",
  },
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  color: theme.palette.text.secondary,
  maxWidth: "700px",
  lineHeight: 1.5,
}));

export const StatsRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const StyledTabsContainer = styled("div")(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    width: "100%",
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .MuiTabs-indicator": {
      height: 3,
      borderRadius: "3px 3px 0 0",
      backgroundColor: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
    },
  };
});

export const StyledTab = styled(Tab)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    textTransform: "none",
    fontWeight: 700,
    fontSize: "0.925rem",
    minHeight: 48,
    padding: theme.spacing(1, 2.5),
    color: theme.palette.text.secondary,
    "&.Mui-selected": {
      color: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
    },
    "&.Mui-disabled": {
      opacity: 0.4,
    },
  };
});

export const TabPanelContainer = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});
