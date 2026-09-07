import { describe, it, expect } from "vitest";
import Avatar, { isUnnamedUser, getAvatarInitials } from "./Avatar";
import { ISO_19794_5_CONSTANTS } from "./Avatar.types";
import { resolveAvatarShapeRadius } from "./Avatar.styles";
import { getRoleAvatarShape } from "~/tokens/shapes";

describe("Avatar Component & MD3 Shape Scale", () => {
  it("exports Avatar component properly", () => {
    expect(Avatar).toBeDefined();
    expect(typeof Avatar).toBe("object"); // forwardRef
    expect(Avatar.displayName).toBe("Avatar");
  });

  it("exports ISO 19794-5 constants", () => {
    expect(ISO_19794_5_CONSTANTS.photoWidthMm).toBe(35);
    expect(ISO_19794_5_CONSTANTS.photoHeightMm).toBe(45);
    expect(ISO_19794_5_CONSTANTS.aspectRatio).toBeCloseTo(0.7778, 3);
  });

  it("resolves all standard MD3 shape scale tokens", () => {
    expect(resolveAvatarShapeRadius("none")).toBe("0px");
    expect(resolveAvatarShapeRadius("square")).toBe("0px");
    expect(resolveAvatarShapeRadius("extra-small")).toBe("4px");
    expect(resolveAvatarShapeRadius("extra-small-top")).toBe("4px 4px 0 0");
    expect(resolveAvatarShapeRadius("small")).toBe("8px");
    expect(resolveAvatarShapeRadius("medium")).toBe("12px");
    expect(resolveAvatarShapeRadius("rounded")).toBe("12px");
    expect(resolveAvatarShapeRadius("large")).toBe("16px");
    expect(resolveAvatarShapeRadius("large-end")).toBe("0 16px 16px 0");
    expect(resolveAvatarShapeRadius("large-top")).toBe("16px 16px 0 0");
    expect(resolveAvatarShapeRadius("large-start")).toBe("16px 0 0 16px");
    expect(resolveAvatarShapeRadius("extra-large")).toBe("28px");
    expect(resolveAvatarShapeRadius("extra-large-top")).toBe("28px 28px 0 0");
    expect(resolveAvatarShapeRadius("full")).toBe("9999px");
    expect(resolveAvatarShapeRadius("circular")).toBe("50%");
    expect(resolveAvatarShapeRadius("cut")).toBe("14px 2px 14px 2px");
    expect(resolveAvatarShapeRadius("asymmetric")).toBe("24px 6px 24px 6px");
    expect(resolveAvatarShapeRadius("biometric")).toBe("10px");
  });

  it("supports custom string or numeric radius", () => {
    expect(resolveAvatarShapeRadius(undefined, 18)).toBe("18px");
    expect(resolveAvatarShapeRadius(undefined, "20px 4px")).toBe("20px 4px");
    expect(resolveAvatarShapeRadius(24)).toBe("24px");
  });

  it("supports all 35 MD3 expressive shapes from catalog", () => {
    const expectedShapes = [
      "circle",
      "square",
      "slanted",
      "arch",
      "semicircle",
      "oval",
      "pill",
      "triangle",
      "arrow",
      "fan",
      "diamond",
      "clamshell",
      "pentagon",
      "gem",
      "very-sunny",
      "sunny",
      "4-sided-cookie",
      "6-sided-cookie",
      "7-sided-cookie",
      "9-sided-cookie",
      "12-sided-cookie",
      "4-leaf-clover",
      "8-leaf-clover",
      "burst",
      "soft-burst",
      "boom",
      "soft-boom",
      "flower",
      "puffy",
      "puffy-diamond",
      "ghost-ish",
      "pixel-circle",
      "pixel-triangle",
      "bun",
      "heart",
    ];

    for (const shape of expectedShapes) {
      expect(resolveAvatarShapeRadius(shape)).toBeDefined();
    }
  });

  it("identifies unnamed users and pending onboarding accounts", () => {
    expect(isUnnamedUser(undefined)).toBe(true);
    expect(isUnnamedUser("")).toBe(true);
    expect(isUnnamedUser("   ")).toBe(true);
    expect(isUnnamedUser("New Student (Pending Onboarding)")).toBe(true);
    expect(isUnnamedUser("New Teacher (Pending Onboarding)")).toBe(true);
    expect(isUnnamedUser("New Admin")).toBe(true);
    expect(isUnnamedUser("student")).toBe(true);
    expect(isUnnamedUser("Arthur Dent")).toBe(false);
  });

  it("resolves role-based avatar shapes correctly", () => {
    expect(getRoleAvatarShape("student")).toBe("pill");
    expect(getRoleAvatarShape("instructor")).toBe("ghost-ish");
    expect(getRoleAvatarShape("admin")).toBe("9-sided-cookie");
    expect(getRoleAvatarShape(undefined)).toBe("pill");
  });

  it("extracts 2-letter uppercase initials instead of full name", () => {
    expect(getAvatarInitials("Arthur Dent")).toBe("AD");
    expect(getAvatarInitials("Ford Prefect")).toBe("FP");
    expect(getAvatarInitials("Zaphod")).toBe("ZA");
    expect(getAvatarInitials("Tricia Marie McMillan")).toBe("TM");
    expect(getAvatarInitials("student")).toBeNull();
    expect(getAvatarInitials(undefined, "Arthur Dent")).toBe("AD");
  });

  it("falls back to initials when image fails to load", async () => {
    const { render, screen, fireEvent } =
      await import("@testing-library/react");
    render(
      <Avatar
        src="https://invalid-domain.test/broken-avatar.png"
        name="Arthur Dent"
        alt="Arthur Dent"
        testId="test-avatar"
      />,
    );

    // Initially, image is rendered
    const img = screen.getByRole("img");
    expect(img).toBeDefined();

    // Trigger image error
    fireEvent.error(img);

    // Image is removed, fallback initials container is rendered with initials "AD" instead of full name
    expect(screen.queryByRole("img")).toBeNull();
    const initialsHolder = screen.getByTestId("avatar-initials-holder");
    expect(initialsHolder).toBeDefined();
    expect(initialsHolder.textContent).toBe("AD");
    expect(initialsHolder.textContent).not.toBe("Arthur Dent");
  });
});
