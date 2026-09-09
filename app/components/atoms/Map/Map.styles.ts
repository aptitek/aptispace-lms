import { styled } from "@mui/material/styles";

export interface StyledMapRootProps {
  $width?: string | number;
  $height?: string | number;
  $borderRadius?: string | number;
  $border?: string;
  $boxShadow?: string;
  $aspectRatio?: string | number;
}

export const StyledMapRoot = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$width" &&
    prop !== "$height" &&
    prop !== "$borderRadius" &&
    prop !== "$border" &&
    prop !== "$boxShadow" &&
    prop !== "$aspectRatio",
})<StyledMapRootProps>(
  ({
    theme,
    $width,
    $height,
    $borderRadius,
    $border,
    $boxShadow,
    $aspectRatio,
  }) => ({
    position: "relative",
    width: $width ?? "100%",
    height: $height ?? "100%",
    aspectRatio: $aspectRatio,
    borderRadius: $borderRadius ?? 0,
    border: $border,
    boxShadow: $boxShadow,
    overflow: "hidden",
    backgroundColor: "var(--color-solarized-base3, #fdf6e3)",
    ...theme.applyStyles("dark", {
      backgroundColor: "var(--color-solarized-base03, #002b36)",
    }),
    boxSizing: "border-box",

    "& .maplibregl-map": {
      width: "100% !important",
      height: "100% !important",
      fontFamily: "inherit",
      cursor: "grab",
    },
    "& .maplibregl-canvas": {
      outline: "none",
      cursor: "grab",
    },
    "&:active .maplibregl-canvas": {
      cursor: "grabbing",
    },
    "& .maplibregl-canvas-container": {
      width: "100% !important",
      height: "100% !important",
    },
    "& .maplibregl-ctrl-attrib": {
      display: "none !important",
    },
    "& .maplibregl-ctrl-logo": {
      display: "none !important",
    },
  }),
);
