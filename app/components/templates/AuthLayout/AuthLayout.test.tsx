import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
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

  it("renders children, header, footer, and galaxy background by default", () => {
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
});
