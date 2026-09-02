import { describe, it, expect } from "vitest";
import {
  sanitizeNamePart,
  cleanDomainName,
  generateUsernameFromPattern,
  generateEmailFromPattern,
  formatUsernameSamplePreview,
} from "./emailFormat";

describe("emailFormat Utility", () => {
  describe("sanitizeNamePart", () => {
    it("lowercases and removes accents and diacritics", () => {
      expect(sanitizeNamePart("Éléonore")).toBe("eleonore");
      expect(sanitizeNamePart("François")).toBe("francois");
      expect(sanitizeNamePart("Jean-Luc")).toBe("jean-luc");
    });

    it("strips special characters and spaces", () => {
      expect(sanitizeNamePart(" O'Connor ")).toBe("oconnor");
      expect(sanitizeNamePart("Van Der Beek")).toBe("vanderbeek");
    });
  });

  describe("cleanDomainName", () => {
    it("strips leading @ and trims", () => {
      expect(cleanDomainName("@aptitek.io")).toBe("aptitek.io");
      expect(cleanDomainName("@@school.edu ")).toBe("school.edu");
    });
  });

  describe("generateUsernameFromPattern", () => {
    it("generates default {first}.{last}", () => {
      const username = generateUsernameFromPattern({
        firstName: "Alice",
        lastName: "Smith",
        pattern: "{first}.{last}",
      });
      expect(username).toBe("alice.smith");
    });

    it("supports character length limits like {first:1}{last} and {f}{last}", () => {
      const u1 = generateUsernameFromPattern({
        firstName: "Alice",
        lastName: "Smith",
        pattern: "{first:1}{last}",
      });
      expect(u1).toBe("asmith");

      const u2 = generateUsernameFromPattern({
        firstName: "Alice",
        lastName: "Smith",
        pattern: "{f}{last}",
      });
      expect(u2).toBe("asmith");
    });

    it("supports custom slice counts like {first:3}.{last:3}", () => {
      const username = generateUsernameFromPattern({
        firstName: "Jonathan",
        lastName: "Doe",
        pattern: "{first:3}.{last:3}",
      });
      expect(username).toBe("jon.doe");
    });

    it("handles partially filled names gracefully", () => {
      expect(
        generateUsernameFromPattern({
          firstName: "Alice",
          lastName: "",
          pattern: "{first}.{last}",
        }),
      ).toBe("alice");

      expect(
        generateUsernameFromPattern({
          firstName: "",
          lastName: "Smith",
          pattern: "{first}.{last}",
        }),
      ).toBe("smith");
    });
  });

  describe("generateEmailFromPattern", () => {
    it("combines generated username and domain", () => {
      const email = generateEmailFromPattern({
        firstName: "Alice",
        lastName: "Smith",
        usernamePattern: "{first}.{last}",
        domain: "aptitek.io",
      });
      expect(email).toBe("alice.smith@aptitek.io");
    });

    it("handles domain with leading @ correctly", () => {
      const email = generateEmailFromPattern({
        firstName: "Bob",
        lastName: "Martin",
        usernamePattern: "{f}_{last}",
        domain: "@company.fr",
      });
      expect(email).toBe("b_martin@company.fr");
    });
  });

  describe("formatUsernameSamplePreview", () => {
    it("returns formatted preview for sample John Doe", () => {
      const preview = formatUsernameSamplePreview(
        "{first}.{last}",
        "aptitek.io",
      );
      expect(preview.username).toBe("john.doe");
      expect(preview.email).toBe("john.doe@aptitek.io");
    });
  });
});
