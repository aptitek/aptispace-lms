import type { SVGAttributes, ReactNode } from "react";
import type { Transition } from "framer-motion";

export interface ClockIntervalNeedlesInfo {
  startHourAngle: number;
  startMinuteAngle: number;
  targetEndHourAngle?: number;
  targetEndMinuteAngle?: number;
  endDot?: { x: number; y: number } | null;
}

export interface ClockDialNeedlesProps {
  startHourAngle: number;
  startMinuteAngle: number;
  targetEndHourAngle?: number;
  targetEndMinuteAngle?: number;
  endDot?: { x: number; y: number } | null;
  activeColor?: string;
  isHovered?: boolean;
  isAnimating?: boolean;
  hourStrokeWidth?: number;
  minuteStrokeWidth?: number;
  hourTestId?: string;
  minuteTestId?: string;
  endDotTestId?: string;
}

export interface AnalogClockProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  "color"
> {
  size?: number;
  color?: string;
  hubColor?: string;
  hubInnerColor?: string;
  hourAngle?: number;
  minuteAngle?: number;
  intervalInfo?: ClockIntervalNeedlesInfo;
  isHovered?: boolean;
  isAnimating?: boolean;
  showTicks?: boolean;
  showDialRing?: boolean;
  showHub?: boolean;
  dialType?: "circle" | "scalloped" | "none";
  cookiePath?: string;
  hourStrokeWidth?: number;
  minuteStrokeWidth?: number;
  hourTransition?: Transition;
  minuteTransition?: Transition;
  children?: ReactNode;
  className?: string;
  "data-testid"?: string;
}
