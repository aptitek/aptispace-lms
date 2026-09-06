import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

export interface MaterialSymbolProps {
  /**
   * Material Symbol ligature name (e.g., 'search', 'close', 'school', 'settings')
   */
  name: string;
  /**
   * Font weight axis (MD3 default: 500 medium, or 600 semi-bold)
   */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /**
   * Fill axis (MD3 default: 0 unfilled / outline)
   */
  fill?: 0 | 1;
  /**
   * Grade axis (-25 to 200, default: 0)
   */
  grad?: number;
  /**
   * Optical size axis in pixels (20, 24, 40, 48, default: 24)
   */
  opsz?: number;
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

function resolveFontVariation(
  fill: number = 0,
  weight: number = 500,
  grad: number = 0,
  opsz: number = 24,
): string {
  return `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grad}, 'opsz' ${opsz}`;
}

/**
 * MaterialSymbol: Native Material Design 3 icon component rendered using
 * the Material Symbols Rounded variable font.
 * Defaults strictly to Rounded, Medium weight (500), and Unfilled (FILL: 0).
 */
export function MaterialSymbol(props: MaterialSymbolProps) {
  const {
    name,
    weight,
    fill,
    grad,
    opsz,
    size,
    color = "inherit",
    className,
    sx,
    "aria-label": ariaLabel,
    "aria-hidden": ariaHidden,
    id,
    "data-testid": testId = "material-symbol",
  } = props;

  const isAriaHidden = ariaHidden !== undefined ? ariaHidden : !ariaLabel;
  const dimension = formatDimension(size);
  const variationSettings = resolveFontVariation(fill, weight, grad, opsz);
  const combinedClass = className
    ? `material-symbols-rounded ${className}`
    : "material-symbols-rounded";

  return (
    <Box
      component="span"
      id={id}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-hidden={isAriaHidden}
      className={combinedClass}
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
        ...sx,
      }}
    >
      {name}
    </Box>
  );
}

export default MaterialSymbol;
