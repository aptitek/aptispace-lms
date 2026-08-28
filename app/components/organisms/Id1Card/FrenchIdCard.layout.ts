import { generateTd1Mrz } from "../../atoms/MrzZone/icao9303";

/**
 * Carte Nationale d'Identité électronique (CNIe) — Exact Layout Specification
 * =============================================================================
 * Machine-readable layout of the current French biometric identity card
 * (issue standard since August 2021), so a renderer can place every element at
 * its correct spot on BOTH faces.
 *
 * Quick reference of the authoritative facts:
 *  - Format ......... ISO/IEC 7810 ID-1 (standard bank-card size)
 *  - Dimensions ..... 85.60 mm × 53.98 mm, thickness 0.76 mm, corner r 3.18 mm
 *  - Material ....... multi-layer polycarbonate, laser-engraved
 *  - MRZ ............ ICAO 9303 TD1 — 3 lines × 30 chars, bottom of the back
 *  - Biometric photo. ICAO 19794-5 composition, grayscale laser engraving
 *
 * All `rect` values are in MILLIMETRES relative to the card's top-left corner
 * (0,0 at the top-left, +x to the right, +y downward). The FRONT is viewed with
 * portrait facing the holder; the BACK is viewed from the reverse side.
 *
 * NOTE ON ACCURACY: the official ANTS/ANSSI overlay drawings are not public.
 * Positions below reproduce the compiled design with faithful, proportional
 * agreement to the physical card (verified against ISO/IEC 7810, ICAO 9303,
 * EU Reg. 2019/1157 and multiple photographic references) and are provided as
 * exact-enough layout targets. See `docs/french-national-identity-card-layout.md`
 * for the human-readable spec with ASCII diagrams and sources.
 */

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/** Axis-aligned rectangle in millimetres from card top-left (0,0). */
export interface MmRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FrenchIdFragmentKind =
  | "flag" // EU flag badge (12 gold stars, negative country code)
  | "header" // document title lines ("RÉPUBLIQUE FRANÇAISE"...)
  | "document-number" // 9-char document No.
  | "photo-primary" // main biometric portrait
  | "photo-ghost" // DOVID / MLI secondary holographic portrait
  | "label-value" // micro-label + holder value (Nom / Surname → DUPONT)
  | "expiry" // "Date d'expiration / Date of expiry"
  | "can" // Card Access Number — 6 digits (PACE)
  | "signature" // holder's engraved signature
  | "barcode-2d" // 2D-Doc / CEV — ANTS-signed visible digital seal
  | "chip-symbol" // ICAO contactless biometric-chip pictogram
  | "mrz" // ICAO 9303 TD1 machine-readable zone
  | "text"; // generic text block

export interface FrenchIdFragment {
  /** Stable unique id within its face, e.g. "nom". */
  id: string;
  kind: FrenchIdFragmentKind;
  /** Printed bilingual micro-label, e.g. "Nom / Surname". */
  label?: string;
  /** Printed / human value, e.g. "DUPONT". Multi-line via "\n". */
  value?: string;
  /** Mm rect (x, y, width, height). */
  rect: MmRect;
  /** Approx. rendered height of the value text, in mm. */
  fontSizeMm?: number;
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "bold";
  textTransform?: "uppercase" | "none";
  /** Free-form annotation for the layout engineer. */
  note?: string;
}

export type FrenchIdCardSide = "front" | "back";

/* ----------------------------------------------------------------------------
 * Card & header metadata
 * ------------------------------------------------------------------------- */

export const FRENCH_ID_CARD = {
  product: "Carte Nationale d'Identité électronique",
  shortName: "CNIe",
  format: "ISO/IEC 7810 ID-1",
  widthMm: 85.6,
  heightMm: 53.98,
  thicknessMm: 0.76,
  cornerRadiusMm: 3.18,
  material: "Multi-layer polycarbonate (laser engraved)",
  biometricPhotoStandard: "ISO/IEC 19794-5:2011",
  mrz: {
    format: "TD1",
    lines: 3,
    charsPerLine: 30,
  },
  /** Validity duration for an adult card, in years. */
  adultValidityYears: 10,
} as const;

