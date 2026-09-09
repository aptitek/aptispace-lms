import { styled, alpha } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";
import type {
  DateTimeFieldSize,
  DateTimeFieldMode,
  DateTimeFieldVisualVariant,
} from "./DateTimeField.types";

interface StyledContainerProps {
  $fullWidth?: boolean;
  $fitContent?: boolean;
}

interface StyledRowProps {
  $size: DateTimeFieldSize;
  $fullWidth?: boolean;
  $fitContent?: boolean;
}

interface StyledPickerWrapperProps {
  $size: DateTimeFieldSize;
  $mode: DateTimeFieldMode;
  $isRange: boolean;
  $fullWidth?: boolean;
  $fitContent?: boolean;
  $textAlign?: "left" | "center";
  $variant?: DateTimeFieldVisualVariant;
}

interface StyledSeparatorProps {
  $size: DateTimeFieldSize;
}

const FIELD_HEIGHTS: Record<DateTimeFieldSize, number> = {
  compact: 32,
  small: 40,
  medium: 56,
  large: 56,
};

const FIELD_FONT_SIZES: Record<DateTimeFieldSize, string> = {
  compact: "0.8125rem",
  small: "0.875rem",
  medium: "1rem",
  large: "1.0625rem",
};

const SINGLE_MIN_WIDTHS: Record<
  DateTimeFieldMode,
  Record<DateTimeFieldSize, number>
> = {
  time: { compact: 104, small: 150, medium: 180, large: 200 },
  date: { compact: 124, small: 170, medium: 210, large: 230 },
  datetime: { compact: 170, small: 230, medium: 270, large: 290 },
};

const RANGE_MIN_WIDTHS: Record<
  DateTimeFieldMode,
  Record<DateTimeFieldSize, number>
> = {
  time: { compact: 98, small: 140, medium: 160, large: 180 },
  date: { compact: 118, small: 160, medium: 190, large: 210 },
  datetime: { compact: 160, small: 220, medium: 250, large: 270 },
};

const ROW_GAPS: Record<DateTimeFieldSize, number> = {
  compact: 4,
  small: 8,
  medium: 12,
  large: 12,
};

const SEPARATOR_FONT_SIZES: Record<DateTimeFieldSize, string> = {
  compact: "0.8125rem",
  small: "1rem",
  medium: "1.2rem",
  large: "1.4rem",
};

const FIELD_BORDER_RADII: Record<DateTimeFieldSize, string> = {
  compact: M3_SHAPE_CORNER_STRINGS.extraSmall,
  small: M3_SHAPE_CORNER_STRINGS.small,
  medium: M3_SHAPE_CORNER_STRINGS.small,
  large: M3_SHAPE_CORNER_STRINGS.small,
};

const COMPACT_INPUT_PADDING = "2px 6px";

const FIELD_LABEL_FONT_SIZES: Record<DateTimeFieldSize, string> = {
  compact: "0.75rem",
  small: "0.875rem",
  medium: "0.875rem",
  large: "0.875rem",
};

const ADORNMENT_PADDINGS: Record<DateTimeFieldSize, number> = {
  compact: 2,
  small: 4,
  medium: 4,
  large: 4,
};

const ADORNMENT_ICON_SIZES: Record<DateTimeFieldSize, string> = {
  compact: "1rem",
  small: "1.25rem",
  medium: "1.25rem",
  large: "1.375rem",
};

const ADORNMENT_BUTTON_SIZES: Record<DateTimeFieldSize, number | undefined> = {
  compact: 22,
  small: undefined,
  medium: undefined,
  large: undefined,
};

const ADORNMENT_MARGIN_RIGHTS: Record<DateTimeFieldSize, number | undefined> = {
  compact: -4,
  small: undefined,
  medium: undefined,
  large: undefined,
};

function resolveMinWidth(
  isRange: boolean,
  mode: DateTimeFieldMode,
  size: DateTimeFieldSize,
): number {
  if (isRange) return RANGE_MIN_WIDTHS[mode][size];
  return SINGLE_MIN_WIDTHS[mode][size];
}

function resolveCompactHeight(size: DateTimeFieldSize): number | undefined {
  if (size === "compact") return FIELD_HEIGHTS.compact;
  return undefined;
}

function resolveInputPadding(size: DateTimeFieldSize): string | undefined {
  if (size === "compact") return COMPACT_INPUT_PADDING;
  return undefined;
}

function resolveElementWidth(fullWidth?: boolean, shouldFit?: boolean): string {
  if (fullWidth) return "100%";
  if (shouldFit) return "fit-content";
  return "auto";
}

function resolveItemMinWidth(
  fullWidth?: boolean,
  shouldFit?: boolean,
  fallbackMinWidth?: number,
): number | "auto" {
  if (fullWidth || shouldFit) return 0;
  return fallbackMinWidth ?? "auto";
}

function resolveSectionsWidth(shouldFit?: boolean): "auto" | undefined {
  return shouldFit ? "auto" : undefined;
}

function resolveSectionsFlex(shouldFit?: boolean): "0 0 auto" | undefined {
  return shouldFit ? "0 0 auto" : undefined;
}

export const DateTimeFieldContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$fullWidth" && prop !== "$fitContent",
})<StyledContainerProps>(({ $fullWidth, $fitContent = true }) => {
  const shouldFit = $fitContent && !$fullWidth;
  return {
    display: "inline-flex",
    flexDirection: "column",
    width: resolveElementWidth($fullWidth, shouldFit),
    maxWidth: "100%",
    verticalAlign: "top",
    position: "relative",
    boxSizing: "border-box",
  };
});

