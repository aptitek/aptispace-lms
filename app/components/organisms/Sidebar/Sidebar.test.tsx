import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
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
    vi.useRealTimers();
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

  it("waits for hover delay before extending and cancels if mouse leaves early", () => {
    vi.useFakeTimers();
    const onLogout = vi.fn();
    renderSidebar({
      user: testStudentUser,
      onLogout,
      hoverDelay: 1200,
      "data-testid": "app-sidebar",
    });

    const sidebar = screen.getByTestId("app-sidebar");

    // Mouse enters: immediately, it should NOT be extended yet
    fireEvent.mouseEnter(sidebar);
    expect(screen.queryByTestId("sidebar-logout-button")).toBeNull();

    // Mouse leaves after 400ms (before 1200ms delay)
    act(() => {
      vi.advanceTimersByTime(400);
    });
    fireEvent.mouseLeave(sidebar);

    // Fast-forward past 1200ms: still should NOT be extended
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.queryByTestId("sidebar-logout-button")).toBeNull();

    // Now mouse enters and stays for full delay
    fireEvent.mouseEnter(sidebar);
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // Now it should be extended!
    const logoutBtn = screen.getByTestId("sidebar-logout-button");
    expect(logoutBtn).toBeDefined();
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });

  it("extends immediately on click without waiting for hover delay and collapses on click outside", () => {
    vi.useFakeTimers();
    renderSidebar({
      user: testStudentUser,
      hoverDelay: 2000,
      "data-testid": "app-sidebar",
    });

    const sidebar = screen.getByTestId("app-sidebar");

    // Initially collapsed
    expect(screen.queryByTestId("sidebar-logout-button")).toBeNull();

    // Clicking rail immediately extends it!
    fireEvent.click(sidebar);
    expect(screen.getByTestId("sidebar-logout-button")).toBeDefined();

    // Clicking outside collapses it back
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId("sidebar-logout-button")).toBeNull();
  });

  it("renders admin tab when user has admin role", () => {
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
  });

  it("renders return to admin button when user is impersonating", () => {
    const onReturnToAdmin = vi.fn();
    renderSidebar({
      user: testImpersonatedUser,
      onReturnToAdmin,
      hoverDelay: 0,
      "data-testid": "app-sidebar",
    });

    const sidebar = screen.getByTestId("app-sidebar");
    fireEvent.mouseEnter(sidebar);

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

  it("renders role badge for student user when extended", () => {
    renderSidebar({
      user: testStudentUser,
      hoverDelay: 0,
      "data-testid": "app-sidebar",
    });

    const sidebar = screen.getByTestId("app-sidebar");
    fireEvent.mouseEnter(sidebar);

    const roleBadge = screen.getByTestId("sidebar-user-role-badge");
    expect(roleBadge).toBeDefined();
    expect(roleBadge.textContent).toContain("STUDENT");
    expect(screen.getByTestId("role-icon-student")).toBeDefined();
  });

  it("renders role badge for admin user when extended", () => {
    const adminUser: AuthUser = {
      id: "admin-1",
      name: "Trillian Astra",
      email: "admin@galaxy.org",
      role: "admin",
    };

    renderSidebar({
      user: adminUser,
      hoverDelay: 0,
      "data-testid": "app-sidebar",
    });

    const sidebar = screen.getByTestId("app-sidebar");
    fireEvent.mouseEnter(sidebar);

    const roleBadge = screen.getByTestId("sidebar-user-role-badge");
    expect(roleBadge).toBeDefined();
    expect(roleBadge.textContent).toContain("ADMIN");
    expect(screen.getByTestId("role-icon-admin")).toBeDefined();
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

    // Clicking rail should NOT expand sidebar in ghost mode when disconnected
    fireEvent.click(sidebar);
    expect(screen.queryByTestId("sidebar-favicon")).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();

    // Hovering rail should NOT expand sidebar in ghost mode when disconnected
    fireEvent.mouseEnter(sidebar);
    expect(screen.queryByTestId("sidebar-favicon")).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();
  });

  it("is no longer ghost once connected and renders full sidebar with user, tabs, logo, and expands", () => {
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

    // Clicking rail extends sidebar and reveals logout button & role badge
    fireEvent.click(sidebar);
    const logoutBtn = screen.getByTestId("sidebar-logout-button");
    expect(logoutBtn).toBeDefined();
    expect(screen.getByTestId("sidebar-user-role-badge")).toBeDefined();

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
