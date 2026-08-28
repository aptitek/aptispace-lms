import type React from "react";
import type { CardShadow, FlipDirection } from "deckfx";
import type { ElectronicsFinish } from "../../atoms/Electronics/Electronics.types";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";

export type Id1CardOrientation = "landscape" | "portrait";
export type Id1CardSize = "sm" | "md" | "lg" | "responsive";

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

export interface Id1CardSideConfig {
  showElectronics?: boolean;
  electronicsFinish?: ElectronicsFinish;
  showNfcAntenna?: boolean;
  showChip?: boolean;
  showInnerCoil?: boolean;
  electronicsOpacity?: number;
  electronicsMirrored?: boolean;

  showGuilloche?: boolean;
  guillocheVariant?: GuillocheVariant;
  guillocheSeed?: string;
  guillocheDensity?: "low" | "medium" | "high";
  guillocheOpacity?: number;
  guillocheNoiseIntensity?: number;

  maskUrl?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;

  content?: React.ReactNode;
}

export interface Id1CardProps {
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

  // Deck-FX 3D Physics & Visuals
  holographic?: boolean;
  holoStrength?: number;
  showGlare?: boolean;
  glareOpacity?: number;
  maxTilt?: number;
  scaleOnHover?: number;
  shadow?: CardShadow;

  // Masking Properties (Only Guilloche and/or User Mask reflects Holo)
  maskUrl?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;

  // Flipping & Interactivity
  isFlipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
  interactive?: boolean;
  flipDirection?: FlipDirection;
  flipDuration?: number;

  // Front Side Config & Shorthands
  front?: Id1CardSideConfig;
  showElectronics?: boolean;
  electronicsFinish?: ElectronicsFinish;
  showNfcAntenna?: boolean;
  showChip?: boolean;
  showInnerCoil?: boolean;
  showGuilloche?: boolean;
  guillocheVariant?: GuillocheVariant;
  guillocheSeed?: string;
  children?: React.ReactNode;
  frontContent?: React.ReactNode;

  // Back Side Config & Shorthands
  back?: Id1CardSideConfig;
  showBackElectronics?: boolean;
  backElectronicsFinish?: ElectronicsFinish;
  showBackNfcAntenna?: boolean;
  showBackChip?: boolean;
  showBackInnerCoil?: boolean;
  showBackGuilloche?: boolean;
  backGuillocheVariant?: GuillocheVariant;
  backGuillocheSeed?: string;
  backContent?: React.ReactNode;
  backChildren?: React.ReactNode;

  // Optional credential data
  credential?: Partial<Id1CardCredential>;
}

export interface Id1CardHandle {
  flip: () => void;
  setFlipped: (isNextFlipped: boolean) => void;
}

// ISO/IEC 7810 ID-1 Standard Constants
export const ISO_7810_ID1 = {
  widthMm: 85.6,
  heightMm: 53.98,
  thicknessMm: 0.76,
  aspectRatio: 85.6 / 53.98, // ~1.5857725
  aspectRatioPortrait: 53.98 / 85.6, // ~0.630607
  nominalCornerRadiusMm: 3.18,
  cornerRadiusRatio: 3.18 / 85.6, // ~3.714% of width
} as const;
