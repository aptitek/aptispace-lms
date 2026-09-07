import React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

export type IconWeight =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "thin"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold";

export interface IconProps {
  /**
   * Material Symbol ligature name (e.g., 'search', 'close', 'school', 'settings')
   */
  name: string;
  /**
   * Font weight axis (MD3 default: 500 medium)
   */
  weight?: IconWeight | number | string;
  /**
   * Fill axis (MD3 default: false / 0 unfilled)
   */
  fill?: boolean | 0 | 1 | number | string;
  /**
   * Grade axis (-25 to 200, default: 0)
   */
  grad?: number | string;
  /**
   * Optical size axis in pixels (20, 24, 40, 48, default: derived from size or 24)
   */
  opsz?: number | string;
  /**
   * Display size in pixels or CSS units (default: 24px)
   */
  size?: number | string;
  /**
   * Color token or CSS color string (defaults to 'inherit')
   */
  color?: string;
  className?: string;
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  id?: string;
  "data-testid"?: string;
}

function formatDimension(dim?: number | string): string {
  if (typeof dim === "number") {
    return `${dim}px`;
  }
  return dim || "24px";
}

function resolveNumericSize(dim?: number | string): number {
  if (typeof dim === "number") return dim;
  if (typeof dim === "string") {
    const parsed = parseFloat(dim);
    if (!isNaN(parsed)) return parsed;
  }
  return 24;
}

const WEIGHT_MAP: Record<string, number> = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

function resolveWeight(weight?: IconWeight | number | string): number {
  if (typeof weight === "number") return weight;
  if (typeof weight === "string") {
    const parsed = parseInt(weight, 10);
    if (!isNaN(parsed) && parsed >= 100 && parsed <= 900) {
      return parsed;
    }
    return WEIGHT_MAP[weight] ?? 500;
  }
  return 500;
}

function resolveFill(fill?: boolean | 0 | 1 | number | string): number {
  if (typeof fill === "boolean") return fill ? 1 : 0;
  if (typeof fill === "number") return fill > 0 ? 1 : 0;
  if (typeof fill === "string") {
    const trimmed = fill.trim().toLowerCase();
    if (trimmed === "true" || trimmed === "1" || trimmed === "fill") return 1;
    return 0;
  }
  return 0;
}

function resolveGrad(grad?: number | string): number {
  if (typeof grad === "number") return grad;
  if (typeof grad === "string") {
    const parsed = parseFloat(grad);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

function resolveOpsz(opsz?: number | string, size?: number | string): number {
  if (typeof opsz === "number") return opsz;
  if (typeof opsz === "string") {
    const parsed = parseFloat(opsz);
    if (!isNaN(parsed)) return parsed;
  }
  const numSize = resolveNumericSize(size);
  if (numSize <= 20) return 20;
  if (numSize <= 24) return 24;
  if (numSize <= 40) return 40;
  return 48;
}

function resolveFontVariation(
  fill: number = 0,
  weight: number = 500,
  grad: number = 0,
  opsz: number = 24,
): string {
  return `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grad}, 'opsz' ${opsz}`;
}

/**
 * Icon: Native Material Design 3 icon component rendered using
 * the Material Symbols Rounded variable font.
 * Defaults strictly to Rounded, Medium weight (500), and Unfilled (FILL: 0).
 */
export function Icon(props: IconProps) {
  const {
    name,
    weight,
    fill,
    grad = 0,
    opsz,
    size,
    color = "inherit",
    className,
    sx,
    style,
    "aria-label": ariaLabel,
    "aria-hidden": ariaHidden,
    id,
    "data-testid": testId = "icon",
  } = props;

  const isAriaHidden = ariaHidden !== undefined ? ariaHidden : !ariaLabel;
  const dimension = formatDimension(size);
  const resolvedFill = resolveFill(fill);
  const resolvedWeight = resolveWeight(weight);
  const resolvedGrad = resolveGrad(grad);
  const resolvedOpsz = resolveOpsz(opsz, size);
  const variationSettings = resolveFontVariation(
    resolvedFill,
    resolvedWeight,
    resolvedGrad,
    resolvedOpsz,
  );

  const combinedClass = className
    ? `material-symbols-rounded ${className}`
    : "material-symbols-rounded";

  const iconStyle: React.CSSProperties = {
    fontVariationSettings: variationSettings,
    fontWeight: resolvedWeight,
    fontOpticalSizing: opsz !== undefined ? "none" : undefined,
    ...style,
  };

  return (
    <Box
      component="span"
      id={id}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-hidden={isAriaHidden}
      className={combinedClass}
      style={iconStyle}
      sx={{
        fontFamily: '"Material Symbols Rounded", sans-serif',
        fontSize: dimension,
        width: dimension,
        height: dimension,
        lineHeight: 1,
        color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        verticalAlign: "middle",
        flexShrink: 0,
        fontVariationSettings: variationSettings,
        fontWeight: resolvedWeight,
        fontOpticalSizing: opsz !== undefined ? "none" : undefined,
        ...sx,
      }}
    >
      {name}
    </Box>
  );
}

export default Icon;
