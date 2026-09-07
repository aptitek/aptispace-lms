import { styled } from "@mui/material/styles";

export {
  PageRoot,
  AdminMainWorkspace,
} from "~/components/templates/AdminLayout";

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
