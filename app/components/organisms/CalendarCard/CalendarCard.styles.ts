import { styled, alpha, type Theme } from "@mui/material/styles";
import { motion, type Variants } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
import type {
  CalendarCardSize,
  CalendarCardOrientation,
  CalendarCardHeaderColor,
} from "./CalendarCard.types";
import { FAB_SIZE_CONFIG, resolveFabColors } from "./CalendarCard.utils";

interface StyledCardProps {
  $size: CalendarCardSize;
  $orientation: CalendarCardOrientation;
  $isInteractive?: boolean;
  $disabled?: boolean;
}

interface StyledHeaderProps {
  $size: CalendarCardSize;
  $headerColor: CalendarCardHeaderColor;
}

interface StyledDayProps {
  $size: CalendarCardSize;
}

interface StyledWeekdayProps {
  $size: CalendarCardSize;
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
  headerColor: CalendarCardHeaderColor,
) {
  if (headerColor === "default") {
    const surfaceBg =
      theme.palette.surfaceContainerHigh ||
      theme.palette.surfaceContainer ||
      theme.palette.background.paper;
    return {
      backgroundColor: surfaceBg,
      color: theme.palette.text.secondary,
      borderBottom: `1px solid ${theme.palette.divider}`,
      ...theme.applyStyles("dark", {
        backgroundColor:
          theme.palette.surfaceContainerHigh ||
          theme.palette.surfaceContainer ||
          theme.palette.background.paper,
        color: theme.palette.text.secondary,
        borderBottom: `1px solid ${theme.palette.divider}`,
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

function resolveInteractiveStateStyles(
  theme: Theme,
  isInteractive?: boolean,
  disabled?: boolean,
) {
  if (disabled) {
    return {
      opacity: 0.5,
      cursor: "not-allowed",
      pointerEvents: "none" as const,
    };
  }

  if (!isInteractive) {
    return {
      cursor: "default",
    };
  }

  return {
    cursor: "pointer",
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "2px",
    },
    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: alpha(theme.palette.primary.main, 0.5),
      boxShadow: `0 12px 24px -6px ${alpha(theme.palette.primary.main, 0.25)}`,
      "& .calendar-card-fab": {
        transform: "scale(1.08)",
        boxShadow: `0 6px 16px -2px ${alpha(theme.palette.primary.main, 0.5)}`,
      },
      ...theme.applyStyles("dark", {
        boxShadow: `0 12px 28px -6px ${alpha(theme.palette.primary.main, 0.35)}`,
      }),
    },
    "&:active": {
      transform: "translateY(-1px) scale(0.98)",
    },
  };
}

export const SheetCard = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$size" &&
    prop !== "$orientation" &&
    prop !== "$isInteractive" &&
    prop !== "$disabled",
})<StyledCardProps>(({
  theme,
  $size,
  $orientation,
  $isInteractive,
  $disabled,
}) => {
  const isHorizontal = $orientation === "horizontal";
  const cfg = SIZE_CONFIG[$size];
  const interactiveStyles = resolveInteractiveStateStyles(
    theme,
    $isInteractive,
    $disabled,
  );

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
    backgroundClip: "padding-box",
    boxShadow:
      "0 6px 18px -4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    overflow: "hidden",
    boxSizing: "border-box",
    userSelect: "none",
    outline: "none",
    transition: theme.transitions.create(
      ["transform", "box-shadow", "border-color", "opacity"],
      { duration: theme.transitions.duration.shorter },
    ),
    ...theme.applyStyles("dark", {
      boxShadow: "0 6px 20px -4px rgba(0, 0, 0, 0.45)",
    }),
    ...interactiveStyles,
  };
});

export const SheetMotionContainer = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$orientation",
})<{ $size: CalendarCardSize; $orientation: CalendarCardOrientation }>(({
  theme,
  $orientation,
}) => {
  const isHorizontal = $orientation === "horizontal";

  return {
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: isHorizontal ? "center" : "stretch",
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: alpha(theme.palette.background.paper, 0.98),
    borderRadius: "inherit",
    transformOrigin: "top center",
    willChange: "transform, opacity",
  };
});

