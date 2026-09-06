import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import Switch from "./Switch";

describe("Material Design 3 Switch Atom", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with role='switch' and respects aria-checked", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <Switch
          checked={false}
          aria-label="Dark Mode"
          data-testid="test-switch"
        />
      </ThemeProvider>,
    );

    const switchEl = screen.getByTestId("test-switch");
    expect(switchEl).toBeDefined();
    expect(switchEl.getAttribute("role")).toBe("switch");
    expect(switchEl.getAttribute("aria-checked")).toBe("false");
    expect(switchEl.getAttribute("aria-label")).toBe("Dark Mode");
  });

  it("handles controlled toggling on click", () => {
    const onChange = vi.fn();

    render(
      <ThemeProvider theme={appTheme}>
        <Switch checked={false} onChange={onChange} data-testid="test-switch" />
      </ThemeProvider>,
    );

    const switchEl = screen.getByTestId("test-switch");
    fireEvent.click(switchEl);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("handles keyboard toggling with Space and Enter", () => {
    const onChange = vi.fn();

    render(
      <ThemeProvider theme={appTheme}>
        <Switch checked={true} onChange={onChange} data-testid="test-switch" />
      </ThemeProvider>,
    );

    const switchEl = screen.getByTestId("test-switch");
    fireEvent.keyDown(switchEl, { key: " " });
    expect(onChange).toHaveBeenCalledWith(false);

    fireEvent.keyDown(switchEl, { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("disables user interaction when disabled prop is true", () => {
    const onChange = vi.fn();

    render(
      <ThemeProvider theme={appTheme}>
        <Switch
          checked={false}
          disabled={true}
          onChange={onChange}
          data-testid="disabled-switch"
        />
      </ThemeProvider>,
    );

    const switchEl = screen.getByTestId("disabled-switch");
    expect(switchEl.hasAttribute("disabled")).toBe(true);

    fireEvent.click(switchEl);
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(switchEl, { key: " " });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders custom thumb icon", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <Switch
          checked={true}
          icon={<span data-testid="custom-icon">★</span>}
          data-testid="icon-switch"
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("custom-icon")).toBeDefined();
  });
});
