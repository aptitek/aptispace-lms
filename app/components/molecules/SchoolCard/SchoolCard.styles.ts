import { styled, alpha } from "@mui/material/styles";
import { StyledCard, DashedSkeletonCard, FabOverlay } from "../../atoms/Card";

export { FabOverlay, DashedSkeletonCard };

export const CardContainer = styled(StyledCard)(({ theme }) => ({
  padding: theme.spacing(3),
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

export const LogoContainer = styled("div")({
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

export const LogoImage = styled("img")({
  maxHeight: "100%",
  maxWidth: "100%",
  objectFit: "contain",
});

export const SchoolName = styled("div")(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  textAlign: "center",
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const SkeletonContainer = styled(DashedSkeletonCard)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const SkeletonCardContainer = styled(StyledCard, {
  shouldForwardProp: (prop) =>
    prop !== "isGhost" && prop !== "isInteractive" && prop !== "opacity",
})<{
  isGhost?: boolean;
  isInteractive?: boolean;
  opacity?: number;
}>(({ theme, isGhost, isInteractive, opacity }) => {
  const primary = theme.palette.primary.main;
  return {
    padding: theme.spacing(3),
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
    cursor: isInteractive ? "pointer" : "default",
    pointerEvents: isInteractive ? "auto" : "none",
    opacity: opacity ?? 1,
    border: isGhost
      ? `2px dashed ${alpha(primary, 0.35)}`
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
        borderColor: primary,
        backgroundColor: alpha(primary, 0.04),
        boxShadow: `0 8px 24px -4px ${alpha(primary, 0.15)}`,
      },
      "&:focus-visible": {
        outline: `2px solid ${primary}`,
        outlineOffset: "2px",
      },
    }),
  };
});
