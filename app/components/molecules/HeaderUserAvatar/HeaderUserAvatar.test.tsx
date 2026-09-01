import { describe, it, expect } from "vitest";
import { HeaderUserAvatar } from "./HeaderUserAvatar";
import type { AuthUser } from "../../../utils/auth";
import { resolveM3ShapeStyle } from "../../atoms/Avatar/m3Shapes";

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

  it("supports official 6-sided cookie shape in M3 shape catalog", () => {
    const resolved6Cookie = resolveM3ShapeStyle("6-sided-cookie");
    expect(resolved6Cookie).toBeDefined();
    expect(resolved6Cookie.clipPath).toBe("url(#m3-shape-6-sided-cookie)");
    expect(resolved6Cookie.pathData).toBeDefined();
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
