import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { type ChipShape, resolveChipShape } from "~/tokens/shapes";
import { FONT_FAMILIES } from "~/tokens/typography";
import type {
  SegmentedChipSize,
  SegmentedChipVariant,
} from "./SegmentedChip.types";

interface StyledRootProps {
  $size: SegmentedChipSize;
  $isClickable?: boolean;
  $variant?: SegmentedChipVariant;
  $shape?: ChipShape;
  $borderColor?: string;
  $bgColor?: string;
}

export const SEGMENTED_CHIP_SIZE_MAP: Record<
  SegmentedChipSize,
  { height: number; fontSize: string }
> = {
  small: { height: 22, fontSize: "0.72rem" },
  medium: { height: 28, fontSize: "0.82rem" },
  large: { height: 36, fontSize: "0.95rem" },
};

function resolveRootBorder(
  borderColor: string | undefined,
  dividerColor: string,
): string {
  return borderColor || alpha(dividerColor, 0.4);
}

function resolveRootBg(
  bgColor: string | undefined,
  isFilled: boolean,
  selectedColor: string,
  paperColor: string,
): string {
  if (bgColor) return bgColor;
  if (isFilled) return alpha(selectedColor, 0.08);
  return alpha(paperColor, 0.95);
}

function resolveHoverStyles(isClickable?: boolean, primaryColor?: string) {
  if (!isClickable) return {};
  return {
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
      borderColor: primaryColor ? alpha(primaryColor, 0.5) : undefined,
    },
    "&:active": {
      transform: "translateY(0)",
    },
  };
}

export const SegmentedChipRoot = styled(Box, {
  shouldForwardProp: (prop) =>
    ![
      "$size",
      "$isClickable",
      "$variant",
      "$shape",
      "$borderColor",
      "$bgColor",
    ].includes(prop as string),
})<StyledRootProps>(({
  theme,
  $size,
  $isClickable,
  $variant,
  $shape,
  $borderColor,
  $bgColor,
}) => {
  const sizeConfig = SEGMENTED_CHIP_SIZE_MAP[$size];
  const isFilled = $variant === "filled";
  const shapeStyle = resolveChipShape($shape ?? "pill");
  const hasClipPath = Boolean(shapeStyle?.clipPath);

  const defaultBorderColor = resolveRootBorder(
    $borderColor,
    theme.palette.divider,
  );
  const defaultBgColor = resolveRootBg(
    $bgColor,
    isFilled,
    theme.palette.action.selected,
    theme.palette.background.paper,
  );

  return {
    display: "inline-flex",
    alignItems: "center",
    boxSizing: "border-box",
    height: sizeConfig.height,
    fontSize: sizeConfig.fontSize,
    borderRadius: shapeStyle?.borderRadius ?? "9999px",
    ...(hasClipPath && {
      clipPath: shapeStyle?.clipPath,
      WebkitClipPath: shapeStyle?.clipPath,
    }),
    overflow: "hidden",
    border: `1px solid ${defaultBorderColor}`,
    backgroundColor: defaultBgColor,
    backdropFilter: "blur(8px)",
    boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
    cursor: $isClickable ? "pointer" : "default",
    userSelect: "none",
    transition:
      "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",
    verticalAlign: "middle",
    maxWidth: "100%",
    ...resolveHoverStyles($isClickable, theme.palette.primary.main),
  };
});

interface StyledSegmentItemProps {
  $size: SegmentedChipSize;
  $bold?: boolean;
  $mono?: boolean;
  $background?: string;
  $color?: string;
  $isClickable?: boolean;
}

export const SegmentItem = styled("span", {
  shouldForwardProp: (prop) =>
    ![
      "$size",
      "$bold",
      "$mono",
      "$background",
      "$color",
      "$isClickable",
    ].includes(prop as string),
})<StyledSegmentItemProps>(({
  theme,
  $size,
  $bold,
  $mono,
  $background,
  $color,
  $isClickable,
}) => {
  const paddingMap = $bold
    ? {
        small: "0 7px",
        medium: "0 10px",
        large: "0 14px",
      }[$size]
    : {
        small: "0 6px",
        medium: "0 8px",
        large: "0 12px",
      }[$size];

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: "100%",
    padding: paddingMap,
    fontWeight: $bold ? 800 : 600,
    letterSpacing: $bold ? "0.02em" : "0.01em",
    fontFamily: $mono ? FONT_FAMILIES.mono : "inherit",
    backgroundColor: $background || "transparent",
    color: $color || theme.palette.text.primary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexShrink: 0,
    cursor: $isClickable ? "pointer" : "inherit",

    ...($isClickable && {
      "&:hover": {
        opacity: 0.85,
      },
    }),
  };
});

export const SegmentDivider = styled(Divider)(({ theme }) => ({
  height: "100%",
  alignSelf: "stretch",
  borderColor: alpha(theme.palette.divider, 0.6),
  flexShrink: 0,
}));

export const SegmentDeleteButton = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingRight: 6,
  paddingLeft: 2,
  cursor: "pointer",
  color: theme.palette.text.secondary,
  transition: "color 0.15s ease",
  "&:hover": {
    color: theme.palette.error.main,
  },
}));
