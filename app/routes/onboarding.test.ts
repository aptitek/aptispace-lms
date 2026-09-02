import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("~/components/templates/AuthLayout/AuthLayout", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("~/components/molecules/EditableAvatar/EditableAvatar", () => ({
  default: () => null,
}));

import { action, CADET_FIXED_DOMAIN } from "./onboarding";

function createActionArgs(request: Request) {
  return {
    request,
    context: {},
    params: {},
  } as unknown as Parameters<typeof action>[0];
}

describe("Onboarding Route Security - Domain Enforcement", () => {
  it("defines the secure institutional domain constant", () => {
    expect(CADET_FIXED_DOMAIN).toBe("aptitek.io");
  });

  describe("Free Domain (Aptitek)", () => {
    it("successfully accepts personal emails with any valid domain", async () => {
      const personalEmails = [
        "john.doe@gmail.com",
        "alex.rider@custom.org",
        "dev@aptitek.io",
      ];

      for (const email of personalEmails) {
        const formData = new FormData();
        formData.set("email", email);
        formData.set("schoolId", "school-aptitek");

        const request = new Request("http://localhost:3000/onboarding", {
          method: "POST",
          body: formData,
        });

        const response = await action(createActionArgs(request));
        expect(response.status).toBe(200);
        const body = (await response.json()) as {
          success: boolean;
          email: string;
        };
        expect(body.success).toBe(true);
        expect(body.email).toBe(email);
      }
    });

    it("rejects emails with invalid format or multiple @ symbols", async () => {
      const invalidEmails = ["nodomain", "user@evil@attacker.com"];

      for (const email of invalidEmails) {
        const formData = new FormData();
        formData.set("email", email);
        formData.set("schoolId", "school-aptitek");

        const request = new Request("http://localhost:3000/onboarding", {
          method: "POST",
          body: formData,
        });

        const response = await action(createActionArgs(request));
        expect(response.status).toBe(400);
        const body = (await response.json()) as { code: string; error: string };
        expect(body.code).toBe("UNAUTHORIZED_EMAIL_DOMAIN");
      }
    });
  });

  describe("Fixed Domain (school-42)", () => {
    it("strictly REJECTS submissions with unauthorized domains for fixed-domain institutions", async () => {
      const unauthorizedEmails = [
        "user@evil.com",
        "hacker@attacker.org",
        "user@gmail.com",
        "user@aptitek.io",
      ];

      for (const email of unauthorizedEmails) {
        const formData = new FormData();
        formData.set("email", email);
        formData.set("schoolId", "school-42");

        const request = new Request("http://localhost:3000/onboarding", {
          method: "POST",
          body: formData,
        });

        const response = await action(createActionArgs(request));
        expect(response.status).toBe(400);
        const body = (await response.json()) as { code: string; error: string };
        expect(body.code).toBe("UNAUTHORIZED_EMAIL_DOMAIN");
        expect(body.error).toContain("Security Violation: Unauthorized domain");
      }
    });

    it("accepts bare username prefix and formats it with the authorized fixed domain", async () => {
      const formData = new FormData();
      formData.set("email", "john.doe");
      formData.set("schoolId", "school-42");

      const request = new Request("http://localhost:3000/onboarding", {
        method: "POST",
        body: formData,
      });

      const response = await action(createActionArgs(request));
      expect(response.status).toBe(200);
      const body = (await response.json()) as {
        success: boolean;
        email: string;
      };
      expect(body.success).toBe(true);
      expect(body.email).toBe("john.doe@42.fr");
    });
  });

  it("handles real-time draft updates through action with update_draft type", async () => {
    const formData = new FormData();
    formData.set("actionType", "update_draft");
    formData.set("firstName", "John");
    formData.set("familyName", "Doe");
    formData.set("email", "john.doe@aptitek.io");

    const request = new Request("http://localhost:3000/onboarding", {
      method: "POST",
      body: formData,
    });

    const response = await action(createActionArgs(request));
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      success: boolean;
      draftSaved: boolean;
    };
    expect(body.success).toBe(true);
    expect(body.draftSaved).toBe(true);
  });

  it("allows draft saving and avatar uploads even if email domain is incomplete or invalid", async () => {
    const formData = new FormData();
    formData.set("actionType", "update_draft");
    formData.set("firstName", "John");
    formData.set("familyName", "Doe");
    formData.set("email", "incomplete-email@unknown.com");
    formData.set("avatarUrl", "https://example.com/avatar.webp");

    const request = new Request("http://localhost:3000/onboarding", {
      method: "POST",
      body: formData,
    });

    const response = await action(createActionArgs(request));
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      success: boolean;
      draftSaved: boolean;
    };
    expect(body.success).toBe(true);
    expect(body.draftSaved).toBe(true);
  });

  it("rejects validate_credential submission when first or family name is missing", async () => {
    const formData = new FormData();
    formData.set("actionType", "validate_credential");
    formData.set("firstName", "");
    formData.set("familyName", "");
    formData.set("email", "john.doe@aptitek.io");

    const request = new Request("http://localhost:3000/onboarding", {
      method: "POST",
      body: formData,
    });

    const response = await action(createActionArgs(request));
    expect(response.status).toBe(400);
    const body = (await response.json()) as { code: string; error: string };
    expect(body.code).toBe("MISSING_REQUIRED_FIELDS");
  });

  it("converts family name to uppercase when saving user edits", async () => {
    const { saveUserEdits } = await import("./onboarding.helpers.server");
    const userService = await import("~/services/userService");
    vi.spyOn(userService, "getUserById").mockResolvedValueOnce({
      id: "test-user-upper",
      firstName: "Jane",
      lastName: "SMITH",
      displayName: "Jane SMITH",
      githubId: null,
      githubEmail: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const updateUserSpy = vi
      .spyOn(userService, "updateUser")
      .mockResolvedValueOnce({
        id: "test-user-upper",
        firstName: "Jane",
        lastName: "SMITH",
        displayName: "Jane SMITH",
        githubId: null,
        githubEmail: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const mockDb = {} as Parameters<typeof saveUserEdits>[0]["db"];

    await saveUserEdits({
      db: mockDb,
      userId: "test-user-upper",
      firstName: "Jane",
      familyName: "smith",
      schoolId: "school-aptitek",
      hasNameFields: true,
    });

    expect(updateUserSpy).toHaveBeenCalledWith(
      mockDb,
      "test-user-upper",
      expect.objectContaining({
        firstName: "Jane",
        lastName: "SMITH",
        displayName: "Jane SMITH",
      }),
    );
  });

  it("auto-creates user record if not present in database when saving edits", async () => {
    const { saveUserEdits } = await import("./onboarding.helpers.server");
    const userService = await import("~/services/userService");
    vi.spyOn(userService, "getUserById").mockResolvedValueOnce(null);
    const createUserSpy = vi
      .spyOn(userService, "createUser")
      .mockResolvedValueOnce({
        id: "new-student-123",
        firstName: "Alex",
        lastName: "RIDER",
        displayName: "Alex RIDER",
        githubId: null,
        githubEmail: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const mockDb = {} as Parameters<typeof saveUserEdits>[0]["db"];

    await saveUserEdits({
      db: mockDb,
      userId: "new-student-123",
      firstName: "Alex",
      familyName: "rider",
      schoolId: "school-aptitek",
      hasNameFields: true,
    });

    expect(createUserSpy).toHaveBeenCalledWith(
      mockDb,
      expect.objectContaining({
        id: "new-student-123",
        firstName: "Alex",
        lastName: "RIDER",
        displayName: "Alex RIDER",
      }),
    );
  });
});
