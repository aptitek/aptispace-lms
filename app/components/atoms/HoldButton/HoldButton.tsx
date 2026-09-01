import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useId,
  useImperativeHandle,
} from "react";
import type { ButtonProps } from "@mui/material/Button";
import { useTheme, type Theme } from "@mui/material/styles";
import {
  useMotionValue,
  animate,
  useAnimation,
  motion,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import {
  HoldButtonWrapper,
  StyledHoldButton,
  SvgBorderContainer,
  HiddenClipDefs,
} from "./HoldButton.styles";
import {
  EXPRESSIVE_SHAPE_CATALOG,
  resolveShapeStyle,
  type ExpressiveShapeName,
  type ShapeDefinition,
  type ResolvedShapeStyle,
} from "../Avatar/shapes";

export interface HoldButtonProps extends Omit<
  ButtonProps,
  "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
> {
  /** Callback fired when the button is held for the required duration */
  onHoldComplete: () => void;
  /** Hold duration in milliseconds (default: 1000) */
  holdTime?: number;
  /** Thickness of the animated outline line stroke in pixels (default: 2.5) */
  borderThickness?: number;
  /** Distance/gap between the button boundary and the outer outline in pixels (default: 3.5) */
  outlineGap?: number;
  /**
   * M3 Expressive shape name (e.g. 'pill', 'circle', 'sunny', '4-sided-cookie', '9-sided-cookie', 'arch', 'gem', etc.)
   * or standard radius token ('small', 'medium', 'large', 'full', etc.)
   */
  shape?: ExpressiveShapeName | string;
  /** Optional sx props to customize the outer wrapper element */
  wrapperSx?: ButtonProps["sx"];
}

function triggerHaptic(type: "light" | "medium" | "heavy") {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    if (type === "light") navigator.vibrate(10);
    else if (type === "medium") navigator.vibrate(20);
    else if (type === "heavy") navigator.vibrate([30, 50, 30]);
  }
}

interface RectBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Computes an SVG path for a rounded rectangle starting at top-center and moving clockwise.
 */
function getRoundedRectPath(bounds: RectBounds, radius: number): string {
  const { x, y, w, h } = bounds;
  if (w <= 0 || h <= 0) return "";

  const r = Math.max(0, Math.min(radius, w / 2, h / 2));

  if (r <= 0) {
    return `M ${x + w / 2} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} L ${x} ${y} Z`;
  }

  return `M ${x + w / 2} ${y} L ${x + w - r} ${y} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} L ${x + r} ${y + h} A ${r} ${r} 0 0 1 ${x} ${y + h - r} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} L ${x + w / 2} ${y} Z`;
}

function resolvePaletteColor(theme: Theme, color?: string): string {
  if (color && color in theme.palette) {
    return (
      theme.palette[color as keyof typeof theme.palette] as Record<
        string,
        string
      >
    ).main;
  }
  return theme.palette.primary.main;
}

function getIconButtonDimension(size?: "small" | "medium" | "large"): number {
  if (size === "small") return 40;
  if (size === "large") return 56;
  return 48;
}

interface PathDataParams {
  expressiveDef?: ShapeDefinition;
  dimensions: { width: number; height: number };
  computedBorderRadius: number;
  outlineGap: number;
  borderThickness: number;
}

function resolvePathData({
  expressiveDef,
  dimensions,
  computedBorderRadius,
  outlineGap,
  borderThickness,
}: PathDataParams): string {
  if (expressiveDef) return expressiveDef.pathData;

  const halfStroke = borderThickness / 2;
  const bounds: RectBounds = {
    x: halfStroke,
    y: halfStroke,
    w: dimensions.width + 2 * outlineGap,
    h: dimensions.height + 2 * outlineGap,
  };
  const r = computedBorderRadius > 0 ? computedBorderRadius + outlineGap : 0;

  return getRoundedRectPath(bounds, r);
}

function computeOuterBounds(
  dimensions: { width: number; height: number },
  outlineGap: number,
  borderThickness: number,
) {
  const totalOffset = outlineGap + borderThickness / 2;
  return {
    totalOffset,
    outerWidth: dimensions.width + 2 * totalOffset,
    outerHeight: dimensions.height + 2 * totalOffset,
  };
}

