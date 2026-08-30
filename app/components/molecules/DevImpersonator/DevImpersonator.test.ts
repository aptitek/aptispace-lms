import { describe, it, expect } from "vitest";
import DevImpersonator from "./DevImpersonator";
import {
  DEV_PERSONAS,
  createAccountInDb,
  getInitialFallbackAccounts,
  loginAsAccount,
  loginAsPersona,
} from "~/utils/auth";

describe("DevImpersonator Molecule & Auth Utilities", () => {
  it("exports DevImpersonator component properly", () => {
    expect(DevImpersonator).toBeDefined();
    expect(typeof DevImpersonator).toBe("function");
  });

  it("exports initial fallback accounts and default personas", () => {
    expect(DEV_PERSONAS).toHaveLength(3);
    const initialAccounts = getInitialFallbackAccounts();
    expect(initialAccounts.length).toBeGreaterThanOrEqual(3);

    const admin = initialAccounts.find((a) => a.role === "admin");
    const instructor = initialAccounts.find((a) => a.role === "instructor");
    const student = initialAccounts.find((a) => a.role === "student");

    expect(admin).toBeDefined();
    expect(instructor).toBeDefined();
    expect(student).toBeDefined();
  });

  it("creates in-memory accounts with pending onboarding status", async () => {
    const newStudent = await createAccountInDb("student");
    expect(newStudent.id).toBeDefined();
    expect(newStudent.role).toBe("student");
    expect(newStudent.isProfileComplete).toBe(false);

    const newAdmin = await createAccountInDb("admin");
    expect(newAdmin.role).toBe("admin");
    expect(newAdmin.isProfileComplete).toBe(false);

    const newInstructor = await createAccountInDb("instructor");
    expect(newInstructor.role).toBe("instructor");
    expect(newInstructor.isProfileComplete).toBe(false);
  });

  it("resolves loginAsAccount with target account credentials", async () => {
    const authUser = await loginAsAccount({
      id: "test-user-id",
      name: "Cmdr. Test",
      email: "test@aptispace.io",
      role: "instructor",
    });

    expect(authUser.id).toBe("test-user-id");
    expect(authUser.role).toBe("instructor");
    expect(authUser.name).toBe("Cmdr. Test");
  });

  it("resolves loginAsPersona with fallback persona role", async () => {
    const authUser = await loginAsPersona("admin");
    expect(authUser.role).toBe("admin");
    expect(authUser.name).toBe("Dr. Eleanor Vance");
  });
});
