import { describe, it, expect } from "vitest";
import {
  loginAsPersona,
  loginAsAccount,
  resolveActiveUser,
  stopImpersonation,
} from "./auth";

describe("Authentication Utilities", () => {
  it("resolves active user correctly with fallback to User", () => {
    const user = resolveActiveUser(null, {
      userId: "test-user-1",
      role: "student",
    });
    expect(user?.name).toBe("User");
    expect(user?.role).toBe("student");
    expect(user?.email).toBe("user@aptitek.io");
  });

  it("resolves persona login correctly for admin", async () => {
    const user = await loginAsPersona("admin");
    expect(user.role).toBe("admin");
    expect(user.email).toBe("admin@aptitek.io");
  });

  it("resolves persona login correctly for student", async () => {
    const user = await loginAsPersona("student");
    expect(user.role).toBe("student");
    expect(user.email).toBe("student@aptitek.io");
  });

  it("logs in directly with custom account details", async () => {
    const user = await loginAsAccount({
      id: "custom-id-123",
      name: "Alice Smith",
      email: "alice@aptitek.io",
      role: "instructor",
    });
    expect(user.id).toBe("custom-id-123");
    expect(user.name).toBe("Alice Smith");
    expect(user.role).toBe("instructor");
  });

  it("exports stopImpersonation function", () => {
    expect(stopImpersonation).toBeDefined();
    expect(typeof stopImpersonation).toBe("function");
  });
});
