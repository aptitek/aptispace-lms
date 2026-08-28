export function hashString(seedStr: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seedStr.length; i += 1) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export class SeededRng {
  private state: number;

  constructor(seed: string | number) {
    this.state = typeof seed === "number" ? seed : hashString(seed);
    if (this.state === 0) this.state = 123456789;
  }

  public next(): number {
    this.state = (this.state * 1664525 + 1013904223) >>> 0;
    return this.state / 4294967296;
  }

  public nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextRange(min, max + 1));
  }
}

// 1D Perlin-like multi-octave harmonic noise based on seed
export function pseudoNoise(theta: number, seed: number, octaves = 3): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxAmp = 0;

  for (let o = 0; o < octaves; o += 1) {
    const phase = ((seed * (o + 1) * 9301 + 49297) % 233280) / 233280;
    value += Math.sin(theta * frequency + phase * Math.PI * 2) * amplitude;
    maxAmp += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxAmp;
}

export interface RosetteConfig {
  cx: number;
  cy: number;
  r1: number;
  r2: number;
  d: number;
  petals: number;
  noiseAmp: number;
  seed: number;
  steps?: number;
}

export function generateProceduralRosette({
  cx,
  cy,
  r1,
  r2,
  d,
  petals,
  noiseAmp,
  seed,
  steps = 360,
}: RosetteConfig): string {
  const points: string[] = [];
  const maxTheta = Math.PI * 2 * petals;

  for (let i = 0; i <= steps; i += 1) {
    const theta = (i / steps) * maxTheta;
    const noiseVal = noiseAmp > 0 ? pseudoNoise(theta, seed) * noiseAmp : 0;

    const radDiff = r1 - r2;
    const ratio = radDiff / r2;

    const rawX = radDiff * Math.cos(theta) + d * Math.cos(ratio * theta);
    const rawY = radDiff * Math.sin(theta) - d * Math.sin(ratio * theta);

    // Apply radial harmonic noise
    const angle = Math.atan2(rawY, rawX);
    const radius = Math.hypot(rawX, rawY) + noiseVal;

    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return `${points.join(" ")} Z`;
}

export interface WaveBandConfig {
  startX: number;
  endX: number;
  baseY: number;
  freq: number;
  amp: number;
  count: number;
  spacing: number;
  seed: number;
  steps?: number;
}

export function generateProceduralWaveBand({
  startX,
  endX,
  baseY,
  freq,
  amp,
  count,
  spacing,
  seed,
  steps = 80,
}: WaveBandConfig): string[] {
  const paths: string[] = [];

  for (let c = 0; c < count; c += 1) {
    const yOffset = baseY + c * spacing;
    const points: string[] = [];

    for (let i = 0; i <= steps; i += 1) {
      const progress = i / steps;
      const x = startX + progress * (endX - startX);
      const theta = progress * Math.PI * 4 * freq;
      const n = pseudoNoise(theta, seed + c);
      const y = yOffset + Math.sin(theta) * amp + n * (amp * 0.4);

      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }

    paths.push(points.join(" "));
  }

  return paths;
}
