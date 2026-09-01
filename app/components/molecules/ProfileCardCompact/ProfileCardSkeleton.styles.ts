import { styled, alpha, keyframes, type Theme } from "@mui/material/styles";

const subtlePulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.95;
  }
  100% {
    opacity: 0.6;
  }
`;

function getSkeletonBg(theme: Theme, isStatic: boolean) {
  return isStatic
    ? alpha(theme.palette.background.paper, 0.25)
    : alpha(theme.palette.background.paper, 0.6);
}

function getSkeletonBorder(theme: Theme, isStatic: boolean) {
  return isStatic
    ? `1px dashed ${alpha(theme.palette.divider, 0.4)}`
    : `1px solid ${alpha(theme.palette.divider, 0.2)}`;
}

function getSkeletonBoxShadow(theme: Theme, isStatic: boolean) {
  return isStatic
    ? "none"
    : `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.04)}`;
}

function getSkeletonDarkStyles(theme: Theme, isStatic: boolean) {
  return {
    backgroundColor: isStatic
      ? alpha(theme.palette.background.paper, 0.15)
      : alpha(theme.palette.background.paper, 0.45),
    border: isStatic
      ? `1px dashed ${alpha(theme.palette.divider, 0.3)}`
      : `1px solid ${alpha(theme.palette.divider, 0.25)}`,
    boxShadow: isStatic
      ? "none"
      : `0 4px 20px -2px ${alpha(theme.palette.common.black, 0.4)}`,
  };
}

export const SkeletonCardContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "variant" && prop !== "animated" && prop !== "opacity",
})<{
  variant?: "shimmer" | "static";
  animated?: boolean;
  opacity?: number;
}>(({ theme, variant = "shimmer", animated = true, opacity }) => {
  const isStatic = variant === "static" || !animated;
  const resolvedOpacity = opacity ?? (isStatic ? 0.45 : 1);

  return {
    position: "relative",
    width: "100%",
    minWidth: "300px",
    maxWidth: "400px",
    borderRadius: "16px",
    padding: theme.spacing(2),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    backgroundColor: getSkeletonBg(theme, isStatic),
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: getSkeletonBorder(theme, isStatic),
    boxShadow: getSkeletonBoxShadow(theme, isStatic),
    overflow: "hidden",
    userSelect: "none",
    pointerEvents: isStatic ? "none" : "auto",
    opacity: resolvedOpacity,
    animation: isStatic ? "none" : `${subtlePulse} 2.5s ease-in-out infinite`,
    ...theme.applyStyles("dark", getSkeletonDarkStyles(theme, isStatic)),
  };
});

export const SkeletonHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
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
  width: "77px",
  height: "99px",
  minWidth: "77px",
  maxWidth: "77px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "22px 22px 14px 14px",
  overflow: "hidden",
});

export const SkeletonDetailsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "99px",
  minWidth: 0,
  flex: 1,
  gap: "6px",
});

export const SkeletonNameBlock = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  minWidth: 0,
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
