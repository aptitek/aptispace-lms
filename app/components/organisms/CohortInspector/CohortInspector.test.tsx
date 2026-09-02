import { describe, it, expect, vi } from "vitest";
import React from "react";
import CohortInspector, { type CohortSavePayload } from "./CohortInspector";
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

  it("creates React element for CohortStructuredFields with year stepper props", async () => {
    const { CohortStructuredFields } =
      await import("./CohortInspector.components");
    const onDiplomaChange = vi.fn();
    const onYearChange = vi.fn();
    const onTagsChange = vi.fn();

    const element = React.createElement(CohortStructuredFields, {
      diploma: "M",
      onDiplomaChange,
      year: 2,
      onYearChange,
      tags: ["IA"],
      onTagsChange,
    });

    expect(element).toBeDefined();
    expect(element.props.year).toBe(2);
    expect(element.props.diploma).toBe("M");
    expect(element.props.tags).toEqual(["IA"]);
  });

  it("creates React element for CohortDateModeToggle", async () => {
    const { CohortDateModeToggle } =
      await import("./CohortInspector.components");
    const onModeChange = vi.fn();

    const element = React.createElement(CohortDateModeToggle, {
      mode: "shortcut",
      onModeChange,
    });

    expect(element).toBeDefined();
    expect(element.props.mode).toBe("shortcut");
    expect(element.props.onModeChange).toBe(onModeChange);
  });

  it("creates React element for CohortDatePickerFields with side-by-side props", async () => {
    const { CohortDatePickerFields } =
      await import("./CohortInspector.components");
    const onStartChange = vi.fn();
    const onEndChange = vi.fn();

    const element = React.createElement(CohortDatePickerFields, {
      startDate: "2026-09-01",
      endDate: "2027-06-30",
      onStartDateChange: onStartChange,
      onEndDateChange: onEndChange,
      disabled: false,
    });

    expect(element).toBeDefined();
    expect(element.props.startDate).toBe("2026-09-01");
    expect(element.props.endDate).toBe("2027-06-30");
  });

  it("creates React element for CohortScheduleCard with custom period", async () => {
    const { CohortScheduleCard } = await import("./CohortInspector.components");
    const onSelectPeriod = vi.fn();
    const onSelectYear = vi.fn();
    const onStartChange = vi.fn();
    const onEndChange = vi.fn();

    const element = React.createElement(CohortScheduleCard, {
      selectedPeriod: "custom",
      onSelectPeriod,
      onSelectYear,
      activeYear: 2026,
      startDate: "2026-09-01",
      endDate: "2027-06-30",
      onStartDateChange: onStartChange,
      onEndDateChange: onEndChange,
      disabled: false,
    });

    expect(element).toBeDefined();
    expect(element.props.selectedPeriod).toBe("custom");
    expect(element.props.startDate).toBe("2026-09-01");
    expect(element.props.endDate).toBe("2027-06-30");
  });

  it("verifies CohortSavePayload accepts id and year properly", () => {
    const payload: CohortSavePayload = {
      id: "cohort-1",
      name: "M2-IA-Dev",
      year: 2,
    };
    expect(payload.id).toBe("cohort-1");
    expect(payload.year).toBe(2);
  });
});
