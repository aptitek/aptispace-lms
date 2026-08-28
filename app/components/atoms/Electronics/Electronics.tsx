import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import {
  type ElectronicsProps,
  ISO_ELECTRONICS_CONSTANTS,
} from "./Electronics.types";
import { SvgLayer, getFinishColors } from "./Electronics.styles";

export interface SpiralOptions {
  turns: number;
  baseX: number;
  baseY: number;
  baseW: number;
  baseH: number;
  spacing: number;
  baseRadius: number;
}

export function generateSpiralPath({
  turns,
  baseX,
  baseY,
  baseW,
  baseH,
  spacing,
  baseRadius,
}: SpiralOptions): string {
  const commands: string[] = [];
  const startX = baseX + baseRadius;
  const startY = baseY;

  commands.push(`M ${startX.toFixed(2)} ${startY.toFixed(2)}`);

  for (let i = 0; i < turns; i += 1) {
    const x = baseX + i * spacing;
    const y = baseY + i * spacing;
    const w = baseW - 2 * i * spacing;
    const h = baseH - 2 * i * spacing;
    const r = Math.max(6, baseRadius - i * spacing);
    const nextY = y + spacing;
    const nextR = Math.max(6, baseRadius - (i + 1) * spacing);

    commands.push(`H ${(x + w - r).toFixed(2)}`);
    commands.push(
      `A ${r} ${r} 0 0 1 ${(x + w).toFixed(2)} ${(y + r).toFixed(2)}`,
    );
    commands.push(`V ${(y + h - r).toFixed(2)}`);
    commands.push(
      `A ${r} ${r} 0 0 1 ${(x + w - r).toFixed(2)} ${(y + h).toFixed(2)}`,
    );
    commands.push(`H ${(x + r).toFixed(2)}`);
    commands.push(
      `A ${r} ${r} 0 0 1 ${x.toFixed(2)} ${(y + h - r).toFixed(2)}`,
    );
    commands.push(`V ${(y + r).toFixed(2)}`);
    commands.push(`A ${r} ${r} 0 0 1 ${(x + r).toFixed(2)} ${y.toFixed(2)}`);

    if (i < turns - 1) {
      commands.push(
        `C ${(x + r * 1.5).toFixed(2)} ${y.toFixed(2)}, ${(x + r * 1.5).toFixed(2)} ${nextY.toFixed(2)}, ${(x + spacing + nextR).toFixed(2)} ${nextY.toFixed(2)}`,
      );
    }
  }

  return commands.join(" ");
}

interface ChipContactPadsProps {
  cx: number;
  cy: number;
  width: number;
  height: number;
  primaryColor: string;
  highlightColor: string;
  grooveColor: string;
}

