import { styled, alpha } from "@mui/material/styles";

export const MrzContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "compact" && prop !== "darkOnLight" && prop !== "fullWidth",
})<{
  compact?: boolean;
  darkOnLight?: boolean;
  fullWidth?: boolean;
}>(({ theme, compact, fullWidth }) => ({
  position: "relative",
  containerType: "inline-size",
  width: fullWidth ? "100%" : "auto",
  fontFamily: '"OCR-B", "Courier New", Courier, monospace',
  backgroundColor: alpha(theme.palette.common.white, 0.98),
  backdropFilter: "blur(12px)",
  borderTop: `1.5px solid ${alpha(theme.palette.common.black, 0.15)}`,
  borderLeft: fullWidth
    ? "none"
    : `1.5px solid ${alpha(theme.palette.common.black, 0.15)}`,
  borderRight: fullWidth
    ? "none"
    : `1.5px solid ${alpha(theme.palette.common.black, 0.15)}`,
  borderBottom: fullWidth
    ? "none"
    : `1.5px solid ${alpha(theme.palette.common.black, 0.15)}`,
  borderRadius: fullWidth ? "0 0 16px 16px" : "8px",
  padding: compact ? "10px 14px" : "12px 18px",
  color: theme.palette.common.black,
  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.12)}, inset 0 1px 1px ${alpha(theme.palette.common.white, 0.95)}`,
  userSelect: "all",
  overflow: "hidden",
  zIndex: 2,
  boxSizing: "border-box",

  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.common.white, 0.98),
    borderTop: `1.5px solid ${alpha(theme.palette.common.black, 0.15)}`,
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.12)}, inset 0 1px 1px ${alpha(theme.palette.common.white, 0.95)}`,
    color: theme.palette.common.black,
  }),
}));

export const MrzPre = styled("pre", {
  shouldForwardProp: (prop) =>
    prop !== "compact" && prop !== "darkOnLight" && prop !== "fullWidth",
})<{
  compact?: boolean;
  darkOnLight?: boolean;
  fullWidth?: boolean;
}>(({ theme, compact, fullWidth }) => ({
  margin: 0,
  padding: 0,
  width: "100%",
  fontFamily: '"OCR-B", "Courier New", Courier, monospace',
  fontSize: compact
    ? "clamp(11px, 2.7cqw, 14px)"
    : "clamp(12.5px, 3.25cqw, 16.5px)",
  lineHeight: 1.45,
  letterSpacing: fullWidth ? "clamp(0.22em, 0.72cqw, 0.4em)" : "0.22em",
  fontWeight: 700,
  textTransform: "uppercase",
  whiteSpace: "pre",
  display: "block",
  textAlign: "justify",
  color: theme.palette.common.black,
  textShadow: "none",

  ...theme.applyStyles("dark", {
    color: theme.palette.common.black,
    textShadow: "none",
  }),

  "& code": {
    fontFamily: "inherit",
    display: "block",
    width: "100%",
    letterSpacing: "inherit",
  },
}));

export const StatusPill = styled("span", {
  shouldForwardProp: (prop) => prop !== "isValidStatus",
})<{ isValidStatus: boolean }>(({ theme, isValidStatus }) => ({
  position: "absolute",
  top: 4,
  right: 4,
  display: "inline-flex",
  alignItems: "center",
  gap: "3px",
  fontSize: "8px",
  fontWeight: 800,
  padding: "2px 6px",
  borderRadius: "10px",
  backgroundColor: isValidStatus
    ? theme.palette.success.dark
    : theme.palette.error.dark,
  color: isValidStatus
    ? theme.palette.success.contrastText
    : theme.palette.error.contrastText,
  border: `1px solid ${
    isValidStatus ? theme.palette.success.main : theme.palette.error.main
  }`,
  boxShadow: `0 1px 4px ${alpha(theme.palette.common.black, 0.3)}`,
  fontFamily: "monospace",
  letterSpacing: "0.5px",
  textTransform: "uppercase",

  ...theme.applyStyles("dark", {
    border: `1px solid ${
      isValidStatus ? theme.palette.success.light : theme.palette.error.light
    }`,
  }),
}));
