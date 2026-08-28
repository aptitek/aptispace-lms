import { describe, it, expect } from "vitest";
import BiometricAvatar from "./BiometricAvatar";
import { ISO_19794_5_CONSTANTS } from "./BiometricAvatar.types";

describe("BiometricAvatar Component (ISO/IEC 19794-5:2011)", () => {
  it("exports BiometricAvatar component", () => {
    expect(BiometricAvatar).toBeDefined();
    expect(typeof BiometricAvatar).toBe("object"); // forwardRef
    expect(BiometricAvatar.displayName).toBe("BiometricAvatar");
  });

  it("conforms strictly to ISO/IEC 19794-5:2011 biometric ratios", () => {
    expect(ISO_19794_5_CONSTANTS.standard).toBe("ISO/IEC 19794-5:2011");
    expect(ISO_19794_5_CONSTANTS.photoWidthMm).toBe(35);
    expect(ISO_19794_5_CONSTANTS.photoHeightMm).toBe(45);
    expect(ISO_19794_5_CONSTANTS.aspectRatio).toBeCloseTo(35 / 45, 4);
  });
});
