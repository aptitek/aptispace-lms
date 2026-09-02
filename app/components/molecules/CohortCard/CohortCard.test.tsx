import { describe, it, expect, vi } from "vitest";
import React from "react";
import CohortCard from "./CohortCard";
import type { CohortConfig } from "~/types/institution";

describe("CohortCard Molecule", () => {
  const mockCohortWithDate: CohortConfig = {
    id: "cohort-101",
    name: "Web Development 2026",
    description: "Full-stack development bootcamp cohort",
    institutionId: "school-aptitek",
    startDate: "2026-09-01",
    endDate: "2027-08-31",
  };

  const mockCohortWithoutDate: CohortConfig = {
    id: "cohort-102",
    name: "Legacy Cohort",
    institutionId: "school-aptitek",
  };

  it("exports CohortCard component properly", () => {
    expect(CohortCard).toBeDefined();
    expect(CohortCard.displayName).toBe("CohortCard");
  });

  it("creates React element for cohort card with start date", () => {
    const onClick = vi.fn();
    const element = React.createElement(CohortCard, {
      cohort: mockCohortWithDate,
      studentCount: 15,
      onClick,
      isSelected: true,
    });

    expect(element).toBeDefined();
    expect(element.props.cohort).toEqual(mockCohortWithDate);
    expect(element.props.studentCount).toBe(15);
    expect(element.props.isSelected).toBe(true);
  });

  it("creates React element for cohort card with diploma, year, and tags", () => {
    const mockStructuredCohort: CohortConfig = {
      id: "cohort-103",
      name: "M1-IA-Dev",
      diploma: "M",
      year: 1,
      tags: ["IA", "Dev"],
      institutionId: "school-aptitek",
    };

    const element = React.createElement(CohortCard, {
      cohort: mockStructuredCohort,
      studentCount: 22,
    });

    expect(element).toBeDefined();
    expect(element.props.cohort.diploma).toBe("M");
    expect(element.props.cohort.year).toBe(1);
    expect(element.props.cohort.tags).toEqual(["IA", "Dev"]);
  });

  it("creates React element for cohort card without date", () => {
    const element = React.createElement(CohortCard, {
      cohort: mockCohortWithoutDate,
    });
    expect(element).toBeDefined();
    expect(element.props.cohort.name).toBe("Legacy Cohort");
  });
});
