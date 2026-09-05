import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import Guilloche from "./Guilloche";
import {
  hashString,
  SeededRng,
  pseudoNoise,
  generateProceduralRosette,
  generateProceduralWaveBand,
  calculateProceduralPaths,
  generateGuillocheMaskDataUrl,
} from "./guillocheMath";

describe("Guilloche Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing with default props", () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <Guilloche />
      </ThemeProvider>,
    );
    const svgElement = container.querySelector("svg");
    expect(svgElement).not.toBeNull();
  });

  it("renders with custom seed, density, and opacity", () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <Guilloche
          seed="APTI-SECURE-99"
          density="high"
          opacity={0.8}
          noiseIntensity={0.6}
        />
      </ThemeProvider>,
    );
    const svgElement = container.querySelector("svg");
    expect(svgElement).not.toBeNull();
    expect(svgElement?.getAttribute("viewBox")).toBe("0 0 856 540");
  });
});

describe("Guilloche Math & Procedural Generator", () => {
  it("exports Guilloche component", () => {
    expect(Guilloche).toBeDefined();
    expect(typeof Guilloche).toBe("function");
  });

  it("produces deterministic hashes for string seeds", () => {
    const hash1 = hashString("APTI-7810-0942");
    const hash2 = hashString("APTI-7810-0942");
    const hash3 = hashString("APTI-7810-OTHER");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(typeof hash1).toBe("number");
  });

  it("generates consistent seeded pseudo-random values", () => {
    const rng1 = new SeededRng("SEED-ALPHA");
    const val1 = rng1.next();
    const rng2 = new SeededRng("SEED-ALPHA");
    const val2 = rng2.next();

    expect(val1).toBe(val2);
    expect(val1).toBeGreaterThanOrEqual(0);
    expect(val1).toBeLessThan(1);
  });

  it("evaluates smooth harmonic pseudo-noise", () => {
    const noise0 = pseudoNoise(0, 12345);
    const noisePi = pseudoNoise(Math.PI, 12345);

    expect(typeof noise0).toBe("number");
    expect(typeof noisePi).toBe("number");
    expect(Math.abs(noise0)).toBeLessThanOrEqual(1);
  });

  it("generates closed SVG rosette path with noise modulation", () => {
    const rosette = generateProceduralRosette({
      cx: 400,
      cy: 270,
      r1: 150,
      r2: 40,
      d: 50,
      petals: 7,
      noiseAmp: 5,
      seed: 98765,
      steps: 120,
    });

    expect(rosette).toBeDefined();
    expect(rosette.startsWith("M ")).toBe(true);
    expect(rosette.endsWith(" Z")).toBe(true);
  });

  it("generates procedural wave bands", () => {
    const waves = generateProceduralWaveBand({
      startX: 0,
      endX: 800,
      baseY: 50,
      freq: 0.3,
      amp: 8,
      count: 3,
      spacing: 4,
      seed: 42,
    });

    expect(waves).toHaveLength(3);
    expect(waves[0].startsWith("M ")).toBe(true);
  });

  it("calculates complete procedural paths for card face", () => {
    const paths = calculateProceduralPaths({
      seedNum: hashString("TEST-SEED"),
      noiseIntensity: 0.5,
      density: "medium",
    });

    expect(paths.rosettes.length).toBeGreaterThanOrEqual(3);
    expect(paths.topWaves.length).toBeGreaterThanOrEqual(4);
    expect(paths.botWaves.length).toBeGreaterThanOrEqual(4);
  });

  it("generates valid SVG data URL for holographic foil masking", () => {
    const dataUrl = generateGuillocheMaskDataUrl({
      seed: "APTI-7810-HOLO",
      density: "medium",
      noiseIntensity: 0.5,
    });

    expect(dataUrl).toBeDefined();
    expect(dataUrl.startsWith("data:image/svg+xml;utf8,")).toBe(true);
    const decoded = decodeURIComponent(dataUrl);
    expect(decoded).toContain("<svg");
    expect(decoded).toContain("viewBox");
  });
});
