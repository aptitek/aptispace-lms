import { describe, it, expect } from "vitest";
import {
  INSTITUTION_CONFIGS,
  normalizeInstitutionType,
  getInstitutionConfig,
} from "./institutions";

describe("Institution Tokens & Configurations", () => {
  it("defines school tokens as cyan clamshell with School icon", () => {
    const config = INSTITUTION_CONFIGS.school;
    expect(config.key).toBe("school");
    expect(config.label).toBe("School");
    expect(config.chipColor).toBe("info");
    expect(config.chipShape).toBe("clamshell");
    expect(config.icon).toBeDefined();
  });

  it("defines company tokens as yellow semicircle with Business icon", () => {
    const config = INSTITUTION_CONFIGS.company;
    expect(config.key).toBe("company");
    expect(config.label).toBe("Institution");
    expect(config.chipColor).toBe("warning");
    expect(config.chipShape).toBe("semicircle");
    expect(config.icon).toBeDefined();
  });

  it("normalizes institution type aliases properly", () => {
    expect(normalizeInstitutionType("school")).toBe("school");
    expect(normalizeInstitutionType("academic")).toBe("school");
    expect(normalizeInstitutionType("academy")).toBe("school");
    expect(normalizeInstitutionType("university")).toBe("school");

    expect(normalizeInstitutionType("company")).toBe("company");
    expect(normalizeInstitutionType("companies")).toBe("company");
    expect(normalizeInstitutionType("institution")).toBe("company");
    expect(normalizeInstitutionType("institutions")).toBe("company");
    expect(normalizeInstitutionType("business")).toBe("company");
    expect(normalizeInstitutionType("corporate")).toBe("company");

    // Individuals are attached to default school
    expect(normalizeInstitutionType("individual")).toBe("school");
    expect(normalizeInstitutionType("individuals")).toBe("school");
    expect(normalizeInstitutionType("freelance")).toBe("school");
    expect(normalizeInstitutionType("solo")).toBe("school");

    expect(normalizeInstitutionType(null)).toBe("school");
    expect(normalizeInstitutionType(undefined)).toBe("school");
  });

  it("returns correct config via getInstitutionConfig", () => {
    expect(getInstitutionConfig("companies").key).toBe("company");
    expect(getInstitutionConfig("institution").key).toBe("company");
    expect(getInstitutionConfig("individuals").key).toBe("school");
    expect(getInstitutionConfig("academy").key).toBe("school");
  });
});
