import { describe, it, expect } from "vitest";
import OnboardingCard from "./OnboardingCard";
import {
  formatInstitutionalEmail,
  buildTd1MrzData,
} from "./OnboardingCard.utils";
import type { SchoolConfig, OnboardingProfile } from "./OnboardingCard.types";

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
});
