import { describe, it, expect } from "vitest";
import { DEV_PERSONAS, loginAsPersona } from "./auth";

describe("Authentication Utilities", () => {
  it("defines default dev personas including admin and student", () => {
    const roles = DEV_PERSONAS.map((p) => p.role);
    expect(roles).toContain("admin");
    expect(roles).toContain("student");
    expect(roles).toContain("instructor");
  });

  it("resolves persona login correctly for admin", async () => {
    const user = await loginAsPersona("admin");
    expect(user.role).toBe("admin");
    expect(user.email).toBe("admin@aptispace.internal");
  });

  it("resolves persona login correctly for student", async () => {
    const user = await loginAsPersona("student");
    expect(user.role).toBe("student");
    expect(user.email).toBe("alex.mercer@cadet.aptispace.io");
  });
});
