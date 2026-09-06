import { describe, it, expect, vi } from "vitest";
import React from "react";
import SegmentedChip from "./SegmentedChip";
import type { SegmentedChipProps } from "./SegmentedChip.types";

describe("SegmentedChip Molecule Component", () => {
  it("exports SegmentedChip component properly", () => {
    expect(SegmentedChip).toBeDefined();
    expect(typeof SegmentedChip).toBe("object"); // forwardRef component
    expect(SegmentedChip.displayName).toBe("SegmentedChip");
  });

  it("creates React element with generic segments list", () => {
    const element = React.createElement(SegmentedChip, {
      segments: [
        { label: "BUILD", bold: true, background: "#22c55e", color: "#fff" },
        { label: "passing" },
        { label: "v2.4.0", mono: true },
      ],
      size: "small",
    });

    expect(element).toBeDefined();
    const props = element.props as SegmentedChipProps;
    expect(props.segments).toHaveLength(3);
    expect(props.size).toBe("small");
  });

  it("creates React element with leading and items shorthand", () => {
    const element = React.createElement(SegmentedChip, {
      leading: { label: "STATUS", bold: true },
      items: ["Healthy", "99.9%"],
      variant: "filled",
    });

    expect(element).toBeDefined();
    const props = element.props as SegmentedChipProps;
    expect(props.leading).toBeDefined();
    expect(props.items).toHaveLength(2);
    expect(props.variant).toBe("filled");
  });

  it("supports structured cohort data for domain compatibility", () => {
    const cohortData = {
      diploma: "Master",
      year: 2026,
      tags: ["AI", "Robotics"],
    };

    const element = React.createElement(SegmentedChip, {
      cohort: cohortData,
      size: "medium",
      testId: "my-cohort-chip",
    });

    expect(element).toBeDefined();
    const props = element.props as SegmentedChipProps;
    expect(props.cohort).toEqual(cohortData);
    expect(props.testId).toBe("my-cohort-chip");
  });

  it("supports delete action and interactive click handlers", () => {
    const handleClick = vi.fn();
    const handleDelete = vi.fn();

    const element = React.createElement(SegmentedChip, {
      segments: [{ label: "Role" }, { label: "Student" }],
      onClick: handleClick,
      onDelete: handleDelete,
      shape: "bun",
    });

    expect(element).toBeDefined();
    const props = element.props as SegmentedChipProps;
    expect(props.onClick).toBe(handleClick);
    expect(props.onDelete).toBe(handleDelete);
    expect(props.shape).toBe("bun");
  });

  it("supports various sizes and shape presets", () => {
    const smallElement = React.createElement(SegmentedChip, {
      segments: ["A", "B"],
      size: "small",
      shape: "pill",
    });
    expect(smallElement.props.size).toBe("small");

    const largeElement = React.createElement(SegmentedChip, {
      segments: ["A", "B"],
      size: "large",
      shape: "asymmetric",
    });
    expect(largeElement.props.size).toBe("large");
    expect(largeElement.props.shape).toBe("asymmetric");
  });
});
