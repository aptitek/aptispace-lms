import { styled } from "@mui/material/styles";

// ISO/IEC 7816-2 Smart EMV Chip (Position X=162.5, Y=244.9)
export const EmvChip = styled("div")(({ theme }) => ({
  position: "relative",
  width: "48px",
  height: "36px",
  borderRadius: "6px",
  background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 40%, ${theme.palette.warning.dark} 80%, ${theme.palette.warning.light} 100%)`,
  boxShadow:
    "0 2px 5px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.6)",
  border: `1px solid ${theme.palette.warning.dark}`,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  "& .chip-grid": {
    width: "100%",
    height: "100%",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: theme.palette.warning.dark,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      left: "35%",
      right: "35%",
      top: 0,
      bottom: 0,
      borderLeft: `1px solid ${theme.palette.warning.dark}`,
      borderRight: `1px solid ${theme.palette.warning.dark}`,
    },
  },
  "& .chip-center": {
    position: "absolute",
    width: "14px",
    height: "14px",
    borderRadius: "2px",
    border: `1px solid ${theme.palette.warning.dark}`,
    backgroundColor: theme.palette.warning.main,
  },
}));

export const ContactlessSymbol = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  opacity: 0.85,
  "& svg": {
    width: "22px",
    height: "22px",
    transform: "rotate(90deg)",
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
  },
}));

export const HolographicSeal = styled("div")(({ theme }) => ({
  position: "relative",
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.light}, ${theme.palette.warning.main}, ${theme.palette.success.main})`,
  backgroundSize: "200% 200%",
  boxShadow: `0 0 10px ${theme.palette.primary.light}, inset 0 0 4px ${theme.palette.action.hover}`,
  border: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "holoShimmer 6s ease infinite",
  overflow: "hidden",

  "@keyframes holoShimmer": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },

  "&::after": {
    content: '"APTISPACE"',
    fontSize: "6px",
    fontWeight: 900,
    letterSpacing: "0.5px",
    color: theme.palette.common.white,
    textShadow: "0 1px 2px rgba(0,0,0,0.8)",
    transform: "rotate(-25deg)",
  },
}));

export const MagneticStripe = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "16px",
  left: 0,
  right: 0,
  height: "44px",
  backgroundColor: theme.palette.common.black,
  boxShadow:
    "inset 0 2px 4px rgba(0, 0, 0, 0.8), inset 0 -1px 2px rgba(255, 255, 255, 0.05)",
  borderTop: `1px solid ${theme.palette.common.black}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(90deg, transparent 90%, rgba(255,255,255,0.03) 100%)",
    backgroundSize: "8px 100%",
  },
}));

export const BackContentWrapper = styled("div")({
  marginTop: "44px",
  zIndex: 2,
});

export const SignatureLabelsRow = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "4px",
  fontSize: "7px",
  color: theme.palette.text.secondary,
  fontWeight: 700,
  letterSpacing: "0.5px",
}));

export const SignatureSection = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const SignatureStrip = styled("div")(({ theme }) => ({
  position: "relative",
  width: "72%",
  height: "32px",
  backgroundColor: theme.palette.common.white,
  borderRadius: "3px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 8px",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
  fontFamily: '"Caveat", "Brush Script MT", cursive',
  fontSize: "1.1rem",
  color: theme.palette.background.default,
  letterSpacing: "1px",

  "&::before": {
    content: '"APTISPACE SECURITY • APTISPACE CLEARANCE • "',
    position: "absolute",
    top: 2,
    left: 4,
    fontSize: "5px",
    fontFamily: "monospace",
    color: theme.palette.text.disabled,
    pointerEvents: "none",
  },
}));

export const CvvBox = styled("div")(({ theme }) => ({
  width: "22%",
  height: "32px",
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "3px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "monospace",
  fontSize: "0.85rem",
  fontWeight: 700,
  color: theme.palette.warning.light,
}));

export const BackNoticeRow = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1.25),
  margin: "4px 0",
  zIndex: 2,
}));

export const BackFinePrint = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "7px",
  color: theme.palette.text.secondary,
  lineHeight: 1.3,
  flex: 1,
}));

export const BackQrBox = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "& .qr-code": {
    fontSize: "28px",
    color: theme.palette.primary.light,
  },
  "& .verified-shield": {
    fontSize: "16px",
    color: theme.palette.success.main,
  },
}));

export const FlipBadge = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "0.7rem",
  fontWeight: 600,
  color: theme.palette.primary.light,
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
  padding: "3px 8px",
  borderRadius: "12px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    borderColor: theme.palette.primary.main,
  },
}));
