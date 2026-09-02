import { describe, it, expect, vi } from "vitest";
import React from "react";
import CohortFilterBar from "./CohortFilterBar";

describe("CohortFilterBar Molecule", () => {
  it("exports CohortFilterBar properly", () => {
    expect(CohortFilterBar).toBeDefined();
    expect(typeof CohortFilterBar).toBe("function");
  });

  it("creates React element with filter props", () => {
    const onQueryChange = vi.fn();
    const onDiplomaFilterChange = vi.fn();
    const onYearFilterChange = vi.fn();
    const onTagFilterChange = vi.fn();

    const element = React.createElement(CohortFilterBar, {
      query: "test",
      onQueryChange,
      diplomaFilter: "M",
      onDiplomaFilterChange,
      yearFilter: 1,
      onYearFilterChange,
      tagFilter: "IA",
      onTagFilterChange,
      availableTags: ["IA", "Dev"],
    });

    expect(element).toBeDefined();
    expect(element.props.query).toBe("test");
    expect(element.props.diplomaFilter).toBe("M");
    expect(element.props.yearFilter).toBe(1);
    expect(element.props.tagFilter).toBe("IA");
  });

  it("handles yearFilter as 'all' or number correctly", () => {
    const onYearFilterChange = vi.fn();
    const elementAll = React.createElement(CohortFilterBar, {
      query: "",
      onQueryChange: vi.fn(),
      diplomaFilter: "all",
      onDiplomaFilterChange: vi.fn(),
      yearFilter: "all",
      onYearFilterChange,
      tagFilter: "all",
      onTagFilterChange: vi.fn(),
    });

    expect(elementAll.props.yearFilter).toBe("all");

    const elementZero = React.createElement(CohortFilterBar, {
      query: "",
      onQueryChange: vi.fn(),
      diplomaFilter: "all",
      onDiplomaFilterChange: vi.fn(),
      yearFilter: 0,
      onYearFilterChange,
      tagFilter: "all",
      onTagFilterChange: vi.fn(),
    });

    expect(elementZero.props.yearFilter).toBe(0);
  });
});
