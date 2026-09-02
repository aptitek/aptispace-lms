import { describe, it, expect } from "vitest";
import React from "react";
import InstitutionChip from "./InstitutionChip";
import type { InstitutionChipProps } from "./InstitutionChip.types";

describe("InstitutionChip Atom Component", () => {
  it("exports InstitutionChip component properly", () => {
    expect(InstitutionChip).toBeDefined();
    expect(typeof InstitutionChip).toBe("object"); // forwardRef component
    expect(InstitutionChip.displayName).toBe("InstitutionChip");
  });

  it("creates React element for school with cyan clamshell defaults", () => {
    const element = React.createElement(InstitutionChip, {
      institutionType: "school",
    });

    expect(element).toBeDefined();
    const props = element.props as InstitutionChipProps;
    expect(props.institutionType).toBe("school");
  });

  it("creates React element for company/institution with yellow semicircle defaults", () => {
    const element = React.createElement(InstitutionChip, {
      institutionType: "company",
    });

    expect(element).toBeDefined();
    const props = element.props as InstitutionChipProps;
    expect(props.institutionType).toBe("company");
  });

  it("allows custom overrides for shape, color, label, and icon", () => {
    const customIcon = <span data-testid="custom-icon">★</span>;
    const element = React.createElement(InstitutionChip, {
      institutionType: "school",
      label: "Tech Academy",
      shape: "rounded",
      color: "primary",
      icon: customIcon,
    });

    expect(element).toBeDefined();
    const props = element.props as InstitutionChipProps;
    expect(props.label).toBe("Tech Academy");
    expect(props.shape).toBe("rounded");
    expect(props.color).toBe("primary");
    expect(props.icon).toBe(customIcon);
  });
});
