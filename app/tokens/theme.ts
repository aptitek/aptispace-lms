import { createTheme, type ThemeOptions } from "@mui/material/styles";
import {
  M3_EXPRESSIVE_CATALOG,
  M3_SCALE_RADIUS_MAP,
  resolveM3ShapeStyle,
} from "../components/atoms/Avatar/shapes";

import {
  ROLE_COLORS,
  CELESTIAL_COLORS,
  EU_FLAG_COLORS,
  FRENCH_FLAG_COLORS,
  UK_FLAG_COLORS,
  FLAG_COLORS,
  NAMED_COLORS,
  type NamedColors,
  type RoleColors,
  type CelestialColors,
  type FlagColors,
} from "./namedColors";

export {
  ROLE_COLORS,
  CELESTIAL_COLORS,
  EU_FLAG_COLORS,
  FRENCH_FLAG_COLORS,
  UK_FLAG_COLORS,
  FLAG_COLORS,
  NAMED_COLORS,
  type NamedColors,
  type RoleColors,
  type CelestialColors,
  type FlagColors,
};

declare module "@mui/material/styles" {
  interface Palette {
    roles: typeof ROLE_COLORS;
    celestial: typeof CELESTIAL_COLORS;
    flags: typeof FLAG_COLORS;
  }
  interface PaletteOptions {
    roles?: typeof ROLE_COLORS;
    celestial?: typeof CELESTIAL_COLORS;
    flags?: typeof FLAG_COLORS;
  }
  interface Theme {
    named: typeof NAMED_COLORS;
  }
  interface ThemeOptions {
    named?: typeof NAMED_COLORS;
  }
  interface Shape {
    borderRadius: number | string;
    m3: typeof M3_EXPRESSIVE_CATALOG;
    scale: typeof M3_SCALE_RADIUS_MAP;
    resolve: typeof resolveM3ShapeStyle;
  }
  interface ShapeOptions {
    borderRadius?: number | string;
    m3?: typeof M3_EXPRESSIVE_CATALOG;
    scale?: typeof M3_SCALE_RADIUS_MAP;
    resolve?: typeof resolveM3ShapeStyle;
  }
}

export const M3_SHAPE_SCALE = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 9999,
} as const;

export type M3ShapeToken = keyof typeof M3_SHAPE_SCALE;

export const M3_MOTION = {
  easing: {
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    emphasizedAccelerate: "cubic-bezier(0.3, 0, 0.8, 0.15)",
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    standardDecelerate: "cubic-bezier(0, 0, 0.2, 1)",
    standardAccelerate: "cubic-bezier(0.3, 0, 1, 1)",
  },
  duration: {
    short1: 50,
    short2: 100,
    short3: 150,
    short4: 200,
    medium1: 250,
    medium2: 300,
    medium3: 350,
    medium4: 400,
    long1: 450,
    long2: 500,
  },
} as const;

const m3TooltipDarkOverrides = {
  popper: {
    zIndex: 1500,
  },
  tooltip: {
    backgroundColor: "#eee8d5",
    color: "#002b36",
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: "1rem",
    borderRadius: 8,
    padding: "6px 10px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.35)",
    border: `1px solid rgba(88, 110, 117, 0.3)`,
    backdropFilter: "blur(8px)",
  },
  arrow: {
    color: "#eee8d5",
  },
};

const m3TooltipLightOverrides = {
  popper: {
    zIndex: 1500,
  },
  tooltip: {
    backgroundColor: "#073642",
    color: "#fdf6e3",
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: "1rem",
    borderRadius: 8,
    padding: "6px 10px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
    border: `1px solid rgba(88, 110, 117, 0.2)`,
    backdropFilter: "blur(8px)",
  },
  arrow: {
    color: "#073642",
  },
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#268bd2",
      light: "#2aa198",
      dark: "#1e6fa8",
      contrastText: "#fdf6e3",
    },
    secondary: {
      main: "#d33682",
      light: "#e0589c",
      dark: "#a82161",
      contrastText: "#fdf6e3",
    },
    error: {
      main: "#dc322f",
      light: "#e75856",
      dark: "#b02421",
      contrastText: "#fdf6e3",
    },
    warning: {
      main: "#b58900",
      light: "#d4a400",
      dark: "#8f6c00",
      contrastText: "#002b36",
    },
    info: {
      main: "#268bd2",
      light: "#2aa198",
      dark: "#1e6fa8",
      contrastText: "#fdf6e3",
    },

    success: {
      main: "#859900",
      light: "#a1b700",
      dark: "#687a00",
      contrastText: "#002b36",
    },
    background: {
      default: "#002b36",
      paper: "#073642",
    },
    text: {
      primary: "#839496",
      secondary: "#586e75",
      disabled: "#073642",
    },
    divider: "rgba(88, 110, 117, 0.25)",
    roles: ROLE_COLORS,
    celestial: CELESTIAL_COLORS,
    flags: FLAG_COLORS,
    action: {
      active: "#93a1a1",
      hover: "rgba(131, 148, 150, 0.08)",
      selected: "rgba(131, 148, 150, 0.16)",
      disabled: "rgba(88, 110, 117, 0.38)",
      disabledBackground: "rgba(7, 54, 66, 0.5)",
      focus: "rgba(38, 139, 210, 0.25)",
    },
  },
  named: NAMED_COLORS,

  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.015em" },
    h3: { fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontWeight: 600, letterSpacing: "-0.005em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { letterSpacing: "0.01em" },
    subtitle2: { letterSpacing: "0.01em" },
    body1: { letterSpacing: "0.01em", lineHeight: 1.6 },
    body2: { letterSpacing: "0.01em", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
    m3: M3_EXPRESSIVE_CATALOG,
    scale: M3_SCALE_RADIUS_MAP,
    resolve: resolveM3ShapeStyle,
  },
  transitions: {
    easing: {
      easeInOut: M3_MOTION.easing.standard,
      easeOut: M3_MOTION.easing.emphasizedDecelerate,
      easeIn: M3_MOTION.easing.emphasizedAccelerate,
      sharp: M3_MOTION.easing.standard,
    },
    duration: {
      shortest: M3_MOTION.duration.short3,
      shorter: M3_MOTION.duration.short4,
      short: M3_MOTION.duration.medium1,
      standard: M3_MOTION.duration.medium2,
      complex: M3_MOTION.duration.medium4,
      enteringScreen: M3_MOTION.duration.medium2,
      leavingScreen: M3_MOTION.duration.short4,
    },
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: m3TooltipDarkOverrides,
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          minHeight: 40,
          "@media (pointer: coarse)": {
            minHeight: 48,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "@media (pointer: coarse)": {
            minWidth: 48,
            minHeight: 48,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#002b36",
          color: "#839496",
          transition: "background-color 0.3s ease, color 0.3s ease",
          scrollbarColor: "#586e75 #002b36",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#586e75",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "#002b36",
          },
        },
      },
    },
  },
};

