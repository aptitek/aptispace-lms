import { styled, alpha, type Theme } from "@mui/material/styles";
import type {
  FixedDomainFieldSize,
  FixedDomainFieldVariant,
} from "./FixedDomainEmailField.types";

interface RootProps {
  fullWidth?: boolean;
  isDisabled?: boolean;
}

interface ContainerProps {
  variantStyle: FixedDomainFieldVariant;
  sizePreset: FixedDomainFieldSize;
  isFocused?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
}

interface DomainCompartmentProps {
  sizePreset: FixedDomainFieldSize;
  hasError?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
}

function getSizeMeasurements(sizePreset: FixedDomainFieldSize = "medium") {
  if (sizePreset === "small") {
    return {
      height: "36px",
      minHeight: "36px",
      paddingX: "10px",
      fontSize: "0.85rem",
      iconSize: "16px",
      domainPaddingX: "7px",
      domainPaddingY: "3px",
      domainFontSize: "0.775rem",
      borderRadius: "8px",
    };
  }
  if (sizePreset === "large") {
    return {
      height: "48px",
      minHeight: "48px",
      paddingX: "14px",
      fontSize: "0.95rem",
      iconSize: "20px",
      domainPaddingX: "10px",
      domainPaddingY: "5px",
      domainFontSize: "0.875rem",
      borderRadius: "12px",
    };
  }
  return {
    height: "42px",
    minHeight: "42px",
    paddingX: "12px",
    fontSize: "0.9rem",
    iconSize: "18px",
    domainPaddingX: "9px",
    domainPaddingY: "4px",
    domainFontSize: "0.825rem",
    borderRadius: "10px",
  };
}

function resolveBorderColor(
  theme: Theme,
  hasError?: boolean,
  isFocused?: boolean,
  isFilled?: boolean,
): string {
  if (hasError) return theme.palette.error.main;
  if (isFocused) return theme.palette.primary.main;
  if (isFilled) return "transparent";
  return alpha(theme.palette.divider, 0.85);
}

function resolveBackgroundColor(
  theme: Theme,
  isFilled?: boolean,
  isFocused?: boolean,
): string {
  if (!isFilled) return theme.palette.background.default;
  if (isFocused) return alpha(theme.palette.primary.main, 0.06);
  return alpha(theme.palette.action.hover, 0.3);
}

function resolveFocusGlow(theme: Theme, hasError?: boolean): string {
  const color = hasError
    ? theme.palette.error.main
    : theme.palette.primary.main;
  return `0 0 0 3px ${alpha(color, 0.2)}`;
}

function resolveHoverBorderColor(
  theme: Theme,
  hasError?: boolean,
  isFocused?: boolean,
): string {
  if (hasError) return theme.palette.error.light;
  if (isFocused) return theme.palette.primary.main;
  return alpha(theme.palette.primary.main, 0.4);
}

export const FieldRoot = styled("div")<RootProps>(
  ({ theme, fullWidth, isDisabled }) => ({
    display: "inline-flex",
    flexDirection: "column",
    width: fullWidth ? "100%" : "auto",
    position: "relative",
    boxSizing: "border-box",
    opacity: isDisabled ? 0.6 : 1,
    cursor: isDisabled ? "not-allowed" : "default",
    gap: theme.spacing(0.5),
  }),
);

export const LabelText = styled("label")(({ theme }) => ({
  fontSize: "0.8rem",
  fontWeight: 700,
  color: theme.palette.text.secondary,
  letterSpacing: "0.02em",
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(0.25),
}));

