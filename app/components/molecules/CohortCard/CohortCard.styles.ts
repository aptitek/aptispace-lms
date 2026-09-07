import { styled, alpha } from "@mui/material/styles";
import { StyledCard, DashedSkeletonCard, FabOverlay } from "../../atoms/Card";

export { FabOverlay, DashedSkeletonCard };

export const CardContainer = styled(StyledCard)(({ theme }) => ({
  padding: theme.spacing(2.5),
  gap: theme.spacing(1),
}));

export const CohortName = styled("div")(({ theme }) => ({
  fontSize: "1.05rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const CohortDescription = styled("div")(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: "2.8em",
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
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

export const CohortDates = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.disabled,
  marginTop: theme.spacing(1),
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

export const SkeletonContainer = styled(DashedSkeletonCard)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));

export const SkeletonCardContainer = styled(StyledCard, {
  shouldForwardProp: (prop) =>
    prop !== "isGhost" && prop !== "isInteractive" && prop !== "opacity",
})<{
  isGhost?: boolean;
  isInteractive?: boolean;
  opacity?: number;
}>(({ theme, isGhost, isInteractive, opacity }) => {
  const secondary = theme.palette.secondary.main;
  return {
    padding: theme.spacing(2.5),
    gap: theme.spacing(1),
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
    cursor: isInteractive ? "pointer" : "default",
    pointerEvents: isInteractive ? "auto" : "none",
    opacity: opacity ?? 1,
    border: isGhost
      ? `2px dashed ${alpha(secondary, 0.35)}`
      : `1px solid ${alpha(theme.palette.divider, 0.4)}`,
    backgroundColor: isGhost
      ? "transparent"
      : theme.palette.surfaceContainerLow || theme.palette.background.paper,
    transition: theme.transitions.create(
      ["transform", "box-shadow", "border-color", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    ...(isInteractive && {
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: secondary,
        backgroundColor: alpha(secondary, 0.04),
        boxShadow: `0 8px 24px -4px ${alpha(secondary, 0.15)}`,
      },
      "&:focus-visible": {
        outline: `2px solid ${secondary}`,
        outlineOffset: "2px",
      },
    }),
  };
});
