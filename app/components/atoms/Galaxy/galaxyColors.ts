import { lighten, type Theme } from "@mui/material/styles";
import { SOLARIZED_BASE } from "~/tokens/theme";

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
  if (theme.palette.mode === "dark") {
    return theme.palette.background.default || theme.palette.common.black;
  }
  return theme.palette.background.default || theme.palette.common.white;
}

export function getStellarDarkColors(): ResolvedGalaxyColors {
  return {
    red: parseColorToRgb(SOLARIZED_BASE.red),
    orange: parseColorToRgb(SOLARIZED_BASE.orange),
    yellow: parseColorToRgb(lighten(SOLARIZED_BASE.yellow, 0.4)),
    white: parseColorToRgb(lighten(SOLARIZED_BASE.base2, 0.35)),
    blue: parseColorToRgb(lighten(SOLARIZED_BASE.blue, 0.45)),
    background: parseColorToRgb(SOLARIZED_BASE.base03),
  };
}

export function getStellarLightColors(): ResolvedGalaxyColors {
  return {
    red: parseColorToRgb(SOLARIZED_BASE.red),
    orange: parseColorToRgb(SOLARIZED_BASE.orange),
    yellow: parseColorToRgb(SOLARIZED_BASE.yellow),
    white: parseColorToRgb(SOLARIZED_BASE.base00),
    blue: parseColorToRgb(SOLARIZED_BASE.blue),
    background: parseColorToRgb(SOLARIZED_BASE.base3),
  };
}

export function getDarkStarPalette(
  _palette: Theme["palette"],
  custom: GalaxyStarColors,
) {
  const stellar = getStellarDarkColors();
  return {
    red: custom.red ? parseColorToRgb(custom.red) : stellar.red,
    orange: custom.orange ? parseColorToRgb(custom.orange) : stellar.orange,
    yellow: custom.yellow ? parseColorToRgb(custom.yellow) : stellar.yellow,
    white: custom.white ? parseColorToRgb(custom.white) : stellar.white,
    blue: custom.blue ? parseColorToRgb(custom.blue) : stellar.blue,
  };
}

export function getLightStarPalette(
  _palette: Theme["palette"],
  custom: GalaxyStarColors,
) {
  const stellar = getStellarLightColors();
  return {
    red: custom.red ? parseColorToRgb(custom.red) : stellar.red,
    orange: custom.orange ? parseColorToRgb(custom.orange) : stellar.orange,
    yellow: custom.yellow ? parseColorToRgb(custom.yellow) : stellar.yellow,
    white: custom.white ? parseColorToRgb(custom.white) : stellar.white,
    blue: custom.blue ? parseColorToRgb(custom.blue) : stellar.blue,
  };
}

export function resolveThemeColors(
  theme: Theme,
  starColors?: GalaxyStarColors,
  customBg?: string,
): ResolvedGalaxyColors {
  const custom = starColors ?? {};
  const bgHex = resolveBackgroundHex(theme, customBg);
  const stars =
    theme.palette.mode === "dark"
      ? getDarkStarPalette(theme.palette, custom)
      : getLightStarPalette(theme.palette, custom);

  return {
    ...stars,
    background: parseColorToRgb(bgHex),
  };
}
