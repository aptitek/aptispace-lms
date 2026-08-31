import { styled, alpha, type Theme } from "@mui/material/styles";

import {
  ISO_7810_ID1,
  type IdCardOrientation,
  type IdCardSize,
} from "./IdCard.types";

const DIMENSION_MAP: Record<
  IdCardSize,
  {
    landscape: { width: number | string; height: number | string };
    portrait: { width: number | string; height: number | string };
  }
> = {
  sm: {
    landscape: {
      width: 340,
      height: Math.round(340 / ISO_7810_ID1.aspectRatio),
    },
    portrait: {
      width: 220,
      height: Math.round(220 / ISO_7810_ID1.aspectRatioPortrait),
    },
  },
  md: {
    landscape: {
      width: 440,
      height: Math.round(440 / ISO_7810_ID1.aspectRatio),
    },
    portrait: {
      width: 280,
      height: Math.round(280 / ISO_7810_ID1.aspectRatioPortrait),
    },
  },
  lg: {
    landscape: {
      width: 540,
      height: Math.round(540 / ISO_7810_ID1.aspectRatio),
    },
    portrait: {
      width: 340,
      height: Math.round(340 / ISO_7810_ID1.aspectRatioPortrait),
    },
  },
  responsive: {
    landscape: { width: "100%", height: "auto" },
    portrait: { width: "100%", height: "auto" },
  },
};

export const getDimensions = (
  size: IdCardSize = "responsive",
  orientation: IdCardOrientation = "landscape",
  customWidth?: number | string,
  customHeight?: number | string,
) => {
  if (customWidth && customHeight) {
    return { width: customWidth, height: customHeight };
  }
  const sizeEntry = DIMENSION_MAP[size] || DIMENSION_MAP.responsive;
  return orientation === "portrait" ? sizeEntry.portrait : sizeEntry.landscape;
};

export const IdCardContainer = styled("div")<{ isClickable?: boolean }>(
  ({ isClickable }) => ({
    display: "inline-block",
    position: "relative",
    cursor: isClickable ? "pointer" : "default",
  }),
);

interface FaceStyleOptions {
  theme: Theme;
  isDark: boolean;
  isBack?: boolean;
  isTransparent?: boolean;
}

function getFaceBackground({
  theme,
  isDark,
  isBack,
  isTransparent,
}: FaceStyleOptions) {
  if (isTransparent) {
    const bgBase = isDark
      ? alpha(theme.palette.background.default, 0.2)
      : alpha(theme.palette.common.white, 0.35);
    const primHaze = alpha(theme.palette.primary.main, isDark ? 0.14 : 0.08);
    const secHaze = alpha(theme.palette.secondary.main, isDark ? 0.14 : 0.08);
    const bgGradient = isBack
      ? `radial-gradient(ellipse at 80% 20%, ${secHaze}, transparent 70%), radial-gradient(ellipse at 20% 80%, ${primHaze}, transparent 70%)`
      : `radial-gradient(ellipse at 20% 20%, ${primHaze}, transparent 70%), radial-gradient(ellipse at 80% 80%, ${secHaze}, transparent 70%)`;
    return { bgBase, bgGradient };
  }

  const bgBase = isDark
    ? theme.palette.background.default
    : theme.palette.background.paper;
  const primHaze = alpha(theme.palette.primary.main, isDark ? 0.18 : 0.08);
  const secHaze = alpha(theme.palette.secondary.main, isDark ? 0.18 : 0.08);
  const bgGradient = isBack
    ? `radial-gradient(ellipse at 80% 20%, ${secHaze}, transparent 70%), radial-gradient(ellipse at 20% 80%, ${primHaze}, transparent 70%)`
    : `radial-gradient(ellipse at 20% 20%, ${primHaze}, transparent 70%), radial-gradient(ellipse at 80% 80%, ${secHaze}, transparent 70%)`;
  return { bgBase, bgGradient };
}

function getFaceBorderAndShadow({
  theme,
  isDark,
  isTransparent,
}: FaceStyleOptions) {
  if (isTransparent) {
    return {
      border: isDark
        ? `1px solid ${alpha(theme.palette.common.white, 0.25)}`
        : `1px solid ${alpha(theme.palette.common.white, 0.6)}`,
      boxShadow: isDark
        ? `inset 0 1.5px 2px ${alpha(theme.palette.common.white, 0.35)}, inset 0 -1.5px 2px ${alpha(
            theme.palette.common.black,
            0.4,
          )}, 0 16px 36px 0 ${alpha(theme.palette.common.black, 0.5)}`
        : `inset 0 1.5px 2px ${alpha(theme.palette.common.white, 0.85)}, inset 0 -1.5px 2px ${alpha(
            theme.palette.common.black,
            0.08,
          )}, 0 16px 36px 0 ${alpha(theme.palette.primary.dark, 0.15)}`,
    };
  }

  return {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark
      ? `inset 0 1px 1px ${alpha(theme.palette.common.white, 0.15)}, inset 0 -1px 1px ${alpha(
          theme.palette.common.black,
          0.4,
        )}`
      : `inset 0 1px 1px ${alpha(theme.palette.common.white, 0.8)}, inset 0 -1px 1px ${alpha(
          theme.palette.common.black,
          0.1,
        )}`,
  };
}

export const CardFaceContainer = styled("div")<{
  isBack?: boolean;
  isTransparent?: boolean;
}>(({ theme, isBack, isTransparent }) => {
  const isDark = theme.palette.mode === "dark";
  const opts: FaceStyleOptions = { theme, isDark, isBack, isTransparent };
  const { bgBase, bgGradient } = getFaceBackground(opts);
  const { border, boxShadow } = getFaceBorderAndShadow(opts);

  return {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: bgBase,
    backgroundImage: bgGradient,
    border,
    boxShadow,
    backdropFilter: isTransparent ? "blur(20px) saturate(190%)" : undefined,
    WebkitBackdropFilter: isTransparent
      ? "blur(20px) saturate(190%)"
      : undefined,
    userSelect: "none",
  };
});

export const ContentOverlay = styled("div")<{ isTransparent?: boolean }>(
  ({ theme }) => ({
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(0.75),
    boxSizing: "border-box",
    pointerEvents: "auto",
  }),
);

export const TransparentGhostOverlay = styled("div")<{
  isMirrored?: boolean;
  isVertical?: boolean;
  opacity?: number;
}>(({ theme, isMirrored = true, isVertical, opacity = 0.35 }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  padding: theme.spacing(0.75),
  boxSizing: "border-box",
  pointerEvents: "none",
  zIndex: 1,
  opacity,
  filter: "blur(0.35px) contrast(0.95)",
  transform: isMirrored ? (isVertical ? "scaleY(-1)" : "scaleX(-1)") : "none",
  transformOrigin: "center center",
  userSelect: "none",
}));
