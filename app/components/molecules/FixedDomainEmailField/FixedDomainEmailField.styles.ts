import { styled, alpha, type Theme } from "@mui/material/styles";
import type {
  FixedDomainFieldSize,
  FixedDomainFieldVariant,
} from "./FixedDomainEmailField.types";
import { SOLARIZED_BASE } from "../../../tokens/theme";

interface RootProps {
  fullWidth?: boolean;
  isDisabled?: boolean;
  sizePreset?: FixedDomainFieldSize;
  variantStyle?: FixedDomainFieldVariant;
}

interface Metrics {
  shape: string;
  inputSize: string;
  labelSize: string;
  iconSize: string;
  clearBtnSize: string;
  lockIconSize: string;
  topSpace: string;
  bottomSpace: string;
  sideSpace: string;
}

function getFieldMetrics(sizePreset: FixedDomainFieldSize = "medium"): Metrics {
  switch (sizePreset) {
    case "small":
      return {
        shape: "6px",
        inputSize: "0.825rem",
        labelSize: "0.75rem",
        iconSize: "16px",
        clearBtnSize: "15px",
        lockIconSize: "14px",
        topSpace: "4px",
        bottomSpace: "4px",
        sideSpace: "8px",
      };
    case "large":
      return {
        shape: "12px",
        inputSize: "1rem",
        labelSize: "0.95rem",
        iconSize: "22px",
        clearBtnSize: "20px",
        lockIconSize: "18px",
        topSpace: "12px",
        bottomSpace: "12px",
        sideSpace: "16px",
      };
    default:
      return {
        shape: "8px",
        inputSize: "0.9rem",
        labelSize: "0.85rem",
        iconSize: "18px",
        clearBtnSize: "17px",
        lockIconSize: "16px",
        topSpace: "8px",
        bottomSpace: "8px",
        sideSpace: "12px",
      };
  }
}

function buildFieldTokens(theme: Theme, m: Metrics) {
  return {
    width: "100%",
    fontFamily: theme.typography.fontFamily,
    backdropFilter: "blur(8px)",

    /* Filled Tokens */
    "--md-filled-text-field-container-color": alpha(
      SOLARIZED_BASE.base03,
      0.35,
    ),
    "--md-filled-text-field-input-text-color": theme.palette.text.primary,
    "--md-filled-text-field-label-text-color": alpha(
      theme.palette.text.secondary,
      0.9,
    ),
    "--md-filled-text-field-focus-label-text-color":
      theme.palette.primary.light,
    "--md-filled-text-field-focus-active-indicator-color":
      theme.palette.primary.light,
    "--md-filled-text-field-active-indicator-color": alpha(
      SOLARIZED_BASE.base3,
      0.25,
    ),
    "--md-filled-text-field-hover-active-indicator-color":
      theme.palette.primary.light,
    "--md-filled-text-field-caret-color": theme.palette.primary.light,
    "--md-filled-text-field-container-shape": m.shape,
    "--md-filled-text-field-input-text-size": m.inputSize,
    "--md-filled-text-field-label-text-size": m.labelSize,
    "--md-filled-text-field-input-text-font": theme.typography.fontFamily,
    "--md-filled-text-field-label-text-font": theme.typography.fontFamily,
    "--md-filled-text-field-supporting-text-font": theme.typography.fontFamily,
    "--md-filled-text-field-input-text-suffix-color": alpha(
      theme.palette.text.secondary,
      0.85,
    ),
    "--md-filled-text-field-leading-icon-color": alpha(
      theme.palette.text.secondary,
      0.8,
    ),
    "--md-filled-text-field-focus-leading-icon-color":
      theme.palette.primary.light,
    "--md-filled-text-field-trailing-icon-color": alpha(
      theme.palette.text.secondary,
      0.8,
    ),
    "--md-filled-text-field-focus-trailing-icon-color":
      theme.palette.primary.light,
    "--md-filled-text-field-top-space": m.topSpace,
    "--md-filled-text-field-bottom-space": m.bottomSpace,
    "--md-filled-text-field-leading-space": m.sideSpace,
    "--md-filled-text-field-trailing-space": m.sideSpace,

    /* Outlined Tokens */
    "--md-outlined-text-field-outline-color": alpha(SOLARIZED_BASE.base3, 0.2),
    "--md-outlined-text-field-focus-outline-color": theme.palette.primary.light,
    "--md-outlined-text-field-hover-outline-color": alpha(
      theme.palette.primary.light,
      0.5,
    ),
    "--md-outlined-text-field-input-text-color": theme.palette.text.primary,
    "--md-outlined-text-field-label-text-color": alpha(
      theme.palette.text.secondary,
      0.9,
    ),
    "--md-outlined-text-field-focus-label-text-color":
      theme.palette.primary.light,
    "--md-outlined-text-field-caret-color": theme.palette.primary.light,
    "--md-outlined-text-field-container-shape": m.shape,
    "--md-outlined-text-field-input-text-size": m.inputSize,
    "--md-outlined-text-field-label-text-size": m.labelSize,
    "--md-outlined-text-field-input-text-font": theme.typography.fontFamily,
    "--md-outlined-text-field-label-text-font": theme.typography.fontFamily,
    "--md-outlined-text-field-supporting-text-font":
      theme.typography.fontFamily,
    "--md-outlined-text-field-input-text-suffix-color": alpha(
      theme.palette.text.secondary,
      0.85,
    ),
    "--md-outlined-text-field-leading-icon-color": alpha(
      theme.palette.text.secondary,
      0.8,
    ),
    "--md-outlined-text-field-focus-leading-icon-color":
      theme.palette.primary.light,
    "--md-outlined-text-field-trailing-icon-color": alpha(
      theme.palette.text.secondary,
      0.8,
    ),
    "--md-outlined-text-field-focus-trailing-icon-color":
      theme.palette.primary.light,
    "--md-outlined-text-field-top-space": m.topSpace,
    "--md-outlined-text-field-bottom-space": m.bottomSpace,
    "--md-outlined-text-field-leading-space": m.sideSpace,
    "--md-outlined-text-field-trailing-space": m.sideSpace,
  };
}

export const FieldRoot = styled("div")<RootProps>(({
  theme,
  fullWidth,
  isDisabled,
  sizePreset = "medium",
}) => {
  const metrics = getFieldMetrics(sizePreset);

  return {
    display: "inline-flex",
    flexDirection: "column",
    width: fullWidth ? "100%" : "auto",
    position: "relative",
    boxSizing: "border-box",
    opacity: isDisabled ? 0.6 : 1,

    "& md-filled-text-field, & md-outlined-text-field": buildFieldTokens(
      theme,
      metrics,
    ),

    "& .md3-field-icon-slot": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "inherit",
      "& .MuiSvgIcon-root": {
        fontSize: metrics.iconSize,
      },
    },

    "& .md3-clear-btn": {
      background: "none",
      border: "none",
      padding: 0,
      margin: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: alpha(theme.palette.text.secondary, 0.75),
      transition: "color 0.15s ease",
      "&:hover": {
        color: theme.palette.text.primary,
      },
      "& .MuiSvgIcon-root": {
        fontSize: metrics.clearBtnSize,
      },
    },

    "& .md3-lock-icon": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: alpha(theme.palette.text.secondary, 0.6),
      "& .MuiSvgIcon-root": {
        fontSize: metrics.lockIconSize,
      },
    },
  };
});
