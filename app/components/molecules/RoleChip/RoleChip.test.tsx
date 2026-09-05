import { describe, it, expect } from "vitest";
import React from "react";
import RoleChip from "./RoleChip";
import type { RoleChipProps } from "./RoleChip.types";

describe("RoleChip Molecule Component", () => {
  it("exports RoleChip component properly", () => {
    expect(RoleChip).toBeDefined();
    expect(typeof RoleChip).toBe("object"); // forwardRef component
    expect(RoleChip.displayName).toBe("RoleChip");
  });

  it("creates React element with student role props", () => {
    const element = React.createElement(RoleChip, {
      userRole: "student",
      size: "small",
    });

    expect(element).toBeDefined();
    const props = element.props as RoleChipProps;
    expect(props.userRole).toBe("student");
    expect(props.size).toBe("small");
  });

  it("creates React element with instructor role props", () => {
    const element = React.createElement(RoleChip, {
      userRole: "instructor",
      variant: "outlined",
    });

    expect(element).toBeDefined();
    const props = element.props as RoleChipProps;
    expect(props.userRole).toBe("instructor");
    expect(props.variant).toBe("outlined");
  });

  it("creates React element with admin role and custom label", () => {
    const element = React.createElement(RoleChip, {
      userRole: "admin",
      label: "SUPER ADMIN",
      showIcon: false,
    });

    expect(element).toBeDefined();
    const props = element.props as RoleChipProps;
    expect(props.userRole).toBe("admin");
    expect(props.label).toBe("SUPER ADMIN");
    expect(props.showIcon).toBe(false);
  });

  it("creates React element with all roles option", () => {
    const element = React.createElement(RoleChip, {
      userRole: "all",
      testId: "filter-all-roles",
    });

    expect(element).toBeDefined();
    const props = element.props as RoleChipProps;
    expect(props.userRole).toBe("all");
    expect(props.testId).toBe("filter-all-roles");
  });
});
