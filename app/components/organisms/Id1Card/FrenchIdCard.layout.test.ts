import { describe, it, expect } from "vitest";
import {
  FRENCH_ID_CARD,
  FRENCH_ID_HEADER,
  FRENCH_ID_FRONT,
  FRENCH_ID_BACK,
  FRENCH_ID_SAMPLE_MRZ,
  getFrenchIdFragment,
  getFrenchIdFragments,
} from "./FrenchIdCard.layout";
import { ISO_7810_ID1 } from "./Id1Card.types";

function isWithinBounds(rect: {
  x: number;
  y: number;
  width: number;
  height: number;
}): boolean {
  return (
    rect.x >= 0 &&
    rect.y >= 0 &&
    rect.x + rect.width <= FRENCH_ID_CARD.widthMm + 0.01 &&
    rect.y + rect.height <= FRENCH_ID_CARD.heightMm + 0.01
  );
}

describe("FrenchIdCard layout spec", () => {
  it("adheres to ISO/IEC 7810 ID-1 card dimensions", () => {
    expect(FRENCH_ID_CARD.format).toBe("ISO/IEC 7810 ID-1");
    expect(FRENCH_ID_CARD.widthMm).toBe(ISO_7810_ID1.widthMm);
    expect(FRENCH_ID_CARD.heightMm).toBe(ISO_7810_ID1.heightMm);
    expect(FRENCH_ID_CARD.thicknessMm).toBe(0.76);
    expect(FRENCH_ID_CARD.cornerRadiusMm).toBe(3.18);
  });

  it("defines the bilingual official header and EU flag", () => {
    expect(FRENCH_ID_HEADER.republic).toBe("RÉPUBLIQUE FRANÇAISE");
    expect(FRENCH_ID_HEADER.titleFr).toBe("CARTE NATIONALE D'IDENTITÉ");
    expect(FRENCH_ID_HEADER.titleEn).toBe("NATIONAL IDENTITY CARD");
    expect(FRENCH_ID_HEADER.euFlag.countryCode).toBe("FR");
    expect(FRENCH_ID_HEADER.euFlag.stars).toBe(12);
  });

  it("places every front fragment inside the card bounds", () => {
    expect(FRENCH_ID_FRONT.length).toBeGreaterThan(0);
    for (const fragment of FRENCH_ID_FRONT) {
      expect(isWithinBounds(fragment.rect)).toBe(true);
    }
  });

  it("places every back fragment inside the card bounds", () => {
    expect(FRENCH_ID_BACK.length).toBeGreaterThan(0);
    for (const fragment of FRENCH_ID_BACK) {
      expect(isWithinBounds(fragment.rect)).toBe(true);
    }
  });

  it("contains all key front identifiers", () => {
    const ids = new Set(FRENCH_ID_FRONT.map((f) => f.id));
    for (const id of [
      "eu-flag",
      "header-republic",
      "header-title-fr",
      "header-title-en",
      "photo-primary",
      "document-number",
      "nom",
      "prenoms",
      "sexe",
      "nationalite",
      "date-naissance",
      "lieu-naissance",
      "signature",
      "expiry",
      "photo-ghost",
      "can",
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("contains all key back identifiers", () => {
    const ids = new Set(FRENCH_ID_BACK.map((f) => f.id));
    for (const id of [
      "header-back",
      "taille",
      "adresse",
      "date-issue",
      "autorite",
      "chip-symbol",
      "barcode-2d",
      "mrz",
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("generates a valid 3-line × 30-char TD1 sample MRZ", () => {
    expect(FRENCH_ID_SAMPLE_MRZ).toHaveLength(3);
    for (const line of FRENCH_ID_SAMPLE_MRZ) {
      expect(line).toHaveLength(30);
    }
  });

  it("looks up fragments by side and id", () => {
    expect(getFrenchIdFragment("front", "nom")?.label).toBe("Nom / Surname");
    expect(getFrenchIdFragment("back", "mrz")?.kind).toBe("mrz");
    expect(getFrenchIdFragment("front", "missing")).toBeUndefined();
    expect(getFrenchIdFragments("back")).toHaveLength(FRENCH_ID_BACK.length);
  });
});
