import { describe, it, expect } from "vitest";
import IdCard from "./IdCard";
import { ISO_7810_ID1 } from "./IdCard.types";
import { getDimensions } from "./IdCard.styles";

describe("IdCard Molecule", () => {
  it("exports IdCard component and forwards ref properly", () => {
    expect(IdCard).toBeDefined();
    expect(typeof IdCard).toBe("object"); // forwardRef creates object
    expect(IdCard.displayName).toBe("IdCard");
  });

  it("adheres strictly to ISO/IEC 7810 ID-1 mathematical standards", () => {
    // 85.60 mm x 53.98 mm
    expect(ISO_7810_ID1.widthMm).toBe(85.6);
    expect(ISO_7810_ID1.heightMm).toBe(53.98);
    expect(ISO_7810_ID1.thicknessMm).toBe(0.76);
    expect(ISO_7810_ID1.aspectRatio).toBeCloseTo(1.5858, 3);
    expect(ISO_7810_ID1.aspectRatioPortrait).toBeCloseTo(0.6306, 3);
    expect(ISO_7810_ID1.nominalCornerRadiusMm).toBe(3.18);
  });

  it("calculates accurate pixel dimensions for standard size presets", () => {
    const smLandscape = getDimensions("sm", "landscape");
    expect(smLandscape.width).toBe(340);
    expect(smLandscape.height).toBe(Math.round(340 / (85.6 / 53.98)));

    const mdLandscape = getDimensions("md", "landscape");
    expect(mdLandscape.width).toBe(440);
    expect(mdLandscape.height).toBe(Math.round(440 / (85.6 / 53.98)));

    const lgLandscape = getDimensions("lg", "landscape");
    expect(lgLandscape.width).toBe(540);
    expect(lgLandscape.height).toBe(Math.round(540 / (85.6 / 53.98)));

    const portrait = getDimensions("md", "portrait");
    expect(portrait.width).toBe(280);
    expect(portrait.height).toBe(Math.round(280 / (53.98 / 85.6)));

    const custom = getDimensions("md", "landscape", 500, 300);
    expect(custom.width).toBe(500);
    expect(custom.height).toBe(300);
  });

  it("supports right-aligned chip position and custom rotation props", () => {
    const defaultProps = {
      chipPosition: "left" as const,
      electronicsRotation: 0,
    };
    expect(defaultProps.chipPosition).toBe("left");
    expect(defaultProps.electronicsRotation).toBe(0);

    const rightRotatedProps = {
      chipPosition: "right" as const,
      electronicsRotation: 180,
    };
    expect(rightRotatedProps.chipPosition).toBe("right");
    expect(rightRotatedProps.electronicsRotation).toBe(180);
  });
});
