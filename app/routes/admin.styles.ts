import { styled } from "@mui/material/styles";
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
  maxWidth: "1500px",
  margin: "0 auto",
  padding: theme.spacing(3, 3, 8),
  boxSizing: "border-box",
  gap: theme.spacing(3),

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 2, 6),
    gap: theme.spacing(2),
  },
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

export const GridColumn = styled("div")({
  width: "100%",
  minWidth: 0,
});
