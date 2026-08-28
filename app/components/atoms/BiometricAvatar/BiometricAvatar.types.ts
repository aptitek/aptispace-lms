export const ISO_19794_5_CONSTANTS = {
  standard: "ISO/IEC 19794-5:2011",
  photoWidthMm: 35,
  photoHeightMm: 45,
  aspectRatio: 35 / 45, // 0.7778 (7:9 portrait format)
  faceHeightMinRatio: 0.7, // 70% of frame height (chin to crown)
  faceHeightMaxRatio: 0.8, // 80% of frame height
} as const;

export interface BiometricAvatarProps {
  src?: string;
  alt?: string;
  isPortrait?: boolean;
  showReticle?: boolean;
  height?: number | string;
  width?: number | string;
  aspectRatio?: string;
  borderRadius?: number | string;
  className?: string;
  testId?: string;
}
