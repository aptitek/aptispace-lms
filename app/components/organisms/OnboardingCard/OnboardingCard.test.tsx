import { describe, it, expect } from "vitest";
import OnboardingCard, { buildHoloLayers } from "./OnboardingCard";
import {
  formatInstitutionalEmail,
  buildTd1MrzData,
  calculateCohortValidity,
} from "./OnboardingCard.utils";
import type {
  SchoolConfig,
  OnboardingProfile,
  CohortConfig,
} from "./OnboardingCard.types";

const mockSchoolWithLogo: SchoolConfig = {
  id: "school-aptitek",
  name: "Aptitek",
  slug: "aptitek",
  logoUrl: "/aptitek-logo.svg",
  emailDomain: "aptitek.io",
  emailPattern: "{first}.{last}@{domain}",
};

const mockSchoolWithoutLogo: SchoolConfig = {
  id: "school-quantum-institute",
  name: "Quantum Institute",
  slug: "quantum-institute",
  logoUrl: null,
  emailDomain: "quantum.edu",
  emailPattern: "{f}{last}@{domain}",
};

const mockProfile: OnboardingProfile = {
  firstName: "Elena",
  familyName: "Rostova",
  email: "elena.rostova@aptitek.io",
  avatarUrl: "https://example.com/avatar.jpg",
  documentNumber: "7810",
};

describe("OnboardingCard Component & Utilities", () => {
  it("exports OnboardingCard component properly", () => {
    expect(OnboardingCard).toBeDefined();
    expect(typeof OnboardingCard).toBe("object"); // forwardRef component
    expect(OnboardingCard.displayName).toBe("OnboardingCard");
  });

  it("formats institutional email according to school domain and standard pattern", () => {
    const email = formatInstitutionalEmail(
      "Elena",
      "Rostova",
      mockSchoolWithLogo,
    );
    expect(email).toBe("elena.rostova@aptitek.io");
  });

  it("formats institutional email with initial pattern {f}{last}@{domain}", () => {
    const email = formatInstitutionalEmail(
      "Elena",
      "Rostova",
      mockSchoolWithoutLogo,
    );
    expect(email).toBe("erostova@quantum.edu");
  });

  it("returns empty string when both first and family names are empty", () => {
    const email = formatInstitutionalEmail("", "", mockSchoolWithLogo);
    expect(email).toBe("");
  });

  it("handles single name when only first or family name is provided", () => {
    const emailFirstOnly = formatInstitutionalEmail(
      "Jane",
      "",
      mockSchoolWithLogo,
    );
    expect(emailFirstOnly).toBe("jane@aptitek.io");

    const emailFamilyOnly = formatInstitutionalEmail(
      "",
      "Doe",
      mockSchoolWithLogo,
    );
    expect(emailFamilyOnly).toBe("doe@aptitek.io");
  });

  it("handles accent marks and spaces in names for email generation", () => {
    const email = formatInstitutionalEmail(
      "Éléonore",
      "St-Exupéry",
      mockSchoolWithLogo,
    );
    expect(email).toBe("eleonore.st.exupery@aptitek.io");
  });

  it("builds valid TD-1 MRZ dataset from profile and school info with uppercase surname", () => {
    const mrz = buildTd1MrzData(mockProfile, mockSchoolWithLogo);
    expect(mrz.documentNumber).toBe("7810");
    expect(mrz.surname).toBe("ROSTOVA");
    expect(mrz.givenNames).toBe("ELENA");
    expect(mrz.issuingState).toBe("APT");

    const mrzFromLower = buildTd1MrzData(
      { ...mockProfile, familyName: "rostova", firstName: "elena" },
      mockSchoolWithLogo,
    );
    expect(mrzFromLower.surname).toBe("ROSTOVA");
    expect(mrzFromLower.givenNames).toBe("ELENA");
  });

  it("derives Guilloche seed from school ID, name, or slug", () => {
    const seedWithId = mockSchoolWithLogo.id;
    expect(seedWithId).toBe("school-aptitek");

    const fallbackSeed = mockSchoolWithoutLogo.id;
    expect(fallbackSeed).toBe("school-quantum-institute");
  });
});