function buildButtonBaseSx(
  isExpressivePolygon: boolean,
  resolvedShape: ResolvedShapeStyle,
  clipId: string,
  hasShape: boolean,
) {
  return {
    WebkitUserSelect: "none" as const,
    userSelect: "none" as const,
    ...(hasShape && { borderRadius: resolvedShape.borderRadius }),
    ...(isExpressivePolygon && {
      clipPath: `url(#${clipId})`,
      width: "100%",
      height: "100%",
      minWidth: "unset",
      minHeight: "unset",
      p: 0,
    }),
  };
}

function useButtonMeasure(elementRef: React.RefObject<HTMLElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [computedBorderRadius, setComputedBorderRadius] = useState(8);

  const measure = useCallback(() => {
    if (!elementRef.current) return;
    const el = elementRef.current;
    const width = el.offsetWidth || el.getBoundingClientRect().width;
    const height = el.offsetHeight || el.getBoundingClientRect().height;
    const style = window.getComputedStyle(el);
    const rad = parseFloat(style.borderRadius) || 8;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
      setComputedBorderRadius(rad);
    }
  }, [elementRef]);

  useEffect(() => {
    measure();
    if (!elementRef.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [measure, elementRef]);

  return { dimensions, computedBorderRadius };
}

function useHoldGesture(
  holdTime: number,
  onHoldComplete: () => void,
  buttonControls: ReturnType<typeof useAnimation>,
) {
  const progress = useMotionValue(0);
  const opacity = useMotionValue(0);
  const animControlsRef = useRef<AnimationPlaybackControls | null>(null);
  const isComplete = useRef(false);

  const startHold = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button === 2) return;
      isComplete.current = false;

      if (animControlsRef.current) animControlsRef.current.stop();

      triggerHaptic("light");
      opacity.set(1);
      progress.set(0.04);

      animControlsRef.current = animate(progress, 1, {
        duration: holdTime / 1000,
        ease: [0.2, 0, 0, 1],
        onComplete: async () => {
          isComplete.current = true;
          triggerHaptic("heavy");
          onHoldComplete();

          await new Promise((r) => setTimeout(r, 200));
          await animate(opacity, 0, { duration: 0.3 });
          progress.set(0);
        },
      });
    },
    [holdTime, onHoldComplete, progress, opacity],
  );

  const cancelHold = useCallback(() => {
    if (isComplete.current) return;
    if (animControlsRef.current) animControlsRef.current.stop();

    const currentProgress = progress.get();
    if (currentProgress > 0 && currentProgress < 0.25) {
      triggerHaptic("medium");
      buttonControls.start({
        x: [0, -6, 6, -6, 6, 0],
        transition: { duration: 0.3, ease: "easeInOut" },
      });
    }

    animate(progress, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(opacity, 0, { duration: 0.25 });
  }, [progress, opacity, buttonControls]);

  return { progress, opacity, startHold, cancelHold };
}

interface SvgOverlayProps {
  isExpressivePolygon: boolean;
  pathD: string;
  paletteColor: string;
  borderThickness: number;
  totalOffset: number;
  outerWidth: number;
  outerHeight: number;
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
}

