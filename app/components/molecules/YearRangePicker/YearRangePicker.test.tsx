import { describe, it, expect, vi } from "vitest";
import React from "react";
import YearRangePicker from "./YearRangePicker";

describe("YearRangePicker Molecule", () => {
  it("exports YearRangePicker component properly", () => {
    expect(YearRangePicker).toBeDefined();
    expect(typeof YearRangePicker).toBe("function");
  });

  it("creates React element with empty values", () => {
    const onMinChange = vi.fn();
    const onMaxChange = vi.fn();

    const element = React.createElement(YearRangePicker, {
      startYearMin: null,
      startYearMax: null,
      onStartYearMinChange: onMinChange,
      onStartYearMaxChange: onMaxChange,
    });

    expect(element).toBeDefined();
    expect(element.props.startYearMin).toBeNull();
    expect(element.props.startYearMax).toBeNull();
  });

  it("creates React element with active range", () => {
    const onMinChange = vi.fn();
    const onMaxChange = vi.fn();

    const element = React.createElement(YearRangePicker, {
      startYearMin: 2025,
      startYearMax: 2027,
      onStartYearMinChange: onMinChange,
      onStartYearMaxChange: onMaxChange,
    });

    expect(element).toBeDefined();
    expect(element.props.startYearMin).toBe(2025);
    expect(element.props.startYearMax).toBe(2027);
  });
});