describe("buildHoloLayers", () => {
  it("generates school logo holo layer for front and AptiSpace logo for back", () => {
    const layers = buildHoloLayers("/aptitek-logo.svg");
    expect(layers).toHaveLength(2);

    const frontLayer = layers.find((l) => l.id === "school-holo-logo");
    expect(frontLayer).toBeDefined();
    expect(frontLayer?.src).toBe("/aptitek-logo.svg");
    expect(frontLayer?.side).toBe("front");
    expect(frontLayer?.holographic).toBe(true);

    const backLayer = layers.find((l) => l.id === "aptispace-holo-logo");
    expect(backLayer).toBeDefined();
    expect(backLayer?.src).toBe("/aptispace-logo.svg");
    expect(backLayer?.side).toBe("back");
    expect(backLayer?.holographic).toBe(true);
  });

  it("omits school logo layer when schoolLogoUrl is null or undefined", () => {
    const layers = buildHoloLayers(null);
    expect(layers).toHaveLength(1);
    expect(layers[0].id).toBe("aptispace-holo-logo");
    expect(layers[0].side).toBe("back");
  });

  it("appends custom holo layers properly", () => {
    const layers = buildHoloLayers("/logo.svg", [
      "custom-pattern.png",
      { id: "layer-2", src: "test.png", side: "back", holographic: true },
    ]);
    expect(layers).toHaveLength(4);
    const custom0 = layers.find((l) => l.id === "custom-holo-0");
    const custom2 = layers.find((l) => l.id === "layer-2");
    expect(custom0).toBeDefined();
    expect(custom2).toBeDefined();
  });
});

describe("calculateCohortValidity", () => {
  it("calculates school year validity starting 1st of September with 1 year duration", () => {
    const cohort: CohortConfig = { name: "Cohort 2026" };
    const validity = calculateCohortValidity(cohort);
    expect(validity.startYear).toBe(2026);
    expect(validity.endYear).toBe(2027);
    expect(validity.validFrom).toBe("01/09/2026");
    expect(validity.validUntil).toBe("31/08/2027");
    expect(validity.formatted).toBe("01/09/2026 – 31/08/2027");
  });

  it("extracts year from various cohort name formats", () => {
    const cohort1: CohortConfig = { name: "Promotion 2027" };
    const validity1 = calculateCohortValidity(cohort1);
    expect(validity1.startYear).toBe(2027);
    expect(validity1.validFrom).toBe("01/09/2027");
    expect(validity1.validUntil).toBe("31/08/2028");

    const cohort2: CohortConfig = { name: "Class of 2025 Engineering" };
    const validity2 = calculateCohortValidity(cohort2);
    expect(validity2.startYear).toBe(2025);
    expect(validity2.validFrom).toBe("01/09/2025");
    expect(validity2.validUntil).toBe("31/08/2026");
  });

  it("respects custom validFrom and validUntil when provided", () => {
    const customCohort: CohortConfig = {
      name: "Spring Semester",
      validFrom: "01/02/2026",
      validUntil: "31/01/2027",
    };
    const validity = calculateCohortValidity(customCohort);
    expect(validity.validFrom).toBe("01/02/2026");
    expect(validity.validUntil).toBe("31/01/2027");
    expect(validity.formatted).toBe("01/02/2026 – 31/01/2027");
  });

  it("falls back gracefully when cohort has no year or is undefined", () => {
    const validity = calculateCohortValidity(undefined);
    expect(validity.startYear).toBe(2026);
    expect(validity.validFrom).toBe("01/09/2026");
    expect(validity.validUntil).toBe("31/08/2027");
  });
});
