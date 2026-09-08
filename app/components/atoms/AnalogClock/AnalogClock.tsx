import { forwardRef } from "react";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import type {
  AnalogClockProps,
  ClockDialNeedlesProps,
} from "./AnalogClock.types";
import {
  ClockSvg,
  MotionHandGroupBase,
  HOUR_SPRING_TRANSITION,
  MINUTE_SPRING_TRANSITION,
  DOT_SPRING_TRANSITION,
} from "./AnalogClock.styles";

/**
 * Hand group that guarantees 100% stable center pivot at (50, 50).
 * By embedding an invisible 100x100 anchor rect centered at (50, 50),
 * SVG getBBox() center is always strictly (50, 50) regardless of line rotation angle.
 */
export const MotionHandGroup = forwardRef<
  SVGGElement,
  React.ComponentProps<typeof motion.g> & { children?: React.ReactNode }
>(({ children, style, ...props }, ref) => (
  <MotionHandGroupBase ref={ref} style={style} {...props}>
    <rect
      x="0"
      y="0"
      width="100"
      height="100"
      fill="none"
      stroke="none"
      pointerEvents="none"
      opacity="0"
    />
    {children}
  </MotionHandGroupBase>
));
MotionHandGroup.displayName = "MotionHandGroup";

interface NeedleMotionOptions {
  isAnimating: boolean;
  isHovered: boolean;
  startAngle: number;
  targetAngle?: number;
  multiTurns?: number;
}

function resolveNeedleRotation(options: NeedleMotionOptions) {
  const {
    isAnimating,
    isHovered,
    startAngle,
    targetAngle,
    multiTurns = 1,
  } = options;

  if (isAnimating) {
    return {
      initial: { rotate: 0 },
      animate: { rotate: [0, 360 * multiTurns] },
      transition: { repeat: Infinity, duration: 2.4, ease: "linear" as const },
    };
  }

  const effectiveAngle =
    isHovered && targetAngle !== undefined ? targetAngle : startAngle;

  return {
    initial: { rotate: effectiveAngle },
    animate: { rotate: effectiveAngle },
    transition:
      multiTurns === 1 ? HOUR_SPRING_TRANSITION : MINUTE_SPRING_TRANSITION,
  };
}

function resolveGhostColor(activeColor: string, hasEndDot: boolean) {
  if (!hasEndDot || activeColor === "currentColor") {
    return activeColor;
  }
  return alpha(activeColor, 0.38);
}

const DEFAULT_NEEDLE_PROPS = {
  activeColor: "currentColor",
  isHovered: false,
  isAnimating: false,
  hourStrokeWidth: 4.8,
  minuteStrokeWidth: 3.2,
  hourTestId: "time-sheet-hour-needle",
  minuteTestId: "time-sheet-minute-needle",
  endDotTestId: "time-sheet-end-dot",
};

const EndDotCircle: React.FC<{
  endDot?: { x: number; y: number } | null;
  ghostColor: string;
  isHovered: boolean;
  testId?: string;
}> = ({ endDot, ghostColor, isHovered, testId }) => {
  if (!endDot) return null;
  return (
    <motion.circle
      cx={endDot.x}
      cy={endDot.y}
      r={3.2}
      fill={ghostColor}
      animate={{
        scale: isHovered ? 1.2 : 1,
        opacity: isHovered ? 0.6 : 1,
      }}
      transition={DOT_SPRING_TRANSITION}
      data-testid={testId}
    />
  );
};

/**
 * Reusable Clock Dial Needles
 * Shared across ClockCard and AnalogClock with guaranteed pivot at (50, 50).
 */
export const ClockDialNeedles = (props: ClockDialNeedlesProps) => {
  const config = { ...DEFAULT_NEEDLE_PROPS, ...props };
  const {
    startHourAngle,
    startMinuteAngle,
    targetEndHourAngle,
    targetEndMinuteAngle,
    endDot,
    activeColor,
    isHovered,
    isAnimating,
    hourStrokeWidth,
    minuteStrokeWidth,
    hourTestId,
    minuteTestId,
    endDotTestId,
  } = config;

  const ghostColor = resolveGhostColor(activeColor, Boolean(endDot));
  const hourMotion = resolveNeedleRotation({
    isAnimating,
    isHovered,
    startAngle: startHourAngle,
    targetAngle: targetEndHourAngle,
    multiTurns: 1,
  });
  const minuteMotion = resolveNeedleRotation({
    isAnimating,
    isHovered,
    startAngle: startMinuteAngle,
    targetAngle: targetEndMinuteAngle,
    multiTurns: 6,
  });

  return (
    <>
      <EndDotCircle
        endDot={endDot}
        ghostColor={ghostColor}
        isHovered={isHovered}
        testId={endDotTestId}
      />

      {/* Hour Needle: Shorter & sturdier (y2=26, length=24 from center 50) */}
      <MotionHandGroup
        initial={hourMotion.initial}
        animate={hourMotion.animate}
        transition={hourMotion.transition}
        data-testid={hourTestId}
      >
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          stroke={activeColor}
          strokeWidth={hourStrokeWidth}
          strokeLinecap="round"
        />
      </MotionHandGroup>

      {/* Minute Needle: Longer & sleeker (y2=16, length=34 from center 50) */}
      <MotionHandGroup
        initial={minuteMotion.initial}
        animate={minuteMotion.animate}
        transition={minuteMotion.transition}
        data-testid={minuteTestId}
      >
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="16"
          stroke={activeColor}
          strokeWidth={minuteStrokeWidth}
          strokeLinecap="round"
        />
      </MotionHandGroup>
    </>
  );
};

