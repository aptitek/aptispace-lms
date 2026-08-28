import {
  ISO_7810_ID1,
  type Id1CardOrientation,
  type Id1CardSize,
} from "./Id1Card.types";

export * from "./Id1Card.elements.styles";

const DIMENSION_MAP: Record<
  Id1CardSize,
  {
    landscape: { width: number | string; height: number | string };
    portrait: { width: number | string; height: number | string };
  }
> = {
  sm: {
    landscape: {
      width: 340,
      height: Math.round(340 / ISO_7810_ID1.aspectRatio),
    },
    portrait: {
      width: 220,
      height: Math.round(220 / ISO_7810_ID1.aspectRatioPortrait),
    },
  },
  md: {
    landscape: {
      width: 440,
      height: Math.round(440 / ISO_7810_ID1.aspectRatio),
    },
    portrait: {
      width: 280,
      height: Math.round(280 / ISO_7810_ID1.aspectRatioPortrait),
    },
  },
  lg: {
    landscape: {
      width: 540,
      height: Math.round(540 / ISO_7810_ID1.aspectRatio),
    },
    portrait: {
      width: 340,
      height: Math.round(340 / ISO_7810_ID1.aspectRatioPortrait),
    },
  },
  responsive: {
    landscape: { width: "100%", height: "auto" },
    portrait: { width: "100%", height: "auto" },
  },
};

export const getDimensions = (
  size: Id1CardSize = "responsive",
  orientation: Id1CardOrientation = "landscape",
  customWidth?: number | string,
  customHeight?: number | string,
) => {
  if (customWidth && customHeight) {
    return { width: customWidth, height: customHeight };
  }
  const sizeEntry = DIMENSION_MAP[size] || DIMENSION_MAP.responsive;
  return orientation === "portrait" ? sizeEntry.portrait : sizeEntry.landscape;
};
