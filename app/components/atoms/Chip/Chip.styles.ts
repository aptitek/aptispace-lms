import { styled, alpha } from "@mui/material/styles";
import MuiChip from "@mui/material/Chip";
import type { ResolvedShapeStyle } from "~/tokens/shapes";
import type { ChipShape } from "./Chip.types";

interface StyledChipProps {
  $chipShape?: ChipShape;
  $mono?: boolean;
}

export const RECTANGULAR_CHIP_RADIUS_MAP: Record<string, string> = {
  // Standard scales
  none: "0px",
  "extra-small": "4px",
  "extra-small-top": "4px 4px 0 0",
  small: "6px",
  medium: "8px",
  rounded: "8px",
  large: "12px",
  "large-top": "12px 12px 0 0",
  "large-end": "0 12px 12px 0",
  "large-start": "12px 0 0 12px",
  "extra-large": "16px",
  "extra-large-top": "16px 16px 0 0",
  full: "9999px",
  circular: "9999px",
  pill: "9999px",
  oval: "9999px",
  square: "4px",

  // Expressive geometric shape adaptations tailored for horizontal rectangular chips
  asymmetric: "16px 4px 16px 4px",
  arch: "14px 14px 4px 4px",
  bun: "14px 14px 6px 6px",
  cut: "12px 2px 12px 2px",
  slanted: "14px 4px 14px 4px",
  clamshell: "14px 14px 4px 14px",
  fan: "14px 4px 4px 4px",
  gem: "12px 4px 12px 4px",
  diamond: "12px 2px 12px 2px",
  "4-sided-cookie": "12px 6px 12px 6px",
  "four-sided-cookie": "12px 6px 12px 6px",
  foursidedcookie: "12px 6px 12px 6px",
  "6-sided-cookie": "12px 6px 12px 6px",
  "six-sided-cookie": "12px 6px 12px 6px",
  sixsidedcookie: "12px 6px 12px 6px",
  "7-sided-cookie": "12px 6px 12px 6px",
  "seven-sided-cookie": "12px 6px 12px 6px",
  sevensidedcookie: "12px 6px 12px 6px",
  "9-sided-cookie": "12px 6px 12px 6px",
  "nine-sided-cookie": "12px 6px 12px 6px",
  ninesidedcookie: "12px 6px 12px 6px",
  "12-sided-cookie": "12px 6px 12px 6px",
  "twelve-sided-cookie": "12px 6px 12px 6px",
  twelvesidedcookie: "12px 6px 12px 6px",
  "ghost-ish": "14px 14px 4px 4px",
  ghostish: "14px 14px 4px 4px",
  "soft-burst": "12px 4px 12px 4px",
  softburst: "12px 4px 12px 4px",
  "soft-boom": "12px 4px 12px 4px",
  softboom: "12px 4px 12px 4px",
  flower: "12px 6px 12px 6px",
  puffy: "12px 6px 12px 6px",
  "puffy-diamond": "12px 4px 12px 4px",
  puffydiamond: "12px 4px 12px 4px",
  "pixel-circle": "8px",
  pixelcircle: "8px",
  "pixel-triangle": "12px 4px 12px 4px",
  pixeltriangle: "12px 4px 12px 4px",
  semicircle: "14px 14px 0 0",
  heart: "14px 14px 6px 6px",
  sunny: "12px 6px 12px 6px",
  "very-sunny": "12px 6px 12px 6px",
  verysunny: "12px 6px 12px 6px",
  burst: "12px 4px 12px 4px",
  boom: "12px 4px 12px 4px",
  biometric: "8px",
};

export function getResolvedChipShape(
  shape?: ChipShape,
): ResolvedShapeStyle | null {
  if (shape === undefined || shape === null) return null;
  if (typeof shape === "number") {
    return { borderRadius: `${shape}px` };
  }
  const key = String(shape).toLowerCase();
  const rectangularRadius = RECTANGULAR_CHIP_RADIUS_MAP[key];
  if (rectangularRadius) {
    return { borderRadius: rectangularRadius };
  }
  return { borderRadius: String(shape) };
}

export const StyledMuiChip = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== "$chipShape" && prop !== "$mono",
})<StyledChipProps>(({ theme, $chipShape, $mono }) => {
  const shapeStyle = getResolvedChipShape($chipShape);
  const hasClipPath = Boolean(shapeStyle?.clipPath);

  return {
    transition: theme.transitions.create([
      "background-color",
      "border-color",
      "box-shadow",
      "transform",
      "filter",
    ]),
    boxSizing: "border-box",

    ...(shapeStyle && {
      borderRadius: shapeStyle.borderRadius,
      ...(hasClipPath && {
        clipPath: shapeStyle.clipPath,
        WebkitClipPath: shapeStyle.clipPath,
        border: "none",
        filter: `drop-shadow(0 1px 3px ${alpha(theme.palette.common.black, 0.15)})`,
      }),
    }),

    ...($mono && {
      fontFamily: '"Roboto Mono", "Fira Code", monospace',
      letterSpacing: "0.02em",
      fontWeight: 600,
      "& .MuiChip-label": {
        fontFamily: "inherit",
        letterSpacing: "inherit",
        fontWeight: "inherit",
      },
    }),

    "& .MuiChip-icon": {
      fontSize: "inherit",
      marginLeft: "6px",
      marginRight: "-2px",
    },

    "&.MuiChip-clickable:hover": {
      transform: "translateY(-1px)",
      boxShadow: hasClipPath
        ? undefined
        : `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
      filter: hasClipPath
        ? `drop-shadow(0 2px 6px ${alpha(theme.palette.primary.main, 0.35)})`
        : undefined,
    },

    "&.MuiChip-clickable:active": {
      transform: "translateY(0)",
    },

    ...theme.applyStyles("dark", {
      ...(hasClipPath && {
        filter: `drop-shadow(0 1px 4px ${alpha(theme.palette.common.black, 0.45)})`,
      }),
      "&.MuiChip-clickable:hover": {
        boxShadow: hasClipPath
          ? undefined
          : `0 2px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
        filter: hasClipPath
          ? `drop-shadow(0 2px 8px ${alpha(theme.palette.primary.main, 0.45)})`
          : undefined,
      },
    }),
  };
});

export const ChipImage = styled("img", {
  shouldForwardProp: (prop) =>
    prop !== "$position" && prop !== "$customHeight" && prop !== "$customWidth",
})<{
  $position: "start" | "end";
  $customHeight?: number | string;
  $customWidth?: number | string;
}>(({ $position, $customHeight, $customWidth }) => ({
  height: $customHeight ?? "16px",
  width: $customWidth ?? "auto",
  objectFit: "contain",
  display: "inline-block",
  verticalAlign: "middle",
  flexShrink: 0,
  marginLeft: $position === "end" ? "6px" : "-2px",
  marginRight: $position === "start" ? "6px" : "-2px",
}));

export const EndImageLabelWrapper = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  verticalAlign: "middle",
});
