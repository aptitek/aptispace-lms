import { describe, it, expect } from "vitest";
import { HeaderUserAvatar } from "./HeaderUserAvatar";
import { getHeaderRoleColor } from "./HeaderUserAvatar.styles";
import type { AuthUser } from "../../../utils/auth";
import { resolveShapeStyle } from "~/tokens/shapes";

import { darkTheme } from "../../../tokens/theme";

const mockUser: AuthUser = {
  id: "user-123",
  name: "Arthur Dent",
  email: "arthur@galaxy.org",
  role: "student",
};

describe("HeaderUserAvatar Molecule (MD3 Sliding Pill)", () => {
  it("exports HeaderUserAvatar component properly", () => {
    expect(HeaderUserAvatar).toBeDefined();
    expect(typeof HeaderUserAvatar).toBe("function");
    expect(HeaderUserAvatar.name).toBe("HeaderUserAvatar");
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
    expect(getHeaderRoleColor("admin", darkTheme)).toBe(
      darkTheme.palette.roles.admin,
    );
    expect(getHeaderRoleColor("instructor", darkTheme)).toBe(
      darkTheme.palette.roles.instructor,
    );
    expect(getHeaderRoleColor("student", darkTheme)).toBe(
      darkTheme.palette.roles.student,
    );
  });
});
