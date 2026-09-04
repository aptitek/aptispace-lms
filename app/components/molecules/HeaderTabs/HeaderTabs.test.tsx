import { describe, it, expect } from "vitest";
import React from "react";
import HeaderTabs from "./HeaderTabs";
import {
  isTabPermitted,
  resolveVisibleTabs,
  DEFAULT_HEADER_TABS,
} from "./HeaderTabs.config";
import type { AuthUser } from "~/utils/auth";
import type { HeaderTabItem } from "./HeaderTabs.types";

const studentUser: AuthUser = {
  id: "student-1",
  name: "Arthur Dent",
  email: "arthur@galaxy.org",
  role: "student",
};

const adminUser: AuthUser = {
  id: "admin-1",
  name: "Dr. Eleanor Vance",
  email: "admin@galaxy.org",
  role: "admin",
};

const impersonatedUser: AuthUser = {
  id: "student-2",
  name: "Ford Prefect",
  email: "ford@galaxy.org",
  role: "student",
  impersonating: true,
};

describe("HeaderTabs Component & Config", () => {
  it("exports HeaderTabs component", () => {
    expect(HeaderTabs).toBeDefined();
    expect(typeof HeaderTabs).toBe("function");
  });

  it("filters visible tabs for student: only Planning tab", () => {
    const visible = resolveVisibleTabs(DEFAULT_HEADER_TABS, studentUser);
    expect(visible).toHaveLength(1);
    expect(visible[0]?.id).toBe("planning");
  });

  it("filters visible tabs for admin: both Planning and Admin tabs", () => {
    const visible = resolveVisibleTabs(DEFAULT_HEADER_TABS, adminUser);
    expect(visible).toHaveLength(2);
    expect(visible.map((t) => t.id)).toEqual(["planning", "admin"]);
  });

  it("permits admin tab when student user is impersonating", () => {
    const adminTab = DEFAULT_HEADER_TABS.find(
      (t) => t.id === "admin",
    ) as HeaderTabItem;
    expect(isTabPermitted(adminTab, impersonatedUser)).toBe(true);

    const visible = resolveVisibleTabs(DEFAULT_HEADER_TABS, impersonatedUser);
    expect(visible).toHaveLength(2);
  });

  it("denies admin tab for unauthenticated or non-admin user", () => {
    const adminTab = DEFAULT_HEADER_TABS.find(
      (t) => t.id === "admin",
    ) as HeaderTabItem;
    expect(isTabPermitted(adminTab, null)).toBe(false);
    expect(isTabPermitted(adminTab, studentUser)).toBe(false);
  });

  it("creates React element with custom tabs and user props", () => {
    const element = React.createElement(HeaderTabs, {
      user: adminUser,
      tabs: DEFAULT_HEADER_TABS,
    });
    expect(element).toBeDefined();
    expect(element.props.user?.role).toBe("admin");
  });
});
