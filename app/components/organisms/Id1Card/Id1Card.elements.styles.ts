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
    justifyContent: "space-between",
    padding: theme.spacing(2),
    boxSizing: "border-box",
    pointerEvents: "auto",
  }),
);

// --- Front Face Layout Components ---

export const FrontLayoutRoot = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: isPortrait ? theme.spacing(1.5) : theme.spacing(1),
  }),
);

export const CardHeaderBar = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

export const CardBrandTag = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  fontSize: "0.75rem",
  fontWeight: 800,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: theme.palette.text.primary,
}));

export const ClearanceBadge = styled("div")<{ level?: string }>(
  ({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.light,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  }),
);

export const FrontMainBody = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    display: "flex",
    flexDirection: isPortrait ? "column" : "row",
    alignItems: isPortrait ? "center" : "flex-start",
    gap: theme.spacing(2),
    flex: 1,
  }),
);

export const AvatarFrame = styled("div")<{ size?: number }>(
  ({ theme, size = 64 }) => ({
    position: "relative",
    width: size,
    height: size,
    borderRadius: "10px",
    overflow: "hidden",
    border: `1.5px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.35)}`,
    flexShrink: 0,
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  }),
);

export const CadetDetailsColumn = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  flex: 1,
  minWidth: 0,
}));

export const CadetNameText = styled("div")(({ theme }) => ({
  fontSize: "1.05rem",
  fontWeight: 800,
  letterSpacing: "-0.01em",
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const CadetCallSignText = styled("div")(({ theme }) => ({
  fontFamily: "monospace",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: theme.palette.secondary.light,
  letterSpacing: "0.5px",
}));

export const CadetRoleText = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const MetaGrid = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    display: "grid",
    gridTemplateColumns: isPortrait ? "1fr 1fr" : "repeat(3, 1fr)",
    gap: theme.spacing(0.75),
    marginTop: "auto",
    paddingTop: theme.spacing(0.75),
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  }),
);

export const MetaItem = styled("div")({
  display: "flex",
  flexDirection: "column",
});

export const MetaLabel = styled("span")(({ theme }) => ({
  fontSize: "0.55rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: theme.palette.text.secondary,
}));

export const MetaValue = styled("span")(({ theme }) => ({
  fontSize: "0.7rem",
  fontWeight: 700,
  fontFamily: "monospace",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

// --- Back Face Layout Components ---

export const BackLayoutRoot = styled("div")<{ isPortrait?: boolean }>(
  ({ theme, isPortrait }) => ({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: isPortrait ? theme.spacing(1) : theme.spacing(0.75),
  }),
);

export const MagneticStripeBar = styled("div")(({ theme }) => ({
  width: "calc(100% + 32px)",
  height: "36px",
  margin: "-16px -16px 8px -16px",
  backgroundColor: theme.palette.common.black,
  backgroundImage: `linear-gradient(90deg, ${theme.palette.common.black} 0%, ${alpha(theme.palette.grey[900], 0.9)} 40%, ${theme.palette.common.black} 100%)`,
  boxShadow: `inset 0 1px 2px ${alpha(theme.palette.common.black, 0.8)}, 0 1px 2px ${alpha(theme.palette.common.white, 0.05)}`,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "4px",
    height: "1px",
    backgroundColor: alpha(theme.palette.common.white, 0.08),
  },
}));

export const BackMiddleSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
  flex: 1,
}));

export const SignaturePanel = styled("div")(({ theme }) => ({
  flex: 1,
  height: "28px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.15)
      : alpha(theme.palette.common.white, 0.85),
  borderRadius: "4px",
  border: `1px dashed ${alpha(theme.palette.divider, 0.8)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 8px",
  fontSize: "0.6rem",
  fontFamily: "monospace",
  color: theme.palette.text.secondary,
}));

export const SecurityCodeTag = styled("span")(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.text.primary,
  letterSpacing: "1px",
}));

export const MrzHolder = styled("div")(({ theme }) => ({
  width: "100%",
  borderRadius: "6px",
  overflow: "hidden",
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
  padding: theme.spacing(0.5),
  boxSizing: "border-box",
}));

export const TransparentGhostOverlay = styled("div")<{
  isMirrored?: boolean;
  isVertical?: boolean;
  opacity?: number;
}>(({ isMirrored = true, isVertical, opacity = 0.22 }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  padding: "16px",
  boxSizing: "border-box",
  pointerEvents: "none",
  zIndex: 1,
  opacity,
  filter: "blur(0.35px) contrast(0.95)",
  transform: isMirrored ? (isVertical ? "scaleY(-1)" : "scaleX(-1)") : "none",
  transformOrigin: "center center",
  userSelect: "none",
}));
