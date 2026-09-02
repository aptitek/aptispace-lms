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

  it("creates React element for cohort card without dates", () => {
    const element = React.createElement(CohortCard, {
      cohort: mockCohortWithoutDate,
      studentCount: 0,
    });

    expect(element).toBeDefined();
    expect(element.props.cohort.name).toBe("Legacy Cohort");
  });
});
