import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { resolveM3ShapeStyle } from "../../atoms/Avatar";
import type {
  EditableAvatarShape,
  EditableAvatarSize,
} from "./EditableAvatar.types";

function calculateAvatarDimensions(
  sizePreset: EditableAvatarSize = "md",
  shapePreset: EditableAvatarShape = "circular",
  customRatio?: string,
): {
  dimension: string;
  radius: string;
  ratio: string;
  fontSize: string;
  clipPath?: string;
} {
  const isBiometric = shapePreset === "biometric";
  const isLandscape = shapePreset === "landscape";

  const sizeMap: Record<
    EditableAvatarSize,
    {
      biometric: string;
      standard: string;
      fontSize: string;
      landscapeHeight: string;
    }
  > = {
    sm: {
      biometric: "56px",
      standard: "40px",
      fontSize: "0.85rem",
      landscapeHeight: "36px",
    },
    md: {
      biometric: "88px",
      standard: "56px",
      fontSize: "1.15rem",
      landscapeHeight: "56px",
    },
    lg: {
      biometric: "120px",
      standard: "80px",
      fontSize: "1.6rem",
      landscapeHeight: "64px",
    },
    xl: {
      biometric: "144px",
      standard: "104px",
      fontSize: "2rem",
      landscapeHeight: "80px",
    },
  };

  const selectedDimension = isBiometric
    ? sizeMap[sizePreset].biometric
    : isLandscape
      ? sizeMap[sizePreset].landscapeHeight
      : sizeMap[sizePreset].standard;

  const shapeStyle = resolveM3ShapeStyle(shapePreset);
  const selectedRatio = customRatio
    ? customRatio
    : isBiometric
      ? "35 / 45"
      : isLandscape
        ? "auto"
        : "1 / 1";

  return {
    dimension: selectedDimension,
    radius: shapeStyle.borderRadius,
    clipPath: shapeStyle.clipPath,
    ratio: selectedRatio,
    fontSize: sizeMap[sizePreset].fontSize,
  };
}

export const EditableAvatarRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDisabled",
})<{
  isDisabled?: boolean;
}>(({ theme, isDisabled }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
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

export const MainContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasPreview",
})<{
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

function resolveContainerWidth(
  avatarShape: EditableAvatarShape | undefined,
  isLandscape: boolean,
  dimension: number | string,
  customWidth?: number | string,
) {
  if (customWidth !== undefined) return customWidth;
  if (avatarShape === "biometric") return "auto";
  if (isLandscape) return "100%";
  return dimension;
}

function resolveContainerBorder(
  clipPath: string | undefined,
  isDragging: boolean | undefined,
  primaryColor: string,
  dividerColor: string,
) {
  if (clipPath) return "none";
  const borderStyle = isDragging ? "dashed" : "solid";
  const borderColor = isDragging ? primaryColor : dividerColor;
  return `1px ${borderStyle} ${borderColor}`;
}

function resolveContainerHover(
  isInteractive: boolean | undefined,
  primaryColor: string,
) {
  if (!isInteractive) return {};
  return {
    borderColor: primaryColor,
    "& .avatar-hover-overlay": {
      opacity: 1,
    },
  };
}

export const MD3AvatarContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "avatarShape" &&
    prop !== "avatarSize" &&
    prop !== "isInteractive" &&
    prop !== "isDragging" &&
    prop !== "customRatio" &&
    prop !== "customWidth" &&
    prop !== "customHeight",
})<{
  avatarShape?: EditableAvatarShape;
  avatarSize?: EditableAvatarSize;
  isInteractive?: boolean;
  isDragging?: boolean;
  customRatio?: string;
  customWidth?: number | string;
  customHeight?: number | string;
}>(({
  theme,
  avatarShape,
  avatarSize,
  isInteractive,
  isDragging,
  customRatio,
  customWidth,
  customHeight,
}) => {
  const { dimension, radius, clipPath, ratio, fontSize } =
    calculateAvatarDimensions(avatarSize, avatarShape, customRatio);
  const isLandscape = avatarShape === "landscape";
  const width = resolveContainerWidth(
    avatarShape,
    isLandscape,
    dimension,
    customWidth,
  );
  const border = resolveContainerBorder(
    clipPath,
    isDragging,
    theme.palette.primary.main,
    theme.palette.divider,
  );

  return {
    position: "relative",
    height: customHeight ?? dimension,
    width,
    maxWidth: isLandscape ? "100%" : undefined,
    aspectRatio: ratio,
    borderRadius: radius,
    clipPath,
    WebkitClipPath: clipPath,
    flexShrink: 0,
    boxSizing: "border-box",
    cursor: isInteractive ? "pointer" : "default",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border,
    transition: theme.transitions.create(["border-color", "opacity"]),
    "&:hover": resolveContainerHover(isInteractive, theme.palette.primary.main),
    "& .MuiAvatar-root": {
      width: "100%",
      height: "100%",
      borderRadius: radius,
      clipPath,
      WebkitClipPath: clipPath,
      fontSize,
      fontWeight: 700,
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.primary.main,
    },
  };
});

export const AvatarHoverOverlay = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "avatarShape" && prop !== "avatarSize" && prop !== "customRatio",
})<{
  avatarShape?: EditableAvatarShape;
  avatarSize?: EditableAvatarSize;
  customRatio?: string;
}>(({ theme, avatarShape, avatarSize, customRatio }) => {
  const { radius, clipPath } = calculateAvatarDimensions(
    avatarSize,
    avatarShape,
    customRatio,
  );
  return {
    position: "absolute",
    inset: 0,
    borderRadius: radius,
    clipPath,
    WebkitClipPath: clipPath,
    backgroundColor: alpha(theme.palette.background.paper, 0.85),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.2s ease",
    color: theme.palette.primary.main,
    fontSize: "0.7rem",
    fontWeight: 700,
    textAlign: "center",
    padding: theme.spacing(0.5),
    gap: theme.spacing(0.25),
    zIndex: 2,
  };
});

export const UnifiedDropInputArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragging" && prop !== "hasError",
})<{
  isDragging?: boolean;
  hasError?: boolean;
}>(({ theme, isDragging, hasError }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px ${isDragging ? "dashed" : "solid"} ${
    hasError
      ? theme.palette.error.main
      : isDragging
        ? theme.palette.primary.main
        : theme.palette.divider
  }`,
  transition: theme.transitions.create(["border-color", "background-color"]),
  padding: theme.spacing(0.5, 0.75),
  boxSizing: "border-box",
  "&:focus-within": {
    borderColor: hasError
      ? theme.palette.error.main
      : theme.palette.primary.main,
  },
}));

export const InputPrefixIconHolder = styled(Box)(({ theme }) => ({
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

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  flexShrink: 0,
}));

export const ActionIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "variantType",
})<{
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

export const DragBadgeHint = styled(Box)(({ theme }) => ({
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

export const HelperMessage = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isError",
})<{
  isError?: boolean;
}>(({ theme, isError }) => ({
  fontSize: "0.75rem",
  color: isError ? theme.palette.error.light : theme.palette.text.secondary,
  paddingLeft: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

export const ModalBackdrop = styled(Box)(({ theme }) => ({
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

export const ModalCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2.5),
  width: "100%",
  maxWidth: "460px",
  boxShadow: theme.shadows[8],
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: theme.palette.text.primary,
}));
