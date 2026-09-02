import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import type { AvatarShape } from "./Avatar.types";
import {
  resolveShapeStyle,
  resolveM3ShapeStyle,
  SHAPE_SCALE_RADIUS_MAP,
  M3_SCALE_RADIUS_MAP,
  EXPRESSIVE_SHAPE_CATALOG,
  M3_EXPRESSIVE_CATALOG,
  ALL_EXPRESSIVE_SHAPES,
  ALL_35_M3_SHAPES,
} from "./shapes";

export {
  EXPRESSIVE_SHAPE_CATALOG,
  M3_EXPRESSIVE_CATALOG,
  ALL_EXPRESSIVE_SHAPES,
  ALL_35_M3_SHAPES,
  SHAPE_SCALE_RADIUS_MAP,
};
export const MD3_SHAPE_SCALE_MAP = M3_SCALE_RADIUS_MAP;

export function resolveAvatarShapeRadius(
  shape?: AvatarShape,
  customRadius?: number | string,
): string {
  const resolved = resolveShapeStyle(shape, customRadius);
  return resolved.borderRadius;
}

export const resolveM3ShapeRadius = resolveAvatarShapeRadius;

export const AvatarRoot = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isPortrait" &&
    prop !== "customHeight" &&
    prop !== "customWidth" &&
    prop !== "customRatio" &&
    prop !== "customRadius" &&
    prop !== "shapePreset" &&
    prop !== "customObjectFit",
})<{
  isPortrait?: boolean;
  customHeight?: number | string;
  customWidth?: number | string;
  customRatio?: string;
  customRadius?: number | string;
  shapePreset?: AvatarShape;
  customObjectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}>(({
  theme,
  isPortrait,
  customHeight,
  customWidth,
  customRatio,
  customRadius,
  shapePreset,
  customObjectFit,
}) => {
  const shapeStyle = resolveM3ShapeStyle(shapePreset, customRadius);
  const isLandscape = shapePreset === "landscape";
  const isBiometric =
    shapePreset === "biometric" || (isPortrait && !shapePreset);

  const resolvedFit = customObjectFit ?? (isLandscape ? "contain" : "cover");
  const isContain = resolvedFit === "contain";

  return {
    position: "relative",
    height: customHeight ?? (isBiometric ? "140px" : "100%"),
    width: customWidth ?? (isLandscape ? "100%" : "auto"),
    aspectRatio: customRatio ?? (isBiometric ? "35 / 45" : isLandscape ? "auto" : "1 / 1"),
    borderRadius: shapeStyle.borderRadius,
    clipPath: shapeStyle.clipPath,
    WebkitClipPath: shapeStyle.clipPath,
    overflow: "hidden",
    border: shapeStyle.clipPath ? "none" : `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
    backgroundColor: theme.palette.background.default,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: isContain ? theme.spacing(0.75, 1.5) : 0,
    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
      width: isContain ? "auto" : "100%",
      height: isContain ? "auto" : "100%",
      objectFit: resolvedFit,
      display: "block",
    },
  };
});

export const BiometricReticle = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: "2px",
  pointerEvents: "none",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: "inherit",
}));

export const FallbackAvatarHolder = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  fontSize: "1.5rem",
  fontWeight: 700,
  textTransform: "uppercase",
  backgroundColor: theme.palette.action.hover,
  userSelect: "none",
  "& svg": {
    width: "60%",
    height: "60%",
    maxWidth: "4rem",
    maxHeight: "4rem",
    fill: "currentColor",
  },
}));
