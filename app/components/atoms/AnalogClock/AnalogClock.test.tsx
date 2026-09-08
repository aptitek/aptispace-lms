import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import AnalogClock from "./AnalogClock";

describe("AnalogClock component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with dial, needles and ticks", () => {
    render(<AnalogClock size={32} data-testid="generic-analog-clock" />);

    const svg = screen.getByTestId("generic-analog-clock");
    expect(svg).toBeDefined();
    expect(svg.getAttribute("viewBox")).toBe("0 0 100 100");
    expect(screen.getByTestId("analog-clock-hour-needle")).toBeDefined();
    expect(screen.getByTestId("analog-clock-minute-needle")).toBeDefined();
  });

  it("supports animation state", () => {
    render(
      <AnalogClock
        size={24}
        isAnimating={true}
        data-testid="animating-clock"
      />,
    );
    expect(screen.getByTestId("animating-clock")).toBeDefined();
  });
});
