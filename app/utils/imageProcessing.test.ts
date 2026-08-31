import { describe, it, expect } from "vitest";
import { calculateAspectRatioFit, processImageToWebp } from "./imageProcessing";

describe("imageProcessing utility", () => {
  it("calculates aspect ratio fit correctly when src is larger than max", () => {
    const result = calculateAspectRatioFit(1000, 500, 500, 500);
    expect(result.width).toBe(500);
    expect(result.height).toBe(250);
  });

  it("calculates aspect ratio fit correctly when src is smaller than max", () => {
    const result = calculateAspectRatioFit(200, 300, 500, 500);
    expect(result.width).toBe(200);
    expect(result.height).toBe(300);
  });

  it("handles edge cases in dimension calculation", () => {
    const result = calculateAspectRatioFit(0, 0, 500, 500);
    expect(result.width).toBe(500);
    expect(result.height).toBe(500);
  });

  it("falls back gracefully in headless environment", async () => {
    const fakeFile = new File(["test-image-content"], "test.png", {
      type: "image/png",
    });
    const result = await processImageToWebp(fakeFile);
    expect(result).toBeDefined();
    expect(result.name).toMatch(/test/);
  });
});
