import { styled } from "@mui/material/styles";
import {
  ISO_7810_ID1,
  type Id1CardOrientation,
  type Id1CardSize,
} from "./Id1Card.types";

export * from "./Id1Card.elements.styles";

export const getDimensions = (
  size: Id1CardSize,
  orientation: Id1CardOrientation,
) => {
  const isLandscape = orientation === "landscape";
  switch (size) {
    case "sm":
      return isLandscape
        ? { width: 340, height: Math.round(340 / ISO_7810_ID1.aspectRatio) }
        : {
            width: 220,
            height: Math.round(220 / ISO_7810_ID1.aspectRatioPortrait),
          };
    case "md":
      return isLandscape
        ? { width: 440, height: Math.round(440 / ISO_7810_ID1.aspectRatio) }
        : {
            width: 280,
            height: Math.round(280 / ISO_7810_ID1.aspectRatioPortrait),
          };
    case "lg":
      return isLandscape
        ? { width: 540, height: Math.round(540 / ISO_7810_ID1.aspectRatio) }
        : {
            width: 340,
            height: Math.round(340 / ISO_7810_ID1.aspectRatioPortrait),
          };
    case "responsive":
    default:
      return isLandscape
        ? { width: "100%", height: "auto" }
        : { width: "100%", height: "auto" };
  }
};

export const CardWrapper = styled("div")<{
  cardOrientation: Id1CardOrientation;
  cardSize: Id1CardSize;
}>(({ cardOrientation, cardSize }) => {
  const isLandscape = cardOrientation === "landscape";
  const ratio = isLandscape
    ? ISO_7810_ID1.aspectRatio
    : ISO_7810_ID1.aspectRatioPortrait;
  const dims = getDimensions(cardSize, cardOrientation);

  return {
    position: "relative",
    width: typeof dims.width === "number" ? `${dims.width}px` : "100%",
    maxWidth: isLandscape ? "540px" : "340px",
    aspectRatio: `${ratio}`,
    perspective: "1200px",
    userSelect: "none",
    margin: "0 auto",
    transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
    cursor: "pointer",
  };
});

export const CardInner = styled("div")<{ isFlipped: boolean }>(
  ({ theme, isFlipped }) => ({
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    borderRadius: "16px",
    boxShadow: isFlipped
      ? `0 25px 50px -12px ${theme.palette.common.black}, 0 0 25px ${theme.palette.primary.light}`
      : `0 25px 50px -12px ${theme.palette.common.black}, 0 0 30px ${theme.palette.primary.main}`,
  }),
);

export const CardFace = styled("div")<{ isBack?: boolean }>(
  ({ theme, isBack }) => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: theme.spacing(2.25),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    transform: isBack ? "rotateY(180deg)" : "none",
    boxSizing: "border-box",
    background: isBack
      ? `linear-gradient(145deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.background.default} 100%)`
      : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 60%, ${theme.palette.background.default} 100%)`,

    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 85% 15%, ${theme.palette.action.focus} 0%, transparent 55%), radial-gradient(circle at 15% 85%, ${theme.palette.action.selected} 0%, transparent 60%)`,
      pointerEvents: "none",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundImage:
        "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      backgroundSize: "16px 16px",
      pointerEvents: "none",
      opacity: 0.6,
    },
  }),
);

export const CardHeaderRow = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  zIndex: 2,
});

export const CardBrandGroup = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const AgencyIcon = styled("img")(({ theme }) => ({
  width: "22px",
  height: "22px",
  filter: `drop-shadow(0 0 4px ${theme.palette.primary.light})`,
}));

export const AgencyTitle = styled("div")(({ theme }) => ({
  fontSize: "11px",
  fontWeight: 900,
  letterSpacing: "1.2px",
  color: theme.palette.text.primary,
  textTransform: "uppercase",
}));

export const StandardSub = styled("div")(({ theme }) => ({
  fontSize: "7.5px",
  letterSpacing: "0.8px",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  fontWeight: 700,
}));

export const SecurityIconsRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const MiddleRow = styled("div")<{ isPortrait: boolean }>(
  ({ theme, isPortrait }) => ({
    display: "flex",
    flexDirection: isPortrait ? "column" : "row",
    gap: theme.spacing(1.75),
    alignItems: isPortrait ? "flex-start" : "center",
    margin: "auto 0",
    zIndex: 2,
  }),
);

export const ChipAndPhoto = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
}));

export const PhotoContainer = styled("div")(({ theme }) => ({
  width: "72px",
  height: "90px",
  borderRadius: "8px",
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
  border: `1.5px solid ${theme.palette.primary.light}`,
  boxShadow: `0 4px 10px rgba(0, 0, 0, 0.4), inset 0 0 12px ${theme.palette.action.focus}`,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  "& .scan-line": {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(transparent 50%, ${theme.palette.action.selected} 51%, transparent 52%)`,
    backgroundSize: "100% 4px",
    pointerEvents: "none",
  },
  "& .corner-bracket": {
    position: "absolute",
    width: "6px",
    height: "6px",
    borderColor: theme.palette.primary.light,
    borderStyle: "solid",
    pointerEvents: "none",
  },
  "& .top-left": { top: 2, left: 2, borderWidth: "1.5px 0 0 1.5px" },
  "& .top-right": { top: 2, right: 2, borderWidth: "1.5px 1.5px 0 0" },
  "& .bottom-left": { bottom: 2, left: 2, borderWidth: "0 0 1.5px 1.5px" },
  "& .bottom-right": { bottom: 2, right: 2, borderWidth: "0 1.5px 1.5px 0" },
}));

export const CredentialDetailBox = styled("div")({
  flex: 1,
  minWidth: 0,
});

export const BadgeRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  marginBottom: "2px",
}));

export const ClearancePill = styled("span")(({ theme }) => ({
  fontSize: "9px",
  fontWeight: 800,
  color: theme.palette.warning.main,
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.warning.main}`,
  padding: "2px 6px",
  borderRadius: "4px",
  letterSpacing: "0.5px",
  fontFamily: "monospace",
}));

export const CadetIdSpan = styled("span")(({ theme }) => ({
  fontSize: "9px",
  color: theme.palette.primary.light,
  fontFamily: "monospace",
  fontWeight: 700,
}));

export const CadetName = styled("div")(({ theme }) => ({
  fontSize: "clamp(13px, 2.5vw, 17px)",
  fontWeight: 800,
  color: theme.palette.text.primary,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  lineHeight: 1.2,
  textShadow: "0 2px 4px rgba(0,0,0,0.6)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const CadetRole = styled("div")(({ theme }) => ({
  fontSize: "9.5px",
  fontWeight: 700,
  color: theme.palette.primary.main,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  marginTop: "2px",
}));

export const CadetDivision = styled("div")(({ theme }) => ({
  fontSize: "8.5px",
  color: theme.palette.text.secondary,
  letterSpacing: "0.3px",
  marginTop: "2px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const CardBottomRow = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  zIndex: 2,
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(0.75),
}));

export const DatesContainer = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  fontSize: "8px",
  fontFamily: "monospace",
  color: theme.palette.text.secondary,
}));

export const DateVal = styled("strong")(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const CallSignVal = styled("strong")(({ theme }) => ({
  color: theme.palette.primary.light,
}));
