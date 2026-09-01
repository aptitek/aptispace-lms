import { createTheme, type ThemeOptions } from "@mui/material/styles";
import {
  M3_EXPRESSIVE_CATALOG,
  M3_SCALE_RADIUS_MAP,
  resolveM3ShapeStyle,
} from "../components/atoms/Avatar/shapes";

declare module "@mui/material/styles" {
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

// Solarized canonical color spectrum
export const SOLARIZED_BASE = {
  base03: "#002b36",
  base02: "#073642",
  base01: "#586e75",
  base00: "#657b83",
  base0: "#839496",
  base1: "#93a1a1",
  base2: "#eee8d5",
  base3: "#fdf6e3",
  yellow: "#b58900",
  orange: "#cb4b16",
  red: "#dc322f",
  magenta: "#d33682",
  violet: "#6c71c4",
  blue: "#268bd2",
  cyan: "#2aa198",
  green: "#859900",
} as const;

// Official EU / French identity-card flag colours (EU Reg. 2019/1157)
export const EU_FLAG_COLORS = {
  blue: "#003399", // EU Reflex Blue field
  gold: "#ffcc00", // EU Yellow 12-stars circle & country code
} as const;

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
    backgroundColor: SOLARIZED_BASE.base2,
    color: SOLARIZED_BASE.base03,
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
    color: SOLARIZED_BASE.base2,
  },
};

const m3TooltipLightOverrides = {
  popper: {
    zIndex: 1500,
  },
  tooltip: {
    backgroundColor: SOLARIZED_BASE.base02,
    color: SOLARIZED_BASE.base3,
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
    color: SOLARIZED_BASE.base02,
  },
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: SOLARIZED_BASE.blue,
      light: SOLARIZED_BASE.cyan,
      dark: "#1e6fa8",
      contrastText: SOLARIZED_BASE.base3,
    },
    secondary: {
      main: SOLARIZED_BASE.magenta,
      light: "#e0589c",
      dark: "#a82161",
      contrastText: SOLARIZED_BASE.base3,
    },
    error: {
      main: SOLARIZED_BASE.red,
      light: "#e75856",
      dark: "#b02421",
      contrastText: SOLARIZED_BASE.base3,
    },
    warning: {
      main: SOLARIZED_BASE.yellow,
      light: "#d4a400",
      dark: "#8f6c00",
      contrastText: SOLARIZED_BASE.base03,
    },
    info: {
      main: SOLARIZED_BASE.violet,
      light: "#8a8ed4",
      dark: "#53579c",
      contrastText: SOLARIZED_BASE.base3,
    },
    success: {
      main: SOLARIZED_BASE.green,
      light: "#a1b700",
      dark: "#687a00",
      contrastText: SOLARIZED_BASE.base03,
    },
    background: {
      default: SOLARIZED_BASE.base03,
      paper: SOLARIZED_BASE.base02,
    },
    text: {
      primary: SOLARIZED_BASE.base0,
      secondary: SOLARIZED_BASE.base01,
      disabled: SOLARIZED_BASE.base02,
    },
    divider: "rgba(88, 110, 117, 0.25)",
    action: {
      active: SOLARIZED_BASE.base1,
      hover: "rgba(131, 148, 150, 0.08)",
      selected: "rgba(131, 148, 150, 0.16)",
      disabled: "rgba(88, 110, 117, 0.38)",
      disabledBackground: "rgba(7, 54, 66, 0.5)",
      focus: "rgba(38, 139, 210, 0.25)",
    },
  },
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
          backgroundColor: SOLARIZED_BASE.base03,
          color: SOLARIZED_BASE.base0,
          transition: "background-color 0.3s ease, color 0.3s ease",
          scrollbarColor: `${SOLARIZED_BASE.base01} ${SOLARIZED_BASE.base03}`,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: SOLARIZED_BASE.base01,
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: SOLARIZED_BASE.base03,
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
      main: SOLARIZED_BASE.blue,
      light: SOLARIZED_BASE.cyan,
      dark: "#1e6fa8",
      contrastText: SOLARIZED_BASE.base3,
    },
    secondary: {
      main: SOLARIZED_BASE.magenta,
      light: "#e0589c",
      dark: "#a82161",
      contrastText: SOLARIZED_BASE.base3,
    },
    error: {
      main: SOLARIZED_BASE.red,
      light: "#e75856",
      dark: "#b02421",
      contrastText: SOLARIZED_BASE.base3,
    },
    warning: {
      main: SOLARIZED_BASE.yellow,
      light: "#d4a400",
      dark: "#8f6b00",
      contrastText: SOLARIZED_BASE.base03,
    },
    info: {
      main: SOLARIZED_BASE.cyan,
      light: "#4fb3ab",
      dark: "#1f756f",
      contrastText: SOLARIZED_BASE.base3,
    },
    success: {
      main: SOLARIZED_BASE.green,
      light: "#9cb01f",
      dark: "#687500",
      contrastText: SOLARIZED_BASE.base3,
    },
    background: {
      default: SOLARIZED_BASE.base3,
      paper: SOLARIZED_BASE.base2,
    },
    text: {
      primary: SOLARIZED_BASE.base00,
      secondary: SOLARIZED_BASE.base01,
      disabled: "#a0b0b5",
    },
    divider: "rgba(88, 110, 117, 0.2)",
    action: {
      hover: "rgba(0, 43, 54, 0.04)",
      selected: "rgba(0, 43, 54, 0.08)",
      disabled: "rgba(0, 43, 54, 0.26)",
      disabledBackground: "rgba(0, 43, 54, 0.12)",
    },
  },
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
          backgroundColor: SOLARIZED_BASE.base3,
          color: SOLARIZED_BASE.base00,
          transition: "background-color 0.3s ease, color 0.3s ease",
          scrollbarColor: `${SOLARIZED_BASE.base1} ${SOLARIZED_BASE.base3}`,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: SOLARIZED_BASE.base1,
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: SOLARIZED_BASE.base3,
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
