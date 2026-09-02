import { describe, it, expect, vi } from "vitest";
import React from "react";
import CohortChip from "./CohortChip";

describe("CohortChip Atom Component", () => {
  it("exports CohortChip component properly", () => {
    expect(CohortChip).toBeDefined();
    expect(CohortChip.displayName).toBe("CohortChip");
  });

  it("creates React element with structured cohort (M1 | AI | Dev)", () => {
    const element = React.createElement(CohortChip, {
      cohort: {
        diploma: "M",
        year: 1,
        tags: ["AI", "Dev"],
      },
      size: "medium",
    });

    expect(element).toBeDefined();
    expect(element.props.cohort?.diploma).toBe("M");
    expect(element.props.cohort?.year).toBe(1);
    expect(element.props.cohort?.tags).toEqual(["AI", "Dev"]);
    expect(element.props.size).toBe("medium");
  });

  it("creates React element supporting size variants: small, medium, large", () => {
    const smallElement = React.createElement(CohortChip, {
      cohort: { diploma: "B", year: 3, tags: ["Cyber"] },
      size: "small",
    });
    expect(smallElement.props.size).toBe("small");

    const largeElement = React.createElement(CohortChip, {
      cohort: { diploma: "F", year: 0, tags: ["Docker"] },
      size: "large",
    });
    expect(largeElement.props.size).toBe("large");
  });

  it("handles legacy cohort name reverse-parsing fallback", () => {
    const element = React.createElement(CohortChip, {
      cohort: {
        name: "M1-IA-Dev",
      },
    });

    expect(element).toBeDefined();
    expect(element.props.cohort?.name).toBe("M1-IA-Dev");
  });

  it("supports interactive click and delete callbacks", () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();

    const element = React.createElement(CohortChip, {
      cohort: { diploma: "L", year: 2, tags: [] },
      onClick,
      onDelete,
    });

    expect(element.props.onClick).toBe(onClick);
    expect(element.props.onDelete).toBe(onDelete);
  });
});
