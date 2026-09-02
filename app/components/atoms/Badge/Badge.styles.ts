import { styled, alpha, type Theme } from "@mui/material/styles";
import MuiBadge from "@mui/material/Badge";
import { resolveShapeStyle, type ResolvedShapeStyle } from "../Avatar/shapes";
import type { BadgeShape, BadgeSize, BadgeColor } from "./Badge.types";

export function getResolvedBadgeShape(
  shape?: BadgeShape,
): ResolvedShapeStyle | null {
  if (shape === undefined || shape === null) return null;
  return resolveShapeStyle(shape);
}

export function resolveBadgePaletteColor(
  theme: Theme,
  color: BadgeColor = "default",
) {
  switch (color) {
    case "primary":
      return theme.palette.primary;
    case "secondary":
      return theme.palette.secondary;
    case "success":
      return theme.palette.success;
    case "error":
      return theme.palette.error;
    case "info":
      return theme.palette.info;
    case "warning":
      return theme.palette.warning;
    case "default":
    default:
      return {
        main: theme.palette.text.primary,
        light: theme.palette.text.secondary,
        dark: theme.palette.text.primary,
        contrastText: theme.palette.background.paper,
      };
  }
}

export const BADGE_SIZE_CONFIG: Record<
  BadgeSize,
  {
    dim: number;
    iconSize: number;
    fontSize: string;
    padding: string;
  }
> = {
  small: {
    dim: 22,
    iconSize: 14,
    fontSize: "0.68rem",
    padding: "0",
  },
  medium: {
    dim: 26,
    iconSize: 16,
    fontSize: "0.75rem",
    padding: "0",
  },
  large: {
    dim: 32,
    iconSize: 20,
    fontSize: "0.85rem",
    padding: "0",
  },
};

function getBadgeDimensions(dim: number, isFixedAspect: boolean) {
  if (isFixedAspect) {
    return {
      width: `${dim}px`,
      height: `${dim}px`,
      minWidth: `${dim}px`,
      minHeight: `${dim}px`,
      maxWidth: `${dim}px`,
      maxHeight: `${dim}px`,
      aspectRatio: "1 / 1",
      padding: 0,
    };
  }
  return {
    minWidth: `${dim}px`,
    height: `${dim}px`,
    padding: "0 6px",
  };
}

function getBadgeShapeStyles(
  shapeStyle: ResolvedShapeStyle | null,
  hasClipPath: boolean,
  paletteColorMain: string,
  glow?: boolean,
) {
  if (!shapeStyle) {
    return { borderRadius: "50%" };
  }
  return {
    borderRadius: shapeStyle.borderRadius ?? "50%",
    ...(hasClipPath && {
      clipPath: shapeStyle.clipPath,
      WebkitClipPath: shapeStyle.clipPath,
      border: "none",
      filter: `drop-shadow(0 2px 4px ${alpha(paletteColorMain, glow ? 0.75 : 0.45)})`,
    }),
  };
}

function getBadgeGlowStyles(
  hasClipPath: boolean,
  paletteColorMain: string,
  glow?: boolean,
) {
  if (!glow) return {};
  return {
    boxShadow: hasClipPath
      ? "none"
      : `0 0 12px ${alpha(paletteColorMain, 0.6)}`,
    filter: hasClipPath
      ? `drop-shadow(0 0 8px ${alpha(paletteColorMain, 0.85)})`
      : undefined,
  };
}

function getBadgeMonoStyles(mono?: boolean) {
  if (!mono) return {};
  return {
    fontFamily: '"Roboto Mono", "Fira Code", monospace',
    fontWeight: 700,
    letterSpacing: "0.02em",
  };
}

export const StyledMuiBadge = styled(MuiBadge, {
  shouldForwardProp: (prop) =>
    prop !== "$badgeShape" &&
    prop !== "$badgeSize" &&
    prop !== "$glow" &&
    prop !== "$mono" &&
    prop !== "$badgeColor",
})<{
  $badgeShape?: BadgeShape;
  $badgeSize?: BadgeSize;
  $glow?: boolean;
  $mono?: boolean;
  $badgeColor?: BadgeColor;
}>(({
  theme,
  $badgeShape,
  $badgeSize = "medium",
  $glow,
  $mono,
  $badgeColor,
}) => {
  const shapeStyle = getResolvedBadgeShape($badgeShape);
  const hasClipPath = Boolean(shapeStyle?.clipPath);
  const paletteColor = resolveBadgePaletteColor(theme, $badgeColor);
  const sizeCfg = BADGE_SIZE_CONFIG[$badgeSize] || BADGE_SIZE_CONFIG.medium;
  const isFixedAspect = Boolean($badgeShape || hasClipPath);

  return {
    "& .MuiBadge-badge": {
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "visible",
      transition: theme.transitions.create([
        "background-color",
        "transform",
        "box-shadow",
        "filter",
      ]),

      ...getBadgeDimensions(sizeCfg.dim, isFixedAspect),
      ...getBadgeShapeStyles(shapeStyle, hasClipPath, paletteColor.main, $glow),
      ...getBadgeMonoStyles($mono),
      ...getBadgeGlowStyles(hasClipPath, paletteColor.main, $glow),

      "& svg, & .MuiSvgIcon-root": {
        fontSize: `${sizeCfg.iconSize}px !important`,
        width: "1em",
        height: "1em",
        display: "block",
        flexShrink: 0,
      },
    },
  };
});