export const FRENCH_ID_HEADER = {
  republic: "RÉPUBLIQUE FRANÇAISE",
  titleFr: "CARTE NATIONALE D'IDENTITÉ",
  titleEn: "NATIONAL IDENTITY CARD",
  euFlag: {
    stars: 12,
    countryCode: "FR", // negative print in the centre of the star circle
  },
} as const;

/** Bilingual document title shown on the front (top header). */
export const FRENCH_ID_TITLE_LINES = {
  french: "CARTE NATIONALE D'IDENTITÉ",
  english: "NATIONAL IDENTITY CARD",
} as const;

/* ----------------------------------------------------------------------------
 * Sample persona (illustrative holder data used by the sample MRZ)
 * ------------------------------------------------------------------------- */

export const FRENCH_ID_SAMPLE_HOLDER = {
  surname: "DUPONT",
  givenNames: "JULIE MARIE",
  sex: "F" as const,
  nationality: "FRA",
  birthDate: "15.03.1990", // DD.MM.YYYY
  birthDateYymmdd: "900315",
  placeOfBirth: "PARIS (75)",
  documentNumber: "21AA12345",
  expiryDate: "15.03.2030", // DD.MM.YYYY (10-year validity)
  expiryDateYymmdd: "300315",
  can: "123456",
  address: "12 RUE DE LA PAIX\n75001 PARIS",
  height: "1,75 m",
  issueDate: "16.03.2020", // DD.MM.YYYY
  authority: "PRÉFECTURE DE POLICE",
} as const;

/**
 * Sample ICAO 9303 TD1 machine-readable zone for the sample holder above,
 * generated through the same validated encoder used elsewhere in the app so the
 * three 30-char lines (incl. check digits) are always internally consistent.
 */
export const FRENCH_ID_SAMPLE_MRZ: [string, string, string] = generateTd1Mrz({
  documentCode: "I",
  issuingState: "FRA",
  documentNumber: FRENCH_ID_SAMPLE_HOLDER.documentNumber,
  birthDate: FRENCH_ID_SAMPLE_HOLDER.birthDateYymmdd,
  sex: FRENCH_ID_SAMPLE_HOLDER.sex,
  expiryDate: FRENCH_ID_SAMPLE_HOLDER.expiryDateYymmdd,
  nationality: FRENCH_ID_SAMPLE_HOLDER.nationality,
  surname: FRENCH_ID_SAMPLE_HOLDER.surname,
  givenNames: FRENCH_ID_SAMPLE_HOLDER.givenNames,
}).lines;

/* ----------------------------------------------------------------------------
 * FRONT (recto) layout
 * ------------------------------------------------------------------------- */

