import { describe, it, expect, vi } from "vitest";
import React from "react";
import InstitutionFilterBar, {
  type InstitutionFilterBarProps,
} from "./InstitutionFilterBar";

describe("InstitutionFilterBar Molecule", () => {
  it("exports InstitutionFilterBar component properly", () => {
    expect(InstitutionFilterBar).toBeDefined();
    expect(typeof InstitutionFilterBar).toBe("function");
    expect(InstitutionFilterBar.name).toBe("InstitutionFilterBar");
  });

  it("creates React element with filter props", () => {
    const handleQueryChange = vi.fn();
    const handleTypeFilterChange = vi.fn();

    const element = React.createElement(InstitutionFilterBar, {
      query: "Aptitek",
      onQueryChange: handleQueryChange,
      typeFilter: "company",
      onTypeFilterChange: handleTypeFilterChange,
      testId: "custom-institution-filter-bar",
    });

    expect(element).toBeDefined();
    const props = element.props as InstitutionFilterBarProps;
    expect(props.query).toBe("Aptitek");
    expect(props.typeFilter).toBe("company");
  });
});
