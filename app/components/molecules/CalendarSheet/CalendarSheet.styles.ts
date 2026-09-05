import { styled, alpha, type Theme } from "@mui/material/styles";
import type {
  CalendarSheetSize,
  CalendarSheetOrientation,
  CalendarSheetHeaderColor,
} from "./CalendarSheet.types";

interface StyledCardProps {
  $size: CalendarSheetSize;
  $orientation: CalendarSheetOrientation;
  $isInteractive?: boolean;
}

interface StyledHeaderProps {
  $size: CalendarSheetSize;
  $headerColor: CalendarSheetHeaderColor;
}

interface StyledDayProps {
  $size: CalendarSheetSize;
}

interface StyledWeekdayProps {
  $size: CalendarSheetSize;
}

const SIZE_CONFIG = {
  small: {
    height: 124,
    cardHeight: 82,
    minWidth: 84,
    maxWidth: 104,
    headerFontSize: "0.6875rem",
    headerPadding: "12px 6px 4px",
    dayFontSize: "1.5rem",
    weekdayFontSize: "0.65rem",
    bodyPadding: "6px 8px 8px",
    chipScale: 0.82,
    holeSize: 5,
    holeOffset: 12,
  },
  medium: {
    height: 175,
    cardHeight: 116,
    minWidth: 124,
    maxWidth: 154,
    headerFontSize: "0.8125rem",
    headerPadding: "15px 10px 6px",
    dayFontSize: "2.4rem",
    weekdayFontSize: "0.75rem",
    bodyPadding: "10px 12px 12px",
    chipScale: 0.92,
    holeSize: 6,
    holeOffset: 20,
  },
  large: {
    height: 220,
    cardHeight: 148,
    minWidth: 160,
    maxWidth: 200,
    headerFontSize: "0.9375rem",
    headerPadding: "18px 14px 8px",
    dayFontSize: "3.25rem",
    weekdayFontSize: "0.85rem",
    bodyPadding: "14px 16px 16px",
    chipScale: 1,
    holeSize: 8,
    holeOffset: 28,
  },
};

function resolveHeaderStyles(
  theme: Theme,
  headerColor: CalendarSheetHeaderColor,
) {
  if (headerColor === "default") {
    return {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.grey[900],
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
      ...theme.applyStyles("dark", {
        backgroundColor: alpha(theme.palette.grey[800], 0.9),
        color: theme.palette.grey[100],
      }),
    };
  }

  const colorMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    error: theme.palette.error,
  };
  const targetPalette = colorMap[headerColor] || theme.palette.primary;

  return {
    backgroundColor: targetPalette.main,
    color: targetPalette.contrastText || theme.palette.common.white,
    borderBottom: `1px solid ${alpha(targetPalette.main, 0.2)}`,
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(targetPalette.main, 0.85),
    }),
  };
}

export const SheetCard = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$orientation" && prop !== "$isInteractive",
})<StyledCardProps>(({ theme, $size, $orientation, $isInteractive }) => {
  const isHorizontal = $orientation === "horizontal";
  const cfg = SIZE_CONFIG[$size];

  return {
    position: "relative",
    display: "inline-flex",
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: isHorizontal ? "center" : "stretch",
    width: isHorizontal ? "auto" : "fit-content",
    minWidth: isHorizontal ? "auto" : cfg.minWidth,
    maxWidth: isHorizontal ? "none" : cfg.maxWidth,
    height: isHorizontal ? cfg.cardHeight : cfg.height,
    minHeight: isHorizontal ? cfg.cardHeight : cfg.height,
    borderRadius: "16px",
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    boxShadow:
      "0 6px 18px -4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    overflow: "hidden",
    boxSizing: "border-box",
    cursor: $isInteractive ? "pointer" : "default",
    userSelect: "none",
    transition: theme.transitions.create(
      ["transform", "box-shadow", "border-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    ...theme.applyStyles("dark", {
      boxShadow: `0 6px 20px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px ${alpha(theme.palette.divider, 0.2)}`,
    }),
    ...($isInteractive && {
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: alpha(theme.palette.primary.main, 0.5),
        boxShadow: `0 12px 24px -6px ${alpha(theme.palette.primary.main, 0.25)}`,
        ...theme.applyStyles("dark", {
          boxShadow: `0 12px 28px -6px ${alpha(theme.palette.primary.main, 0.35)}`,
        }),
      },
      "&:active": {
        transform: "translateY(-1px)",
      },
    }),
  };
});

