export type GuillocheVariant =
  | "holo-spectrum"
  | "solarized-gold"
  | "cyber-cyan"
  | "deep-space"
  | "cosmic-crimson";

export interface GuillocheProps {
  seed?: string;
  variant?: GuillocheVariant;
  density?: "low" | "medium" | "high";
  showWaves?: boolean;
  showRosettes?: boolean;
  showConcentricRings?: boolean;
  noiseIntensity?: number; // 0 to 1
  opacity?: number;
  className?: string;
  testId?: string;
}

export const GUILLOCHE_VIEWBOX = {
  width: 856,
  height: 540,
} as const;
