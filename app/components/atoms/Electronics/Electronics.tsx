import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import {
  type ElectronicsProps,
  type ElectronicsChipView,
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

interface ChipPadsProps {
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
}: ChipPadsProps) {
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
    <g id="iso7816-chip-front" filter="url(#chipGlow)">
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

function ChipBackView({
  cx,
  cy,
  width,
  height,
  primaryColor,
  highlightColor,
  grooveColor,
}: ChipPadsProps) {
  const x = cx - width / 2;
  const y = cy - height / 2;

  const wireBonds = [
    `M ${cx - 10} ${cy - 12} L ${x + 12} ${y + 16}`,
    `M ${cx - 10} ${cy} L ${x + 10} ${cy}`,
    `M ${cx - 10} ${cy + 12} L ${x + 12} ${y + height - 16}`,
    `M ${cx + 10} ${cy - 12} L ${x + width - 12} ${y + 16}`,
    `M ${cx + 10} ${cy} L ${x + width - 10} ${cy}`,
    `M ${cx + 10} ${cy + 12} L ${x + width - 12} ${y + height - 16}`,
  ];

  return (
    <g id="iso7816-chip-backview" filter="url(#chipGlow)">
      {/* Milled Substrate Cavity Pocket */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={grooveColor}
        stroke={primaryColor}
        strokeWidth={1.2}
        strokeDasharray="4 2"
        opacity={0.7}
      />

      {/* Internal Lead Frame Terminal Blocks */}
      <rect
        x={x + 6}
        y={y + 6}
        width={24}
        height={height - 12}
        rx={4}
        fill="url(#metalGradient)"
        opacity={0.35}
      />
      <rect
        x={x + width - 30}
        y={y + 6}
        width={24}
        height={height - 12}
        rx={4}
        fill="url(#metalGradient)"
        opacity={0.35}
      />

      {/* Black Epoxy Resin Encapsulation Dome */}
      <circle
        cx={cx}
        cy={cy}
        r={32}
        fill={grooveColor}
        stroke={primaryColor}
        strokeWidth={1}
        opacity={0.95}
      />
      <circle
        cx={cx - 6}
        cy={cy - 6}
        r={28}
        fill="none"
        stroke={highlightColor}
        strokeWidth={0.5}
        opacity={0.3}
      />

      {/* Silicon Microcontroller Die */}
      <rect
        x={cx - 11}
        y={cy - 13}
        width={22}
        height={26}
        rx={2}
        fill={grooveColor}
        stroke={highlightColor}
        strokeWidth={1}
      />
      <line
        x1={cx - 7}
        y1={cy - 7}
        x2={cx + 7}
        y2={cy - 7}
        stroke={primaryColor}
        strokeWidth={0.6}
        opacity={0.8}
      />
      <line
        x1={cx - 7}
        y1={cy}
        x2={cx + 7}
        y2={cy}
        stroke={primaryColor}
        strokeWidth={0.6}
        opacity={0.8}
      />
      <line
        x1={cx - 7}
        y1={cy + 7}
        x2={cx + 7}
        y2={cy + 7}
        stroke={primaryColor}
        strokeWidth={0.6}
        opacity={0.8}
      />

      {/* Micro Bonding Wire Paths */}
      {wireBonds.map((d) => (
        <path
          key={`wire-${d.slice(0, 16)}`}
          d={d}
          fill="none"
          stroke={highlightColor}
          strokeWidth={0.9}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
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
      <path
        d="M 51 45 V 148 A 16 16 0 0 0 67 164 H 86"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 51 495 V 342 A 16 16 0 0 1 67 326 H 86"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function resolveChipViewType(
  chipView: ElectronicsChipView | undefined,
  showChip: boolean | undefined,
  side: "front" | "back" | undefined,
  mirrored: boolean | undefined,
): "front" | "back" | "none" {
  if (showChip === false || chipView === "none") return "none";
  if (chipView === "back" || chipView === "front") return chipView;
  if (side === "back" || mirrored === true) return "back";
  return "front";
}

function getElectronicsTransform(
  isMirrored: boolean,
  rotation?: number,
): string | undefined {
  const parts: string[] = [];
  if (isMirrored) {
    parts.push("translate(856, 0) scale(-1, 1)");
  }
  if (rotation && rotation % 360 !== 0) {
    parts.push(`rotate(${rotation} 428 270)`);
  }
  return parts.length > 0 ? parts.join(" ") : undefined;
}

const defaultElectronics = {
  finish: "gold" as const,
  chipPosition: "left" as const,
  rotation: 0,
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

  const isMirrored =
    (config.chipPosition === "right") !==
    (config.mirrored || config.side === "back");
  const chipViewType = resolveChipViewType(
    props.chipView,
    config.showChip,
    props.side,
    config.mirrored,
  );
  const transformAttr = useMemo(
    () => getElectronicsTransform(isMirrored, config.rotation),
    [isMirrored, config.rotation],
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

  const chipElement = useMemo(() => {
    if (chipViewType === "none") return null;
    const padProps: ChipPadsProps = {
      cx: ISO_ELECTRONICS_CONSTANTS.chipCenterX,
      cy: ISO_ELECTRONICS_CONSTANTS.chipCenterY,
      width: ISO_ELECTRONICS_CONSTANTS.chipWidth,
      height: ISO_ELECTRONICS_CONSTANTS.chipHeight,
      primaryColor: colors.primary,
      highlightColor: colors.highlight,
      grooveColor: colors.groove,
    };
    if (chipViewType === "back") {
      return <ChipBackView {...padProps} />;
    }
    return <ChipContactPads {...padProps} />;
  }, [chipViewType, colors]);

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

      <g transform={transformAttr}>
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

        {config.showNfcAntenna && config.showInnerCoil && (
          <CoilConnectors primaryColor={colors.primary} />
        )}

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

        {chipElement}
      </g>
    </SvgLayer>
  );
}
