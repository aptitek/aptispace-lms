import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import { HoldButton } from "./HoldButton";

describe("HoldButton Atom", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports HoldButton with correct displayName", () => {
    expect(HoldButton).toBeDefined();
    expect(HoldButton.displayName).toBe("HoldButton");
  });

  it("renders children and handles pointer events", () => {
    const onHoldComplete = vi.fn();

    render(
      <ThemeProvider theme={appTheme}>
        <HoldButton
          onHoldComplete={onHoldComplete}
          data-testid="hold-btn"
          holdTime={100}
        >
          Hold to Delete
        </HoldButton>
      </ThemeProvider>,
    );

    const button = screen.getByTestId("hold-btn");
    expect(button).toBeDefined();
    expect(button.textContent).toContain("Hold to Delete");

    fireEvent.pointerDown(button);
    fireEvent.pointerUp(button);
  });

  it("renders with custom shape prop", () => {
    const onHoldComplete = vi.fn();

    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <HoldButton
          onHoldComplete={onHoldComplete}
          shape="pill"
          data-testid="pill-hold-btn"
        >
          Pill Button
        </HoldButton>
      </ThemeProvider>,
    );

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("renders expressive shape with properly scaled progress path", () => {
    const onHoldComplete = vi.fn();

    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <HoldButton
          onHoldComplete={onHoldComplete}
          shape="4-sided-cookie"
          data-testid="cookie-hold-btn"
        >
          Cookie Button
        </HoldButton>
      </ThemeProvider>,
    );

    const paths = container.querySelectorAll("svg path");
    const overlayPath = paths[paths.length - 1];
    expect(overlayPath).toBeDefined();
    const d = overlayPath.getAttribute("d") || "";
    // Scaled path coordinates should exceed 1.0 (they are scaled into pixel coordinates > 1)
    expect(d).toMatch(/M\s*\d{2}/);
  });
});
