import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import DevImpersonator from "./DevImpersonator";
import {
  createAccountInDb,
  fetchAccountsFromDb,
  getRoleLabel,
  getRoleTitle,
  loginAsAccount,
  loginAsPersona,
} from "~/utils/auth";

describe("DevImpersonator Molecule & Auth Utilities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("exports DevImpersonator component properly", () => {
    expect(DevImpersonator).toBeDefined();
    expect(typeof DevImpersonator).toBe("function");
  });

  it("mounts DevImpersonator in DOM and renders action buttons", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <DevImpersonator />
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.getByTestId("create-student-btn")).toBeDefined();
    expect(screen.getByTestId("create-instructor-btn")).toBeDefined();
    expect(screen.getByTestId("create-admin-btn")).toBeDefined();
  });

  it("formats role labels and titles correctly", () => {
    expect(getRoleLabel("admin")).toBe("Admin");
    expect(getRoleLabel("instructor")).toBe("Instructor");
    expect(getRoleLabel("student")).toBe("Student");

    expect(getRoleTitle("student", false)).toContain("Onboarding Pending");
    expect(getRoleTitle("admin", true)).toBe("System Administrator");
    expect(getRoleTitle("instructor", true)).toBe("Instructor");
    expect(getRoleTitle("student", true)).toBe("Student");
  });

  it("fetches accounts from API via fetchAccountsFromDb", async () => {
    const mockAccounts = [
      {
        id: "user-1",
        name: "Alice Smith",
        email: "alice.smith@aptitek.io",
        role: "student" as const,
        badge: "Student",
        title: "Student",
        isProfileComplete: true,
      },
    ];

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accounts: mockAccounts }),
    } as unknown as Response);

    const accounts = await fetchAccountsFromDb();
    expect(accounts).toEqual(mockAccounts);
  });

  it("creates accounts via createAccountInDb", async () => {
    const mockCreated = {
      id: "user-new-123",
      name: "New Student (Pending Onboarding)",
      firstName: "",
      lastName: "",
      email: "",
      role: "student" as const,
      badge: "Student",
      title: "Onboarding Pending • Unconfigured Profile",
      isProfileComplete: false,
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ account: mockCreated }),
    } as unknown as Response);

    const result = await createAccountInDb("student");
    expect(result).toEqual(mockCreated);
  });

  it("resolves loginAsAccount with target account credentials", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: "test-user-id",
          name: "Professor Test",
          email: "test@aptitek.io",
          role: "instructor",
        },
      }),
    } as unknown as Response);

    const authUser = await loginAsAccount({
      id: "test-user-id",
      name: "Professor Test",
      email: "test@aptitek.io",
      role: "instructor",
    });

    expect(authUser.id).toBe("test-user-id");
    expect(authUser.role).toBe("instructor");
    expect(authUser.name).toBe("Professor Test");
  });

  it("resolves loginAsPersona with fallback persona role", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: "admin-1",
          name: "Admin User",
          email: "admin@aptispace.com",
          role: "admin",
        },
      }),
    } as unknown as Response);

    const authUser = await loginAsPersona("admin");
    expect(authUser.role).toBe("admin");
    expect(authUser.name).toBe("Admin User");
  });
});
