import { describe, it, expect } from "vitest";
import { RoleBadge, getRoleLabelText } from "./RoleBadge";
import {
  getRoleThemeColor,
  getRoleBadgeBorderRadius,
} from "./RoleBadge.styles";
import { darkTheme, lightTheme } from "../../../tokens/theme";

describe("RoleBadge Atom Component & Tokens", () => {
  it("exports RoleBadge component properly", () => {
    expect(RoleBadge).toBeDefined();
    expect(typeof RoleBadge).toBe("object"); // forwardRef component
    expect(RoleBadge.displayName).toBe("RoleBadge");
  });

  it("resolves role theme colors using theme palette for dark mode without raw colors", () => {
    const studentColor = getRoleThemeColor("student", darkTheme);
    expect(studentColor.main).toBe(darkTheme.palette.success.main);

    const instructorColor = getRoleThemeColor("instructor", darkTheme);
    expect(instructorColor.main).toBe(darkTheme.palette.primary.main);

    const adminColor = getRoleThemeColor("admin", darkTheme);
    expect(adminColor.main).toBe(darkTheme.palette.secondary.main);
  });

  it("resolves role theme colors using theme palette for light mode without raw colors", () => {
    const studentColor = getRoleThemeColor("student", lightTheme);
    expect(studentColor.main).toBe(lightTheme.palette.success.main);

    const instructorColor = getRoleThemeColor("instructor", lightTheme);
    expect(instructorColor.main).toBe(lightTheme.palette.primary.main);

    const adminColor = getRoleThemeColor("admin", lightTheme);
    expect(adminColor.main).toBe(lightTheme.palette.secondary.main);
  });

  it("resolves role label text with translation fallbacks", () => {
    const mockT = (_key: string, fallback: string) => fallback;
    expect(getRoleLabelText("student", mockT)).toBe("Student");
    expect(getRoleLabelText("instructor", mockT)).toBe("Instructor");
    expect(getRoleLabelText("admin", mockT)).toBe("Admin");
    expect(getRoleLabelText(undefined, mockT)).toBe("Student");
  });

  it("resolves role-based badge shapes (pill, arch, cookie)", () => {
    expect(getRoleBadgeBorderRadius("student", true)).toBe("11px 4px 11px 4px");
    expect(getRoleBadgeBorderRadius("student", false)).toBe("9999px");
    expect(getRoleBadgeBorderRadius("instructor", true)).toBe(
      "10px 10px 3px 3px",
    );
    expect(getRoleBadgeBorderRadius("admin", true)).toBe("7px 2px 7px 2px");
  });
});