function getStandaloneBoxShadow(
  hasClipPath: boolean,
  paletteColorMain: string,
  glow?: boolean,
) {
  if (hasClipPath) return "none";
  if (glow) return `0 0 12px ${alpha(paletteColorMain, 0.6)}`;
  return `0 2px 8px ${alpha(paletteColorMain, 0.35)}`;
}

function getStandaloneVisualStyles(
  shapeStyle: ResolvedShapeStyle | null,
  hasClipPath: boolean,
  paletteColorMain: string,
  glow?: boolean,
) {
  return {
    border: hasClipPath ? "none" : `1px solid ${alpha(paletteColorMain, 0.65)}`,
    borderRadius: shapeStyle?.borderRadius ?? "50%",
    clipPath: shapeStyle?.clipPath,
    WebkitClipPath: shapeStyle?.clipPath,
    boxShadow: getStandaloneBoxShadow(hasClipPath, paletteColorMain, glow),
    filter: hasClipPath
      ? `drop-shadow(0 2px 4px ${alpha(paletteColorMain, glow ? 0.75 : 0.45)})`
      : undefined,
  };
}

export const StandaloneBadgeRoot = styled("span", {
  shouldForwardProp: (prop) =>
    prop !== "$badgeShape" &&
    prop !== "$badgeSize" &&
    prop !== "$glow" &&
    prop !== "$mono" &&
    prop !== "$badgeColor",
})<{
  $badgeShape?: BadgeShape;
  $badgeSize?: BadgeSize;
  $glow?: boolean;
  $mono?: boolean;
  $badgeColor?: BadgeColor;
}>(({
  theme,
  $badgeShape,
  $badgeSize = "medium",
  $glow,
  $mono,
  $badgeColor,
}) => {
  const shapeStyle = getResolvedBadgeShape($badgeShape);
  const hasClipPath = Boolean(shapeStyle?.clipPath);
  const paletteColor = resolveBadgePaletteColor(theme, $badgeColor);
  const sizeCfg = BADGE_SIZE_CONFIG[$badgeSize] || BADGE_SIZE_CONFIG.medium;

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: sizeCfg.dim,
    height: sizeCfg.dim,
    minWidth: sizeCfg.dim,
    minHeight: sizeCfg.dim,
    maxWidth: sizeCfg.dim,
    maxHeight: sizeCfg.dim,
    aspectRatio: "1 / 1",
    padding: 0,
    backgroundColor: alpha(paletteColor.main, 0.22),
    color: paletteColor.main,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    boxSizing: "border-box",
    fontWeight: 700,
    fontSize: sizeCfg.fontSize,
    letterSpacing: "0.04em",
    userSelect: "none",
    flexShrink: 0,
    cursor: "default",
    position: "relative",
    zIndex: 10,
    isolation: "isolate",
    lineHeight: 1,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    transition: theme.transitions.create([
      "background-color",
      "border-color",
      "box-shadow",
      "filter",
      "transform",
    ]),

    ...getStandaloneVisualStyles(
      shapeStyle,
      hasClipPath,
      paletteColor.main,
      $glow,
    ),
    ...getBadgeMonoStyles($mono),

    "& svg, & .MuiSvgIcon-root": {
      display: "inline-block",
      flexShrink: 0,
      fill: "currentColor",
      color: "inherit",
      fontSize: `${sizeCfg.iconSize}px !important`,
      width: "1em",
      height: "1em",
    },

    "&:hover": {
      boxShadow: hasClipPath
        ? "none"
        : `0 0 12px ${alpha(paletteColor.main, 0.7)}`,
      filter: hasClipPath
        ? `drop-shadow(0 0 8px ${alpha(paletteColor.main, 0.85)})`
        : undefined,
      borderColor: paletteColor.main,
      transform: "scale(1.08)",
    },

    ...theme.applyStyles("dark", {
      backgroundColor: alpha(paletteColor.main, 0.28),
      border: hasClipPath
        ? "none"
        : `1px solid ${alpha(paletteColor.main, 0.65)}`,
      color: paletteColor.main,
    }),
  };
});
