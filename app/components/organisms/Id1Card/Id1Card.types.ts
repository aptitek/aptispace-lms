import type { ElectronicsFinish } from "../../atoms/Electronics/Electronics.types";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";

export type Id1CardOrientation = "landscape" | "portrait";
export type Id1CardSize = "sm" | "md" | "lg" | "responsive";

export interface Id1CardCredential {
  id?: string;
  name: string;
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
  credential?: Partial<Id1CardCredential>;
  orientation?: Id1CardOrientation;
  size?: Id1CardSize;
  width?: number | string;
  height?: number | string;
  isFlipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
  interactive?: boolean;
  holographic?: boolean;
  holoStrength?: number;
  showGlare?: boolean;
  showElectronics?: boolean;
  showNfcAntenna?: boolean;
  electronicsFinish?: ElectronicsFinish;
  showGuilloche?: boolean;
  guillocheVariant?: GuillocheVariant;
  className?: string;
  testId?: string;
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
