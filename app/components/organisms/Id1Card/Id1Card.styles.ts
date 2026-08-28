import { styled } from "@mui/material/styles";
import {
  ISO_7810_ID1,
  type Id1CardOrientation,
  type Id1CardSize,
} from "./Id1Card.types";

export * from "./Id1Card.elements.styles";

export const TransparentCardWrapper = styled("div")<{
  isTransparent?: boolean;
}>(({ isTransparent, theme }) => ({
  width: "100%",
  height: "100%",
  display: "contents",

  // Override deckfx hardcoded colors to enforce MUI theme
  "& .bg-blue-900": {
    backgroundColor: "transparent !important",
    background: "transparent !important",
  },

  ...(isTransparent
    ? {
        "& .backface-hidden": {
          backfaceVisibility: "visible !important",
          WebkitBackfaceVisibility: "visible !important",
        },
        "& .bg-white, & .dark\\:bg-slate-950, & [class*='bg-white'], & [class*='dark:bg-slate-950']":
          {
            backgroundColor: "transparent !important",
            background: "transparent !important",
          },
      }
    : {
        "& .bg-white": {
          backgroundColor: `${theme.palette.background.paper} !important`,
        },
        "& .dark\\:bg-slate-950": {
          backgroundColor: `${theme.palette.background.default} !important`,
        },
      }),
}));

export const MaskOverlay = styled("div")<{
  maskUrl?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
}>(
  ({
    maskUrl,
    maskSize = "contain",
    maskPosition = "center",
    maskRepeat = "no-repeat",
  }) => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
    ...(maskUrl
      ? {
          maskImage: `url(${maskUrl})`,
          WebkitMaskImage: `url(${maskUrl})`,
          maskSize,
          WebkitMaskSize: maskSize,
          maskPosition,
          WebkitMaskPosition: maskPosition,
          maskRepeat,
          WebkitMaskRepeat: maskRepeat,
        }
      : {}),
  }),
);

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
