import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { type GuillocheProps, GUILLOCHE_VIEWBOX } from "./Guilloche.types";
import {
  hashString,
  SeededRng,
  generateProceduralRosette,
  generateProceduralWaveBand,
} from "./guillocheMath";
import { GuillocheSvg, getGuillocheColors } from "./Guilloche.styles";

interface ProceduralConfig {
  seedNum: number;
  noiseIntensity: number;
  density: "low" | "medium" | "high";
}

interface ProceduralRosetteItem {
  id: string;
  path: string;
  cx: number;
  cy: number;
  r1: number;
  gradientId: string;
  strokeWidth: number;
  opacity: number;
}

function calculateProceduralPaths({
  seedNum,
  noiseIntensity,
  density,
}: ProceduralConfig) {
  const rng = new SeededRng(seedNum);
  const noiseAmp = noiseIntensity * 16;
  const count = density === "high" ? 6 : density === "low" ? 3 : 4;
  const steps = density === "high" ? 420 : 320;

  const rosettes: ProceduralRosetteItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const cx = rng.nextRange(-60, GUILLOCHE_VIEWBOX.width + 60);
    const cy = rng.nextRange(-50, GUILLOCHE_VIEWBOX.height + 50);
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
    endX: GUILLOCHE_VIEWBOX.width + 40,
    baseY: rng.nextRange(20, 60),
    freq: rng.nextRange(0.2, 0.45),
    amp: rng.nextRange(8, 16),
    count: density === "high" ? 6 : 4,
    spacing: rng.nextRange(4, 7),
    seed: seedNum + 303,
  });

  const botWaves = generateProceduralWaveBand({
    startX: -40,
    endX: GUILLOCHE_VIEWBOX.width + 40,
    baseY: GUILLOCHE_VIEWBOX.height - rng.nextRange(30, 70),
    freq: rng.nextRange(0.25, 0.5),
    amp: rng.nextRange(7, 15),
    count: density === "high" ? 6 : 4,
    spacing: rng.nextRange(4, 7),
    seed: seedNum + 404,
  });

  return { rosettes, topWaves, botWaves };
}

interface WaveGroupProps {
  topWaves: string[];
  botWaves: string[];
}

function WaveGroup({ topWaves, botWaves }: WaveGroupProps) {
  return (
    <g id="guilloche-waves" opacity={0.75}>
      {topWaves.map((wavePath) => (
        <path
          key={`top-wave-${wavePath.slice(0, 16)}`}
          d={wavePath}
          fill="none"
          stroke="url(#holoGradient1)"
          strokeWidth={0.85}
        />
      ))}
      {botWaves.map((wavePath) => (
        <path
          key={`bot-wave-${wavePath.slice(0, 16)}`}
          d={wavePath}
          fill="none"
          stroke="url(#holoGradient2)"
          strokeWidth={0.85}
        />
      ))}
    </g>
  );
}

interface RosetteGroupProps {
  rosettes: ProceduralRosetteItem[];
  accentColor: string;
}

function RosetteGroup({ rosettes, accentColor }: RosetteGroupProps) {
  return (
    <g id="guilloche-rosettes">
      {rosettes.map((rosette, index) => (
        <path
          key={rosette.id}
          d={rosette.path}
          fill="none"
          stroke={index === 2 ? accentColor : `url(#${rosette.gradientId})`}
          strokeWidth={rosette.strokeWidth}
          opacity={rosette.opacity}
        />
      ))}
    </g>
  );
}

interface RingGroupProps {
  rosettes: ProceduralRosetteItem[];
  strokePrimary: string;
  strokeSecondary: string;
}

function RingGroup({
  rosettes,
  strokePrimary,
  strokeSecondary,
}: RingGroupProps) {
  return (
    <g id="guilloche-rings" opacity={0.45}>
      {rosettes.slice(0, 3).map((rosette) => (
        <g key={`ring-${rosette.id}`}>
          <circle
            cx={rosette.cx}
            cy={rosette.cy}
            r={rosette.r1 * 0.55}
            fill="none"
            stroke={strokePrimary}
            strokeWidth={0.6}
            strokeDasharray="3 3"
          />
          <circle
            cx={rosette.cx}
            cy={rosette.cy}
            r={rosette.r1 * 0.72}
            fill="none"
            stroke={strokeSecondary}
            strokeWidth={0.5}
          />
        </g>
      ))}
    </g>
  );
}

const defaultGuilloche = {
  seed: "APTI-7810-CADET-SECURITY",
  variant: "holo-spectrum" as const,
  density: "medium" as const,
  showWaves: true,
  showRosettes: true,
  showConcentricRings: true,
  noiseIntensity: 0.5,
  opacity: 0.35,
  holographic: true,
  holoStrength: 0.7,
  testId: "guilloche-canvas",
};

export default function Guilloche(props: GuillocheProps) {
  const config = { ...defaultGuilloche, ...props };
  const theme = useTheme();
  const colors = useMemo(
    () => getGuillocheColors(config.variant, theme),
    [config.variant, theme],
  );
  const seedNum = useMemo(() => hashString(config.seed), [config.seed]);

  const procedural = useMemo(
    () =>
      calculateProceduralPaths({
        seedNum,
        noiseIntensity: config.noiseIntensity,
        density: config.density,
      }),
    [seedNum, config.noiseIntensity, config.density],
  );

  return (
    <GuillocheSvg
      viewBox={`0 0 ${GUILLOCHE_VIEWBOX.width} ${GUILLOCHE_VIEWBOX.height}`}
      customOpacity={config.opacity}
      className={`${config.variant === "holo-spectrum" ? "holo-animated" : ""} ${
        config.className || ""
      }`.trim()}
      data-testid={config.testId}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="holoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.strokePrimary} />
          <stop offset="50%" stopColor={colors.strokeSecondary} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>
        <linearGradient id="holoGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.strokeSecondary} />
          <stop offset="70%" stopColor={colors.strokeTertiary} />
          <stop offset="100%" stopColor={colors.strokePrimary} />
        </linearGradient>
      </defs>

      {config.showWaves && (
        <WaveGroup
          topWaves={procedural.topWaves}
          botWaves={procedural.botWaves}
        />
      )}

      {config.showRosettes && (
        <RosetteGroup
          rosettes={procedural.rosettes}
          accentColor={colors.accent}
        />
      )}

      {config.showConcentricRings && (
        <RingGroup
          rosettes={procedural.rosettes}
          strokePrimary={colors.strokePrimary}
          strokeSecondary={colors.strokeSecondary}
        />
      )}
    </GuillocheSvg>
  );
}
