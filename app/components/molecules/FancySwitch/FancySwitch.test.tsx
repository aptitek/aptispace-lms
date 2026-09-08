import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import FancySwitch from "./FancySwitch";

describe("FancySwitch component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with proper role and aria attributes", () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <FancySwitch
          checked={false}
          onChange={onChange}
          ariaLabel="Test Switch"
          thumbContent={() => <span data-testid="test-thumb">T</span>}
          data-testid="fancy-unit-switch"
        />
      </ThemeProvider>,
    );

    const switchBtn = screen.getByTestId("fancy-unit-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");
    expect(switchBtn.getAttribute("aria-label")).toBe("Test Switch");
    expect(screen.getByTestId("test-thumb")).toBeDefined();

    fireEvent.click(switchBtn);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("handles keyboard Enter and Space activation", () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <FancySwitch
          checked={true}
          onChange={onChange}
          ariaLabel="Keyboard Switch"
          thumbContent={() => <span>K</span>}
          data-testid="keyboard-switch"
        />
      </ThemeProvider>,
    );

    const switchBtn = screen.getByTestId("keyboard-switch");
    fireEvent.keyDown(switchBtn, { key: " " });
    expect(onChange).toHaveBeenCalledWith(false);

    fireEvent.keyDown(switchBtn, { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("does not trigger when disabled", () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <FancySwitch
          checked={false}
          disabled={true}
          onChange={onChange}
          ariaLabel="Disabled Switch"
          tooltipTitle="Disabled feature"
          thumbContent={() => <span>D</span>}
          data-testid="disabled-switch"
        />
      </ThemeProvider>,
    );

    const switchBtn = screen.getByTestId("disabled-switch");
    expect(switchBtn.hasAttribute("disabled")).toBe(true);
    fireEvent.click(switchBtn);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders custom peeking element and decorations", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <FancySwitch
          checked={false}
          ariaLabel="Decorated Switch"
          peekingElement={(state) =>
            state.isHovered ? (
              <span data-testid="peeking-icon">Peeking</span>
            ) : null
          }
          backgroundDecorations={() => (
            <span data-testid="bg-decor">Background</span>
          )}
          thumbContent={() => <span>Icon</span>}
          data-testid="decorated-switch"
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("bg-decor")).toBeDefined();
    expect(screen.queryByTestId("peeking-icon")).toBeNull();

    const switchBtn = screen.getByTestId("decorated-switch");
    fireEvent.mouseEnter(switchBtn);
    expect(screen.getByTestId("peeking-icon")).toBeDefined();

    fireEvent.mouseLeave(switchBtn);
    expect(screen.queryByTestId("peeking-icon")).toBeNull();
  });
});
