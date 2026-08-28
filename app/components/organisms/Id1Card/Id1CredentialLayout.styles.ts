import { styled, alpha } from "@mui/material/styles";

// ============================================================================
// Front Face Credential Styles (ISO/IEC 19794-5:2011 Biometric Layout)
// ============================================================================

export const FrontLayoutRoot = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: isPortrait ? "column" : "row",
    alignItems: isPortrait ? "center" : "stretch",
    justifyContent: "space-between",
    gap: isPortrait ? theme.spacing(1.25) : theme.spacing(1.75),
    boxSizing: "border-box",
  }),
);

export const FrontDetailsPanel = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    minWidth: 0,
    height: isPortrait ? "auto" : "100%",
    width: isPortrait ? "100%" : "auto",
    gap: isPortrait ? theme.spacing(1) : theme.spacing(0.75),
  }),
);

export const CardHeaderBar = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

export const CardBrandTag = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: theme.palette.text.primary,
}));

export const ClearanceBadge = styled("div")<{ level?: string }>(
  ({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 7px",
    borderRadius: "4px",
    fontSize: "0.62rem",
    fontWeight: 800,
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.light,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  }),
);

export const FrontMainBody = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    display: "flex",
    flexDirection: isPortrait ? "column" : "row",
    alignItems: isPortrait ? "center" : "flex-start",
    gap: theme.spacing(1.5),
    flex: 1,
  }),
);

export const CadetDetailsColumn = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.35),
  flex: 1,
  minWidth: 0,
}));

export const CadetNameText = styled("div")(({ theme }) => ({
  fontSize: "1.05rem",
  fontWeight: 800,
  letterSpacing: "-0.01em",
  color: theme.palette.text.primary,
  lineHeight: 1.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textTransform: "uppercase",
}));

export const CadetCallSignText = styled("div")(({ theme }) => ({
  fontFamily: "monospace",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: theme.palette.secondary.light,
  letterSpacing: "0.4px",
}));

export const CadetRoleText = styled("div")(({ theme }) => ({
  fontSize: "0.72rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
}));

export const MetaGrid = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    display: "grid",
    gridTemplateColumns: isPortrait ? "1fr 1fr" : "repeat(3, 1fr)",
    gap: theme.spacing(0.6),
    marginTop: "auto",
    paddingTop: theme.spacing(0.5),
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
  }),
);

export const MetaItem = styled("div")({
  display: "flex",
  flexDirection: "column",
});

export const MetaLabel = styled("span")(({ theme }) => ({
  fontSize: "0.52rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: theme.palette.text.secondary,
}));

export const MetaValue = styled("span")(({ theme }) => ({
  fontSize: "0.68rem",
  fontWeight: 700,
  fontFamily: "monospace",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

// ============================================================================
// Back Face Credential Styles (ISO 7810 Magstripe, Signature & ICAO 9303 MRZ)
// ============================================================================

export const BackLayoutRoot = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: isPortrait ? theme.spacing(1) : theme.spacing(0.75),
    boxSizing: "border-box",
  }),
);

export const MagneticStripeBar = styled("div")(({ theme }) => ({
  width: "calc(100% + 32px)",
  height: "36px",
  margin: "-16px -16px 8px -16px",
  backgroundColor: theme.palette.common.black,
  backgroundImage: `linear-gradient(90deg, ${theme.palette.common.black} 0%, ${alpha(theme.palette.grey[900], 0.9)} 40%, ${theme.palette.common.black} 100%)`,
  boxShadow: `inset 0 1px 2px ${alpha(theme.palette.common.black, 0.8)}, 0 1px 2px ${alpha(theme.palette.common.white, 0.05)}`,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "4px",
    height: "1px",
    backgroundColor: alpha(theme.palette.common.white, 0.08),
  },
}));

export const BackMiddleSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
  flex: 1,
}));

export const SignaturePanel = styled("div")(({ theme }) => ({
  flex: 1,
  height: "28px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.15)
      : alpha(theme.palette.common.white, 0.85),
  borderRadius: "4px",
  border: `1px dashed ${alpha(theme.palette.divider, 0.8)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 8px",
  fontSize: "0.6rem",
  fontFamily: "monospace",
  color: theme.palette.text.secondary,
}));

export const SecurityCodeTag = styled("span")(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.text.primary,
  letterSpacing: "1px",
}));

export const MrzHolder = styled("div")(({ theme }) => ({
  width: "100%",
  borderRadius: "6px",
  overflow: "hidden",
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
  padding: theme.spacing(0.5),
  boxSizing: "border-box",
}));