function SvgOverlay({
  isExpressivePolygon,
  pathD,
  paletteColor,
  borderThickness,
  totalOffset,
  outerWidth,
  outerHeight,
  progress,
  opacity,
}: SvgOverlayProps) {
  if (!pathD || outerWidth <= 0 || outerHeight <= 0) return null;

  if (isExpressivePolygon) {
    const minDim = Math.min(outerWidth, outerHeight);
    const halfStrokeRatio = borderThickness / (2 * minDim);
    const scaleFactor = Math.max(0.01, 1 - 2 * halfStrokeRatio);
    const normalizedStrokeWidth = borderThickness / (minDim * scaleFactor);

    return (
      <SvgBorderContainer
        color={paletteColor}
        offset={totalOffset}
        viewBox={`0 0 ${outerWidth} ${outerHeight}`}
      >
        <motion.path
          d={pathD}
          fill="none"
          stroke={paletteColor}
          strokeWidth={normalizedStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          // eslint-disable-next-line no-restricted-syntax
          style={{
            pathLength: progress,
            opacity,
          }}
        />
      </SvgBorderContainer>
    );
  }

  return (
    <SvgBorderContainer
      color={paletteColor}
      offset={totalOffset}
      viewBox={`0 0 ${outerWidth} ${outerHeight}`}
    >
      <motion.path
        d={pathD}
        fill="none"
        stroke={paletteColor}
        strokeWidth={borderThickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        // eslint-disable-next-line no-restricted-syntax
        style={{
          pathLength: progress,
          opacity,
        }}
      />
    </SvgBorderContainer>
  );
}

function ClipDefs({ clipId, pathData }: { clipId: string; pathData?: string }) {
  if (!pathData) return null;
  return (
    <HiddenClipDefs aria-hidden="true">
      <defs>
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d={pathData} />
        </clipPath>
      </defs>
    </HiddenClipDefs>
  );
}

function resolveWrapperSx(
  isExpressivePolygon: boolean,
  iconDim: number,
  wrapperSx?: ButtonProps["sx"],
) {
  const shapeStyles = isExpressivePolygon
    ? {
        width: iconDim,
        height: iconDim,
        minWidth: iconDim,
        minHeight: iconDim,
        flexShrink: 0,
      }
    : {};
  return [shapeStyles, ...(Array.isArray(wrapperSx) ? wrapperSx : [wrapperSx])];
}

export const HoldButton = React.forwardRef<HTMLButtonElement, HoldButtonProps>(
  (
    {
      onHoldComplete,
      holdTime = 1000,
      borderThickness = 2.5,
      outlineGap = 3.5,
      shape,
      children,
      color = "primary",
      size,
      sx,
      wrapperSx,
      ...props
    },
    forwardedRef,
  ) => {
    const theme = useTheme();
    const rawId = useId();
    const clipId = `hold-button-clip-${rawId.replace(/:/g, "")}`;

    const internalRef = useRef<HTMLButtonElement | null>(null);
    useImperativeHandle(
      forwardedRef,
      () => internalRef.current as HTMLButtonElement,
    );

    const { dimensions, computedBorderRadius } = useButtonMeasure(internalRef);
    const buttonControls = useAnimation();
    const { progress, opacity, startHold, cancelHold } = useHoldGesture(
      holdTime,
      onHoldComplete,
      buttonControls,
    );

    const paletteColor = resolvePaletteColor(theme, color);
    const expressiveDef = shape ? EXPRESSIVE_SHAPE_CATALOG[shape] : undefined;
    const resolvedShape = resolveShapeStyle(shape);
    const isExpressivePolygon = Boolean(expressiveDef);
    const hasShape = Boolean(shape);
    const { totalOffset, outerWidth, outerHeight } = computeOuterBounds(
      dimensions,
      outlineGap,
      borderThickness,
    );

    const pathD = resolvePathData({
      expressiveDef,
      dimensions,
      computedBorderRadius,
      outlineGap,
      borderThickness,
    });

    const iconDim = getIconButtonDimension(size);
    const baseSx = buildButtonBaseSx(
      isExpressivePolygon,
      resolvedShape,
      clipId,
      hasShape,
    );

    const combinedWrapperSx = resolveWrapperSx(
      isExpressivePolygon,
      iconDim,
      wrapperSx,
    );

    return (
      <HoldButtonWrapper animate={buttonControls} sx={combinedWrapperSx}>
        {isExpressivePolygon && (
          <ClipDefs clipId={clipId} pathData={expressiveDef?.pathData} />
        )}

        <StyledHoldButton
          ref={internalRef}
          color={color}
          size={size}
          {...props}
          onPointerDown={(e) => {
            startHold(e);
            props.onPointerDown?.(e);
          }}
          onPointerUp={(e) => {
            cancelHold();
            props.onPointerUp?.(e);
          }}
          onPointerLeave={(e) => {
            cancelHold();
            props.onPointerLeave?.(e);
          }}
          onPointerCancel={(e) => {
            cancelHold();
            props.onPointerCancel?.(e);
          }}
          sx={[baseSx, ...(Array.isArray(sx) ? sx : [sx])]}
        >
          {children}
        </StyledHoldButton>

        <SvgOverlay
          isExpressivePolygon={isExpressivePolygon}
          pathD={pathD}
          paletteColor={paletteColor}
          borderThickness={borderThickness}
          totalOffset={totalOffset}
          outerWidth={outerWidth}
          outerHeight={outerHeight}
          progress={progress}
          opacity={opacity}
        />
      </HoldButtonWrapper>
    );
  },
);

HoldButton.displayName = "HoldButton";
