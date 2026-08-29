import type React from "react";
import type { CardShadow, CardLayer } from "deckfx";
import type { ElectronicsFinish } from "../../atoms/Electronics/Electronics.types";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";

export type Id1CardSide = "front" | "back";
export type Id1CardOrientation = "landscape" | "portrait";
export type Id1CardSize = "sm" | "md" | "lg" | "responsive";
export type Id1CardFlipDirection = "horizontal" | "vertical";

/**
 * Props for the Id1Card molecule.
 * Handles the physical ID-1 substrate, security features, 3D effects, and content slots.
 */
export interface Id1CardProps {
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
  layers?: CardLayer[];

  // Masking Properties (Guilloche / Custom Mask reflects Holo)
  maskUrl?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;

  // Electronics Security Layer
  showElectronics?: boolean;
  electronicsFinish?: ElectronicsFinish;
  chipPosition?: "left" | "right";
  electronicsRotation?: number;
  frontElectronicsRotation?: number;
  backElectronicsRotation?: number;
  showNfcAntenna?: boolean;
  showChip?: boolean;
  chipView?: "front" | "back" | "none";
  frontChipView?: "front" | "back" | "none";
  backChipView?: "front" | "back" | "none";
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

  // Content slots
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
