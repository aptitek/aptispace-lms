import { lighten, type Theme } from "@mui/material/styles";

export interface GalaxyStarColors {
  red?: string;
  orange?: string;
  yellow?: string;
  white?: string;
  blue?: string;
}

export interface ResolvedGalaxyColors {
  red: [number, number, number];
  orange: [number, number, number];
  yellow: [number, number, number];
  white: [number, number, number];
  blue: [number, number, number];
  background: [number, number, number];
}

export function parseHex(hexStr: string): [number, number, number] {
  const cleanHex = hexStr.replace(/^#/, "");
  if (cleanHex.length === 3 || cleanHex.length === 4) {
    return [
      parseInt(cleanHex[0] + cleanHex[0], 16) / 255,
      parseInt(cleanHex[1] + cleanHex[1], 16) / 255,
      parseInt(cleanHex[2] + cleanHex[2], 16) / 255,
    ];
  }
  return [
    parseInt(cleanHex.slice(0, 2), 16) / 255,
    parseInt(cleanHex.slice(2, 4), 16) / 255,
    parseInt(cleanHex.slice(4, 6), 16) / 255,
  ];
}

export function parseColorToRgb(color: string): [number, number, number] {
  if (!color) return [1, 1, 1];
  const trimmed = color.trim().toLowerCase();
  if (trimmed.startsWith("#")) {
    return parseHex(trimmed);
  }
  if (trimmed.startsWith("rgb")) {
    const match = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [
        parseInt(match[1], 10) / 255,
        parseInt(match[2], 10) / 255,
        parseInt(match[3], 10) / 255,
      ];
    }
  }
  return [1, 1, 1];
}

export function resolveBackgroundHex(theme: Theme, customBg?: string): string {
  if (customBg) {
    return customBg;
  }
  return theme.palette.background.default || theme.palette.common.black;
}

export function getStellarColors(
  palette: Theme["palette"],
): ResolvedGalaxyColors {
  return {
    red: parseColorToRgb(palette.error.main),
    orange: parseColorToRgb(palette.warning.main),
    yellow: parseColorToRgb(
      lighten(palette.warning.light || palette.warning.main, 0.4),
    ),
    white: parseColorToRgb(palette.text.primary),
    blue: parseColorToRgb(palette.info.main),
    background: parseColorToRgb(palette.background.default),
  };
}

export function resolveThemeColors(
  theme: Theme,
  starColors?: GalaxyStarColors,
  customBg?: string,
): ResolvedGalaxyColors {
  const custom = starColors ?? {};
  const bgHex = resolveBackgroundHex(theme, customBg);
  const stellar = getStellarColors(theme.palette);

  return {
    red: custom.red ? parseColorToRgb(custom.red) : stellar.red,
    orange: custom.orange ? parseColorToRgb(custom.orange) : stellar.orange,
    yellow: custom.yellow ? parseColorToRgb(custom.yellow) : stellar.yellow,
    white: custom.white ? parseColorToRgb(custom.white) : stellar.white,
    blue: custom.blue ? parseColorToRgb(custom.blue) : stellar.blue,
    background: parseColorToRgb(bgHex),
  };
}
