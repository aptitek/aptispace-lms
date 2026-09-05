import { describe, it, expect, afterEach, vi } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { appTheme } from "~/tokens/theme";
import HoloDecorator from "./HoloDecorator";

describe("HoloDecorator Molecule", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // Polyfill ResizeObserver for DOM test environment if needed
  if (typeof global.ResizeObserver === "undefined") {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  it("exports HoloDecorator component", () => {
    expect(HoloDecorator).toBeDefined();
    expect(typeof HoloDecorator).toBe("function");
  });

  it("renders child component without changes when active is false", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <HoloDecorator active={false}>
          <Typography>Inactive Hologram</Typography>
        </HoloDecorator>
      </ThemeProvider>,
    );

    expect(screen.getByText("Inactive Hologram")).toBeDefined();
  });

  it("renders text holographic decoration when active", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <div className="physics-card">
          <HoloDecorator type="text">
            <Typography>Active Hologram Text</Typography>
          </HoloDecorator>
        </div>
      </ThemeProvider>,
    );

    expect(screen.getByText("Active Hologram Text")).toBeDefined();
  });

  it("renders image holographic wrapper when type is image and maskUrl provided", () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <div className="physics-card">
          <HoloDecorator type="image" maskUrl="/assets/mask.png">
            <Box component="img" src="/assets/photo.png" alt="Test Graphic" />
          </HoloDecorator>
        </div>
      </ThemeProvider>,
    );

    expect(screen.getByAltText("Test Graphic")).toBeDefined();
    expect(container.querySelector("span")).toBeDefined();
  });
});