export const SheetHeader = styled("div", {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$headerColor",
})<StyledHeaderProps>(({ theme, $size, $headerColor }) => {
  const cfg = SIZE_CONFIG[$size];
  const headerStyles = resolveHeaderStyles(theme, $headerColor);

  return {
    position: "relative",
    padding: cfg.headerPadding,
    fontSize: cfg.headerFontSize,
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "capitalize",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1.25,
    ...headerStyles,
  };
});

export const MonthYearText = styled("span", {
  shouldForwardProp: (prop) => prop !== "$size",
})<{ $size?: CalendarSheetSize }>(() => ({
  display: "inline-block",
  lineHeight: 1.25,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
  zIndex: 1,
}));

export const PerforationHoles = styled("div", {
  shouldForwardProp: (prop) => prop !== "$size",
})<{ $size: CalendarSheetSize }>(({ theme, $size }) => {
  const cfg = SIZE_CONFIG[$size];

  return {
    position: "absolute",
    top: 4,
    left: 0,
    right: 0,
    pointerEvents: "none",
    height: cfg.holeSize,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      width: cfg.holeSize,
      height: cfg.holeSize,
      borderRadius: "50%",
      backgroundColor: alpha(theme.palette.common.white, 0.6),
      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.3)",
      ...theme.applyStyles("dark", {
        backgroundColor: alpha(theme.palette.common.black, 0.5),
      }),
    },
    "&::before": {
      left: cfg.holeOffset,
    },
    "&::after": {
      right: cfg.holeOffset,
    },
  };
});

export const SheetBody = styled("div", {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$orientation",
})<{ $size: CalendarSheetSize; $orientation: CalendarSheetOrientation }>(({
  $size,
  $orientation,
}) => {
  const cfg = SIZE_CONFIG[$size];
  const isHorizontal = $orientation === "horizontal";

  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: isHorizontal ? "none" : 1,
    padding: cfg.bodyPadding,
    gap: isHorizontal ? 0.5 : 0.25,
  };
});

export const DayNumber = styled("span", {
  shouldForwardProp: (prop) => prop !== "$size",
})<StyledDayProps>(({ theme, $size }) => {
  const cfg = SIZE_CONFIG[$size];

  return {
    fontSize: cfg.dayFontSize,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.04em",
    color: theme.palette.text.primary,
    fontVariantNumeric: "tabular-nums",
    display: "block",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 2,
  };
});

export const WeekdayName = styled("span", {
  shouldForwardProp: (prop) => prop !== "$size",
})<StyledWeekdayProps>(({ theme, $size }) => {
  const cfg = SIZE_CONFIG[$size];

  return {
    fontSize: cfg.weekdayFontSize,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: theme.palette.text.secondary,
    lineHeight: 1.2,
    textAlign: "center",
    display: "block",
  };
});

export const ChipWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$orientation",
})<{ $size: CalendarSheetSize; $orientation: CalendarSheetOrientation }>(({
  theme,
  $size,
  $orientation,
}) => {
  const isHorizontal = $orientation === "horizontal";

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: isHorizontal
      ? theme.spacing(1, 1.5, 1, 0)
      : theme.spacing(0, 1, 1.25),
    transform: $size === "small" ? "scale(0.88)" : "none",
    transformOrigin: isHorizontal ? "center left" : "top center",
    "& .MuiChip-root": {
      fontWeight: 700,
      height: $size === "small" ? "20px" : "24px",
      fontSize: $size === "small" ? "0.6875rem" : "0.75rem",
      borderRadius: "9999px",
    },
  };
});
