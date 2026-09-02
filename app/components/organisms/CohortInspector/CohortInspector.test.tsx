import { describe, it, expect, vi } from "vitest";
import React from "react";
import CohortInspector from "./CohortInspector";
import type { CohortConfig } from "~/types/institution";

describe("CohortInspector Organism", () => {
  const mockCohort: CohortConfig = {
    id: "cohort-1",
    name: "Web Development 2026",
    description: "Full-stack development bootcamp cohort",
    institutionId: "school-aptitek",
    startDate: "2026-09-01",
    endDate: "2027-06-30",
  };

  it("exports CohortInspector component properly", () => {
    expect(CohortInspector).toBeDefined();
    expect(typeof CohortInspector).toBe("function");
    expect(CohortInspector.name).toBe("CohortInspector");
  });

  it("creates React element for editing cohort", () => {
    const onCloseMock = vi.fn();
    const onSaveMock = vi.fn();

    const element = React.createElement(CohortInspector, {
      cohort: mockCohort,
      onClose: onCloseMock,
      onSave: onSaveMock,
      isSubmitting: false,
    });

    expect(element).toBeDefined();
    expect(element.props.cohort).toEqual(mockCohort);
    expect(element.props.onClose).toBe(onCloseMock);
    expect(element.props.onSave).toBe(onSaveMock);
  });

  it("creates React element for cohort with diploma, year, and tags", () => {
    const formattedCohort: CohortConfig = {
      id: "cohort-m1",
      name: "M1-IA-Dev",
      diploma: "M",
      year: 1,
      tags: ["IA", "Dev"],
      institutionId: "school-aptitek",
    };

    const element = React.createElement(CohortInspector, {
      cohort: formattedCohort,
      onClose: vi.fn(),
      onSave: vi.fn(),
    });

    expect(element).toBeDefined();
    expect(element.props.cohort?.diploma).toBe("M");
    expect(element.props.cohort?.year).toBe(1);
    expect(element.props.cohort?.tags).toEqual(["IA", "Dev"]);
  });
});
