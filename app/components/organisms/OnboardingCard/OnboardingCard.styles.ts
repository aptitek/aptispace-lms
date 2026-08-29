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
  padding: "2px 7px",
  borderRadius: "6px",
  backgroundColor: alpha(SOLARIZED_BASE.base3, 0.1),
  border: `1px solid ${alpha(SOLARIZED_BASE.base3, 0.2)}`,
  backdropFilter: "blur(8px)",
  fontSize: "0.65rem",
  fontWeight: 800,
  letterSpacing: "0.5px",
  color: theme.palette.primary.light,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
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

export const FieldsCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  width: "100%",
  minWidth: 0,
});

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
  "& .MuiInputBase-root": {
    fontSize: "0.74rem",
  },
  "& .fixed-domain-root": {
    width: "100%",
  },
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
