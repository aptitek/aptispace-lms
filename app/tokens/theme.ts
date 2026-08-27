import { createTheme, type ThemeOptions } from "@mui/material/styles";

// Solarized canonical color spectrum
const SOLARIZED_BASE = {
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
      main: SOLARIZED_BASE.cyan,
      light: "#38c3b9",
      dark: "#207e77",
      contrastText: SOLARIZED_BASE.base03,
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
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: SOLARIZED_BASE.base03,
          color: SOLARIZED_BASE.base0,
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
export const appTheme = darkTheme;
