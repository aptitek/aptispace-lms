import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { ProfileButton } from "./ProfileButton";
import { getProfileRoleColor } from "./ProfileButton.styles";
import type { AuthUser } from "~/utils/auth";
import { resolveShapeStyle } from "~/tokens/shapes";
import { darkTheme } from "~/tokens/theme";

const mockUser: AuthUser = {
  id: "user-123",
  name: "Arthur Dent",
  email: "arthur@galaxy.org",
  role: "student",
};

const mockAdminUser: AuthUser = {
  id: "user-admin",
  name: "Ford Prefect",
  email: "ford@galaxy.org",
  role: "admin",
  impersonating: true,
};

import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("ProfileButton Molecule (MD3 Morphing Avatar & Logout Button)", () => {
  afterEach(() => {
    cleanup();
  });
  it("exports ProfileButton properly", () => {
    expect(ProfileButton).toBeDefined();
    expect(typeof ProfileButton).toBe("function");
    expect(ProfileButton.name).toBe("ProfileButton");
  });

  it("supports role-based expressive shapes in avatar shape catalog", () => {
    const resolvedPill = resolveShapeStyle("pill");
    expect(resolvedPill).toBeDefined();
    expect(resolvedPill.clipPath).toBe("url(#avatar-shape-pill)");

    const resolvedGhost = resolveShapeStyle("ghost-ish");
    expect(resolvedGhost).toBeDefined();
    expect(resolvedGhost.clipPath).toBe("url(#avatar-shape-ghost-ish)");

    const resolvedCookie = resolveShapeStyle("9-sided-cookie");
    expect(resolvedCookie).toBeDefined();
    expect(resolvedCookie.clipPath).toBe("url(#avatar-shape-9-sided-cookie)");
  });

  it("resolves role colors appropriately for admin, instructor, and student", () => {
    expect(mockUser.role).toBe("student");
    expect(getProfileRoleColor("admin", darkTheme)).toBe(
      darkTheme.palette.roles.admin,
    );
    expect(getProfileRoleColor("instructor", darkTheme)).toBe(
      darkTheme.palette.roles.instructor,
    );
    expect(getProfileRoleColor("student", darkTheme)).toBe(
      darkTheme.palette.roles.student,
    );
  });

  it("renders default variant with avatar trigger and user initials", () => {
    const onAvatarClick = vi.fn();
    renderWithTheme(
      <ProfileButton
        user={mockUser}
        onAvatarClick={onAvatarClick}
        avatarTestId="test-avatar-trigger"
      />,
    );

    const trigger = screen.getByTestId("test-avatar-trigger");
    expect(trigger).toBeDefined();
    expect(trigger.textContent).toContain("AD");

    fireEvent.click(trigger);
    expect(onAvatarClick).toHaveBeenCalledTimes(1);
  });

  it("renders logout-only variant without avatar trigger and calls onLogout", () => {
    const onLogout = vi.fn();
    renderWithTheme(
      <ProfileButton
        user={mockUser}
        variant="logoutOnly"
        onLogout={onLogout}
        actionTestId="test-logout-btn"
        avatarTestId="test-avatar-trigger"
      />,
    );

    expect(screen.queryByTestId("test-avatar-trigger")).toBeNull();

    const logoutBtn = screen.getByTestId("test-logout-btn");
    expect(logoutBtn).toBeDefined();

    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("calls onReturnToAdmin when impersonating in logout-only variant", () => {
    const onReturnToAdmin = vi.fn();
    const onLogout = vi.fn();
    renderWithTheme(
      <ProfileButton
        user={mockAdminUser}
        variant="logoutOnly"
        onLogout={onLogout}
        onReturnToAdmin={onReturnToAdmin}
        actionTestId="test-return-admin-btn"
      />,
    );

    const returnBtn = screen.getByTestId("test-return-admin-btn");
    expect(returnBtn).toBeDefined();
    expect(returnBtn.getAttribute("data-action")).toBe("return-to-admin");

    fireEvent.click(returnBtn);
    expect(onReturnToAdmin).toHaveBeenCalledTimes(1);
    expect(onLogout).not.toHaveBeenCalled();
  });

  it("falls back to initials when avatar image fails to load", () => {
    const userWithImage = {
      ...mockUser,
      name: "Sarah Connor",
      avatarUrl: "https://example.com/broken.jpg",
    };

    renderWithTheme(
      <ProfileButton
        user={userWithImage}
        variant="default"
        avatarTestId="test-avatar-trigger"
      />,
    );

    const trigger = screen.getByTestId("test-avatar-trigger");
    const img = trigger.querySelector("img");
    expect(img).not.toBeNull();

    // Trigger image error
    fireEvent.error(img!);

    // Should switch from img to initials "SC", not "Sarah Connor"
    expect(trigger.querySelector("img")).toBeNull();
    expect(trigger.textContent).toContain("SC");
    expect(trigger.textContent).not.toContain("Sarah");
  });

  it("falls back to solarized MDI user icon when default GitHub avatar is supplied", () => {
    const userWithDefaultGithub = {
      ...mockUser,
      name: "Cadet Elena",
      avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4",
    };

    const { container } = renderWithTheme(
      <ProfileButton
        user={userWithDefaultGithub}
        variant="default"
        avatarTestId="test-avatar-trigger-default"
      />,
    );

    const trigger = container.querySelector(
      '[data-testid="test-avatar-trigger-default"]',
    );
    expect(trigger).not.toBeNull();
    // Should NOT render an <img> element
    expect(trigger!.querySelector("img")).toBeNull();
    // Should render MDI placeholder fallback, NOT initials
    expect(
      trigger!.querySelector('[data-testid="profile-mdi-placeholder"]'),
    ).not.toBeNull();
  });
});
