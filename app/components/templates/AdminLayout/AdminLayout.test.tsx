import { describe, it, expect, vi } from "vitest";
import React from "react";
import { AdminLayout } from "./AdminLayout";
import type { AdminLayoutProps } from "./AdminLayout.types";
import type { AuthUser } from "~/utils/auth";

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

  it("creates React element with required props", () => {
    const onLogout = vi.fn();
    const element = React.createElement(
      AdminLayout,
      {
        user: mockUser,
        onLogout,
        tabs: React.createElement("div", null, "Tabs"),
      },
      React.createElement("div", null, "Workspace Content"),
    );

    expect(element).toBeDefined();
    const props = element.props as AdminLayoutProps;
    expect(props.user).toBe(mockUser);
    expect(props.onLogout).toBe(onLogout);
  });
});
