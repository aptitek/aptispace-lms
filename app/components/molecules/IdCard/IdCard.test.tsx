import { describe, it, expect } from "vitest";
import IdCard, { normalizeHoloLayers } from "./IdCard";
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

describe("IdCard Holo Layers Feature", () => {
  it("normalizes convenience holoImage prop with alpha mask by default", () => {
    const layers = normalizeHoloLayers({
      holoImage: "/assets/security-seal.png",
      holoImageOpacity: 0.85,
      holoImageBlendMode: "overlay",
      holoImageObjectFit: "contain",
      holoImageSide: "front",
    });

    expect(layers).toHaveLength(1);
    expect(layers[0]).toMatchObject({
      id: "holo-layer-primary",
      src: "/assets/security-seal.png",
      maskUrl: "/assets/security-seal.png", // alpha mask by default
      opacity: 0.85,
      blendMode: "overlay",
      objectFit: "contain",
      side: "front",
      holographic: true,
    });
  });

  it("supports custom holoImageMask when specified", () => {
    const layers = normalizeHoloLayers({
      holoImage: "/assets/badge.png",
      holoImageMask: "/assets/badge-mask.png",
    });

    expect(layers).toHaveLength(1);
    expect(layers[0].src).toBe("/assets/badge.png");
    expect(layers[0].maskUrl).toBe("/assets/badge-mask.png");
  });

  it("normalizes string array into IdHoloLayer array using image alpha as mask", () => {
    const layers = normalizeHoloLayers({
      holoLayers: ["/assets/crest.png", "/assets/signature.png"],
    });

    expect(layers).toHaveLength(2);
    expect(layers[0]).toMatchObject({
      src: "/assets/crest.png",
      maskUrl: "/assets/crest.png",
      side: "both",
      holographic: true,
    });
    expect(layers[1]).toMatchObject({
      src: "/assets/signature.png",
      maskUrl: "/assets/signature.png",
      side: "both",
      holographic: true,
    });
  });

  it("normalizes mixed layer objects and strings with explicit side and opacity", () => {
    const layers = normalizeHoloLayers({
      holoLayers: [
        "/assets/crest.png",
        {
          id: "back-seal",
          src: "/assets/seal.png",
          maskUrl: "/assets/seal-holo-mask.png",
          opacity: 0.7,
          blendMode: "screen",
          side: "back",
          holographic: true,
        },
      ],
    });

    expect(layers).toHaveLength(2);
    expect(layers[0].side).toBe("both");
    expect(layers[0].maskUrl).toBe("/assets/crest.png");
    expect(layers[1]).toMatchObject({
      id: "back-seal",
      src: "/assets/seal.png",
      maskUrl: "/assets/seal-holo-mask.png",
      opacity: 0.7,
      blendMode: "screen",
      side: "back",
    });
  });

  it("correctly filters layers by active card face", () => {
    const layers = normalizeHoloLayers({
      holoLayers: [
        { src: "/front-badge.png", side: "front" },
        { src: "/back-qr.png", side: "back" },
        { src: "/watermark.png", side: "both" },
      ],
    });

    const isFront = (l: { side?: string }) =>
      l.side === "both" || l.side === "front";
    const isBack = (l: { side?: string }) =>
      l.side === "both" || l.side === "back";
    const getSrc = (l: { src?: string }) => l.src;

    const frontActive = layers.filter(isFront);
    const backActive = layers.filter(isBack);

    expect(frontActive.map(getSrc)).toEqual([
      "/front-badge.png",
      "/watermark.png",
    ]);
    expect(backActive.map(getSrc)).toEqual(["/back-qr.png", "/watermark.png"]);
  });
});
