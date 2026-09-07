import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import AuthLayout from "./AuthLayout";

// Mock Galaxy to avoid WebGL context dependency in happy-dom
vi.mock("~/components/organisms/Galaxy/Galaxy", () => ({
  default: () => <div data-testid="galaxy-mock" />,
}));

describe("AuthLayout Template", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("exports AuthLayout component", () => {
    expect(AuthLayout).toBeDefined();
    expect(typeof AuthLayout).toBe("function");
  });

  it("renders children, auth-sidebar, and galaxy background by default", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AuthLayout>
            <div data-testid="auth-card">Login Form</div>
          </AuthLayout>
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.getByTestId("auth-card")).toBeDefined();
    expect(screen.getByText("Login Form")).toBeDefined();
    expect(screen.getByTestId("auth-sidebar")).toBeDefined();
    expect(screen.getByTestId("galaxy-mock")).toBeDefined();
  });

  it("does not render galaxy when showGalaxy is false", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AuthLayout showGalaxy={false}>
            <div data-testid="auth-card">Login Form</div>
          </AuthLayout>
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.getByTestId("auth-card")).toBeDefined();
    expect(screen.queryByTestId("galaxy-mock")).toBeNull();
  });

  it("renders headerChildren inside the header when provided", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AuthLayout
            headerChildren={<span data-testid="extra-header-item">Extra</span>}
          >
            <div>Card</div>
          </AuthLayout>
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.getByTestId("extra-header-item")).toBeDefined();
  });

  it("renders non-ghost sidebar when user is connected", () => {
    const testUser = {
      id: "u-1",
      name: "Arthur Dent",
      email: "arthur@galaxy.org",
      role: "student" as const,
    };

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AuthLayout user={testUser}>
            <div>Card</div>
          </AuthLayout>
        </ThemeProvider>
      </I18nextProvider>,
    );

    // Connected user in AuthLayout renders full sidebar with favicon, tabs, status slot
    expect(screen.getByTestId("sidebar-favicon")).toBeDefined();
    expect(screen.getByTestId("header-tab-planning")).toBeDefined();
    expect(screen.getByTestId("sidebar-status-slot")).toBeDefined();
  });

  it("replaces avatar with logout button when isOnboarding is true", () => {
    const testUser = {
      id: "u-1",
      name: "Arthur Dent",
      email: "arthur@galaxy.org",
      role: "student" as const,
    };
    const onLogout = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AuthLayout user={testUser} isOnboarding={true} onLogout={onLogout}>
            <div>Card</div>
          </AuthLayout>
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.queryByTestId("sidebar-avatar-trigger")).toBeNull();
    const logoutBtn = screen.getByTestId("sidebar-logout-button");
    expect(logoutBtn).toBeDefined();
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });
});