export const MD3FieldContainer = styled("div")<ContainerProps>(({
  theme,
  variantStyle,
  sizePreset,
  isFocused,
  hasError,
  isDisabled,
}) => {
  const metrics = getSizeMeasurements(sizePreset);
  const isFilled = variantStyle === "filled";
  const borderColor = resolveBorderColor(theme, hasError, isFocused, isFilled);
  const backgroundColor = resolveBackgroundColor(theme, isFilled, isFocused);
  const focusGlow = resolveFocusGlow(theme, hasError);
  const hoverBorder = resolveHoverBorderColor(theme, hasError, isFocused);

  return {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    minHeight: metrics.minHeight,
    height: metrics.height,
    boxSizing: "border-box",
    borderRadius: metrics.borderRadius,
    backgroundColor,
    border: `1px solid ${borderColor}`,
    boxShadow: isFocused ? focusGlow : "none",
    padding: `0 ${metrics.paddingX}`,
    gap: theme.spacing(1),
    transition: theme.transitions.create(
      ["background-color", "border-color", "box-shadow"],
      {
        duration: theme.transitions.duration.shorter,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
      },
    ),

    "&:hover": isDisabled
      ? {}
      : {
          borderColor: hoverBorder,
          boxShadow: isFocused
            ? focusGlow
            : `0 0 0 1px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
  };
});

export const LeadingIconContainer = styled("span")<{
  sizePreset: FixedDomainFieldSize;
  isFocused?: boolean;
  hasError?: boolean;
}>(({ theme, sizePreset, isFocused, hasError }) => {
  const metrics = getSizeMeasurements(sizePreset);
  const iconColor = hasError
    ? theme.palette.error.main
    : isFocused
      ? theme.palette.primary.main
      : theme.palette.text.secondary;

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: iconColor,
    flexShrink: 0,
    lineHeight: 1,
    transition: theme.transitions.create(["color"], {
      duration: theme.transitions.duration.shorter,
    }),

    "& .MuiSvgIcon-root": {
      fontSize: metrics.iconSize,
    },
  };
});

export const InputWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  flex: 1,
  minWidth: 0,
  height: "100%",
  position: "relative",
});

export const UsernameInput = styled("input")<{
  sizePreset: FixedDomainFieldSize;
}>(({ theme, sizePreset }) => {
  const metrics = getSizeMeasurements(sizePreset);
  return {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: metrics.fontSize,
    fontWeight: 500,
    letterSpacing: "0.01em",
    padding: 0,
    margin: 0,
    lineHeight: "normal",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",

    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 0.65,
      fontWeight: 400,
    },

    "&:disabled": {
      cursor: "not-allowed",
    },

    // Clean browser / password extension autofill styling
    "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active":
      {
        WebkitTextFillColor: `${theme.palette.text.primary} !important`,
        WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
        transition: "background-color 5000s ease-in-out 0s",
        backgroundColor: "transparent !important",
      },
  };
});

function resolveCompartmentBg(
  theme: Theme,
  hasError?: boolean,
  isFocused?: boolean,
): string {
  if (hasError) return alpha(theme.palette.error.main, 0.1);
  if (isFocused) return alpha(theme.palette.primary.main, 0.12);
  return alpha(theme.palette.action.selected, 0.6);
}

function resolveCompartmentBorder(
  theme: Theme,
  hasError?: boolean,
  isFocused?: boolean,
): string {
  if (hasError) return alpha(theme.palette.error.main, 0.3);
  if (isFocused) return alpha(theme.palette.primary.main, 0.35);
  return alpha(theme.palette.divider, 0.6);
}

export const DomainCompartment = styled("div")<DomainCompartmentProps>(({
  theme,
  sizePreset,
  hasError,
  isFocused,
  isDisabled,
}) => {
  const metrics = getSizeMeasurements(sizePreset);
  const compartmentBg = resolveCompartmentBg(theme, hasError, isFocused);
  const compartmentBorder = resolveCompartmentBorder(
    theme,
    hasError,
    isFocused,
  );
  const atAccentColor = hasError
    ? theme.palette.error.main
    : theme.palette.primary.light;

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    padding: `${metrics.domainPaddingY} ${metrics.domainPaddingX}`,
    borderRadius: "6px",
    backgroundColor: compartmentBg,
    border: `1px solid ${compartmentBorder}`,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: metrics.domainFontSize,
    fontWeight: 600,
    lineHeight: 1.2,
    userSelect: "none",
    pointerEvents: isDisabled ? "none" : "auto",
    whiteSpace: "nowrap",
    flexShrink: 0,
    boxSizing: "border-box",
    transition: theme.transitions.create(
      ["background-color", "border-color", "color"],
      {
        duration: theme.transitions.duration.shorter,
      },
    ),

    "& .domain-at": {
      color: atAccentColor,
      fontWeight: 700,
      fontSize: "1em",
    },

    "& .domain-text": {
      color: theme.palette.text.primary,
      letterSpacing: "0.01em",
    },

    "& .domain-lock": {
      color: theme.palette.text.secondary,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "2px",
      opacity: 0.75,
      "& .MuiSvgIcon-root": {
        fontSize: "12px",
      },
    },
  };
});

export const ClearIconButton = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  borderRadius: "50%",
  padding: "2px",
  color: theme.palette.text.secondary,
  cursor: "pointer",
  flexShrink: 0,
  lineHeight: 1,
  transition: theme.transitions.create(
    ["background-color", "color", "transform"],
    {
      duration: theme.transitions.duration.shorter,
    },
  ),

  "&:hover": {
    backgroundColor: alpha(theme.palette.action.active, 0.1),
    color: theme.palette.text.primary,
    transform: "scale(1.1)",
  },

  "&:active": {
    transform: "scale(0.92)",
  },

  "& .MuiSvgIcon-root": {
    fontSize: "15px",
  },
}));

export const CompartmentDivider = styled("div")(({ theme }) => ({
  width: "1px",
  height: "50%",
  backgroundColor: alpha(theme.palette.divider, 0.6),
  margin: theme.spacing(0, 0.25),
  flexShrink: 0,
}));

export const HelperTextRoot = styled("div")<{
  hasError?: boolean;
}>(({ theme, hasError }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize ?? "0.75rem",
  fontWeight: 500,
  lineHeight: 1.3,
  color: hasError ? theme.palette.error.main : theme.palette.text.secondary,
  paddingLeft: theme.spacing(0.5),
  minHeight: "16px",

  "& .MuiSvgIcon-root": {
    fontSize: "13px",
  },
}));
