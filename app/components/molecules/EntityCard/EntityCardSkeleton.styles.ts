import { styled, alpha, type Theme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function getSkeletonBg(theme: Theme, isGhost?: boolean) {
  return isGhost
    ? alpha(theme.palette.background.paper, 0.45)
    : theme.palette.background.paper;
}

function getSkeletonBorder(theme: Theme, isGhost?: boolean) {
  return isGhost
    ? `1.5px dashed ${alpha(theme.palette.divider, 0.35)}`
    : undefined;
}

export const SkeletonCardContainer = styled(Card, {
  shouldForwardProp: (prop) =>
    prop !== "animated" &&
    prop !== "opacity" &&
    prop !== "isGhost" &&
    prop !== "isInteractive",
})<{
  animated?: boolean;
  opacity?: number;
  isGhost?: boolean;
  isInteractive?: boolean;
}>(({ theme, opacity, isGhost, isInteractive }) => {
  const primary = theme.palette.primary.main;
  const bg = getSkeletonBg(theme, isGhost);
  const border = getSkeletonBorder(theme, isGhost);

  return {
    position: "relative",
    width: "100%",
    minWidth: "260px",
    maxWidth: "100%",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    opacity: opacity ?? 1,
    pointerEvents: isInteractive ? "auto" : "none",
    cursor: isInteractive ? "pointer" : "default",
    backgroundColor: bg,
    border,
    backdropFilter: isGhost ? "blur(8px)" : undefined,
    WebkitBackdropFilter: isGhost ? "blur(8px)" : undefined,
    overflow: "hidden",
    userSelect: "none",
    transition: theme.transitions.create(
      ["transform", "box-shadow", "border-color", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    ...(isInteractive && {
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: primary,
        backgroundColor: alpha(primary, 0.04),
        boxShadow: `0 8px 24px -4px ${alpha(primary, 0.15)}`,
        "& .md3-ghost-fab": {
          transform: "scale(1.1)",
          boxShadow: `0 8px 20px -2px ${alpha(primary, 0.55)}, 0 4px 10px -1px ${alpha(theme.palette.common.black, 0.25)}`,
        },
      },
      "&:focus-visible": {
        outline: `2px solid ${primary}`,
        outlineOffset: "2px",
      },
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: isGhost
        ? alpha(theme.palette.background.paper, 0.35)
        : theme.palette.background.paper,
      borderColor: isGhost ? alpha(theme.palette.divider, 0.25) : undefined,
    }),
  };
});

export { GhostFabOverlay } from "../../atoms/ExpressiveCard";

export const SkeletonCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  "&:last-child": {
    paddingBottom: theme.spacing(2),
  },
}));

export const SkeletonHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const SkeletonHeaderBadges = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const SkeletonBodyRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  width: "100%",
  minWidth: 0,
}));

export const SkeletonAvatarContainer = styled("div")({
  position: "relative",
  width: "80px",
  height: "80px",
  minWidth: "80px",
  maxWidth: "80px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const SkeletonDetailsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "80px",
  minWidth: 0,
  flex: 1,
  gap: "3px",
});

export const SkeletonNameBlock = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  minWidth: 0,
  overflow: "hidden",
});

export const SkeletonFooterRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  marginTop: "auto",
  paddingTop: theme.spacing(0.25),
  minWidth: 0,
}));
