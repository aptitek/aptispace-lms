import { describe, it, expect } from "vitest";
import React from "react";
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

describe("Header Component", () => {
  it("exports Header component", () => {
    expect(Header).toBeDefined();
    expect(typeof Header).toBe("function");
  });

  it("renders with regular student user", () => {
    const element = React.createElement(Header, {
      user: testStudentUser,
    });
    expect(element).toBeDefined();
    expect(element.props.user?.role).toBe("student");
    expect(element.props.user?.impersonating).toBeFalsy();
  });

  it("renders with impersonated user and handles return to admin", () => {
    const onReturnToAdmin = () => {};
    const element = React.createElement(Header, {
      user: testImpersonatedUser,
      onReturnToAdmin,
    });
    expect(element).toBeDefined();
    expect(element.props.user?.impersonating).toBe(true);
    expect(element.props.onReturnToAdmin).toBe(onReturnToAdmin);
  });
});
