import { styled, alpha } from "@mui/material/styles";
import type {
  EditableAvatarShape,
  EditableAvatarSize,
} from "./EditableAvatar.types";

function calculateAvatarDimensions(
  sizePreset: EditableAvatarSize = "md",
  shapePreset: EditableAvatarShape = "circular",
): { dimension: string; radius: string; ratio: string; fontSize: string } {
  const isBiometric = shapePreset === "biometric";

  const sizeMap: Record<
    EditableAvatarSize,
    { biometric: string; standard: string; fontSize: string }
  > = {
    sm: { biometric: "56px", standard: "40px", fontSize: "0.85rem" },
    md: { biometric: "88px", standard: "56px", fontSize: "1.15rem" },
    lg: { biometric: "120px", standard: "80px", fontSize: "1.6rem" },
    xl: { biometric: "144px", standard: "104px", fontSize: "2rem" },
  };

  const selectedDimension = isBiometric
    ? sizeMap[sizePreset].biometric
    : sizeMap[sizePreset].standard;

  let selectedRadius = "50%";
  let selectedRatio = "1 / 1";

  if (shapePreset === "rounded") {
    selectedRadius = sizePreset === "sm" ? "10px" : "16px";
  } else if (shapePreset === "square") {
    selectedRadius = "4px";
  } else if (isBiometric) {
    selectedRadius = "10px";
    selectedRatio = "35 / 45";
  }

  return {
    dimension: selectedDimension,
    radius: selectedRadius,
    ratio: selectedRatio,
    fontSize: sizeMap[sizePreset].fontSize,
  };
}

export const EditableAvatarRoot = styled("div")<{
  isDisabled?: boolean;
}>(({ theme, isDisabled }) => ({
  display: "inline-flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  boxSizing: "border-box",
  opacity: isDisabled ? 0.6 : 1,
  pointerEvents: isDisabled ? "none" : "auto",
}));

