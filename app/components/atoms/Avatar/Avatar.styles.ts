import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import type { AvatarShape } from "./Avatar.types";
import {
  resolveM3ShapeStyle,
  M3_SCALE_RADIUS_MAP,
  M3_EXPRESSIVE_CATALOG,
  ALL_35_M3_SHAPES,
} from "./m3Shapes";

export { M3_EXPRESSIVE_CATALOG, ALL_35_M3_SHAPES };
export const MD3_SHAPE_SCALE_MAP = M3_SCALE_RADIUS_MAP;

export function resolveM3ShapeRadius(
  shape?: AvatarShape,
  customRadius?: number | string,
): string {
  const resolved = resolveM3ShapeStyle(shape, customRadius);
  return resolved.borderRadius;
}

export const AvatarRoot = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isPortrait" &&
    prop !== "customHeight" &&
    prop !== "customWidth" &&
    prop !== "customRatio" &&
    prop !== "customRadius" &&
    prop !== "shapePreset",
})<{
  isPortrait?: boolean;
  customHeight?: number | string;
  customWidth?: number | string;
  customRatio?: string;
  customRadius?: number | string;
  shapePreset?: AvatarShape;
}>(({
  theme,
  isPortrait,
  customHeight,
  customWidth,
  customRatio,
  customRadius,
  shapePreset,
}) => {
  const shapeStyle = resolveM3ShapeStyle(shapePreset, customRadius);
  const isBiometric =
    shapePreset === "biometric" || (isPortrait && !shapePreset);

  return {
    position: "relative",
    height: customHeight ?? (isBiometric ? "140px" : "100%"),
    width: customWidth ?? "auto",
    aspectRatio: customRatio ?? (isBiometric ? "35 / 45" : "1 / 1"),
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
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  };
});

export const BiometricAvatarRoot = AvatarRoot;

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
}));
