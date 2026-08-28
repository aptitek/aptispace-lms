import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { styled, useTheme, type Theme } from "@mui/material/styles";
import {
  Card as DeckFXCard,
  type CardLayer,
  type CardShadow,
  type HolographicOptions,
} from "deckfx";

export type MD3CardVariant = "elevated" | "filled" | "outlined";
export type MD3Elevation = 0 | 1 | 2 | 3 | 4 | 5;

export interface MD3DeckCardRef {
  flipTo: (faceUp: boolean) => void;
  toggleFlip: () => void;
  isFaceUp: () => boolean;
}

export interface MD3DeckCardProps {
  /** MD3 Card visual variant: elevated (default), filled, or outlined */
  variant?: MD3CardVariant;
  /** MD3 Elevation level (0-5) */
  elevation?: MD3Elevation;
  /** Width of the card (e.g. 320, "100%", "420px") */
  width?: number | string;
  /** Height of the card (e.g. 480, 640, "100%") */
  height?: number | string;
  /** Initial face-up state */
  faceUp?: boolean;
  /** Flip animation duration in ms (default: 600) */
  flipDuration?: number;
  /** Flip axis direction */
  flipDirection?: "horizontal" | "vertical";
  /** Callback fired when flip begins */
  onFlip?: (newFaceUp: boolean) => void;
  /** Callback fired when flip finishes */
  onFlipComplete?: (faceUp: boolean) => void;
  /** Holographic foil effect enabled or options */
  holographic?: boolean | HolographicOptions;
  /** Intensity multiplier for holographic foil */
  holoStrength?: number;
  /** 3D multi-layer stack for parallax & selective foil */
  layers?: CardLayer[];
  /** Maximum tilt angle in degrees (default: 12 for subtle MD3 feel) */
  maxTilt?: number;
  /** Scale multiplier on hover (default: 1.02) */
  scaleOnHover?: number;
  /** Whether to show glare reflection on mouse move */
  showGlare?: boolean;
  /** DeckFX shadow preset override */
  shadow?: CardShadow;
  /** Front face content */
  children?: ReactNode;
  /** Back face content */
  backContent?: ReactNode;
  /** Disabled interaction state */
  disabled?: boolean;
  /** Custom CSS class names */
  className?: string;
  /** Custom container style */
  style?: CSSProperties;
  /** Test identifier */
  "data-testid"?: string;
}

const DEFAULT_CARD_CONFIG = {
  variant: "elevated" as MD3CardVariant,
  elevation: 1 as MD3Elevation,
  width: "100%",
  height: 480,
  faceUp: true,
  flipDuration: 550,
  flipDirection: "horizontal" as const,
  holographic: false,
  holoStrength: 1,
  layers: [] as CardLayer[],
  maxTilt: 12,
  scaleOnHover: 1.015,
  showGlare: true,
  shadow: "none" as const,
  disabled: false,
  testId: "md3-deck-card",
};

function resolveMD3CardProps(props: MD3DeckCardProps) {
  return {
    ...DEFAULT_CARD_CONFIG,
    ...props,
    testId: props["data-testid"] ?? DEFAULT_CARD_CONFIG.testId,
  };
}

/**
 * Calculates MD3 Surface Tint & Elevation Shadow based on theme mode & elevation level
 */
function getMD3ElevationStyles(theme: Theme, elevation: MD3Elevation) {
  const isDark = theme.palette.mode === "dark";
  const shadowMap: Record<MD3Elevation, string> = {
    0: "none",
    1: isDark
      ? `0px 2px 4px ${theme.palette.action.focus}, 0px 1px 2px ${theme.palette.action.hover}`
      : `0px 1px 3px 1px ${theme.palette.action.focus}, 0px 1px 2px 0px ${theme.palette.action.hover}`,
    2: isDark
      ? `0px 4px 8px ${theme.palette.action.focus}, 0px 2px 4px ${theme.palette.action.hover}`
      : `0px 2px 6px 2px ${theme.palette.action.focus}, 0px 1px 2px 0px ${theme.palette.action.hover}`,
    3: isDark
      ? `0px 8px 16px ${theme.palette.action.focus}, 0px 4px 8px ${theme.palette.action.hover}`
      : `0px 4px 8px 3px ${theme.palette.action.focus}, 0px 1px 3px 0px ${theme.palette.action.hover}`,
    4: isDark
      ? `0px 12px 24px ${theme.palette.action.focus}, 0px 6px 12px ${theme.palette.action.hover}`
      : `0px 6px 10px 4px ${theme.palette.action.focus}, 0px 2px 3px 0px ${theme.palette.action.hover}`,
    5: isDark
      ? `0px 16px 32px ${theme.palette.action.focus}, 0px 8px 16px ${theme.palette.action.hover}`
      : `0px 8px 12px 6px ${theme.palette.action.focus}, 0px 4px 4px 0px ${theme.palette.action.hover}`,
  };

  return shadowMap[elevation] ?? shadowMap[1];
}

/**
 * Returns background color according to MD3 Card variant and Solarized theme
 */
function getMD3CardBackground(
  theme: Theme,
  variant: MD3CardVariant,
  _elevation: MD3Elevation,
) {
  if (variant === "filled") {
    return theme.palette.action.selected;
  }
  if (variant === "outlined") {
    return theme.palette.background.default;
  }
  return theme.palette.background.paper;
}

