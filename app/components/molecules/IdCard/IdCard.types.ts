import type React from "react";
import type { CardShadow, CardLayer } from "deckfx";
import type { ElectronicsFinish } from "../../atoms/Electronics/Electronics.types";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";

export type IdCardSide = "front" | "back";
export type IdCardOrientation = "landscape" | "portrait";
export type IdCardSize = "sm" | "md" | "lg" | "responsive";
export type IdCardFlipDirection = "horizontal" | "vertical";

export type IdHoloVariant =
  | "holo-spectrum"
  | "cyber-cyan"
  | "solarized-gold"
  | "cosmic-crimson"
  | "default"
  | "rainbow"
  | "cosmic"
  | "gold";

// Backwards compatibility aliases
export type Id1CardSide = IdCardSide;
export type Id1CardOrientation = IdCardOrientation;
export type Id1CardSize = IdCardSize;
export type Id1CardFlipDirection = IdCardFlipDirection;
export type Id1HoloVariant = IdHoloVariant;

/**
 * Configuration for an image-based Holographic Layer on the ID card.
 * An image is rendered visually and its alpha transparency (or a custom mask) masks the holo foil reflection.
 */
export interface IdHoloLayer {
  id?: string;
  src?: string;
  maskUrl?: string; // If omitted, defaults to src (alpha mask)
  alt?: string;
  opacity?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  position?: string;
  className?: string;
  style?: React.CSSProperties;
  side?: IdCardSide | "both";
  zIndex?: number;
  holographic?: boolean;
  holoStrength?: number;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
  x?: number | string;
  y?: number | string;
  left?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  width?: number | string;
  height?: number | string;
  preserveAspectRatio?: string;
}

export type Id1HoloLayer = IdHoloLayer;

/**
 * Props for the IdCard molecule.
 * Handles the physical ID credential substrate, security features, 3D effects, and content slots.
 */
export interface IdCardProps {
  // Side Selection & 3D Flip Animation
  side?: IdCardSide;
  isFlipped?: boolean;
  enableFlip?: boolean;
  flipOnClick?: boolean;
  flipDirection?: IdCardFlipDirection;
  flipDuration?: number;
  onFlip?: (side: IdCardSide) => void;
  onFlipChange?: (isFlipped: boolean) => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  // Dimensions & Layout
  orientation?: IdCardOrientation;
  size?: IdCardSize;
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
  holoVariant?: IdHoloVariant;
  showGlare?: boolean;
  glareOpacity?: number;
  maxTilt?: number;
  scaleOnHover?: number;
  shadow?: CardShadow;
  layers?: CardLayer[];

  // Holo Layers (Image layer whose alpha masks holo reflection)
  holoLayers?: (string | IdHoloLayer)[];
  holoImage?: string;
  holoImageMask?: string;
  holoImageOpacity?: number;
  holoImageBlendMode?: React.CSSProperties["mixBlendMode"];
  holoImageObjectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  holoImageSide?: IdCardSide | "both";

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
  renderGhostContent?: (side: IdCardSide) => React.ReactNode;
}

export type Id1CardProps = IdCardProps;

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
