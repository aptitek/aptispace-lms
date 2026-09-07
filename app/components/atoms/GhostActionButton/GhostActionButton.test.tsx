import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import { GhostActionButton } from "./GhostActionButton";

afterEach(cleanup);

describe("GhostActionButton Atom", () => {
  it("exports GhostActionButton component properly", () => {
    expect(GhostActionButton).toBeDefined();
    expect(typeof GhostActionButton).toBe("function");
  });

  it("renders with tooltip, testId, and triggers onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <GhostActionButton
          tooltip="Add Student"
          testId="my-ghost-fab"
          className="custom-fab-class"
          onClick={onClick}
        />
      </ThemeProvider>,
    );

    const button = screen.getByTestId("my-ghost-fab");
    expect(button).toBeDefined();
    expect(button.getAttribute("aria-label")).toBe("Add Student");
    expect(button.classList.contains("custom-fab-class")).toBe(true);

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("uses default testId when not provided", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <GhostActionButton tooltip="Create item" />
      </ThemeProvider>,
    );

    const button = screen.getByTestId("ghost-fab-btn");
    expect(button).toBeDefined();
    expect(button.getAttribute("aria-label")).toBe("Create item");
  });
});
