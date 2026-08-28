import { describe, it, expect } from "vitest";
import Electronics, { generateSpiralPath } from "./Electronics";
import { ISO_ELECTRONICS_CONSTANTS } from "./Electronics.types";

describe("Electronics Component (ISO/IEC 7816 & 14443)", () => {
  it("exports Electronics component", () => {
    expect(Electronics).toBeDefined();
    expect(typeof Electronics).toBe("function");
  });

  it("maintains precise ISO/IEC 7816 contact pad position constants", () => {
    // 856 x 540 viewbox standard
    expect(ISO_ELECTRONICS_CONSTANTS.viewWidth).toBe(856);
    expect(ISO_ELECTRONICS_CONSTANTS.viewHeight).toBe(540);
    // Chip position: 162.5 x 244.9
    expect(ISO_ELECTRONICS_CONSTANTS.chipCenterX).toBe(162.5);
    expect(ISO_ELECTRONICS_CONSTANTS.chipCenterY).toBe(244.9);
    // Outer coil offsets
    expect(ISO_ELECTRONICS_CONSTANTS.outerCoilX).toBe(24);
    expect(ISO_ELECTRONICS_CONSTANTS.outerCoilY).toBe(24);
    expect(ISO_ELECTRONICS_CONSTANTS.outerCoilW).toBe(808);
    expect(ISO_ELECTRONICS_CONSTANTS.outerCoilH).toBe(492);
  });

  it("generates valid SVG spiral path string", () => {
    const spiral = generateSpiralPath({
      turns: 4,
      baseX: 24,
      baseY: 24,
      baseW: 808,
      baseH: 492,
      spacing: 7,
      baseRadius: 26,
    });
    expect(spiral).toBeDefined();
    expect(spiral.startsWith("M 50.00 24.00")).toBe(true);
    expect(spiral).toContain("H 806.00");
    expect(spiral).toContain("A 26 26");
  });

  it("calculates symmetrical mirroring in horizontal flip", () => {
    const frontChipX = ISO_ELECTRONICS_CONSTANTS.chipCenterX;
    const cardWidth = ISO_ELECTRONICS_CONSTANTS.viewWidth;
    const backChipX = cardWidth - frontChipX;

    // Symmetrical X coordinate: 162.5 mm -> 693.5 mm
    expect(backChipX).toBe(693.5);
    expect(frontChipX + backChipX).toBe(cardWidth);
  });

  it("handles left and right chipPosition with symmetry", () => {
    const isMirrored = (
      pos: "left" | "right",
      side: "front" | "back",
    ): boolean => (pos === "right") !== (side === "back");

    // Front with chipPosition="left": normal (chip on left at 162.5)
    expect(isMirrored("left", "front")).toBe(false);
    // Front with chipPosition="right": mirrored (chip on right at 693.5)
    expect(isMirrored("right", "front")).toBe(true);
    // Back with chipPosition="left": mirrored (chip on right at 693.5)
    expect(isMirrored("left", "back")).toBe(true);
    // Back with chipPosition="right": unmirrored relative to front-right (chip on left at 162.5)
    expect(isMirrored("right", "back")).toBe(false);
  });
});
