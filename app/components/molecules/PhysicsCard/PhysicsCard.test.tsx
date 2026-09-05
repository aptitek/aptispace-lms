import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import PhysicsCard from "./PhysicsCard";

describe("PhysicsCard Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports PhysicsCard component", () => {
    expect(PhysicsCard).toBeDefined();
    expect(typeof PhysicsCard).toBe("function");
  });

  it("renders front children content inside the card", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <PhysicsCard
          data-testid="physics-card"
          frontContent={<div>Front Content</div>}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Front Content")).toBeDefined();
  });

  it("renders backContent when provided", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <PhysicsCard
          frontContent={<div>Front Content</div>}
          backContent={<div>Back Content</div>}
          isFlipped={true}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Back Content")).toBeDefined();
    expect(screen.getByText("Front Content")).toBeDefined();
  });

  it("applies holographic effects without error", () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <PhysicsCard
          frontContent={<div>Holo Content</div>}
          showHolo={true}
          showSheen={true}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Holo Content")).toBeDefined();
    expect(container.querySelector(".physics-card")).toBeDefined();
  });
});
