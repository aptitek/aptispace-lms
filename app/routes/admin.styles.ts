import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";

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
      backgroundColor: isDark
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
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
      color: isDark ? theme.palette.secondary.main : theme.palette.primary.main,
    },
    "&.Mui-disabled": {
      opacity: 0.4,
    },
  };
});

export const TabPanelContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "hasSidePanel",
})<{ hasSidePanel?: boolean }>(({ theme, hasSidePanel }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: hasSidePanel ? "1fr 380px" : "1fr",
  gap: theme.spacing(3),
  alignItems: "start",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const MainColumn = styled("div")({
  width: "100%",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

export const SideColumn = styled("div")({
  width: "100%",
  position: "sticky",
  top: "24px",
});

export const MD3CollectionGrid = styled("div")(({ theme }) => ({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: theme.spacing(2),
  justifyItems: "stretch",
  alignItems: "stretch",
}));
