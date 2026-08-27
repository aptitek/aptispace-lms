# 03 — Solarized Design Tokens & Theming

> **Part of AptiSpace LMS Architecture Guides**  
> **Master Index:** [ARCHITECTURE.md](file:///home/aptitek/50-59_Code/51_Websites/aptispace-lms-04/ARCHITECTURE.md)

---

## 1. Theming Philosophy & Color System

AptiSpace LMS uses a customized implementation of the **Solarized** color system engineered into Material UI v9 (`@mui/material/styles`). The palette provides calibrated optical contrast across both Dark and Light modes while preserving a cohesive identity.

### 1.1 Canonical Solarized Color Matrix

```
┌───────────┬───────────┬──────────────────────────────────┬──────────────────────────────────┐
│ Token     │ Hex Value │ Dark Mode Role                   │ Light Mode Role                  │
├───────────┼───────────┼──────────────────────────────────┼──────────────────────────────────┤
│ base03    │ #002b36   │ Default Background (deep space)  │ —                                │
│ base02    │ #073642   │ Surface / Card Background        │ —                                │
│ base01    │ #586e75   │ Secondary / Muted Text           │ Comments / Soft Text             │
│ base00    │ #657b83   │ —                                │ Primary Text (Body)              │
│ base0     │ #839496   │ Primary Text (Body)              │ —                                │
│ base1     │ #93a1a1   │ Headings / Highlights            │ Secondary / Muted Text           │
│ base2     │ #eee8d5   │ —                                │ Surface / Card Background        │
│ base3     │ #fdf6e3   │ —                                │ Default Background (warm parchment)│
├───────────┼───────────┼──────────────────────────────────┴──────────────────────────────────┤
│ yellow    │ #b58900   │ Accent / Warning Light / Milestone                                  │
│ orange    │ #cb4b16   │ Accent / Warning Main / Highlights                                  │
│ red       │ #dc322f   │ Error / Alert / Critical Badge                                      │
│ magenta   │ #d33682   │ Premium Accent / Special Badges / XP Flares                         │
│ violet    │ #6c71c4   │ Secondary Brand / Futuristic Shimmers                               │
│ blue      │ #268bd2   │ Primary Brand Color / Active Navigation                             │
│ cyan      │ #2aa198   │ Info / Tertiary Accent / Holographic Highlights                     │
│ green     │ #859900   │ Success / Completed Course Accent                                   │
└───────────┴───────────┴─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Typography: Recursive Casual

The typography uses **Recursive**, a variable font configured in **Casual** mode (`CASL 1`, `CRSV 1`). This provides a friendly, casual, approachable warmth while maintaining crisp geometry and sleek modern readability.

### 2.1 Font Configuration
```typescript
typography: {
  fontFamily: '"Recursive", ui-sans-serif, system-ui, sans-serif',
  allVariants: {
    fontVariationSettings: '"CASL" 1, "CRSV" 1',
  },
  h1: { fontWeight: 700, letterSpacing: "-0.02em" },
  h2: { fontWeight: 600, letterSpacing: "-0.01em" },
  body1: { fontSize: "1rem", lineHeight: 1.6 },
  body2: { fontSize: "0.875rem", lineHeight: 1.5 },
  button: { textTransform: "none", fontWeight: 600 },
}
```

---

## 3. Theme Factory (`createTheme`)

```typescript
import { createTheme } from "@mui/material/styles";

export const solarizedColors = {
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

export const solarizedDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: solarizedColors.blue,
      light: solarizedColors.cyan,
      dark: "#1e6ea8",
      contrastText: solarizedColors.base3,
    },
    secondary: {
      main: solarizedColors.violet,
      light: solarizedColors.magenta,
      dark: "#53579b",
      contrastText: solarizedColors.base3,
    },
    background: {
      default: solarizedColors.base03,
      paper: solarizedColors.base02,
    },
    text: {
      primary: solarizedColors.base0,
      secondary: solarizedColors.base01,
      disabled: solarizedColors.base02,
    },
    error: { main: solarizedColors.red },
    warning: { main: solarizedColors.orange, light: solarizedColors.yellow },
    info: { main: solarizedColors.cyan },
    success: { main: solarizedColors.green },
    divider: solarizedColors.base02,
  },
  shape: {
    borderRadius: 12, // MUI3 Expressive rounded radius
  },
});
```

---

## 4. Component Authoring with `styled`

All new styled components must use the `styled` primitive from `@mui/material/styles`.

> [!IMPORTANT]
> **Strict Import Invariants:**
> - `import { styled } from "@mui/material/styles";` ✅ **CORRECT**
> - `import styled from "@emotion/styled";` ❌ **FORBIDDEN (ESLint Error)**
> - `import { styled } from "@mui/material";` ❌ **FORBIDDEN (ESLint Error)**

### 4.1 Canonical Styled Component Example

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { styled } from "@mui/material/styles";

export interface ExpressiveCardProps extends HTMLAttributes<HTMLDivElement> {
  $variant?: "standard" | "holographic" | "accent";
  $interactive?: boolean;
}

const StyledCardRoot = styled("div", {
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<ExpressiveCardProps>(({ theme, $variant = "standard", $interactive = false }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["transform", "box-shadow", "border-color"], {
    duration: theme.transitions.duration.shorter,
  }),

  ...($interactive && {
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: theme.palette.primary.main,
      boxShadow: `0 12px 32px ${
        theme.palette.mode === "dark" ? "rgba(0, 43, 54, 0.7)" : "rgba(238, 232, 213, 0.9)"
      }`,
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "2px",
    },
  }),
}));

export const ExpressiveCard = forwardRef<HTMLDivElement, ExpressiveCardProps>(
  function ExpressiveCard(props, ref) {
    return <StyledCardRoot ref={ref} {...props} />;
  }
);
```

### 4.2 Prohibited Patterns
1. ❌ **No Hardcoded Hex/RGB:** `color: "#268bd2"` $\rightarrow$ must use `color: theme.palette.primary.main`.
2. ❌ **No Inline Style Objects:** `<div style={{ backgroundColor: "#002b36" }}>` $\rightarrow$ use `styled()` component.
3. ❌ **No Arbitrary Pixel Spacing:** `padding: "23px"` $\rightarrow$ use `padding: theme.spacing(3)`.