function ChipContactPads({
  cx,
  cy,
  width,
  height,
  primaryColor,
  highlightColor,
  grooveColor,
}: ChipContactPadsProps) {
  const x = cx - width / 2;
  const y = cy - height / 2;
  const colW = width / 2;
  const rowH = height / 4;

  const padCoords = [
    { x, y, label: "C1" },
    { x, y: y + rowH, label: "C2" },
    { x, y: y + rowH * 2, label: "C3" },
    { x, y: y + rowH * 3, label: "C4" },
    { x: x + colW, y, label: "C5" },
    { x: x + colW, y: y + rowH, label: "C6" },
    { x: x + colW, y: y + rowH * 2, label: "C7" },
    { x: x + colW, y: y + rowH * 3, label: "C8" },
  ];

  return (
    <g id="iso7816-chip" filter="url(#chipGlow)">
      {/* Outer Chip Bevel Frame */}
      <rect
        x={x - 2}
        y={y - 2}
        width={width + 4}
        height={height + 4}
        rx={10}
        fill={grooveColor}
        opacity={0.8}
      />

      {/* Gold/Metal Base Carrier */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill="url(#metalGradient)"
        stroke={primaryColor}
        strokeWidth={1}
      />

      {/* Individual 8-Pin Contact Isolation Grooves */}
      {padCoords.map((pad) => (
        <rect
          key={pad.label}
          x={pad.x + 1.5}
          y={pad.y + 1.5}
          width={colW - 3}
          height={rowH - 3}
          rx={3}
          fill="none"
          stroke={grooveColor}
          strokeWidth={1.2}
          opacity={0.9}
        />
      ))}

      {/* Center Microcontroller Silicon Die Outline */}
      <rect
        x={cx - 18}
        y={cy - 22}
        width={36}
        height={44}
        rx={4}
        fill="none"
        stroke={highlightColor}
        strokeWidth={1}
        strokeDasharray="2 2"
        opacity={0.7}
      />
    </g>
  );
}

function CoilConnectors({ primaryColor }: { primaryColor: string }) {
  return (
    <g
      id="coil-feed-connectors"
      stroke={primaryColor}
      strokeWidth={1.5}
      fill="none"
    >
      {/* Top track: smooth 90deg elbow directly meeting top edge of inner coil */}
      <path
        d="M 51 45 V 148 A 16 16 0 0 0 67 164 H 86"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom track: smooth symmetrical elbow directly meeting bottom edge of inner coil */}
      <path
        d="M 51 495 V 342 A 16 16 0 0 1 67 326 H 86"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

const defaultElectronics = {
  finish: "gold" as const,
  showNfcAntenna: true,
  showChip: true,
  showInnerCoil: true,
  opacity: 0.85,
  mirrored: false,
  testId: "smartcard-electronics",
};

export default function Electronics(props: ElectronicsProps) {
  const config = { ...defaultElectronics, ...props };
  const theme = useTheme();
  const colors = useMemo(
    () => getFinishColors(config.finish, theme),
    [config.finish, theme],
  );

  const outerCoilPath = useMemo(() => {
    return generateSpiralPath({
      turns: ISO_ELECTRONICS_CONSTANTS.outerTurns,
      baseX: ISO_ELECTRONICS_CONSTANTS.outerCoilX,
      baseY: ISO_ELECTRONICS_CONSTANTS.outerCoilY,
      baseW: ISO_ELECTRONICS_CONSTANTS.outerCoilW,
      baseH: ISO_ELECTRONICS_CONSTANTS.outerCoilH,
      spacing: ISO_ELECTRONICS_CONSTANTS.outerCoilSpacing,
      baseRadius: ISO_ELECTRONICS_CONSTANTS.outerCoilRadius,
    });
  }, []);

  const innerCoilPath = useMemo(() => {
    const innerX =
      ISO_ELECTRONICS_CONSTANTS.chipCenterX -
      ISO_ELECTRONICS_CONSTANTS.innerCoilW / 2;
    const innerY =
      ISO_ELECTRONICS_CONSTANTS.chipCenterY -
      ISO_ELECTRONICS_CONSTANTS.innerCoilH / 2;
    return generateSpiralPath({
      turns: ISO_ELECTRONICS_CONSTANTS.innerTurns,
      baseX: innerX,
      baseY: innerY,
      baseW: ISO_ELECTRONICS_CONSTANTS.innerCoilW,
      baseH: ISO_ELECTRONICS_CONSTANTS.innerCoilH,
      spacing: ISO_ELECTRONICS_CONSTANTS.innerCoilSpacing,
      baseRadius: ISO_ELECTRONICS_CONSTANTS.innerCoilRadius,
    });
  }, []);

  const contentGroup = (
    <g
      transform={config.mirrored ? "translate(856, 0) scale(-1, 1)" : undefined}
    >
      {/* ISO 14443 Outer NFC Antenna Perimeter Track */}
      {config.showNfcAntenna && (
        <path
          d={outerCoilPath}
          fill="none"
          stroke={colors.primary}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />
      )}

      {/* Solid Inter-Coil Feed Traces connecting outer antenna and inner coupling coil without round circles */}
      {config.showNfcAntenna && config.showInnerCoil && (
        <CoilConnectors primaryColor={colors.primary} />
      )}

      {/* Inner Inductive Coupling Coil */}
      {config.showInnerCoil && (
        <path
          d={innerCoilPath}
          fill="none"
          stroke={colors.primary}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55}
        />
      )}

      {/* ISO 7816-2 Smart Contact Chip */}
      {config.showChip && (
        <ChipContactPads
          cx={ISO_ELECTRONICS_CONSTANTS.chipCenterX}
          cy={ISO_ELECTRONICS_CONSTANTS.chipCenterY}
          width={ISO_ELECTRONICS_CONSTANTS.chipWidth}
          height={ISO_ELECTRONICS_CONSTANTS.chipHeight}
          primaryColor={colors.primary}
          highlightColor={colors.highlight}
          grooveColor={colors.groove}
        />
      )}
    </g>
  );

  return (
    <SvgLayer
      viewBox={`0 0 ${ISO_ELECTRONICS_CONSTANTS.viewWidth} ${ISO_ELECTRONICS_CONSTANTS.viewHeight}`}
      customOpacity={config.opacity}
      className={config.className}
      data-testid={config.testId}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="45%" stopColor={colors.highlight} />
          <stop offset="70%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.glow} />
        </linearGradient>

        <filter id="chipGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="4"
            floodColor={colors.glow}
            floodOpacity={0.4}
          />
        </filter>
      </defs>

      {contentGroup}
    </SvgLayer>
  );
}