export const DateTimeFieldRow = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$fullWidth" && prop !== "$fitContent",
})<StyledRowProps>(({ $size, $fullWidth, $fitContent = true }) => {
  const shouldFit = $fitContent && !$fullWidth;
  return {
    display: "inline-flex",
    alignItems: "center",
    width: resolveElementWidth($fullWidth, shouldFit),
    maxWidth: "100%",
    gap: ROW_GAPS[$size],
    position: "relative",
  };
});

export const PickerItemWrapper = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$size" &&
    prop !== "$mode" &&
    prop !== "$isRange" &&
    prop !== "$fullWidth" &&
    prop !== "$fitContent" &&
    prop !== "$textAlign" &&
    prop !== "$variant",
})<StyledPickerWrapperProps>(({
  theme,
  $size,
  $mode,
  $isRange,
  $fullWidth,
  $fitContent = true,
  $textAlign = "left",
}) => {
  const minHeight = FIELD_HEIGHTS[$size];
  const fontSize = FIELD_FONT_SIZES[$size];
  const minWidth = resolveMinWidth($isRange, $mode, $size);
  const compactHeight = resolveCompactHeight($size);
  const inputPadding = resolveInputPadding($size);
  const shouldFit = $fitContent && !$fullWidth;

  const itemWidth = resolveElementWidth($fullWidth, shouldFit);
  const itemMinWidth = resolveItemMinWidth($fullWidth, shouldFit, minWidth);
  const sectionsWidth = resolveSectionsWidth(shouldFit);
  const sectionsFlex = resolveSectionsFlex(shouldFit);

  return {
    display: "inline-flex",
    width: itemWidth,
    minWidth: itemMinWidth,
    maxWidth: "100%",
    flex: $fullWidth ? 1 : "0 0 auto",
    position: "relative",

    "& .MuiTextField-root": {
      width: itemWidth,
      minWidth: 0,
      maxWidth: "100%",
    },

    "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
      borderRadius: FIELD_BORDER_RADII[$size],
      fontSize,
      fontVariantNumeric: "tabular-nums",
      height: compactHeight,
      minHeight,
      width: itemWidth,
      maxWidth: "100%",
      transition: theme.transitions.create(["border-color", "box-shadow"], {
        duration: theme.transitions.duration.shorter,
      }),
      "&:hover:not(.Mui-error):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline, &:hover:not(.Mui-error):not(.Mui-disabled) .MuiPickersOutlinedInput-notchedOutline":
        {
          borderColor: theme.palette.text.secondary,
        },
      "&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline, &.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline":
        {
          borderColor: theme.palette.primary.main,
          borderWidth: "2px",
        },
    },

    "& .MuiFilledInput-root, & .MuiPickersFilledInput-root": {
      borderRadius: "12px 12px 0 0",
      backgroundColor:
        theme.palette.surfaceContainerHighest ||
        alpha(theme.palette.text.primary, 0.04),
      fontSize,
      fontVariantNumeric: "tabular-nums",
      minHeight,
      width: itemWidth,
      maxWidth: "100%",
      transition: theme.transitions.create(
        ["background-color", "border-color"],
        { duration: theme.transitions.duration.shorter },
      ),
      "&:hover": {
        backgroundColor: alpha(theme.palette.text.primary, 0.08),
      },
      "&.Mui-focused": {
        backgroundColor: alpha(theme.palette.text.primary, 0.08),
      },
    },

    "& .MuiInput-root, & .MuiPickersInput-root": {
      fontSize,
      fontVariantNumeric: "tabular-nums",
      width: itemWidth,
      maxWidth: "100%",
    },

    "& .MuiPickersInputBase-sectionsContainer": {
      width: sectionsWidth,
      flex: sectionsFlex,
      textAlign: $textAlign,
      padding: inputPadding,
    },

    "& .MuiOutlinedInput-input, & .MuiPickersInputBase-input": {
      textAlign: $textAlign,
      padding: inputPadding,
    },

    "& .MuiInputLabel-root": {
      fontSize: FIELD_LABEL_FONT_SIZES[$size],
      fontWeight: 500,
      "&.Mui-focused": {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    },

    "& .MuiFormHelperText-root": {
      fontSize: "0.75rem",
      lineHeight: 1.25,
    },

    "& .MuiInputAdornment-root": {
      marginRight: ADORNMENT_MARGIN_RIGHTS[$size],
      "& .MuiIconButton-root": {
        width: ADORNMENT_BUTTON_SIZES[$size],
        height: ADORNMENT_BUTTON_SIZES[$size],
        minWidth: ADORNMENT_BUTTON_SIZES[$size],
        minHeight: ADORNMENT_BUTTON_SIZES[$size],
        padding: ADORNMENT_PADDINGS[$size],
        color: theme.palette.text.secondary,
        transition: theme.transitions.create(["color", "background-color"], {
          duration: theme.transitions.duration.shorter,
        }),
        "&:hover": {
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      },
      "& .MuiSvgIcon-root": {
        fontSize: ADORNMENT_ICON_SIZES[$size],
      },
    },
  };
});

export const DateTimeFieldHelperText = styled(FormHelperText)(({ theme }) => ({
  margin: theme.spacing(0.5, 1.75, 0, 1.75),
  fontSize: "0.75rem",
  lineHeight: 1.25,
  color: theme.palette.text.secondary,
  "&.Mui-error": {
    color: theme.palette.error.main,
  },
}));

export const DateTimeSeparator = styled("span", {
  shouldForwardProp: (prop) => prop !== "$size",
})<StyledSeparatorProps>(({ theme, $size }) => ({
  fontSize: SEPARATOR_FONT_SIZES[$size],
  fontWeight: 700,
  color: theme.palette.text.secondary,
  userSelect: "none",
  lineHeight: 1,
  padding: "0 2px",
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  alignSelf: "center",
}));
