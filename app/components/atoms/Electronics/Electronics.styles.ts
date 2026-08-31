import { styled, type Theme } from "@mui/material/styles";
import type { ElectronicsFinish } from "./Electronics.types";

export const getFinishColors = (finish: ElectronicsFinish, theme: Theme) => {
  switch (finish) {
    case "copper":
      return {
        primary: theme.palette.error.main,
        highlight: theme.palette.error.light,
        glow: theme.palette.error.dark,
        groove: theme.palette.background.default,
      };
    case "silver":
      return {
        primary: theme.palette.text.primary,
        highlight: theme.palette.common.white,
        glow: theme.palette.divider,
        groove: theme.palette.background.default,
      };
    case "cyan-laser":
      return {
        primary: theme.palette.primary.light,
        highlight: theme.palette.common.white,
        glow: theme.palette.primary.main,
        groove: theme.palette.background.default,
      };
    case "gold":
    default:
      return {
        primary: theme.palette.warning.main,
        highlight: theme.palette.warning.light,
        glow: theme.palette.warning.dark,
        groove: theme.palette.background.default,
      };
  }
};

export const SvgLayer = styled("svg", {
  shouldForwardProp: (prop) => prop !== "customOpacity",
})<{ customOpacity: number }>(({ customOpacity }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  opacity: customOpacity,
  zIndex: 1,
  overflow: "visible",
}));
