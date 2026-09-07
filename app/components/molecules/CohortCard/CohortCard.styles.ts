import { styled, alpha, type Theme } from "@mui/material/styles";
import { StyledCard, DashedSkeletonCard, FabOverlay } from "../../atoms/Card";

export { FabOverlay, DashedSkeletonCard };

export const CardContainer = styled(StyledCard)(({ theme }) => ({
  padding: theme.spacing(1.25, 1.5),
  minWidth: "220px",
  gap: theme.spacing(0.75),
}));

export const CohortName = styled("div")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const CohortDescription = styled("div")(({ theme }) => ({
  fontSize: "0.8125rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.35,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: "2.4em",
}));

export const CohortHeaderRow = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

export const CohortMetaRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "auto",
  paddingTop: theme.spacing(0.75),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

export const CohortDates = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.disabled,
  marginTop: theme.spacing(0.5),
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

function getSkeletonBg(theme: Theme, isGhost?: boolean) {
  return isGhost
    ? alpha(theme.palette.background.paper, 0.45)
    : theme.palette.background.paper;
}

function getSkeletonBorder(theme: Theme, isGhost?: boolean) {
  return isGhost
    ? `1.5px dashed ${alpha(theme.palette.divider, 0.35)}`
    : `1px solid ${alpha(theme.palette.divider, 0.4)}`;
}

export const SkeletonContainer = styled(DashedSkeletonCard)(({ theme }) => ({
  padding: theme.spacing(1.25, 1.5),
}));

export const SkeletonCardContainer = styled(StyledCard, {
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
    minWidth: "220px",
    maxWidth: "100%",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    padding: theme.spacing(1.25, 1.5),
    gap: theme.spacing(0.75),
    opacity: opacity ?? 1,
    pointerEvents: isInteractive ? "auto" : "none",
    cursor: isInteractive ? "pointer" : "default",
    backgroundColor: bg,
    border,
    boxShadow: "none",
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
      boxShadow: "none",
    }),
  };
});