export const FRENCH_ID_FRONT: readonly FrenchIdFragment[] = [
  // --- Top header ---
  {
    id: "eu-flag",
    kind: "flag",
    value: "FR",
    rect: { x: 3.2, y: 3.0, width: 8.0, height: 5.6 },
    note: "EU flag: blue field, 12 gold stars in a circle, negative 'FR' country code in the centre (EU Reg. 2019/1157).",
  },
  {
    id: "header-republic",
    kind: "header",
    value: "RÉPUBLIQUE FRANÇAISE",
    rect: { x: 13.0, y: 2.6, width: 44.0, height: 3.2 },
    fontSizeMm: 2.0,
    weight: "bold",
    textTransform: "uppercase",
  },
  {
    id: "header-title-fr",
    kind: "header",
    value: "CARTE NATIONALE D'IDENTITÉ",
    rect: { x: 13.0, y: 5.7, width: 52.0, height: 3.0 },
    fontSizeMm: 1.8,
    weight: "bold",
    textTransform: "uppercase",
  },
  {
    id: "header-title-en",
    kind: "header",
    value: "NATIONAL IDENTITY CARD",
    rect: { x: 13.0, y: 8.5, width: 52.0, height: 2.6 },
    fontSizeMm: 1.4,
  },

  // --- Main data (left photo, right holder fields) ---
  {
    id: "photo-primary",
    kind: "photo-primary",
    rect: { x: 3.2, y: 11.6, width: 27.0, height: 33.0 },
    note: "Main biometric portrait, grayscale laser engraving, ISO 19794-5 ratio (35×45 mm crop), framed by secure guilloche micro-text.",
  },
  {
    id: "document-number",
    kind: "document-number",
    label: "N° du document",
    value: FRENCH_ID_SAMPLE_HOLDER.documentNumber,
    rect: { x: 56.0, y: 12.2, width: 26.0, height: 4.0 },
    fontSizeMm: 1.9,
    align: "right",
    weight: "bold",
    textTransform: "uppercase",
  },
  {
    id: "nom",
    kind: "label-value",
    label: "Nom / Surname",
    value: FRENCH_ID_SAMPLE_HOLDER.surname,
    rect: { x: 33.0, y: 16.4, width: 48.0, height: 6.0 },
    fontSizeMm: 2.2,
    weight: "bold",
    textTransform: "uppercase",
  },
  {
    id: "prenoms",
    kind: "label-value",
    label: "Prénoms / Given names",
    value: FRENCH_ID_SAMPLE_HOLDER.givenNames,
    rect: { x: 33.0, y: 22.6, width: 48.0, height: 5.8 },
    fontSizeMm: 1.8,
    textTransform: "uppercase",
  },
  {
    id: "sexe",
    kind: "label-value",
    label: "Sexe / Sex",
    value: FRENCH_ID_SAMPLE_HOLDER.sex,
    rect: { x: 33.0, y: 28.2, width: 17.0, height: 5.0 },
    fontSizeMm: 1.8,
  },
  {
    id: "nationalite",
    kind: "label-value",
    label: "Nationalité / Nationality",
    value: FRENCH_ID_SAMPLE_HOLDER.nationality,
    rect: { x: 50.0, y: 28.2, width: 28.0, height: 5.0 },
    fontSizeMm: 1.8,
  },
  {
    id: "date-naissance",
    kind: "label-value",
    label: "Date de naissance / Date of birth",
    value: FRENCH_ID_SAMPLE_HOLDER.birthDate,
    rect: { x: 33.0, y: 33.2, width: 40.0, height: 5.0 },
    fontSizeMm: 1.8,
  },
  {
    id: "lieu-naissance",
    kind: "label-value",
    label: "Lieu de naissance / Place of birth",
    value: FRENCH_ID_SAMPLE_HOLDER.placeOfBirth,
    rect: { x: 33.0, y: 38.0, width: 48.0, height: 5.0 },
    fontSizeMm: 1.8,
    textTransform: "uppercase",
  },

  // --- Front bottom band ---
  {
    id: "signature",
    kind: "signature",
    label: "Signature",
    rect: { x: 4.2, y: 46.8, width: 24.5, height: 3.6 },
    note: "Live digitized signature of the holder, below the primary photo.",
  },
  {
    id: "expiry",
    kind: "expiry",
    label: "Date d'expiration / Date of expiry",
    value: FRENCH_ID_SAMPLE_HOLDER.expiryDate,
    rect: { x: 44.0, y: 43.6, width: 34.0, height: 5.0 },
    fontSizeMm: 1.8,
  },
  {
    id: "photo-ghost",
    kind: "photo-ghost",
    rect: { x: 44.0, y: 45.0, width: 13.0, height: 8.0 },
    note: "DOVID / MLI holographic secondary portrait and opt.-variable year, bottom band, tilts with viewing angle.",
  },
  {
    id: "can",
    kind: "can",
    label: "CAN",
    value: FRENCH_ID_SAMPLE_HOLDER.can,
    rect: { x: 65.5, y: 46.5, width: 17.0, height: 4.2 },
    fontSizeMm: 2.1,
    align: "right",
    weight: "bold",
    note: "Card Access Number — 6 digits, card-specific font, used for contactless PACE reading.",
  },
];

