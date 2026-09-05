import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import Header from "./Header";
import type { AuthUser } from "../../../utils/auth";

const testStudentUser: AuthUser = {
  id: "student-1",
  name: "Arthur Dent",
  email: "arthur@galaxy.org",
  role: "student",
};

const testImpersonatedUser: AuthUser = {
  id: "student-2",
  name: "Ford Prefect",
  email: "ford@galaxy.org",
  role: "student",
  impersonating: true,
};

function renderHeader(props: React.ComponentProps<typeof Header>) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>
        <Header {...props} />
      </ThemeProvider>
    </I18nextProvider>,
  );
}

describe("Header Component", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders with regular student user and shows user avatar trigger and logout button", () => {
    const onLogout = vi.fn();
    renderHeader({
      user: testStudentUser,
      onLogout,
      "data-testid": "app-header",
    });

    const header = screen.getByTestId("app-header");
    expect(header).toBeDefined();

    const avatarTrigger = screen.getByTestId("header-avatar-trigger");
    expect(avatarTrigger).toBeDefined();
    expect(avatarTrigger.getAttribute("aria-label")).toBe("Arthur Dent");
    expect(avatarTrigger.textContent).toContain("AD");

    const logoutBtn = screen.getByTestId("header-logout-button");
    expect(logoutBtn).toBeDefined();
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });

  it("renders with impersonated user and triggers onReturnToAdmin", () => {
    const onReturnToAdmin = vi.fn();
    renderHeader({
      user: testImpersonatedUser,
      onReturnToAdmin,
      "data-testid": "app-header",
    });

    const avatarTrigger = screen.getByTestId("header-avatar-trigger");
    expect(avatarTrigger.getAttribute("aria-label")).toBe("Ford Prefect");

    const returnButton = screen.getByTestId("header-return-admin-btn");
    expect(returnButton).toBeDefined();
    fireEvent.click(returnButton);
    expect(onReturnToAdmin).toHaveBeenCalled();
  });
});
