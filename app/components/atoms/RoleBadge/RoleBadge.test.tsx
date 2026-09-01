import { describe, it, expect } from "vitest";
import { RoleBadge, getRoleLabelText } from "./RoleBadge";
import {
  getRoleThemeColor,
  getRoleBadgeBorderRadius,
  getRoleBadgeShapeName,
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
    expect(instructorColor.main).toBe(darkTheme.palette.info.main);

    const adminColor = getRoleThemeColor("admin", darkTheme);
    expect(adminColor.main).toBe(darkTheme.palette.secondary.main);
  });

  it("resolves role theme colors using theme palette for light mode without raw colors", () => {
    const studentColor = getRoleThemeColor("student", lightTheme);
    expect(studentColor.main).toBe(lightTheme.palette.success.main);

    const instructorColor = getRoleThemeColor("instructor", lightTheme);
    expect(instructorColor.main).toBe(lightTheme.palette.info.main);

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

  it("resolves exact role-based MD3 shapes (pill for student, ghost for instructor, 9-sided cookie for admin)", () => {
    expect(getRoleBadgeShapeName("student")).toBe("pill");
    expect(getRoleBadgeShapeName("instructor")).toBe("ghost-ish");
    expect(getRoleBadgeShapeName("teacher")).toBe("ghost-ish");
    expect(getRoleBadgeShapeName("admin")).toBe("9-sided-cookie");
    expect(getRoleBadgeShapeName("administrator")).toBe("9-sided-cookie");
    expect(getRoleBadgeShapeName(undefined)).toBe("pill");

    expect(getRoleBadgeBorderRadius("student", false)).toBe("9999px");
    expect(getRoleBadgeBorderRadius("instructor", false)).toBe(
      "12px 12px 4px 4px",
    );
    expect(getRoleBadgeBorderRadius("admin", false)).toBe("8px 3px 8px 3px");
  });
});