export const LabelText = styled("label")(({ theme }) => ({
  fontSize: "0.8rem",
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

export const MainContainer = styled("div")<{
  hasPreview?: boolean;
}>(({ theme, hasPreview }) => ({
  display: "grid",
  gridTemplateColumns: hasPreview ? "auto 1fr" : "1fr",
  gap: theme.spacing(2),
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    justifyItems: "center",
  },
}));

export const MD3AvatarContainer = styled("div")<{
  avatarShape?: EditableAvatarShape;
  avatarSize?: EditableAvatarSize;
  isInteractive?: boolean;
  isDragging?: boolean;
}>(({ theme, avatarShape, avatarSize, isInteractive, isDragging }) => {
  const { dimension, radius, ratio, fontSize } = calculateAvatarDimensions(
    avatarSize,
    avatarShape,
  );

  return {
    position: "relative",
    height: dimension,
    width: avatarShape === "biometric" ? "auto" : dimension,
    aspectRatio: ratio,
    borderRadius: radius,
    flexShrink: 0,
    boxSizing: "border-box",
    cursor: isInteractive ? "pointer" : "default",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1.5px ${isDragging ? "dashed" : "solid"} ${
      isDragging
        ? theme.palette.primary.light
        : isInteractive
          ? alpha(theme.palette.primary.main, 0.4)
          : alpha(theme.palette.divider, 0.6)
    }`,
    boxShadow: isDragging
      ? `0 0 16px ${alpha(theme.palette.primary.light, 0.4)}`
      : isInteractive
        ? `0 0 8px ${alpha(theme.palette.common.black, 0.2)}`
        : "none",
    transition: "all 0.2s ease-in-out",
    "&:hover": isInteractive
      ? {
          borderColor: theme.palette.primary.light,
          boxShadow: `0 0 14px ${alpha(theme.palette.primary.light, 0.3)}`,
          "& .avatar-hover-overlay": {
            opacity: 1,
          },
        }
      : {},
    "& .MuiAvatar-root": {
      width: "100%",
      height: "100%",
      borderRadius: radius,
      fontSize,
      fontWeight: 700,
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      color: theme.palette.primary.light,
    },
  };
});

export const AvatarHoverOverlay = styled("div")<{
  avatarShape?: EditableAvatarShape;
  avatarSize?: EditableAvatarSize;
}>(({ theme, avatarShape, avatarSize }) => {
  const { radius } = calculateAvatarDimensions(avatarSize, avatarShape);
  return {
    position: "absolute",
    inset: 0,
    borderRadius: radius,
    backgroundColor: alpha(theme.palette.background.default, 0.75),
    backdropFilter: "blur(2px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.2s ease",
    color: theme.palette.primary.light,
    fontSize: "0.65rem",
    fontWeight: 700,
    textAlign: "center",
    padding: theme.spacing(0.5),
    gap: theme.spacing(0.25),
    zIndex: 2,
  };
});

export const AvatarResetBadge = styled("button")(({ theme }) => ({
  position: "absolute",
  top: "-6px",
  right: "-6px",
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  backgroundColor: theme.palette.background.paper,
  border: `1.5px solid ${theme.palette.primary.light}`,
  color: theme.palette.primary.light,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.4)}`,
  zIndex: 4,
  padding: 0,
  transition: "all 0.15s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.background.paper,
    transform: "scale(1.15)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

export const UnifiedDropInputArea = styled("div")<{
  isDragging?: boolean;
  hasError?: boolean;
}>(({ theme, isDragging, hasError }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  borderRadius: "10px",
  backgroundColor: isDragging
    ? alpha(theme.palette.primary.main, 0.15)
    : theme.palette.background.default,
  border: `1.5px ${isDragging ? "dashed" : "solid"} ${
    hasError
      ? theme.palette.error.main
      : isDragging
        ? theme.palette.primary.light
        : theme.palette.divider
  }`,
  boxShadow: isDragging
    ? `0 0 14px ${alpha(theme.palette.primary.light, 0.35)}`
    : "none",
  transition: "all 0.2s ease-in-out",
  padding: theme.spacing(0.5, 0.75),
  boxSizing: "border-box",
  "&:focus-within": {
    borderColor: hasError
      ? theme.palette.error.main
      : theme.palette.primary.light,
    boxShadow: `0 0 0 2px ${alpha(
      hasError ? theme.palette.error.main : theme.palette.primary.light,
      0.2,
    )}`,
  },
}));

export const InputPrefixIconHolder = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  flexShrink: 0,
}));

export const TextInput = styled("input")(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  color: theme.palette.text.primary,
  fontSize: "0.875rem",
  fontFamily: "inherit",
  padding: theme.spacing(0.75, 0.5),
  "&::placeholder": {
    color: theme.palette.text.disabled,
    opacity: 0.8,
  },
}));

export const ActionsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  flexShrink: 0,
}));

export const ActionIconButton = styled("button")<{
  variantType?: "primary" | "secondary" | "danger";
}>(({ theme, variantType }) => {
  const getActionColor = () => {
    if (variantType === "primary") return theme.palette.primary.light;
    if (variantType === "danger") return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    borderRadius: "6px",
    color: getActionColor(),
    padding: "6px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.12),
      color: theme.palette.primary.light,
      transform: "scale(1.05)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
    "&:disabled": {
      color: theme.palette.text.disabled,
      cursor: "not-allowed",
      transform: "none",
      backgroundColor: "transparent",
    },
  };
});

export const HiddenFileInput = styled("input")({
  display: "none",
});

export const DragBadgeHint = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.background.paper, 0.92),
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.light,
  fontSize: "0.85rem",
  fontWeight: 700,
  pointerEvents: "none",
  zIndex: 3,
}));

export const HelperMessage = styled("div")<{
  isError?: boolean;
}>(({ theme, isError }) => ({
  fontSize: "0.75rem",
  color: isError ? theme.palette.error.light : theme.palette.text.secondary,
  paddingLeft: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

export const ModalBackdrop = styled("div")(({ theme }) => ({
  position: "fixed",
  inset: 0,
  backgroundColor: alpha(theme.palette.common.black, 0.65),
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1300,
  padding: theme.spacing(2),
}));

export const ModalCard = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "16px",
  padding: theme.spacing(2.5),
  width: "100%",
  maxWidth: "460px",
  boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.5)}, 0 0 24px ${alpha(theme.palette.action.focus, 0.4)}`,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const ModalHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: theme.palette.text.primary,
}));