interface StyledFabProps {
  $size: CalendarCardSize;
  $headerColor: CalendarCardHeaderColor;
  $disabled?: boolean;
}

export const CalendarCardFab = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$headerColor" && prop !== "$disabled",
})<StyledFabProps>(({ theme, $size, $headerColor, $disabled }) => {
  const cfg = FAB_SIZE_CONFIG[$size];
  const colors = resolveFabColors(theme, $headerColor);

  return {
    position: "absolute",
    bottom: cfg.bottom,
    right: cfg.right,
    width: cfg.size,
    height: cfg.size,
    borderRadius: cfg.borderRadius,
    backgroundColor: colors.bg,
    color: colors.color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 12,
    boxShadow: `0 3px 10px -2px ${colors.shadowColor}, 0 2px 5px -1px rgba(0, 0, 0, 0.18)`,
    cursor: $disabled ? "not-allowed" : "pointer",
    opacity: $disabled ? 0.38 : 1,
    pointerEvents: $disabled ? "none" : "auto",
    transition: theme.transitions.create(
      ["transform", "box-shadow", "background-color", "opacity"],
      { duration: theme.transitions.duration.shorter },
    ),
    "& svg": {
      fontSize: cfg.iconSize,
      color: "inherit",
    },
    "&:hover": {
      backgroundColor: colors.hoverBg,
      transform: "scale(1.1)",
      boxShadow: `0 6px 16px -2px ${colors.shadowColor}, 0 3px 8px -1px rgba(0, 0, 0, 0.25)`,
    },
    "&:active": {
      transform: "scale(0.94)",
    },
  };
});

export const SHEET_TEAR_VARIANTS: Variants = {
  initial: (shouldReduceMotion: boolean) => ({
    opacity: shouldReduceMotion ? 0 : 0.85,
    scale: shouldReduceMotion ? 1 : 0.98,
    y: 0,
    rotate: 0,
    zIndex: 1,
  }),
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    zIndex: 1,
    transition: M3_SPRINGS.expressive.spatial.default,
  },
  exit: (shouldReduceMotion: boolean) => ({
    opacity: 0,
    scale: shouldReduceMotion ? 1 : 0.94,
    y: shouldReduceMotion ? 0 : 48,
    rotate: shouldReduceMotion ? 0 : 5,
    zIndex: 3,
    boxShadow: shouldReduceMotion
      ? "none"
      : "0 14px 28px -4px rgba(0, 0, 0, 0.22)",
    transition: {
      duration: shouldReduceMotion ? 0.15 : 0.24,
      ease: [0.32, 0, 0.67, 0] as const,
    },
  }),
};

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
})<{ $size?: CalendarCardSize }>(() => ({
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
})<{ $size: CalendarCardSize }>(({ theme, $size }) => {
  const cfg = SIZE_CONFIG[$size];

  return {
    position: "absolute",
    top: 4,
    left: 0,
    right: 0,
    pointerEvents: "none",
    height: cfg.holeSize,
    zIndex: 10,
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
})<{ $size: CalendarCardSize; $orientation: CalendarCardOrientation }>(({
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
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$orientation" && prop !== "$isEditable",
})<{
  $size: CalendarCardSize;
  $orientation: CalendarCardOrientation;
  $isEditable?: boolean;
}>(({ theme, $size, $orientation, $isEditable }) => {
  const isHorizontal = $orientation === "horizontal";

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: isHorizontal
      ? theme.spacing(1, 1.5, 1, 0)
      : theme.spacing(0, 1, 1.25),
    paddingRight:
      $isEditable && !isHorizontal
        ? $size === "small"
          ? "16px"
          : "22px"
        : undefined,
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
