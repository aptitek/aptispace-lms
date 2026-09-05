export type GuillocheVariant =
  | "holo-spectrum"
  | "solarized-gold"
  | "cyber-cyan"
  | "deep-space"
  | "cosmic-crimson";

export type GuillocheDensity = "low" | "medium" | "high";

export interface GuillocheProps {
  seed?: string;
  variant?: GuillocheVariant;
  density?: GuillocheDensity;
  showWaves?: boolean;
  showRosettes?: boolean;
  showConcentricRings?: boolean;
  noiseIntensity?: number; // 0 to 1
  opacity?: number;
  holographic?: boolean;
  holoStrength?: number;
  className?: string;
  testId?: string;
}

export const GUILLOCHE_VIEWBOX = {
  width: 856,
  height: 540,
} as const;
