export type ElectronicsFinish = "gold" | "silver" | "copper" | "cyan-laser";

export interface ElectronicsProps {
  finish?: ElectronicsFinish;
  showNfcAntenna?: boolean;
  showChip?: boolean;
  showInnerCoil?: boolean;
  opacity?: number;
  mirrored?: boolean;
  className?: string;
  testId?: string;
}

// ISO/IEC 7810 & 7816 Exact Constants in 856x540 Coordinate Space (0.1mm unit)
export const ISO_ELECTRONICS_CONSTANTS = {
  viewWidth: 856,
  viewHeight: 540,
  // ISO 7816-2 Chip Center
  chipCenterX: 162.5,
  chipCenterY: 244.9,
  chipWidth: 126,
  chipHeight: 104,
  // ISO 14443 Outer NFC Antenna Coil
  outerCoilX: 24,
  outerCoilY: 24,
  outerCoilW: 808,
  outerCoilH: 492,
  outerCoilSpacing: 7,
  outerCoilRadius: 26,
  outerTurns: 4,
  // Inner Coupling Coil
  innerCoilW: 177,
  innerCoilH: 162,
  innerCoilSpacing: 5.5,
  innerCoilRadius: 16,
  innerTurns: 4,
} as const;
