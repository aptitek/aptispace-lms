import { styled, alpha } from "@mui/material/styles";
import { SOLARIZED_BASE } from "../../../tokens/theme";

export const MrzContainer = styled("div")<{
  compact?: boolean;
  darkOnLight?: boolean;
  fullWidth?: boolean;
}>(({ theme, compact, darkOnLight, fullWidth }) => ({
  position: "relative",
  width: fullWidth ? "100%" : "auto",
  fontFamily: '"OCR-B", "Courier New", Courier, monospace',
  backgroundColor: darkOnLight
    ? alpha(SOLARIZED_BASE.base3, 0.94)
    : theme.palette.background.paper,
  border: darkOnLight
    ? `1px solid ${alpha(SOLARIZED_BASE.base03, 0.16)}`
    : `1px solid ${theme.palette.divider}`,
  borderRadius: "6px",
  padding: compact ? "6px 8px" : "10px 14px",
  color: darkOnLight ? SOLARIZED_BASE.base03 : theme.palette.text.primary,
  boxShadow: darkOnLight
    ? `0 2px 8px ${alpha(SOLARIZED_BASE.base03, 0.1)}, inset 0 1px 1px ${alpha(SOLARIZED_BASE.base3, 0.9)}`
    : theme.palette.mode === "dark"
      ? `inset 0 1px 3px ${alpha(SOLARIZED_BASE.base03, 0.5)}`
      : `inset 0 1px 3px ${alpha(SOLARIZED_BASE.base03, 0.2)}`,
  userSelect: "all",
  overflow: "hidden",
  zIndex: 2,
  boxSizing: "border-box",
}));

export const MrzPre = styled("pre")<{
  compact?: boolean;
  darkOnLight?: boolean;
  fullWidth?: boolean;
}>(({ theme, compact, darkOnLight, fullWidth }) => ({
  margin: 0,
  padding: 0,
  width: "100%",
  fontFamily: '"OCR-B", "Courier New", Courier, monospace',
  fontSize: compact
    ? "clamp(7.8px, 2.05vw, 10.2px)"
    : "clamp(9px, 2.4vw, 12px)",
  lineHeight: 1.35,
  letterSpacing: fullWidth ? "0.22em" : "0.16em",
  fontWeight: 800,
  textTransform: "uppercase",
  whiteSpace: "pre",
  display: "block",
  textAlign: "justify",
  color: darkOnLight ? SOLARIZED_BASE.base03 : theme.palette.text.primary,
  textShadow: darkOnLight ? "none" : `0 0 2px ${theme.palette.primary.light}`,

  "& code": {
    fontFamily: "inherit",
    display: "block",
    width: "100%",
  },
}));

export const StatusPill = styled("span")<{ isValidStatus: boolean }>(
  ({ theme, isValidStatus }) => ({
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
    fontFamily: "monospace",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }),
);