export const darkTheme = createTheme(darkThemeOptions);

export const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#268bd2",
      light: "#2aa198",
      dark: "#1e6fa8",
      contrastText: "#fdf6e3",
    },
    secondary: {
      main: "#d33682",
      light: "#e0589c",
      dark: "#a82161",
      contrastText: "#fdf6e3",
    },
    error: {
      main: "#dc322f",
      light: "#e75856",
      dark: "#b02421",
      contrastText: "#fdf6e3",
    },
    warning: {
      main: "#b58900",
      light: "#d4a400",
      dark: "#8f6b00",
      contrastText: "#002b36",
    },
    info: {
      main: "#268bd2",
      light: "#2aa198",
      dark: "#1e6fa8",
      contrastText: "#fdf6e3",
    },

    success: {
      main: "#859900",
      light: "#9cb01f",
      dark: "#687500",
      contrastText: "#fdf6e3",
    },
    background: {
      default: "#fdf6e3",
      paper: "#eee8d5",
    },
    text: {
      primary: "#657b83",
      secondary: "#586e75",
      disabled: "#a0b0b5",
    },
    divider: "rgba(88, 110, 117, 0.2)",
    roles: ROLE_COLORS,
    celestial: CELESTIAL_COLORS,
    flags: FLAG_COLORS,
    action: {
      hover: "rgba(0, 43, 54, 0.04)",
      selected: "rgba(0, 43, 54, 0.08)",
      disabled: "rgba(0, 43, 54, 0.26)",
      disabledBackground: "rgba(0, 43, 54, 0.12)",
    },
  },
  named: NAMED_COLORS,

  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.015em" },
    h3: { fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontWeight: 600, letterSpacing: "-0.005em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { letterSpacing: "0.01em" },
    subtitle2: { letterSpacing: "0.01em" },
    body1: { letterSpacing: "0.01em", lineHeight: 1.6 },
    body2: { letterSpacing: "0.01em", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
    m3: M3_EXPRESSIVE_CATALOG,
    scale: M3_SCALE_RADIUS_MAP,
    resolve: resolveM3ShapeStyle,
  },
  transitions: {
    easing: {
      easeInOut: M3_MOTION.easing.standard,
      easeOut: M3_MOTION.easing.emphasizedDecelerate,
      easeIn: M3_MOTION.easing.emphasizedAccelerate,
      sharp: M3_MOTION.easing.standard,
    },
    duration: {
      shortest: M3_MOTION.duration.short3,
      shorter: M3_MOTION.duration.short4,
      short: M3_MOTION.duration.medium1,
      standard: M3_MOTION.duration.medium2,
      complex: M3_MOTION.duration.medium4,
      enteringScreen: M3_MOTION.duration.medium2,
      leavingScreen: M3_MOTION.duration.short4,
    },
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: m3TooltipLightOverrides,
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          minHeight: 40,
          "@media (pointer: coarse)": {
            minHeight: 48,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "@media (pointer: coarse)": {
            minWidth: 48,
            minHeight: 48,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#fdf6e3",
          color: "#657b83",
          transition: "background-color 0.3s ease, color 0.3s ease",
          scrollbarColor: "#93a1a1 #fdf6e3",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#93a1a1",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "#fdf6e3",
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme(lightThemeOptions);
export const appTheme = darkTheme;

export type ThemeMode = "dark" | "light";

export function getThemeByMode(mode: ThemeMode) {
  return mode === "light" ? lightTheme : darkTheme;
}
