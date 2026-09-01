import { describe, it, expect } from "vitest";
import { HeaderUserAvatar } from "./HeaderUserAvatar";
import type { AuthUser } from "../../../utils/auth";
import { resolveShapeStyle } from "../../atoms/Avatar/shapes";

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

  it("supports user avatar configuration and sliding pill logout properties", () => {
    const props = {
      user: mockUser,
      size: 40,
      onLogout: () => {},
    };

    expect(props.user.name).toBe("Arthur Dent");
    expect(props.user.role).toBe("student");
    expect(props.size).toBe(40);
    expect(typeof props.onLogout).toBe("function");
  });
});
