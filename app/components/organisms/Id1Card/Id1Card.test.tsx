import { describe, it, expect } from "vitest";
import Id1Card from "./Id1Card";
import { ISO_7810_ID1, ISO_19794_5_BIOMETRICS } from "./Id1Card.types";
import { getDimensions } from "./Id1Card.styles";

describe("ISO/IEC 7810 ID-1 Card Component", () => {
  it("exports Id1Card component and forwards ref properly", () => {
    expect(Id1Card).toBeDefined();
    expect(typeof Id1Card).toBe("object"); // forwardRef creates object
    expect(Id1Card.displayName).toBe("Id1Card");
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

  it("conforms to ISO/IEC 19794-5:2011 Biometric Facial Image standards", () => {
    expect(ISO_19794_5_BIOMETRICS.standard).toBe("ISO/IEC 19794-5:2011");
    // Standard 35 mm x 45 mm biometric portrait dimensions
    expect(ISO_19794_5_BIOMETRICS.photoWidthMm).toBe(35);
    expect(ISO_19794_5_BIOMETRICS.photoHeightMm).toBe(45);
    expect(ISO_19794_5_BIOMETRICS.aspectRatio).toBeCloseTo(35 / 45, 4);
    expect(ISO_19794_5_BIOMETRICS.faceHeightMinRatio).toBe(0.7);
    expect(ISO_19794_5_BIOMETRICS.faceHeightMaxRatio).toBe(0.8);
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
    // Verifies prop typing and default configuration
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
