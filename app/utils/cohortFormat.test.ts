import { describe, it, expect } from "vitest";
import {
  formatCohortName,
  parseCohortName,
  getSpecialtySlug,
  getDiplomaColor,
  getCohortDisplayName,
  DIPLOMA_OPTIONS,
  YEAR_OPTIONS,
} from "./cohortFormat";

describe("cohortFormat Utility", () => {
  describe("formatCohortName", () => {
    it("formats standard Master 1 with tags: M1-IA-Dev", () => {
      const result = formatCohortName({
        diploma: "M",
        year: 1,
        tags: ["IA", "Dev"],
      });
      expect(result).toBe("M1-IA-Dev");
    });

    it("formats Bachelor 3 with single tag: B3-Cyber", () => {
      const result = formatCohortName({
        diploma: "B",
        year: 3,
        tags: ["Cyber"],
      });
      expect(result).toBe("B3-Cyber");
    });

    it("handles Year 0 / None: F-Docker", () => {
      const result = formatCohortName({
        diploma: "F",
        year: 0,
        tags: ["Docker"],
      });
      expect(result).toBe("F-Docker");
    });

    it("handles null year: C-IoT", () => {
      const result = formatCohortName({
        diploma: "C",
        year: null,
        tags: ["IoT"],
      });
      expect(result).toBe("C-IoT");
    });

    it("formats diploma and year without tags: L2", () => {
      const result = formatCohortName({
        diploma: "L",
        year: 2,
        tags: [],
      });
      expect(result).toBe("L2");
    });

    it("formats diploma without year or tags: M", () => {
      const result = formatCohortName({
        diploma: "M",
        year: 0,
        tags: [],
      });
      expect(result).toBe("M");
    });

    it("extracts first uppercase letter if full diploma name is passed", () => {
      const result = formatCohortName({
        diploma: "Doctorate",
        year: 2,
        tags: ["AI"],
      });
      expect(result).toBe("D2-AI");
    });

    it("handles empty values gracefully", () => {
      expect(formatCohortName({})).toBe("");
      expect(formatCohortName({ diploma: null, year: 0, tags: [] })).toBe("");
    });
  });

  describe("getSpecialtySlug", () => {
    it("converts uppercase or mixed tags to lowercase slug for i18n", () => {
      expect(getSpecialtySlug("AI")).toBe("ai");
      expect(getSpecialtySlug("Dev")).toBe("dev");
      expect(getSpecialtySlug("Cyber")).toBe("cyber");
      expect(getSpecialtySlug("IoT")).toBe("iot");
      expect(getSpecialtySlug("Cloud-Native")).toBe("cloudnative");
      expect(getSpecialtySlug(null)).toBe("");
    });
  });

  describe("parseCohortName", () => {
    it("reverse parses M1-IA-Dev", () => {
      const parsed = parseCohortName("M1-IA-Dev");
      expect(parsed).toEqual({
        diploma: "M",
        year: 1,
        tags: ["IA", "Dev"],
      });
    });

    it("reverse parses B3-Cyber", () => {
      const parsed = parseCohortName("B3-Cyber");
      expect(parsed).toEqual({
        diploma: "B",
        year: 3,
        tags: ["Cyber"],
      });
    });

    it("reverse parses F-Docker (no year)", () => {
      const parsed = parseCohortName("F-Docker");
      expect(parsed).toEqual({
        diploma: "F",
        year: 0,
        tags: ["Docker"],
      });
    });

    it("reverse parses L2 (no tags)", () => {
      const parsed = parseCohortName("L2");
      expect(parsed).toEqual({
        diploma: "L",
        year: 2,
        tags: [],
      });
    });

    it("returns nulls for non-matching or empty strings", () => {
      expect(parseCohortName("")).toEqual({
        diploma: null,
        year: null,
        tags: [],
      });
      expect(parseCohortName("Legacy Cohort 2026")).toEqual({
        diploma: null,
        year: null,
        tags: [],
      });
    });
  });

  describe("getDiplomaColor", () => {
    it("returns correct color theme for known diplomas", () => {
      expect(getDiplomaColor("M").main).toBe("var(--color-diploma-m)");
      expect(getDiplomaColor("B").main).toBe("var(--color-diploma-b)");
      expect(getDiplomaColor("C").main).toBe("var(--color-diploma-c)");
      expect(getDiplomaColor("F").main).toBe("var(--color-diploma-f)");
      expect(getDiplomaColor("L").main).toBe("var(--color-diploma-l)");
      expect(getDiplomaColor("D").main).toBe("var(--color-diploma-d)");
    });

    it("returns default theme for unknown or empty diploma", () => {
      expect(getDiplomaColor(null).main).toBe("var(--color-diploma-default)");
      expect(getDiplomaColor("Z").main).toBe("var(--color-diploma-default)");
    });
  });

  describe("getCohortDisplayName", () => {
    it("formats structured cohort properly", () => {
      expect(
        getCohortDisplayName({ diploma: "M", year: 1, tags: ["IA", "Dev"] }),
      ).toBe("M1-IA-Dev");
    });

    it("falls back to name or default if diploma is absent", () => {
      expect(getCohortDisplayName({ name: "Legacy 2026" })).toBe("Legacy 2026");
      expect(getCohortDisplayName(undefined)).toBe("Cohort");
    });
  });

  describe("constants", () => {
    it("has all required diploma options", () => {
      const codes: string[] = [];
      for (const d of DIPLOMA_OPTIONS) {
        codes.push(d.code);
      }
      expect(codes).toEqual(["C", "F", "L", "B", "M", "D"]);
    });

    it("includes none (0) in year options", () => {
      let hasZero = false;
      for (const y of YEAR_OPTIONS) {
        if (y.value === 0) hasZero = true;
      }
      expect(hasZero).toBe(true);
    });
  });
});
