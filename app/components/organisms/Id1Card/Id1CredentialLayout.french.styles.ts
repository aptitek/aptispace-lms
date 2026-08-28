import { styled, alpha } from "@mui/material/styles";
import { FRENCH_ID_CARD } from "./FrenchIdCard.layout";
import { EU_FLAG_COLORS } from "../../../tokens/theme";

const CARD_W = FRENCH_ID_CARD.widthMm; // 85.6 mm
const CARD_H = FRENCH_ID_CARD.heightMm; // 53.98 mm

/**
 * Convert an mm rect (layout space) into CSS percentages relative to the full
 * card face, so every fragment scales proportionally no matter the rendered px
 * size (the card always keeps the ISO/IEC 7810 ID-1 aspect ratio).
 */
export function mmToPct(x: number, y: number, w: number, h: number): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    left: `${(x / CARD_W) * 100}%`,
    top: `${(y / CARD_H) * 100}%`,
    width: `${(w / CARD_W) * 100}%`,
    height: `${(h / CARD_H) * 100}%`,
  };
}

/**
 * Convert a mm font height into a percentage of the card height (cqh units on
 * the sized container), so text also scales with the rendered card.
 */
export function mmToCqh(fontSizeMm: number): string {
  return `${(fontSizeMm / CARD_H) * 100}cqh`;
}

/**
 * Root that exactly overlays the physical card face. `Id1Card` wraps credential
 * content in a padded overlay; the negative insets cancel that padding so the
 * mm→% coordinates align to the card's own edges. Container-type "size" makes
 * the cqh font units resolve against this face.
 */
export const FrenchRoot = styled("div")(({ theme }) => ({
  position: "absolute",
  top: `-${theme.spacing(2)}`,
  left: `-${theme.spacing(2)}`,
  right: `-${theme.spacing(2)}`,
  bottom: `-${theme.spacing(2)}`,
  boxSizing: "border-box",
  overflow: "hidden",
  containerType: "size",
  color: theme.palette.text.primary,
}));

/** Any positioned layout fragment (leaf) — rect supplied via mmToPct(). */
export const FrenchFragment = styled("div")<{
  align?: "left" | "center" | "right";
}>(({ align = "left" }) => ({
  position: "absolute",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: align,
  lineHeight: 1.1,
  overflow: "hidden",
}));

/** Tiny uppercase bilingual micro-label, e.g. "Nom / Surname". */
export const FrenchMicroLabel = styled("span")(({ theme }) => ({
  display: "block",
  fontSize: mmToCqh(1.1),
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  color: alpha(theme.palette.text.secondary, 0.9),
  whiteSpace: "nowrap",
}));

/** A holder value (dimensions/scaling driven per-fragment via inline style). */
export const FrenchFieldValue = styled("span")<{ caps?: boolean }>(
  ({ theme, caps }) => ({
    display: "block",
    fontWeight: 600,
    color: theme.palette.text.primary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: caps ? "uppercase" : "none",
  }),
);

export const FrenchHeader = styled(FrenchFieldValue)({
  fontWeight: 800,
  whiteSpace: "nowrap",
});

/** Grayscale laser-engraved portrait (ISO/IEC 19794-5 rendering). */
export const FrenchPhoto = styled("img")<{ ghost?: boolean }>(
  ({ theme, ghost }) => ({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    filter: ghost
      ? "grayscale(1) contrast(1.05) opacity(0.4)"
      : "grayscale(1) contrast(1.05)",
    backgroundColor: alpha(theme.palette.background.default, 0.7),
  }),
);

/** ICAO 9303 TD1 machine-readable zone (monospace, 3 lines × 30 chars). */
export const FrenchMRZ = styled("span")(({ theme }) => ({
  display: "block",
  fontFamily: "monospace",
  fontWeight: 700,
  whiteSpace: "pre",
  color: theme.palette.text.primary,
}));

/** EU flag badge: blue field, 12 gold stars, negative country code. */
export const FrenchEuFlag = styled("div")({
  position: "relative",
  width: "100%",
  height: "100%",
  backgroundColor: EU_FLAG_COLORS.blue,
  borderRadius: "0.5cqh",
  overflow: "hidden",
});

export const FrenchEuStar = styled("span")({
  position: "absolute",
  color: EU_FLAG_COLORS.gold,
  fontSize: mmToCqh(1.15),
  lineHeight: 1,
  transform: "translate(-50%, -50%)",
});

export const FrenchEuCode = styled("span")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: EU_FLAG_COLORS.gold,
  fontWeight: 800,
  fontSize: mmToCqh(2.2),
  letterSpacing: "0.03em",
});

/** Stylized holder signature (placeholder scribble under the portrait). */
export const FrenchSignature = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  color: theme.palette.text.primary,
}));

/** 2D-Doc / CEV — ANTS-signed visible electronic seal placeholder grid. */
export const French2dBarcode = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  padding: "2px",
  boxSizing: "border-box",
  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.92)
      : theme.palette.common.white,
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gridTemplateRows: "repeat(8, 1fr)",
  gap: "1px",
  "& span": { backgroundColor: theme.palette.common.black },
}));

/** ICAO contactless biometric-chip pictogram (chip with radiating arcs). */
export const FrenchChipSymbol = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  color: theme.palette.text.primary,
}));
