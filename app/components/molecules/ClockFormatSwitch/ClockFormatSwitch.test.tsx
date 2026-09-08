import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import ClockFormatSwitch from "./ClockFormatSwitch";

describe("ClockFormatSwitch component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with 12h format and digital clock on inactive side", () => {
    const onChangeFormat = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ClockFormatSwitch
            format="12h"
            onChangeFormat={onChangeFormat}
            data-testid="unit-clock-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("unit-clock-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
    expect(switchBtn.getAttribute("data-format")).toBe("12h");
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");
    expect(screen.getByText("12")).toBeDefined();

    // Inactive side shows digital clock
    expect(screen.getByTestId("inactive-digital-slot")).toBeDefined();
    expect(screen.getByTestId("digital-colon")).toBeDefined();

    fireEvent.click(switchBtn);
    expect(onChangeFormat).toHaveBeenCalledWith("24h");
  });

  it("renders with 24h format when configured", () => {
    const onChangeFormat = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ClockFormatSwitch
            format="24h"
            onChangeFormat={onChangeFormat}
            data-testid="unit-clock-switch-24"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("unit-clock-switch-24");
    expect(switchBtn.getAttribute("data-format")).toBe("24h");
    expect(switchBtn.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText("24")).toBeDefined();

    fireEvent.click(switchBtn);
    expect(onChangeFormat).toHaveBeenCalledWith("12h");
  });

  it("renders blinking colon on hover", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ClockFormatSwitch format="12h" data-testid="hover-clock-switch" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("hover-clock-switch");
    const colon = screen.getByTestId("digital-colon");
    expect(colon).toBeDefined();

    fireEvent.mouseEnter(switchBtn);
    expect(screen.getByTestId("digital-colon")).toBeDefined();

    fireEvent.mouseLeave(switchBtn);
    expect(screen.getByTestId("digital-colon")).toBeDefined();
  });

  it("triggers transit clock during toggle action", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ClockFormatSwitch format="12h" data-testid="transit-switch" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("transit-switch");
    fireEvent.click(switchBtn);

    // During transit, the transit clock is rendered in the thumb
    expect(screen.getByTestId("transit-clock")).toBeDefined();
  });

  it("does not toggle when disabled", () => {
    const onChangeFormat = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ClockFormatSwitch
            disabled={true}
            format="12h"
            onChangeFormat={onChangeFormat}
            data-testid="disabled-clock-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("disabled-clock-switch");
    expect(switchBtn.hasAttribute("disabled")).toBe(true);

    fireEvent.click(switchBtn);
    expect(onChangeFormat).not.toHaveBeenCalled();
  });
});
