import { describe, it, expect } from "vitest";
import {
  ROLE_CONFIGS,
  getRoleConfig,
  normalizeRole,
  type RoleType,
} from "./roles";
import { ROLE_COLORS } from "./namedColors";

describe("roles token system (Single Source of Truth)", () => {
  it("defines configuration for student, instructor, and admin", () => {
    const roles: RoleType[] = ["student", "instructor", "admin"];
    roles.forEach((r) => {
      const config = ROLE_CONFIGS[r];
      expect(config).toBeDefined();
      expect(config.key).toBe(r);
      expect(config.color).toBe(ROLE_COLORS[r]);
      expect(config.icon).toBeDefined();
      expect(config.polygonShape).toBeDefined();
    });
  });

  it("configures student with pill avatar and asymmetric status chip", () => {
    const student = getRoleConfig("student");
    expect(student.avatarShape).toBe("pill");
    expect(student.badgeShape).toBe("pill");
    expect(student.statusChipShape).toBe("asymmetric");
    expect(student.color).toBe(ROLE_COLORS.student);
    expect(student.badgeColor).toBe("success");
    expect(student.chipColor).toBe("success");
  });

  it("configures instructor with ghost-ish avatar and arch status chip", () => {
    const instructor = getRoleConfig("instructor");
    expect(instructor.avatarShape).toBe("ghost-ish");
    expect(instructor.badgeShape).toBe("ghost-ish");
    expect(instructor.statusChipShape).toBe("arch");
    expect(instructor.color).toBe(ROLE_COLORS.instructor);
    expect(instructor.badgeColor).toBe("info");
    expect(instructor.chipColor).toBe("info");
  });

  it("configures admin with 9-sided-cookie avatar and bun status chip", () => {
    const admin = getRoleConfig("admin");
    expect(admin.avatarShape).toBe("9-sided-cookie");
    expect(admin.badgeShape).toBe("9-sided-cookie");
    expect(admin.statusChipShape).toBe("bun");
    expect(admin.color).toBe(ROLE_COLORS.admin);
    expect(admin.badgeColor).toBe("secondary");
    expect(admin.chipColor).toBe("secondary");
  });

  it("normalizes alias strings properly", () => {
    expect(normalizeRole("teacher")).toBe("instructor");
    expect(normalizeRole("faculty")).toBe("instructor");
    expect(normalizeRole("administrator")).toBe("admin");
    expect(normalizeRole("STUDENT")).toBe("student");
    expect(normalizeRole("unknown")).toBe("student");
    expect(normalizeRole(null)).toBe("student");
  });
});
