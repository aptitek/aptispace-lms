import { describe, it, expect } from "vitest";
import OnboardingCard from "./OnboardingCard";
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
  id: "school-orbital-academy",
  name: "Orbital Space Academy",
  slug: "orbital-academy",
  logoUrl: "/assets/images/brand-logo.svg",
  emailDomain: "cadet.orbital-academy.edu",
  emailPattern: "{first}.{last}@{domain}",
};

const mockSchoolWithoutLogo: SchoolConfig = {
  id: "school-quantum-institute",
  name: "Quantum Aerospace Institute",
  slug: "quantum-aerospace",
  logoUrl: null,
  emailDomain: "quantum.edu",
  emailPattern: "{f}{last}@{domain}",
};

const mockProfile: OnboardingProfile = {
  firstName: "Elena",
  familyName: "Rostova",
  email: "elena.rostova@cadet.orbital-academy.edu",
  avatarUrl: "https://example.com/avatar.jpg",
  documentNumber: "7810",
  clearanceLevel: "LEVEL-3 PILOT",
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
    expect(email).toBe("elena.rostova@cadet.orbital-academy.edu");
  });

  it("formats institutional email with initial pattern {f}{last}@{domain}", () => {
    const email = formatInstitutionalEmail(
      "Elena",
      "Rostova",
      mockSchoolWithoutLogo,
    );
    expect(email).toBe("erostova@quantum.edu");
  });

  it("handles accent marks and spaces in cadet names for email generation", () => {
    const email = formatInstitutionalEmail(
      "Éléonore",
      "St-Exupéry",
      mockSchoolWithLogo,
    );
    expect(email).toBe("eleonore.st.exupery@cadet.orbital-academy.edu");
  });

  it("builds valid TD-1 MRZ dataset from profile and school info", () => {
    const mrz = buildTd1MrzData(mockProfile, mockSchoolWithLogo);
    expect(mrz.documentNumber).toBe("7810");
    expect(mrz.surname).toBe("ROSTOVA");
    expect(mrz.givenNames).toBe("ELENA");
    expect(mrz.issuingState).toBe("ORB");
  });

  it("derives Guilloche seed from school ID, name, or slug", () => {
    const seedWithId = mockSchoolWithLogo.id;
    expect(seedWithId).toBe("school-orbital-academy");

    const fallbackSeed = mockSchoolWithoutLogo.id;
    expect(fallbackSeed).toBe("school-quantum-institute");
  });

  describe("calculateCohortValidity", () => {
    it("calculates school year validity starting 1st of September with 1 year duration", () => {
      const cohort: CohortConfig = { name: "Cadet Cohort 2026" };
      const validity = calculateCohortValidity(cohort);
      expect(validity.startYear).toBe(2026);
      expect(validity.endYear).toBe(2027);
      expect(validity.validFrom).toBe("01/09/2026");
      expect(validity.validUntil).toBe("31/08/2027");
      expect(validity.formatted).toBe("01/09/2026 – 31/08/2027");
    });

    it("extracts year from various cohort name formats", () => {
      const cohort1: CohortConfig = { name: "Promotion X-2027" };
      const validity1 = calculateCohortValidity(cohort1);
      expect(validity1.startYear).toBe(2027);
      expect(validity1.validFrom).toBe("01/09/2027");
      expect(validity1.validUntil).toBe("31/08/2028");

      const cohort2: CohortConfig = { name: "Class of 2025 Flight Division" };
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
});
