import { styled, alpha, keyframes } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import Chip from "../../atoms/Chip";
import { getContrastTextColor } from "./TimeSheet.utils";
import type {
  TimeSheetSize,
  TimeSheetOrientation,
} from "./TimeSheet.types";

interface StyledCardProps {
  $size: TimeSheetSize;
  $orientation: TimeSheetOrientation;
  $isInteractive?: boolean;
}

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 60, 60, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(255, 60, 60, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 60, 60, 0);
  }
`;

const SIZE_CONFIG = {
  small: {
    cardHeight: 82,
    clockSize: 124,
    overlapOffset: 28,
    cardPaddingLeft: 34,
    cardPaddingRight: 16,
    digitalFontSize: "0.85rem",
    detailsGap: 4,
    chipScale: 0.85,
    chipHeight: "20px",
    chipFontSize: "0.6875rem",
  },
  medium: {
    cardHeight: 116,
    clockSize: 175,
    overlapOffset: 38,
    cardPaddingLeft: 46,
    cardPaddingRight: 20,
    digitalFontSize: "1.0625rem",
    detailsGap: 8,
    chipScale: 1,
    chipHeight: "24px",
    chipFontSize: "0.75rem",
  },
  large: {
    cardHeight: 148,
    clockSize: 220,
    overlapOffset: 48,
    cardPaddingLeft: 56,
    cardPaddingRight: 24,
    digitalFontSize: "1.28rem",
    detailsGap: 10,
    chipScale: 1,
    chipHeight: "24px",
    chipFontSize: "0.75rem",
  },
};

function getConnectedCardLayout(
  cfg: (typeof SIZE_CONFIG)[TimeSheetSize],
  isHorizontal: boolean,
) {
  if (isHorizontal) {
    return {
      height: cfg.cardHeight,
      minHeight: cfg.cardHeight,
      marginLeft: -cfg.overlapOffset,
      marginTop: 0,
      paddingLeft: cfg.cardPaddingLeft,
      paddingRight: cfg.cardPaddingRight,
      paddingTop: 12,
      paddingBottom: 12,
    };
  }

  return {
    height: "auto",
    minHeight: "auto",
    marginLeft: 0,
    marginTop: -cfg.overlapOffset,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: cfg.cardPaddingLeft,
    paddingBottom: 16,
  };
}

export const SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 24,
  mass: 0.8,
};

export const SheetCard = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$orientation" && prop !== "$isInteractive",
})<StyledCardProps>(({ theme, $isInteractive }) => {
  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    cursor: $isInteractive ? "pointer" : "default",
    userSelect: "none",
    transition: theme.transitions.create(
      ["transform", "filter"],
      { duration: theme.transitions.duration.shorter },
    ),
    ...($isInteractive && {
      "&:hover": {
        transform: "translateY(-3px)",
      },
      "&:active": {
        transform: "translateY(-1px)",
      },
    }),
  };
});

export const ClockMedallion = styled("div", {
  shouldForwardProp: (prop) => prop !== "$size",
})<{ $size: TimeSheetSize }>(({ theme, $size }) => {
  const cfg = SIZE_CONFIG[$size];

  return {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: cfg.clockSize,
    height: cfg.clockSize,
    flexShrink: 0,
    filter: "drop-shadow(0 8px 18px rgba(0, 0, 0, 0.12))",
    ...theme.applyStyles("dark", {
      filter: "drop-shadow(0 10px 24px rgba(0, 0, 0, 0.5))",
    }),
  };
});

export const ClockSvg = styled("svg", {
  shouldForwardProp: (prop) => prop !== "$size",
})<{ $size: TimeSheetSize }>(({ $size }) => {
  const cfg = SIZE_CONFIG[$size];

  return {
    width: cfg.clockSize,
    height: cfg.clockSize,
    display: "block",
    overflow: "visible",
  };
});

export const MotionHandGroup = styled(motion.g)(() => ({
  // Hand container grouping with SVG rotation
}));

export const ConnectedCard = styled("div", {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$orientation",
})<{ $size: TimeSheetSize; $orientation: TimeSheetOrientation }>(
  ({ theme, $size, $orientation }) => {
    const isHorizontal = $orientation === "horizontal";
    const cfg = SIZE_CONFIG[$size];
    const layout = getConnectedCardLayout(cfg, isHorizontal);

    return {
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      ...layout,
      gap: cfg.detailsGap,
      borderRadius: "18px",
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      boxShadow:
        "0 6px 18px -4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxSizing: "border-box",
      ...theme.applyStyles("dark", {
        boxShadow: `0 6px 20px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px ${alpha(theme.palette.divider, 0.2)}`,
      }),
      "& .MuiChip-root": {
        fontWeight: 700,
        height: cfg.chipHeight,
        fontSize: cfg.chipFontSize,
        borderRadius: "9999px",
      },
    };
  },
);

export const DigitalIntervalRow = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 8,
  whiteSpace: "nowrap",
});

export const DigitalIntervalText = styled("span", {
  shouldForwardProp: (prop) => prop !== "$size",
})<{ $size: TimeSheetSize }>(({ theme, $size }) => {
  const cfg = SIZE_CONFIG[$size];

  return {
    fontSize: cfg.digitalFontSize,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1.2,
    color: theme.palette.text.primary,
    whiteSpace: "nowrap",
  };
});

export const LivePulseDot = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.error.main,
  display: "inline-block",
  animation: `${pulseAnimation} 1.6s infinite ease-in-out`,
  cursor: "pointer",
  flexShrink: 0,
}));

export const TimeSheetChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "$progressColor",
})<{ $progressColor?: string }>(({ theme, $progressColor }) => {
  if (!$progressColor) {
    return {};
  }

  const contrastColor = getContrastTextColor($progressColor);

  return {
    backgroundColor: `${$progressColor} !important`,
    color: `${contrastColor} !important`,
    borderColor: `${$progressColor} !important`,
    transition: theme.transitions.create(
      ["background-color", "color", "border-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    "& .MuiChip-label": {
      color: `${contrastColor} !important`,
    },
  };
});

export const ProgressContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$progressColor",
})<{ $progressColor?: string }>(({ theme, $progressColor }) => {
  const activeColor = $progressColor || theme.palette.primary.main;

  return {
    width: "100%",
    maxWidth: 156,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 2,
    padding: theme.spacing(0.25, 0),
    color: activeColor,
    "& .text-primary": {
      color: `${activeColor} !important`,
    },
    "& svg path": {
      stroke: `${activeColor} !important`,
    },
    "& .bg-secondary-container": {
      backgroundColor: `${alpha(activeColor, 0.22)} !important`,
    },
  };
});
