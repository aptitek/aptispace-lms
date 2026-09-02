import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import type { DiplomaColorTheme } from "~/utils/cohortFormat";
import type { CohortChipSize } from "./CohortChip.types";

interface StyledRootProps {
  $size: CohortChipSize;
  $diplomaColor: DiplomaColorTheme;
  $isClickable?: boolean;
  $variant?: "outlined" | "filled";
}

export const CohortChipRoot = styled(Box, {
  shouldForwardProp: (prop) =>
    !["$size", "$diplomaColor", "$isClickable", "$variant"].includes(
      prop as string,
    ),
})<StyledRootProps>(({
  theme,
  $size,
  $diplomaColor,
  $isClickable,
  $variant,
}) => {
  const sizeMap = {
    small: {
      height: 22,
      fontSize: "0.72rem",
      gap: 0,
    },
    medium: {
      height: 28,
      fontSize: "0.82rem",
      gap: 0,
    },
    large: {
      height: 36,
      fontSize: "0.95rem",
      gap: 0,
    },
  }[$size];

  const isFilled = $variant === "filled";

  return {
    display: "inline-flex",
    alignItems: "center",
    boxSizing: "border-box",
    height: sizeMap.height,
    fontSize: sizeMap.fontSize,
    borderRadius: 9999, // MD3 Pill shape
    overflow: "hidden",
    border: `1px solid ${$diplomaColor.border || alpha(theme.palette.divider, 0.4)}`,
    backgroundColor: isFilled
      ? $diplomaColor.light
      : alpha(theme.palette.background.paper, 0.95),
    backdropFilter: "blur(8px)",
    boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
    cursor: $isClickable ? "pointer" : "default",
    userSelect: "none",
    transition:
      "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",
    verticalAlign: "middle",
    maxWidth: "100%",

    ...($isClickable && {
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
        borderColor: $diplomaColor.main,
      },
      "&:active": {
        transform: "translateY(0)",
      },
    }),
  };
});

interface StyledDiplomaProps {
  $size: CohortChipSize;
  $diplomaColor: DiplomaColorTheme;
}

export const CohortDiplomaSegment = styled("span", {
  shouldForwardProp: (prop) =>
    !["$size", "$diplomaColor"].includes(prop as string),
})<StyledDiplomaProps>(({ $size, $diplomaColor }) => {
  const paddingMap = {
    small: "0 7px",
    medium: "0 10px",
    large: "0 14px",
  }[$size];

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: paddingMap,
    fontWeight: 800, // Bold as requested
    letterSpacing: "0.02em",
    backgroundColor: $diplomaColor.main, // Colored fill corresponding to diploma
    color: $diplomaColor.text,
    whiteSpace: "nowrap",
    flexShrink: 0,
  };
});

export const CohortDivider = styled(Divider)(({ theme }) => ({
  height: "55%",
  alignSelf: "center",
  borderColor: alpha(theme.palette.divider, 0.6),
  flexShrink: 0,
}));

interface StyledTagProps {
  $size: CohortChipSize;
}

export const CohortTagSegment = styled("span", {
  shouldForwardProp: (prop) => prop !== "$size",
})<StyledTagProps>(({ theme, $size }) => {
  const paddingMap = {
    small: "0 6px",
    medium: "0 8px",
    large: "0 12px",
  }[$size];

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: paddingMap,
    fontWeight: 600,
    letterSpacing: "0.01em",
    color: theme.palette.text.primary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
});

export const CohortDeleteIconContainer = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  paddingRight: 6,
  paddingLeft: 2,
  cursor: "pointer",
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.error.main,
  },
}));
