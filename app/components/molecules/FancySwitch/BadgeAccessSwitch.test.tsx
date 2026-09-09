import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import { BadgeAccessSwitch } from "./index";

describe("BadgeAccessSwitch Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders locked mode with closed padlock and closed door by default", () => {
    const onChangeStatus = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <BadgeAccessSwitch
            status="locked"
            onChangeStatus={onChangeStatus}
            data-testid="unit-badge-access-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("unit-badge-access-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
    expect(switchBtn.getAttribute("data-status")).toBe("locked");
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");
    expect(screen.getByTestId("lock-closed-glyph")).toBeDefined();
    expect(screen.getByTestId("door-front-closed-icon")).toBeDefined();

    fireEvent.click(switchBtn);
    expect(onChangeStatus).toHaveBeenCalledWith("unlocked");
  });

  it("renders unlocked mode with open padlock and open door", () => {
    const onChangeStatus = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <BadgeAccessSwitch
            status="unlocked"
            onChangeStatus={onChangeStatus}
            data-testid="unlocked-badge-access-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("unlocked-badge-access-switch");
    expect(switchBtn.getAttribute("data-status")).toBe("unlocked");
    expect(switchBtn.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByTestId("lock-open-glyph")).toBeDefined();
    expect(screen.getByTestId("meeting-room-open-icon")).toBeDefined();

    fireEvent.click(switchBtn);
    expect(onChangeStatus).toHaveBeenCalledWith("locked");
  });

  it("shows peeking badge companion on hover", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <BadgeAccessSwitch status="locked" data-testid="hover-badge-switch" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("hover-badge-switch");
    const badge = screen.getByTestId("peeking-badge");
    expect(badge).toBeDefined();

    fireEvent.mouseEnter(switchBtn);
    expect(screen.getByTestId("peeking-badge-icon")).toBeDefined();

    fireEvent.mouseLeave(switchBtn);
    expect(screen.getByTestId("peeking-badge")).toBeDefined();
  });

  it("renders holographic contactless NFC reader", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <BadgeAccessSwitch status="locked" data-testid="nfc-badge-switch" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.getByTestId("holo-nfc-icon")).toBeDefined();
  });

  it("does not toggle when disabled", () => {
    const onChangeStatus = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <BadgeAccessSwitch
            disabled={true}
            status="locked"
            onChangeStatus={onChangeStatus}
            data-testid="disabled-badge-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("disabled-badge-switch");
    expect(switchBtn.hasAttribute("disabled")).toBe(true);

    fireEvent.click(switchBtn);
    expect(onChangeStatus).not.toHaveBeenCalled();
  });
});
