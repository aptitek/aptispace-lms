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

  it("defines company tokens as gray semicircle with Business icon", () => {
    const config = INSTITUTION_CONFIGS.company;
    expect(config.key).toBe("company");
    expect(config.label).toBe("Company");
    expect(config.chipColor).toBe("default");
    expect(config.chipShape).toBe("semicircle");
    expect(config.icon).toBeDefined();
  });

  it("defines individual tokens as gray square with Person icon", () => {
    const config = INSTITUTION_CONFIGS.individual;
    expect(config.key).toBe("individual");
    expect(config.label).toBe("Individual");
    expect(config.chipColor).toBe("default");
    expect(config.chipShape).toBe("square");
    expect(config.icon).toBeDefined();
  });

  it("normalizes institution type aliases properly", () => {
    expect(normalizeInstitutionType("school")).toBe("school");
    expect(normalizeInstitutionType("academy")).toBe("school");
    expect(normalizeInstitutionType("university")).toBe("school");

    expect(normalizeInstitutionType("company")).toBe("company");
    expect(normalizeInstitutionType("companies")).toBe("company");
    expect(normalizeInstitutionType("business")).toBe("company");
    expect(normalizeInstitutionType("corporate")).toBe("company");

    expect(normalizeInstitutionType("individual")).toBe("individual");
    expect(normalizeInstitutionType("individuals")).toBe("individual");
    expect(normalizeInstitutionType("freelance")).toBe("individual");
    expect(normalizeInstitutionType("solo")).toBe("individual");

    expect(normalizeInstitutionType(null)).toBe("school");
    expect(normalizeInstitutionType(undefined)).toBe("school");
  });

  it("returns correct config via getInstitutionConfig", () => {
    expect(getInstitutionConfig("companies").key).toBe("company");
    expect(getInstitutionConfig("individuals").key).toBe("individual");
    expect(getInstitutionConfig("academy").key).toBe("school");
  });
});
