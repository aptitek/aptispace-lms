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

export interface ProceduralRosetteItem {
  id: string;
  path: string;
  cx: number;
  cy: number;
  r1: number;
  gradientId: string;
  strokeWidth: number;
  opacity: number;
}

export interface ProceduralPathsConfig {
  seedNum: number;
  noiseIntensity: number;
  density: "low" | "medium" | "high";
}

export function calculateProceduralPaths({
  seedNum,
  noiseIntensity,
  density,
}: ProceduralPathsConfig) {
  const rng = new SeededRng(seedNum);
  const noiseAmp = noiseIntensity * 16;
  const count = density === "high" ? 6 : density === "low" ? 3 : 4;
  const steps = density === "high" ? 420 : 320;

  const rosettes: ProceduralRosetteItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const cx = rng.nextRange(-60, 916);
    const cy = rng.nextRange(-50, 590);
    const r1 = rng.nextRange(110, 320);
    const r2 = rng.nextRange(24, 72);
    const d = rng.nextRange(30, 85);
    const petals = rng.nextInt(4, 11);
    const seedOffset = seedNum + index * 107;

    const path = generateProceduralRosette({
      cx,
      cy,
      r1,
      r2,
      d,
      petals,
      noiseAmp: noiseAmp * rng.nextRange(0.6, 1.2),
      seed: seedOffset,
      steps,
    });

    rosettes.push({
      id: `rosette-${index}-${seedOffset}`,
      path,
      cx,
      cy,
      r1,
      gradientId: index % 2 === 0 ? "holoGradient1" : "holoGradient2",
      strokeWidth: rng.nextRange(0.75, 1.25),
      opacity: rng.nextRange(0.55, 0.85),
    });
  }

  const topWaves = generateProceduralWaveBand({
    startX: -40,
    endX: 896,
    baseY: rng.nextRange(20, 60),
    freq: rng.nextRange(0.2, 0.45),
    amp: rng.nextRange(8, 16),
    count: density === "high" ? 6 : 4,
    spacing: rng.nextRange(4, 7),
    seed: seedNum + 303,
  });

  const botWaves = generateProceduralWaveBand({
    startX: -40,
    endX: 896,
    baseY: 540 - rng.nextRange(30, 70),
    freq: rng.nextRange(0.25, 0.5),
    amp: rng.nextRange(7, 15),
    count: density === "high" ? 6 : 4,
    spacing: rng.nextRange(4, 7),
    seed: seedNum + 404,
  });

  return { rosettes, topWaves, botWaves };
}

export interface GuillocheMaskOptions {
  seed: string;
  density?: "low" | "medium" | "high";
  noiseIntensity?: number;
  showWaves?: boolean;
  showRosettes?: boolean;
  showConcentricRings?: boolean;
}

function renderWaveSvgElements(
  topWaves: string[],
  botWaves: string[],
): string[] {
  const result: string[] = [];
  for (const w of topWaves) {
    result.push(
      `<path d="${w}" fill="none" stroke="white" stroke-width="1.3"/>`,
    );
  }
  for (const w of botWaves) {
    result.push(
      `<path d="${w}" fill="none" stroke="white" stroke-width="1.3"/>`,
    );
  }
  return result;
}

function renderRosetteSvgElements(rosettes: ProceduralRosetteItem[]): string[] {
  const result: string[] = [];
  for (const r of rosettes) {
    const width = Math.max(1, r.strokeWidth * 1.5);
    result.push(
      `<path d="${r.path}" fill="none" stroke="white" stroke-width="${width}" opacity="${r.opacity}"/>`,
    );
  }
  return result;
}

function renderRingSvgElements(rosettes: ProceduralRosetteItem[]): string[] {
  const result: string[] = [];
  for (const r of rosettes.slice(0, 3)) {
    result.push(
      `<circle cx="${r.cx.toFixed(1)}" cy="${r.cy.toFixed(1)}" r="${(r.r1 * 0.55).toFixed(1)}" fill="none" stroke="white" stroke-width="0.9" stroke-dasharray="3 3"/>`,
    );
    result.push(
      `<circle cx="${r.cx.toFixed(1)}" cy="${r.cy.toFixed(1)}" r="${(r.r1 * 0.72).toFixed(1)}" fill="none" stroke="white" stroke-width="0.8"/>`,
    );
  }
  return result;
}

export function generateGuillocheMaskDataUrl(
  opts: GuillocheMaskOptions,
): string {
  const seed = opts.seed;
  const density = opts.density || "medium";
  const noiseIntensity =
    opts.noiseIntensity !== undefined ? opts.noiseIntensity : 0.5;

  const procedural = calculateProceduralPaths({
    seedNum: hashString(seed),
    noiseIntensity,
    density,
  });

  const elements: string[] = [];

  if (opts.showWaves !== false) {
    elements.push(
      ...renderWaveSvgElements(procedural.topWaves, procedural.botWaves),
    );
  }

  if (opts.showRosettes !== false) {
    elements.push(...renderRosetteSvgElements(procedural.rosettes));
  }

  if (opts.showConcentricRings !== false) {
    elements.push(...renderRingSvgElements(procedural.rosettes));
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 856 540" width="100%" height="100%">${elements.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
