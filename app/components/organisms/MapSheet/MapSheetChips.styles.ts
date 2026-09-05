import { styled, alpha } from "@mui/material/styles";

/**
 * Door code display pill with one-click copy button
 */
export const DoorCodePill = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "2px 8px",
  borderRadius: "7px",
  backgroundColor: alpha(theme.palette.background.paper, 0.88),
  border: `1px dashed ${alpha(theme.palette.error.main, 0.42)}`,
  fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontWeight: 800,
  fontSize: "0.78rem",
  letterSpacing: "0.04em",
  color: theme.palette.error.dark || theme.palette.error.main,
  width: "fit-content",
  lineHeight: 1.3,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.paper, 0.92),
    borderColor: alpha(theme.palette.error.main, 0.5),
    color: theme.palette.error.light || theme.palette.error.main,
  }),
}));

/**
 * Address text container with truncated overflow protection
 */
export const AddressTextWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 6,
  minWidth: 0,
  flex: 1,
});

/**
 * Wrapper holding wayfinding chips and horizontal transit track connector
 */
export const ChipsDeckWrapper = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  minWidth: 0,
});

/**
 * Row holding wayfinding chips (Campus, Building, Room, Code)
 */
export const ChipsDeckRow = styled("div")({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  gap: 6,
  flexWrap: "wrap",
  minWidth: 0,
  width: "100%",
});

/**
 * Expressive Wayfinding Chip for Campus, Building, Room Name, and Instructions
 */
export const WayfindingChip = styled("div", {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant?: "campus" | "building" | "instruction" | "room" }>(({
  theme,
  $variant = "campus",
}) => {
  const isCampus = $variant === "campus";
  const isInstruction = $variant === "instruction";
  const isRoom = $variant === "room";
  const colorObj = isCampus
    ? theme.palette.success
    : isInstruction
      ? theme.palette.warning
      : isRoom
        ? theme.palette.secondary
        : theme.palette.primary;
  const color = colorObj.main;

  return {
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 8px",
    borderRadius: "8px",
    backgroundColor: alpha(theme.palette.background.paper, 0.88),
    border: `1px solid ${alpha(color, 0.3)}`,
    color: colorObj.dark || color,
    fontSize: "0.75rem",
    fontWeight: 700,
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    userSelect: "none",
    boxShadow: `0 1px 2px ${alpha(color, 0.06)}`,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    transition:
      "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      borderColor: color,
      boxShadow: `0 2px 6px ${alpha(color, 0.18)}`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.paper, 0.92),
      borderColor: alpha(color, 0.42),
      color: colorObj.light || color,
    }),
    "& span": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  };
});
