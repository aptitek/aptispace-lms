import type React from "react";
import type { CardShadow } from "deckfx";
import type { ElectronicsFinish } from "../../atoms/Electronics/Electronics.types";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";

export type Id1CardSide = "front" | "back";
export type Id1CardOrientation = "landscape" | "portrait";
export type Id1CardSize = "sm" | "md" | "lg" | "responsive";
export type Id1CardFlipDirection = "horizontal" | "vertical";

export interface Id1CardCredential {
  id?: string;
  name?: string;
  callSign?: string;
  role?: string;
  division?: string;
  clearanceLevel?: string;
  issueDate?: string;
  expiryDate?: string;
  avatarUrl?: string;
  securityCode?: string;
  barcodeValue?: string;
}

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

  // Masking Properties (Only Guilloche / User Mask reflects Holo)
  maskUrl?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;

  // Electronics Security Layer
  showElectronics?: boolean;
  electronicsFinish?: ElectronicsFinish;
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

  // Credential Data & Content
  credential?: Partial<Id1CardCredential>;
  content?: React.ReactNode;
  children?: React.ReactNode;
}

// ISO/IEC 7810 ID-1 Standard Geometry Constants
export const ISO_7810_ID1 = {
  widthMm: 85.6,
  heightMm: 53.98,
  thicknessMm: 0.76,
  aspectRatio: 85.6 / 53.98, // ~1.5857725
  aspectRatioPortrait: 53.98 / 85.6, // ~0.630607
  nominalCornerRadiusMm: 3.18,
  cornerRadiusRatio: 3.18 / 85.6, // ~3.714% of width
} as const;
