import { describe, it, expect } from "vitest";
import Avatar, { BiometricAvatar } from "./Avatar";
import { ISO_19794_5_CONSTANTS } from "./Avatar.types";
import { resolveM3ShapeRadius } from "./Avatar.styles";

describe("Avatar Component & MD3 Shape Scale", () => {
  it("exports Avatar component properly", () => {
    expect(Avatar).toBeDefined();
    expect(typeof Avatar).toBe("object"); // forwardRef
    expect(Avatar.displayName).toBe("Avatar");
    expect(BiometricAvatar).toBe(Avatar);
  });

  it("exports ISO 19794-5 constants", () => {
    expect(ISO_19794_5_CONSTANTS.photoWidthMm).toBe(35);
    expect(ISO_19794_5_CONSTANTS.photoHeightMm).toBe(45);
    expect(ISO_19794_5_CONSTANTS.aspectRatio).toBeCloseTo(0.7778, 3);
  });

  it("resolves all standard MD3 shape scale tokens", () => {
    expect(resolveM3ShapeRadius("none")).toBe("0px");
    expect(resolveM3ShapeRadius("square")).toBe("30%");
    expect(resolveM3ShapeRadius("extra-small")).toBe("4px");
    expect(resolveM3ShapeRadius("extra-small-top")).toBe("4px 4px 0 0");
    expect(resolveM3ShapeRadius("small")).toBe("8px");
    expect(resolveM3ShapeRadius("medium")).toBe("12px");
    expect(resolveM3ShapeRadius("rounded")).toBe("12px");
    expect(resolveM3ShapeRadius("large")).toBe("16px");
    expect(resolveM3ShapeRadius("large-end")).toBe("0 16px 16px 0");
    expect(resolveM3ShapeRadius("large-top")).toBe("16px 16px 0 0");
    expect(resolveM3ShapeRadius("large-start")).toBe("16px 0 0 16px");
    expect(resolveM3ShapeRadius("extra-large")).toBe("28px");
    expect(resolveM3ShapeRadius("extra-large-top")).toBe("28px 28px 0 0");
    expect(resolveM3ShapeRadius("full")).toBe("9999px");
    expect(resolveM3ShapeRadius("circular")).toBe("50%");
    expect(resolveM3ShapeRadius("cut")).toBe("14px 2px 14px 2px");
    expect(resolveM3ShapeRadius("asymmetric")).toBe("24px 6px 24px 6px");
    expect(resolveM3ShapeRadius("biometric")).toBe("10px");
  });

  it("supports custom string or numeric radius", () => {
    expect(resolveM3ShapeRadius(undefined, 18)).toBe("18px");
    expect(resolveM3ShapeRadius(undefined, "20px 4px")).toBe("20px 4px");
    expect(resolveM3ShapeRadius(24)).toBe("24px");
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
      expect(resolveM3ShapeRadius(shape)).toBeDefined();
    }
  });
});
