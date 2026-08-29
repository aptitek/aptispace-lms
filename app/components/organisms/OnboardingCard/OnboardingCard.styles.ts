import { styled, alpha } from "@mui/material/styles";
import { SOLARIZED_BASE } from "../../../tokens/theme";

export const CardFrontContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  width: "100%",
  padding: "10px 14px",
  boxSizing: "border-box",
  position: "relative",
  zIndex: 10,
  userSelect: "none",
});

export const SchoolHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: "6px",
  borderBottom: `1px solid ${alpha(SOLARIZED_BASE.base3, 0.14)}`,
  gap: theme.spacing(1),
}));

export const SchoolBrandingHolder = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  maxWidth: "65%",
  overflow: "hidden",
}));

export const SchoolLogoImg = styled("img")({
  height: "24px",
  maxWidth: "110px",
  objectFit: "contain",
  display: "block",
  filter: `drop-shadow(0 1px 3px ${alpha(SOLARIZED_BASE.base03, 0.4)})`,
});

export const SchoolFallbackText = styled("span")(({ theme }) => ({
  fontSize: "0.85rem",
  fontWeight: 900,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: theme.palette.text.primary,
  textShadow: `0 1px 4px ${alpha(SOLARIZED_BASE.base03, 0.6)}`,
}));

export const CohortBadge = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",

  "& md-assist-chip": {
    fontFamily: theme.typography.fontFamily,
    cursor: "default",
    "--md-assist-chip-container-shape": "6px",
    "--md-assist-chip-container-color": alpha(SOLARIZED_BASE.base3, 0.1),
    "--md-assist-chip-outline-color": alpha(SOLARIZED_BASE.base3, 0.25),
    "--md-assist-chip-label-text-color": theme.palette.primary.light,
    "--md-assist-chip-label-text-size": "0.65rem",
    "--md-assist-chip-label-text-weight": "800",
    "--md-assist-chip-container-height": "20px",
    "--md-assist-chip-leading-space": "6px",
    "--md-assist-chip-trailing-space": "6px",
    backdropFilter: "blur(8px)",
  },
}));

export const CardMainBody = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "100px 1fr",
  gap: theme.spacing(1.5),
  alignItems: "center",
  flex: 1,
  paddingTop: "6px",
  paddingBottom: "4px",
}));

export const AvatarCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  flexShrink: 0,
  width: "96px",
  height: "112px",
  borderRadius: "10px",
  overflow: "hidden",
  border: `1.5px solid ${alpha(SOLARIZED_BASE.base3, 0.35)}`,
  boxShadow: `0 4px 12px ${alpha(SOLARIZED_BASE.base03, 0.35)}`,
  "& .MuiAvatar-root, & .biometric-avatar-container": {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
  },
});

export const FieldsCol = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "100%",
  minWidth: 0,

  "& md-filled-text-field, & md-outlined-text-field": {
    width: "100%",
    fontFamily: theme.typography.fontFamily,
    "--md-filled-text-field-container-color": alpha(
      SOLARIZED_BASE.base03,
      0.45,
    ),
    "--md-filled-text-field-input-text-color": theme.palette.text.primary,
    "--md-filled-text-field-label-text-color": alpha(
      theme.palette.text.secondary,
      0.85,
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
    "--md-filled-text-field-container-shape": "6px",
    "--md-filled-text-field-input-text-size": "0.76rem",
    "--md-filled-text-field-label-text-size": "0.68rem",
    "--md-filled-text-field-label-text-populated-size": "0.56rem",
    "--md-filled-text-field-top-space": "3px",
    "--md-filled-text-field-bottom-space": "3px",
    "--md-filled-text-field-with-label-top-space": "2px",
    "--md-filled-text-field-with-label-bottom-space": "2px",
    "--md-filled-text-field-leading-space": "8px",
    "--md-filled-text-field-trailing-space": "8px",
    backdropFilter: "blur(6px)",
  },
}));

export const FieldRow = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  width: "100%",
});

export const CardFieldLabel = styled("label")(({ theme }) => ({
  fontSize: "0.58rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.7px",
  color: theme.palette.text.secondary,
  lineHeight: 1,
}));

export const CardInput = styled("input")<{ hasError?: boolean }>(
  ({ theme, hasError }) => ({
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: alpha(SOLARIZED_BASE.base03, 0.3),
    border: `1px solid ${hasError ? theme.palette.error.main : alpha(SOLARIZED_BASE.base3, 0.18)}`,
    borderRadius: "5px",
    padding: "3px 6px",
    fontSize: "0.74rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
    outline: "none",
    transition: "all 0.18s ease-in-out",
    backdropFilter: "blur(6px)",
    "&:focus": {
      borderColor: theme.palette.primary.light,
      backgroundColor: alpha(SOLARIZED_BASE.base03, 0.45),
      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.light, 0.5)}`,
    },
    "&:disabled": {
      opacity: 0.8,
      cursor: "not-allowed",
    },
  }),
);

export const FixedDomainEmailHolder = styled("div")({
  width: "100%",
});

export const CardBackContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  width: "100%",
  padding: 0,
  boxSizing: "border-box",
  position: "relative",
  zIndex: 10,
});

export const BackMainArea = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  gap: theme.spacing(1),
  alignItems: "center",
  padding: "12px 14px 4px 14px",
  flex: 1,
}));

export const BackLeftContactCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  position: "relative",
  minHeight: "80px",
});

export const BackRightContentCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  textAlign: "center",
});

export const FullWidthMrzHolder = styled("div")({
  width: "100%",
  padding: "0 10px 8px 10px",
  boxSizing: "border-box",
  "& pre": {
    margin: 0,
    width: "100%",
  },
});
