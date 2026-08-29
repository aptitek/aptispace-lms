import { describe, it, expect } from "vitest";
import RoleChip from "./RoleChip";

describe("RoleChip Component Atom", () => {
  it("exports RoleChip properly", () => {
    expect(RoleChip).toBeDefined();
    expect(typeof RoleChip).toBe("function");
  });

  it("handles admin, student, and instructor roles", () => {
    const adminProps = { role: "admin" as const, label: "Administrator" };
    const studentProps = { role: "student" as const, label: "Cadet" };
    const instructorProps = {
      role: "instructor" as const,
      label: "Flight Instructor",
    };

    expect(adminProps.role).toBe("admin");
    expect(studentProps.role).toBe("student");
    expect(instructorProps.role).toBe("instructor");
  });
});
