import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {
  type ChipShape,
  resolveChipShape,
  M3_SHAPE_CORNERS,
} from "~/tokens/shapes";
import { FONT_FAMILIES } from "~/tokens/typography";
import { M3_STROKES } from "~/tokens/spacing";
import type {
  SegmentedChipSize,
  SegmentedChipVariant,
  SegmentedChipOrientation,
} from "./SegmentedChip.types";

interface StyledRootProps {
  $size: SegmentedChipSize;
  $isClickable?: boolean;
  $variant?: SegmentedChipVariant;
  $shape?: ChipShape;
  $borderColor?: string;
  $bgColor?: string;
  $orientation?: SegmentedChipOrientation;
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

function resolveDefaultRadius(
  isVertical: boolean,
  shapeStyle?: { borderRadius?: string } | null,
) {
  if (isVertical) return "16px";
  return shapeStyle?.borderRadius ?? "9999px";
}

function resolveRootLayout(
  isVertical: boolean,
  isResponsive: boolean,
  height: number,
) {
  const isColumn = isVertical || isResponsive;
  return {
    display: "inline-flex",
    flexDirection: isColumn ? ("column" as const) : ("row" as const),
    flexWrap: "nowrap" as const,
    alignItems: isColumn ? ("stretch" as const) : ("center" as const),
    height: isColumn ? "auto" : height,
    minHeight: height,
    width: isColumn ? "fit-content" : "auto",
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
      "$orientation",
    ].includes(prop as string),
})<StyledRootProps>(({
  theme,
  $size,
  $isClickable,
  $variant,
  $shape,
  $borderColor,
  $bgColor,
  $orientation = "horizontal",
}) => {
  const sizeConfig = SEGMENTED_CHIP_SIZE_MAP[$size];
  const isFilled = $variant === "filled";
  const isVertical = $orientation === "vertical";
  const isResponsive = $orientation === "responsive";
  const isColumn = isVertical || isResponsive;
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

  const defaultRadius = resolveDefaultRadius(isColumn, shapeStyle);
  const layout = resolveRootLayout(isVertical, isResponsive, sizeConfig.height);

  return {
    ...layout,
    boxSizing: "border-box",
    fontSize: sizeConfig.fontSize,
    borderRadius: defaultRadius,
    ...(hasClipPath && {
      clipPath: shapeStyle?.clipPath,
      WebkitClipPath: shapeStyle?.clipPath,
    }),
    overflow: "hidden",
    border: `${M3_STROKES.thin}px solid ${defaultBorderColor}`,
    backgroundColor: defaultBgColor,
    backdropFilter: "blur(8px)",
    boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
    cursor: $isClickable ? "pointer" : "default",
    userSelect: "none",
    transition:
      "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",
    verticalAlign: "middle",
    maxWidth: "100%",
    ...(isColumn && {
      "& .MuiDivider-root": {
        width: "100%",
        height: M3_STROKES.thin,
        minHeight: M3_STROKES.thin,
        border: "none",
        borderBottom: `${M3_STROKES.thin}px solid ${alpha(theme.palette.divider, 0.6)}`,
        alignSelf: "stretch",
        flexShrink: 0,
      },
    }),
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
  $isEditable?: boolean;
  $isColumn?: boolean;
}

function resolveSegmentPadding(
  size: SegmentedChipSize,
  bold?: boolean,
  isColumn?: boolean,
) {
  if (isColumn) {
    return { small: "0 8px", medium: "0 12px", large: "0 14px" }[size];
  }
  if (bold) {
    return { small: "0 7px", medium: "0 10px", large: "0 14px" }[size];
  }
  return { small: "0 6px", medium: "0 8px", large: "0 12px" }[size];
}

function resolveSegmentTypography(bold?: boolean, mono?: boolean) {
  return {
    fontWeight: bold ? 800 : 600,
    letterSpacing: bold ? "0.02em" : "0.01em",
    fontFamily: mono ? FONT_FAMILIES.mono : "inherit",
  };
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
      "$isEditable",
      "$isColumn",
    ].includes(prop as string),
})<StyledSegmentItemProps>(({
  theme,
  $size,
  $bold,
  $mono,
  $background,
  $color,
  $isClickable,
  $isEditable,
  $isColumn,
}) => {
  const padding = resolveSegmentPadding($size, $bold, $isColumn);
  const typography = resolveSegmentTypography($bold, $mono);

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: $isColumn ? "flex-start" : "center",
    width: $isColumn ? "100%" : "auto",
    boxSizing: "border-box",
    gap: 6,
    minHeight: SEGMENTED_CHIP_SIZE_MAP[$size].height,
    padding,
    ...typography,
    backgroundColor: $background || "transparent",
    color: $color || theme.palette.text.primary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexShrink: 0,
    cursor: $isEditable ? "text" : $isClickable ? "pointer" : "inherit",
    transition: "background-color 0.15s ease, opacity 0.15s ease",

    ...($isClickable && {
      "&:hover": {
        opacity: 0.85,
      },
    }),

    ...($isEditable && {
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
    }),
  };
});

interface StyledSegmentInlineInputProps {
  $size: SegmentedChipSize;
  $bold?: boolean;
  $mono?: boolean;
  $color?: string;
}

export const SegmentInlineInput = styled("input", {
  shouldForwardProp: (prop) =>
    !["$size", "$bold", "$mono", "$color"].includes(prop as string),
})<StyledSegmentInlineInputProps>(({ theme, $size, $bold, $mono, $color }) => {
  const sizeConfig = SEGMENTED_CHIP_SIZE_MAP[$size];
  const typography = resolveSegmentTypography($bold, $mono);

  return {
    ...typography,
    fontSize: sizeConfig.fontSize,
    color: $color || theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    border: `${M3_STROKES.thin}px solid ${theme.palette.primary.main}`,
    borderRadius: `${M3_SHAPE_CORNERS.extraSmall}px`,
    padding: "0 4px",
    margin: 0,
    outline: "none",
    boxSizing: "border-box",
    height: sizeConfig.height - 6,
    minHeight: sizeConfig.height - 6,
    lineHeight: 1,
    minWidth: "3ch",
    maxWidth: "100%",
    boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.25)}`,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    "&:focus": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`,
    },
  };
});

export const SegmentDivider = styled(Divider)(({ theme }) => ({
  alignSelf: "stretch",
  borderColor: alpha(theme.palette.divider, 0.6),
  flexShrink: 0,
  "&.MuiDivider-vertical": {
    height: "100%",
    width: M3_STROKES.thin,
  },
  "&.MuiDivider-horizontal": {
    width: "100%",
    height: M3_STROKES.thin,
    borderBottomWidth: M3_STROKES.thin,
  },
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

interface StyledSegmentContentWrapperProps {
  $isEditable?: boolean;
}

export const SegmentContentWrapper = styled("span", {
  shouldForwardProp: (prop) => prop !== "$isEditable",
})<StyledSegmentContentWrapperProps>(({ $isEditable }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  cursor: $isEditable ? "text" : "inherit",
  outline: "none",
  "&:focus-visible": {
    outline: "1px dashed currentColor",
    borderRadius: `${M3_SHAPE_CORNERS.extraSmall}px`,
  },
}));

