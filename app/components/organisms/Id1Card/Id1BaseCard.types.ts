import type React from "react";
import type { CardShadow } from "deckfx";
import type { ElectronicsFinish } from "../../atoms/Electronics/Electronics.types";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";

export type Id1CardSide = "front" | "back";
export type Id1CardOrientation = "landscape" | "portrait";
export type Id1CardSize = "sm" | "md" | "lg" | "responsive";
export type Id1CardFlipDirection = "horizontal" | "vertical";

/**
 * Base card props for physical ID-1 card features.
 * This component handles the card substrate, security features, and 3D effects.
 */
export interface Id1BaseCardProps {
  // Side Selection & 3D Flip Animation
  side?: Id1CardSide;
  isFlipped?: boolean;
  enableFlip?: boolean;
  flipOnClick?: boolean;
  flipDirection?: Id1CardFlipDirection;
  flipDuration?: number;
  onFlip?: (side: Id1CardSide) => void;
  onFlipChange?: (isFlipped: boolean) => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  // Dimensions & Layout
  orientation?: Id1CardOrientation;
  size?: Id1CardSize;
  width?: number | string;
  height?: number | string;
  className?: string;
  containerClassName?: string;
  testId?: string;

  // Material & Transparency
  transparent?: boolean;
  transparentGhostOpacity?: number;

  // Deck-FX 3D Physics & Visuals
  holographic?: boolean;
  holoStrength?: number;
  showGlare?: boolean;
  glareOpacity?: number;
  maxTilt?: number;
  scaleOnHover?: number;
  shadow?: CardShadow;

  // Masking Properties (Only Guilloche / User Mask reflects Holo)
  maskUrl?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;

  // Electronics Security Layer
  showElectronics?: boolean;
  electronicsFinish?: ElectronicsFinish;
  chipPosition?: "left" | "right";
  electronicsRotation?: number;
  showNfcAntenna?: boolean;
  showChip?: boolean;
  chipView?: "front" | "back" | "none";
  showInnerCoil?: boolean;
  electronicsOpacity?: number;
  electronicsMirrored?: boolean;

  // Procedural Guilloche Security Geometry
  showGuilloche?: boolean;
  guillocheVariant?: GuillocheVariant;
  guillocheSeed?: string;
  guillocheDensity?: "low" | "medium" | "high";
  guillocheOpacity?: number;
  guillocheNoiseIntensity?: number;

  // Content (render prop or children for each face)
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  children?: React.ReactNode;

  // Ghost layer content for transparent cards
  renderGhostContent?: (side: Id1CardSide) => React.ReactNode;
}

// ISO/IEC 7810 ID-1 Standard Dimensions (mm)
export const ISO_7810_ID1 = {
  widthMm: 85.6,
  heightMm: 53.98,
  thicknessMm: 0.76,
  nominalCornerRadiusMm: 3.18,
  aspectRatio: 85.6 / 53.98, // ~1.5858 (Landscape)
  aspectRatioPortrait: 53.98 / 85.6, // ~0.6306 (Portrait)
} as const;

export type ISO_7810_ID1_Type = typeof ISO_7810_ID1;

// ISO/IEC 19794-5:2011 Biometric Facial Image Dimensions & Criteria
export const ISO_19794_5_BIOMETRICS = {
  standard: "ISO/IEC 19794-5:2011",
  photoWidthMm: 35,
  photoHeightMm: 45,
  aspectRatio: 35 / 45, // 0.7778 (7:9 portrait format)
  faceHeightMinRatio: 0.7, // 70% of frame height (chin to crown)
  faceHeightMaxRatio: 0.8, // 80% of frame height
} as const;

export type ISO_19794_5_BIOMETRICS_Type = typeof ISO_19794_5_BIOMETRICS;
