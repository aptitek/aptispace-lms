import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";

export {
  PageRoot,
  AdminMainWorkspace,
} from "~/components/templates/AdminLayout";

export const StyledTabsContainer = styled("div")(({ theme }) => ({
  width: "100%",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    backgroundColor: theme.palette.primary.main,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.secondary.main,
    }),
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 700,
  fontSize: "0.925rem",
  minHeight: 48,
  padding: theme.spacing(1, 2.5),
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    ...theme.applyStyles("dark", {
      color: theme.palette.secondary.main,
    }),
  },
  "&.Mui-disabled": {
    opacity: 0.4,
  },
}));

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
