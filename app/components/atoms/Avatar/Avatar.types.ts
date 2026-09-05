import type { ReactNode } from "react";
import type { ExpressiveShapeName } from "~/tokens/shapes";

export const ISO_19794_5_CONSTANTS = {
  standard: "ISO/IEC 19794-5:2011",
  photoWidthMm: 35,
  photoHeightMm: 45,
  aspectRatio: 35 / 45, // 0.7778 (7:9 portrait format)
  faceHeightMinRatio: 0.7, // 70% of frame height (chin to crown)
  faceHeightMaxRatio: 0.8, // 80% of frame height
} as const;

export type M3ScaleShape =
  | "none"
  | "extra-small"
  | "extra-small-top"
  | "small"
  | "medium"
  | "large"
  | "large-end"
  | "large-top"
  | "large-start"
  | "extra-large"
  | "extra-large-top"
  | "full"
  | "cut"
  | "asymmetric"
  | "circular"
  | "rounded"
  | "square"
  | "biometric"
  | "landscape";

export type AvatarShape =
  M3ScaleShape | ExpressiveShapeName | (string & {}) | number;

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  role?: string | null;
  isPortrait?: boolean;
  showReticle?: boolean;
  shape?: AvatarShape;
  height?: number | string;
  width?: number | string;
  aspectRatio?: string;
  borderRadius?: number | string;
  className?: string;
  testId?: string;
  "data-testid"?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  children?: ReactNode;
  placeholderIcon?: ReactNode;
}