/**
 * Center Pivot Hub (matching Material You widget from ClockCard)
 */
export const ClockCenterHub: React.FC<{
  color?: string;
  innerColor?: string;
  outerRadius?: number;
  innerRadius?: number;
  dataTestId?: string;
}> = ({
  color = "currentColor",
  innerColor = "transparent",
  outerRadius = 4.2,
  innerRadius = 1.8,
  dataTestId = "clock-center-hub",
}) => (
  <g data-testid={dataTestId}>
    <circle cx="50" cy="50" r={outerRadius} fill={color} />
    {innerRadius > 0 && innerColor !== "transparent" && (
      <circle cx="50" cy="50" r={innerRadius} fill={innerColor} />
    )}
  </g>
);

const ClockDialTicks: React.FC<{ color: string }> = ({ color }) => (
  <>
    <line
      x1="50"
      y1="10"
      x2="50"
      y2="18"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <line
      x1="90"
      y1="50"
      x2="82"
      y2="50"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <line
      x1="50"
      y1="90"
      x2="50"
      y2="82"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="50"
      x2="18"
      y2="50"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </>
);

const ClockDialBackground: React.FC<{
  dialType?: "circle" | "scalloped" | "none";
  showDialRing?: boolean;
  cookiePath?: string;
  color: string;
}> = ({ dialType = "circle", showDialRing = true, cookiePath, color }) => {
  if (dialType === "scalloped" && cookiePath) {
    return (
      <path
        d={cookiePath}
        fill={alpha(color, 0.08)}
        stroke={alpha(color, 0.22)}
        strokeWidth="1.2"
        data-testid="time-sheet-cookie-dial"
      />
    );
  }
  if (showDialRing && dialType === "circle") {
    return (
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={color}
        strokeWidth="4"
        opacity={0.9}
      />
    );
  }
  return null;
};

const DEFAULT_ANALOG_CLOCK_PROPS = {
  size: 24,
  color: "currentColor",
  hourAngle: 45,
  minuteAngle: 180,
  isHovered: false,
  isAnimating: false,
  showTicks: false,
  showDialRing: true,
  showHub: true,
  dialType: "circle" as const,
  hourStrokeWidth: 4.8,
  minuteStrokeWidth: 3.2,
  "data-testid": "analog-clock",
};

const HubComponent: React.FC<{
  showHub?: boolean;
  hubColor?: string;
  color: string;
  hubInnerColor?: string;
}> = ({ showHub, hubColor, color, hubInnerColor }) => {
  if (!showHub) return null;
  return (
    <ClockCenterHub
      color={hubColor ?? color}
      innerColor={hubInnerColor ?? "transparent"}
    />
  );
};

/**
 * Generic AnalogClock Component
 * Factorizes the clock dial, needles, and rotation mechanics from ClockCard.
 */
export const AnalogClock = forwardRef<SVGSVGElement, AnalogClockProps>(
  (props, ref) => {
    const config = { ...DEFAULT_ANALOG_CLOCK_PROPS, ...props };
    const {
      size,
      color,
      hubColor,
      hubInnerColor,
      hourAngle,
      minuteAngle,
      intervalInfo,
      isHovered,
      isAnimating,
      showTicks,
      showDialRing,
      showHub,
      dialType,
      cookiePath,
      hourStrokeWidth,
      minuteStrokeWidth,
      children,
      className,
      "data-testid": dataTestId,
      ...restProps
    } = config;

    const startHourAngle = intervalInfo?.startHourAngle ?? hourAngle;
    const startMinuteAngle = intervalInfo?.startMinuteAngle ?? minuteAngle;

    return (
      <ClockSvg
        ref={ref}
        $size={size}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className={className}
        data-testid={dataTestId}
        {...restProps}
      >
        <ClockDialBackground
          dialType={dialType}
          showDialRing={showDialRing}
          cookiePath={cookiePath}
          color={color}
        />

        {showTicks && <ClockDialTicks color={color} />}

        {children}

        <ClockDialNeedles
          startHourAngle={startHourAngle}
          startMinuteAngle={startMinuteAngle}
          targetEndHourAngle={intervalInfo?.targetEndHourAngle}
          targetEndMinuteAngle={intervalInfo?.targetEndMinuteAngle}
          endDot={intervalInfo?.endDot}
          activeColor={color}
          isHovered={isHovered}
          isAnimating={isAnimating}
          hourStrokeWidth={hourStrokeWidth}
          minuteStrokeWidth={minuteStrokeWidth}
          hourTestId="analog-clock-hour-needle"
          minuteTestId="analog-clock-minute-needle"
          endDotTestId="analog-clock-end-dot"
        />

        <HubComponent
          showHub={showHub}
          hubColor={hubColor}
          color={color}
          hubInnerColor={hubInnerColor}
        />
      </ClockSvg>
    );
  },
);

AnalogClock.displayName = "AnalogClock";
export default AnalogClock;
