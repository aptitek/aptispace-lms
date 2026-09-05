import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import ThemeToggle, { ZenithSwitch } from "./ThemeToggle";

describe("ThemeToggle and ZenithSwitch components", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports ZenithSwitch and ThemeToggle components", () => {
    expect(ZenithSwitch).toBeDefined();
    expect(ThemeToggle).toBeDefined();
    expect(ZenithSwitch.displayName).toBe("ZenithSwitch");
  });

  it("renders ZenithSwitch and handles click toggling", () => {
    const onToggle = vi.fn();
    const onChangeMode = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ZenithSwitch
            checked={false}
            onToggle={onToggle}
            onChangeMode={onChangeMode}
            data-testid="zenith-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("zenith-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(switchBtn);
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(onChangeMode).toHaveBeenCalledWith("dark");
  });

  it("respects disabled state", () => {
    const onToggle = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ZenithSwitch
            checked={true}
            disabled={true}
            onToggle={onToggle}
            data-testid="disabled-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("disabled-switch");
    expect(switchBtn.hasAttribute("disabled")).toBe(true);
    fireEvent.click(switchBtn);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
