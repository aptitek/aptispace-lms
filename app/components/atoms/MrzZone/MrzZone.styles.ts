import { styled } from "@mui/material/styles";

export const MrzContainer = styled("div")<{ compact?: boolean }>(
  ({ theme, compact }) => ({
    position: "relative",
    fontFamily: '"OCR-B", "Courier New", Courier, monospace',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "6px",
    padding: compact ? theme.spacing(0.75) : theme.spacing(1.25),
    color: theme.palette.text.primary,
    boxShadow: `inset 0 1px 3px rgba(0,0,0,0.5)`,
    userSelect: "all",
    overflow: "hidden",
    zIndex: 2,
  }),
);

export const MrzPre = styled("pre")<{ compact?: boolean }>(
  ({ theme, compact }) => ({
    margin: 0,
    padding: 0,
    fontFamily: "inherit",
    fontSize: compact
      ? "clamp(7px, 1.8vw, 9.5px)"
      : "clamp(8.5px, 2.2vw, 11px)",
    lineHeight: 1.3,
    letterSpacing: "0.16em",
    fontWeight: 700,
    textTransform: "uppercase",
    whiteSpace: "pre",
    overflowX: "auto",
    color: theme.palette.text.primary,
    textShadow: `0 0 2px ${theme.palette.primary.light}`,

    "& code": {
      fontFamily: "inherit",
    },
  }),
);

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