/**
 * Styled Wrapper mapping MD3 tokens onto the DeckFX Card root
 */
const StyledDeckFXContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "variant" &&
    prop !== "elevationLevel" &&
    prop !== "fullWidth" &&
    prop !== "cardRadius",
})<{
  variant: MD3CardVariant;
  elevationLevel: MD3Elevation;
  cardRadius: number;
}>(({ theme, variant, elevationLevel, cardRadius }) => {
  const bg = getMD3CardBackground(theme, variant, elevationLevel);
  const boxShadow =
    variant === "elevated"
      ? getMD3ElevationStyles(theme, elevationLevel)
      : "none";
  const border =
    variant === "outlined"
      ? `1px solid ${theme.palette.divider}`
      : variant === "filled"
        ? "1px solid transparent"
        : `1px solid ${theme.palette.divider}`;

  return {
    position: "relative",
    display: "block",
    width: "100%",
    maxWidth: "100%",

    // Override inner DeckFX card styles with MD3 tokens
    "& .rounded-xl": {
      borderRadius: `${cardRadius}px !important`,
    },

    "& .bg-white, & .dark\\:bg-slate-950, & .bg-card": {
      backgroundColor: `${bg} !important`,
      color: `${theme.palette.text.primary} !important`,
      borderColor: "transparent !important",
    },

    "& > div > div": {
      borderRadius: `${cardRadius}px !important`,
      border: `${border} !important`,
      boxShadow: `${boxShadow} !important`,
      backdropFilter: "blur(16px)",
      transition:
        "box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease-out",
    },

    // Back content surface
    "& .bg-blue-900": {
      backgroundColor: `${bg} !important`,
      borderRadius: `${cardRadius}px !important`,
      border: `${border} !important`,
    },
  };
});

/**
 * MD3 DeckFX Base Card Component
 */
export const MD3DeckCard = forwardRef<MD3DeckCardRef, MD3DeckCardProps>(
  function MD3DeckCard(rawProps, ref) {
    const theme = useTheme();
    const config = resolveMD3CardProps(rawProps);
    const deckRef = useRef<{ flipTo: (faceUp: boolean) => void } | null>(null);
    const [currentFaceUp, setCurrentFaceUp] = useState(config.faceUp);

    const radius = Math.max(16, (Number(theme.shape.borderRadius) || 12) * 1.6);

    useImperativeHandle(
      ref,
      () => ({
        flipTo: (newFaceUp: boolean) => {
          setCurrentFaceUp(newFaceUp);
          deckRef.current?.flipTo(newFaceUp);
          config.onFlip?.(newFaceUp);
        },
        toggleFlip: () => {
          const nextState = !currentFaceUp;
          setCurrentFaceUp(nextState);
          deckRef.current?.flipTo(nextState);
          config.onFlip?.(nextState);
        },
        isFaceUp: () => currentFaceUp,
      }),
      [currentFaceUp, config],
    );

    const handleFlip = (newFaceUp: boolean) => {
      setCurrentFaceUp(newFaceUp);
      config.onFlip?.(newFaceUp);
    };

    return (
      <StyledDeckFXContainer
        variant={config.variant}
        elevationLevel={config.elevation}
        cardRadius={radius}
        className={config.className}
        style={config.style}
        data-testid={config.testId}
        data-variant={config.variant}
        data-elevation={config.elevation}
        data-faceup={currentFaceUp}
      >
        <DeckFXCard
          ref={deckRef}
          width={config.width}
          height={config.height}
          faceUp={currentFaceUp}
          onFlip={handleFlip}
          onFlipComplete={config.onFlipComplete}
          flipDuration={config.flipDuration}
          flipDirection={config.flipDirection}
          holographic={config.holographic}
          holoStrength={config.holoStrength}
          layers={config.layers}
          maxTilt={config.maxTilt}
          scaleOnHover={config.scaleOnHover}
          showGlare={config.showGlare}
          shadow={config.shadow}
          disabled={config.disabled}
          backContent={config.backContent}
        >
          {config.children}
        </DeckFXCard>
      </StyledDeckFXContainer>
    );
  },
);

/**
 * Subcomponents for standard MD3 card layouts
 */

export const MD3CardHeader = styled("header")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 3, 1.5, 3),
  width: "100%",
  boxSizing: "border-box",
}));

export const MD3CardTitleGroup = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  minWidth: 0,
}));

export const MD3CardHeadline = styled("h2")(({ theme }) => ({
  margin: 0,
  fontSize: "1.25rem",
  fontWeight: 700,
  letterSpacing: "-0.015em",
  color: theme.palette.text.primary,
  lineHeight: 1.3,
}));

export const MD3CardSubhead = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body2.fontSize ?? "0.875rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
}));

export const MD3CardMedia = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  borderRadius: Number(theme.shape.borderRadius) || 12,
}));

export const MD3CardContent = styled("div")(({ theme }) => ({
  padding: theme.spacing(2, 3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize ?? "0.875rem",
  lineHeight: 1.6,
  boxSizing: "border-box",
  width: "100%",
}));

export const MD3CardActions = styled("footer")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3, 2.5, 3),
  width: "100%",
  boxSizing: "border-box",
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export default MD3DeckCard;
