import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const InspectorContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== "maxHeight",
})<{ maxHeight?: string | number }>(({ theme, maxHeight = "850px" }) => ({
  padding: theme.spacing(2.5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  height: "calc(100vh - 200px)",
  maxHeight,
  overflowY: "auto",
  position: "sticky",
  top: 24,
  backgroundColor:
    theme.palette.surfaceContainer || theme.palette.background.paper,
  borderColor: theme.palette.divider,
}));

export const InspectorHeaderBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
}));

export const InspectorBodyBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "gap",
})<{ gap?: number }>(({ theme, gap = 2.5 }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(gap),
  flex: 1,
}));

export const InspectorActionsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing(1.5),
  marginTop: "auto",
  paddingTop: theme.spacing(1),
}));
