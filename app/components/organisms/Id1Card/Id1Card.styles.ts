import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
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

export const FlipPerspectiveStage = styled("div")<{
  stageWidth: number | string;
  stageHeight: number | string;
  isClickable?: boolean;
}>(({ stageWidth, stageHeight, isClickable }) => ({
  perspective: "1400px",
  width: stageWidth,
  height: stageHeight,
  position: "relative",
  display: "inline-block",
  cursor: isClickable ? "pointer" : "default",
  userSelect: "none",
  WebkitUserSelect: "none",
}));

export const MotionFlipFlipper = styled(motion.div)({
  width: "100%",
  height: "100%",
  position: "relative",
  transformStyle: "preserve-3d",
});

export const CardFaceWrapper = styled("div")<{
  isBack?: boolean;
  isActive?: boolean;
  isVertical?: boolean;
}>(({ isBack, isActive, isVertical }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  transformStyle: "preserve-3d",
  transform: isBack
    ? isVertical
      ? "rotateX(180deg)"
      : "rotateY(180deg)"
    : "rotate(0deg)",
  zIndex: isActive ? 2 : 0,
  pointerEvents: isActive ? "auto" : "none",
}));
