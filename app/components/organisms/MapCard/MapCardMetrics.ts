import type { MapCardSize } from "./MapCard.types";

export interface SheetDimensions {
  maxWidth: number | string;
  minHeight: number;
  height: number | string;
  maxHeight: number | string;
}

export const SIZE_METRICS = {
  small: {
    minHeight: 124,
    maxHeight: 160,
    maxWidth: 460,
    fontSize: "0.72rem",
    iconSize: "0.85rem",
    padding: "8px 10px",
    gap: 0.75,
    chipScale: 0.82,
    mapFlex: "0 0 38%",
  },
  medium: {
    minHeight: 160,
    maxHeight: 210,
    maxWidth: 580,
    fontSize: "0.78rem",
    iconSize: "0.95rem",
    padding: "10px 12px",
    gap: 1,
    chipScale: 0.9,
    mapFlex: "0 0 40%",
  },
  large: {
    minHeight: 195,
    maxHeight: 250,
    maxWidth: 680,
    fontSize: "0.85rem",
    iconSize: "1.1rem",
    padding: "12px 16px",
    gap: 1.25,
    chipScale: 1,
    mapFlex: "0 0 42%",
  },
};

export const ROOM_CHIP_SIZE_METRICS: Record<
  MapCardSize,
  { fontSize: string; padding: string; borderRadius: string; gap: number }
> = {
  small: {
    fontSize: "1.1rem",
    padding: "4px 12px",
    borderRadius: "12px",
    gap: 6,
  },
  medium: {
    fontSize: "1.35rem",
    padding: "8px 16px",
    borderRadius: "12px",
    gap: 8,
  },
  large: {
    fontSize: "1.65rem",
    padding: "8px 24px",
    borderRadius: "16px",
    gap: 8,
  },
};

export function getSheetDimensions(
  isExtended: boolean,
  isHorizontal: boolean,
  metrics: { maxWidth: number; minHeight: number; maxHeight: number },
): SheetDimensions {
  if (isExtended) {
    return {
      maxWidth: isHorizontal ? 920 : 560,
      minHeight: isHorizontal ? 380 : 320,
      height: isHorizontal ? 400 : "auto",
      maxHeight: "none",
    };
  }
  return {
    maxWidth: isHorizontal ? metrics.maxWidth : 440,
    minHeight: metrics.minHeight,
    height: "auto",
    maxHeight: "none",
  };
}
