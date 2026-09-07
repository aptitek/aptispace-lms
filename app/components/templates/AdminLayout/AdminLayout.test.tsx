import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import { AdminLayout } from "./AdminLayout";
import type { AuthUser } from "~/utils/auth";

afterEach(cleanup);

describe("AdminLayout Template", () => {
  const mockUser: AuthUser = {
    id: "admin-1",
    name: "Ada Lovelace",
    email: "admin@aptispace.test",
    role: "admin",
    firstName: "Ada",
    familyName: "Lovelace",
  };

  it("exports component properly", () => {
    expect(AdminLayout).toBeDefined();
    expect(typeof AdminLayout).toBe("function");
  });

  it("renders with tabs and child workspace content", () => {
    const onLogout = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <AdminLayout
          user={mockUser}
          onLogout={onLogout}
          tabs={<div data-testid="mock-tabs">Admin Tabs</div>}
        >
          <div data-testid="mock-workspace">Admin Workspace Content</div>
        </AdminLayout>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("admin-layout-root")).toBeDefined();
    expect(screen.getByTestId("mock-tabs")).toBeDefined();
    expect(screen.getByText("Admin Tabs")).toBeDefined();
    expect(screen.getByTestId("mock-workspace")).toBeDefined();
    expect(screen.getByText("Admin Workspace Content")).toBeDefined();
  });
});
