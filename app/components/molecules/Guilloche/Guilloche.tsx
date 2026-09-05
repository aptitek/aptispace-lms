import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { type GuillocheProps, GUILLOCHE_VIEWBOX } from "./Guilloche.types";
import {
  hashString,
  calculateProceduralPaths,
  type ProceduralRosetteItem,
} from "./guillocheMath";
import { GuillocheSvg, getGuillocheColors } from "./Guilloche.styles";

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

interface GuillocheDefsProps {
  colors: ReturnType<typeof getGuillocheColors>;
}

function GuillocheDefs({ colors }: GuillocheDefsProps) {
  return (
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
  );
}

function getGuillocheClassName(
  variant: string,
  holographic: boolean,
  className?: string,
): string {
  const isAnimated = holographic || variant === "holo-spectrum";
  return [isAnimated ? "holo-animated" : "", className]
    .filter(Boolean)
    .join(" ");
}

const defaultGuilloche = {
  seed: "APTI-7810-SECURITY",
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

  const className = getGuillocheClassName(
    config.variant,
    config.holographic,
    config.className,
  );

  return (
    <GuillocheSvg
      viewBox={`0 0 ${GUILLOCHE_VIEWBOX.width} ${GUILLOCHE_VIEWBOX.height}`}
      customOpacity={config.opacity}
      className={className}
      data-testid={config.testId}
      aria-hidden="true"
    >
      <GuillocheDefs colors={colors} />

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
