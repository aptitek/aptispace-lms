import { describe, it, expect } from "vitest";
import {
  getAcademicYearDates,
  getAcademicYearOptions,
  calculateDurationMonths,
  ACADEMIC_PERIODS,
} from "./academicYear";

describe("academicYear utils", () => {
  it("generates full academic year dates from Sep 1 to Aug 31", () => {
    const dates = getAcademicYearDates(2026, "fullAcademic");
    expect(dates.startDate).toBe("2026-09-01");
    expect(dates.endDate).toBe("2027-08-31");
    expect(dates.label).toBe("2026–2027");
  });

  it("generates fall semester dates from Sep 1 to Jan 31", () => {
    const dates = getAcademicYearDates(2026, "fall");
    expect(dates.startDate).toBe("2026-09-01");
    expect(dates.endDate).toBe("2027-01-31");
  });

  it("generates spring semester dates from Feb 1 to Aug 31", () => {
    const dates = getAcademicYearDates(2026, "spring");
    expect(dates.startDate).toBe("2027-02-01");
    expect(dates.endDate).toBe("2027-08-31");
  });

  it("generates calendar year dates from Jan 1 to Dec 31", () => {
    const dates = getAcademicYearDates(2026, "calendar");
    expect(dates.startDate).toBe("2026-01-01");
    expect(dates.endDate).toBe("2026-12-31");
  });

  it("calculates duration in months correctly", () => {
    expect(calculateDurationMonths("2026-09-01", "2027-08-31")).toBe(12);
    expect(calculateDurationMonths("2026-09-01", "2027-01-31")).toBe(5);
    expect(calculateDurationMonths(undefined, undefined)).toBeNull();
    expect(calculateDurationMonths("2027-01-01", "2026-01-01")).toBeNull();
  });

  it("generates year options list based on reference date", () => {
    const ref = new Date(2026, 8, 15); // Sep 2026 -> start year 2026
    const years = getAcademicYearOptions(ref, 1, 2);
    expect(years).toEqual([2025, 2026, 2027, 2028]);
  });

  it("has definitions for period types", () => {
    expect(Object.keys(ACADEMIC_PERIODS)).toHaveLength(4);
  });
});
