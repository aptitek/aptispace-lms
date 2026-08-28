import { styled, alpha, type Theme } from "@mui/material/styles";

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
      ? alpha(theme.palette.background.default, 0.15)
      : alpha(theme.palette.common.white, 0.28);
    const primHaze = alpha(theme.palette.primary.main, isDark ? 0.12 : 0.06);
    const secHaze = alpha(theme.palette.secondary.main, isDark ? 0.12 : 0.06);
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
        ? `1px solid ${alpha(theme.palette.common.white, 0.22)}`
        : `1px solid ${alpha(theme.palette.common.white, 0.55)}`,
      boxShadow: isDark
        ? `inset 0 1.5px 2px ${alpha(theme.palette.common.white, 0.35)}, inset 0 -1.5px 2px ${alpha(
            theme.palette.common.black,
            0.4,
          )}, 0 12px 32px 0 ${alpha(theme.palette.common.black, 0.45)}`
        : `inset 0 1.5px 2px ${alpha(theme.palette.common.white, 0.8)}, inset 0 -1.5px 2px ${alpha(
            theme.palette.common.black,
            0.08,
          )}, 0 12px 32px 0 ${alpha(theme.palette.primary.dark, 0.15)}`,
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
    borderRadius: "inherit",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: bgBase,
    backgroundImage: bgGradient,
    border,
    boxShadow,
    backdropFilter: isTransparent ? "blur(16px) saturate(180%)" : undefined,
    WebkitBackdropFilter: isTransparent
      ? "blur(16px) saturate(180%)"
      : undefined,
    userSelect: "none",
  };
});

export const ContentOverlay = styled("div")<{ isTransparent?: boolean }>({
  position: "relative",
  zIndex: 2,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  pointerEvents: "auto",
});