/* ----------------------------------------------------------------------------
 * BACK (verso) layout
 * ------------------------------------------------------------------------- */

export const FRENCH_ID_BACK: readonly FrenchIdFragment[] = [
  {
    id: "header-back",
    kind: "header",
    value: "RÉPUBLIQUE FRANÇAISE",
    rect: { x: 6.0, y: 3.2, width: 50.0, height: 3.2 },
    fontSizeMm: 2.0,
    weight: "bold",
    textTransform: "uppercase",
    note: "Back face repeats the Republic header with a Marianne guilloche motif.",
  },
  {
    id: "taille",
    kind: "label-value",
    label: "Taille / Height",
    value: FRENCH_ID_SAMPLE_HOLDER.height,
    rect: { x: 56.0, y: 4.6, width: 26.0, height: 5.0 },
    fontSizeMm: 1.8,
  },
  {
    id: "adresse",
    kind: "label-value",
    label: "Adresse / Address",
    value: FRENCH_ID_SAMPLE_HOLDER.address, // 2 lines
    rect: { x: 5.0, y: 8.6, width: 48.0, height: 12.0 },
    fontSizeMm: 1.7,
  },
  {
    id: "date-issue",
    kind: "label-value",
    label: "Date de délivrance / Date of issue",
    value: FRENCH_ID_SAMPLE_HOLDER.issueDate,
    rect: { x: 5.0, y: 21.2, width: 44.0, height: 5.0 },
    fontSizeMm: 1.7,
  },
  {
    id: "autorite",
    kind: "label-value",
    label: "Autorité de délivrance / Issuing authority",
    value: FRENCH_ID_SAMPLE_HOLDER.authority,
    rect: { x: 5.0, y: 26.2, width: 48.0, height: 5.0 },
    fontSizeMm: 1.5,
    textTransform: "uppercase",
  },

  // --- Security / machine-readable zone (right & bottom) ---
  {
    id: "chip-symbol",
    kind: "chip-symbol",
    rect: { x: 56.0, y: 13.0, width: 8.0, height: 8.0 },
    note: "ICAO contactless biometric-chip pictogram (chip with radiating arcs).",
  },
  {
    id: "barcode-2d",
    kind: "barcode-2d",
    label: "2D-Doc (CEV)",
    rect: { x: 60.0, y: 13.0, width: 21.0, height: 21.0 },
    note: "Visible Electronic Seal (Cachet Électronique Visible), square 2D barcode signed by ANTS; contains key identity data for offline verification.",
  },
  {
    id: "mrz",
    kind: "mrz",
    label: "MRZ · ICAO 9303 TD1",
    value: FRENCH_ID_SAMPLE_MRZ.join("\n"),
    rect: { x: 3.5, y: 37.5, width: 78.6, height: 12.5 },
    fontSizeMm: 2.4,
    align: "left",
    weight: "bold",
    note: "3 lines × 30 chars OCR-B machine-readable zone at the bottom; see FRENCH_ID_SAMPLE_MRZ.",
  },
];

/** Lookup a fragment on either face by its id. */
export function getFrenchIdFragment(
  side: FrenchIdCardSide,
  id: string,
): FrenchIdFragment | undefined {
  const list = side === "back" ? FRENCH_ID_BACK : FRENCH_ID_FRONT;
  return list.find((f) => f.id === id);
}

/** Get the full fragment list for a given face (returns a new array). */
export function getFrenchIdFragments(
  side: FrenchIdCardSide,
): readonly FrenchIdFragment[] {
  return side === "back" ? FRENCH_ID_BACK : FRENCH_ID_FRONT;
}
