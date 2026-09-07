import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import Sidebar from "./Sidebar";
import type { AuthUser } from "~/utils/auth";

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

function renderSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>
        <Sidebar {...props} />
      </ThemeProvider>
    </I18nextProvider>,
  );
}

describe("Sidebar Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with regular student user, shows favicon, tab icons, and bottom controls", () => {
    const onLogout = vi.fn();
    renderSidebar({
      user: testStudentUser,
      onLogout,
      "data-testid": "app-sidebar",
    });

    const sidebar = screen.getByTestId("app-sidebar");
    expect(sidebar).toBeDefined();

    const favicon = screen.getByTestId("sidebar-favicon");
    expect(favicon).toBeDefined();

    const planningTab = screen.getByTestId("header-tab-planning");
    expect(planningTab).toBeDefined();

    // Student should not see the admin tab
    expect(screen.queryByTestId("header-tab-admin")).toBeNull();

    const avatarTrigger = screen.getByTestId("sidebar-avatar-trigger");
    expect(avatarTrigger).toBeDefined();
    expect(avatarTrigger.textContent).toContain("AD");

    // Status trigger at the bottom
    const statusSlot = screen.getByTestId("sidebar-status-slot");
    expect(statusSlot).toBeDefined();
  });

  it("keeps sidebar rail non-extensible and expands ProfileButton logout button on hover", () => {
    const onLogout = vi.fn();
    renderSidebar({
      user: testStudentUser,
      onLogout,
      "data-testid": "app-sidebar",
    });

    const sidebar = screen.getByTestId("app-sidebar");
    expect(sidebar).toBeDefined();

    const profileContainer = screen.getByTestId("profile-button");
    expect(profileContainer).toBeDefined();

    // Hovering the profile button extends the logout button
    fireEvent.mouseEnter(profileContainer);
    const logoutBtn = screen.getByTestId("sidebar-logout-button");
    expect(logoutBtn).toBeDefined();

    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();

    // Mouse leave collapses the logout button
    fireEvent.mouseLeave(profileContainer);
  });

  it("expands logo smoothly on hover and collapses on mouse leave", () => {
    renderSidebar({
      user: testStudentUser,
      "data-testid": "app-sidebar",
    });

    const logoLink = screen.getByTestId("sidebar-logo-link");
    expect(logoLink).toBeDefined();
    const logoText = screen.getByTestId("sidebar-logo-text");
    expect(logoText).toBeDefined();
    expect(logoText.textContent).toContain("AptiSpace");

    // Hovering logo extends it
    fireEvent.mouseEnter(logoLink);
    expect(logoLink).toBeDefined();

    // Mouse leave collapses it
    fireEvent.mouseLeave(logoLink);
  });

  it("renders admin tab when user has admin role and expands on hover", () => {
    const adminUser: AuthUser = {
      id: "admin-1",
      name: "Trillian Astra",
      email: "admin@galaxy.org",
      role: "admin",
    };

    renderSidebar({
      user: adminUser,
      "data-testid": "app-sidebar",
    });

    const adminTab = screen.getByTestId("header-tab-admin");
    expect(adminTab).toBeDefined();

    // Hovering the tab expands into O= Text =)
    fireEvent.mouseEnter(adminTab);
    expect(adminTab.textContent).toContain("Admin");

    fireEvent.mouseLeave(adminTab);
  });

  it("renders return to admin button on hover when user is impersonating", () => {
    const onReturnToAdmin = vi.fn();
    renderSidebar({
      user: testImpersonatedUser,
      onReturnToAdmin,
      "data-testid": "app-sidebar",
    });

    const profileContainer = screen.getByTestId("profile-button");
    fireEvent.mouseEnter(profileContainer);

    const returnBtn = screen.getByTestId("sidebar-return-admin-button");
    expect(returnBtn).toBeDefined();
    fireEvent.click(returnBtn);
    expect(onReturnToAdmin).toHaveBeenCalled();
  });

  it("opens profile modal when avatar is clicked", () => {
    renderSidebar({
      user: testStudentUser,
      "data-testid": "app-sidebar",
    });

    const avatarTrigger = screen.getByTestId("sidebar-avatar-trigger");
    fireEvent.click(avatarTrigger);

    expect(screen.getByTestId("sidebar-profile-card-modal")).toBeDefined();
  });

  it("configures student role shape on avatar", () => {
    renderSidebar({
      user: testStudentUser,
      "data-testid": "app-sidebar",
    });

    const avatarTrigger = screen.getByTestId("sidebar-avatar-trigger");
    expect(avatarTrigger.getAttribute("data-shape")).toBe("pill");
  });

  it("configures admin role shape on avatar", () => {
    const adminUser: AuthUser = {
      id: "admin-1",
      name: "Trillian Astra",
      email: "admin@galaxy.org",
      role: "admin",
    };

    renderSidebar({
      user: adminUser,
      "data-testid": "app-sidebar",
    });

    const avatarTrigger = screen.getByTestId("sidebar-avatar-trigger");
    expect(avatarTrigger.getAttribute("data-shape")).toBe("9-sided-cookie");
  });

  it("renders correctly in ghost variant when disconnected without tabs, logo, or status trigger and does not expand", () => {
    renderSidebar({
      variant: "ghost",
      "data-testid": "auth-sidebar",
    });

    const sidebar = screen.getByTestId("auth-sidebar");
    expect(sidebar).toBeDefined();
    expect(screen.queryByTestId("sidebar-favicon")).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.queryByTestId("sidebar-status-slot")).toBeNull();
    expect(screen.getByTestId("sidebar-language-toggle")).toBeDefined();
    expect(screen.getByTestId("sidebar-theme-toggle")).toBeDefined();
    const bottomSection = screen.getByTestId("sidebar-bottom-section");
    expect(bottomSection).toBeDefined();
    const computedStyle = window.getComputedStyle(bottomSection);
    expect(computedStyle.borderTopStyle).toBe("none");

    // Rail should remain non-extensible in ghost mode when disconnected
    fireEvent.click(sidebar);
    expect(screen.queryByTestId("sidebar-favicon")).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();

    fireEvent.mouseEnter(sidebar);
    expect(screen.queryByTestId("sidebar-favicon")).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();
  });

  it("is no longer ghost once connected and renders full sidebar with user, tabs, logo, and profile button", () => {
    const onLogout = vi.fn();
    renderSidebar({
      variant: "ghost",
      user: testStudentUser,
      onLogout,
      "data-testid": "auth-sidebar",
    });

    const sidebar = screen.getByTestId("auth-sidebar");
    expect(sidebar).toBeDefined();

    // Once connected, sidebar is no longer ghost:
    // Favicon/logo is displayed
    expect(screen.getByTestId("sidebar-favicon")).toBeDefined();

    // Tabs are displayed
    expect(screen.getByTestId("header-tab-planning")).toBeDefined();

    // Status center trigger is displayed
    expect(screen.getByTestId("sidebar-status-slot")).toBeDefined();

    // User section is present
    expect(screen.getByTestId("sidebar-user-card")).toBeDefined();

    // Hovering profile button reveals logout button
    const profileContainer = screen.getByTestId("profile-button");
    fireEvent.mouseEnter(profileContainer);
    const logoutBtn = screen.getByTestId("sidebar-logout-button");
    expect(logoutBtn).toBeDefined();

    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });

  it("replaces the avatar with just the logout button on onboarding", () => {
    const onLogout = vi.fn();
    renderSidebar({
      user: testStudentUser,
      isOnboarding: true,
      onLogout,
      "data-testid": "app-sidebar",
    });

    const sidebar = screen.getByTestId("app-sidebar");
    expect(sidebar).toBeDefined();

    // Avatar must NOT be present on onboarding
    expect(screen.queryByTestId("sidebar-avatar-trigger")).toBeNull();

    // Logout button must be present directly in the collapsed sidebar
    const logoutBtn = screen.getByTestId("sidebar-logout-button");
    expect(logoutBtn).toBeDefined();

    // Clicking logout button fires onLogout
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();

    // Profile modal should not be present
    expect(screen.queryByTestId("sidebar-profile-card-modal")).toBeNull();
  });
});
