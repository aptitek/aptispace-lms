import React, { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { motion, type HTMLMotionProps } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
import { FONT_FAMILIES } from "~/tokens/typography";
import type { SwitchSizeConfig } from "~/components/atoms/Switch";
import AnalogClock from "~/components/atoms/AnalogClock";

export const ClockFaceContainer = styled(motion.div)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.common.white,
}));

/**
 * Analog clock transition glyph powered by generic AnalogClock atom (reusing ClockCard geometry)
 */
export const AnalogClockGlyph: React.FC<{
  size: number;
  isAnimating: boolean;
}> = ({ size, isAnimating }) => {
  return (
    <ClockFaceContainer>
      <AnalogClock
        size={size}
        isAnimating={isAnimating}
        color="currentColor"
        showTicks={false}
        showDialRing={true}
        data-testid="switch-analog-clock"
      />
    </ClockFaceContainer>
  );
};

interface DigitSpanProps extends HTMLMotionProps<"span"> {
  $fontSize?: number;
}

const CleanDigitSpan = forwardRef<HTMLSpanElement, DigitSpanProps>(
  ({ $fontSize: _f, ...props }, ref) =>
    React.createElement(motion.span, { ref, ...props }),
);
CleanDigitSpan.displayName = "CleanDigitSpan";

export const ClockDigitPuckText = styled(CleanDigitSpan)<{ $fontSize: number }>(
  ({ theme, $fontSize }) => ({
    fontFamily: theme.typography.fontFamily,
    fontSize: $fontSize,
    fontWeight: 800,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.04em",
    lineHeight: 1,
    color: theme.palette.common.white,
    userSelect: "none",
    pointerEvents: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }),
);

export const ClockPuckDisplay: React.FC<{
  is24h: boolean;
  fontSize: number;
}> = ({ is24h, fontSize }) => {
  const text = is24h ? "24" : "12";
  return (
    <ClockDigitPuckText
      $fontSize={fontSize}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={M3_SPRINGS.expressive.effects.fast}
    >
      {text}
    </ClockDigitPuckText>
  );
};

export const DigitalClockBadge = styled("div", {
  shouldForwardProp: (prop) => prop !== "$fontSize" && prop !== "$isHovered",
})<{
  $fontSize: number;
  $isHovered: boolean;
}>(({ theme, $fontSize, $isHovered }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: FONT_FAMILIES.mono,
  fontSize: $fontSize,
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "-0.05em",
  lineHeight: 1,
  padding: theme.spacing(0.25, 0.5),
  borderRadius: 4,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.surfaceContainerLow,
  border: `1px solid ${theme.palette.outlineVariant}`,
  boxSizing: "border-box",
  whiteSpace: "nowrap",
  userSelect: "none",
  pointerEvents: "none",
  opacity: $isHovered ? 1 : 0.7,
  transition: "opacity 0.2s ease, border-color 0.2s ease, color 0.2s ease",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.surfaceContainerHigh,
  }),
}));

export const DigitalColonSpan = styled(motion.span, {
  shouldForwardProp: (prop) => prop !== "$isHovered",
})<{ $isHovered: boolean }>(({ theme, $isHovered }) => ({
  display: "inline-block",
  color: $isHovered ? theme.palette.primary.main : "inherit",
}));

function resolveDigitalFontSize(thumbSize: number): number {
  if (thumbSize <= 20) return 6;
  if (thumbSize <= 25) return 7;
  return 8.5;
}

/**
 * Ultra-compact digital clock display for the inactive side
 * Specifically scaled to fit within the compact empty slot without clipping
 */
export const DigitalClockGlyph: React.FC<{
  format: "12h" | "24h";
  isHovered: boolean;
  cfg: SwitchSizeConfig;
}> = ({ format, isHovered, cfg }) => {
  const hours = format === "24h" ? "24" : "12";
  const fontSize = resolveDigitalFontSize(cfg.thumbSize);

  return (
    <DigitalClockBadge
      $fontSize={fontSize}
      $isHovered={isHovered}
      data-testid="digital-clock-inactive"
    >
      <span>{hours}</span>
      <DigitalColonSpan
        $isHovered={isHovered}
        data-testid="digital-colon"
        animate={isHovered ? { opacity: [1, 0, 1] } : { opacity: 0.85 }}
        transition={
          isHovered
            ? { repeat: Infinity, duration: 0.6, ease: "linear" }
            : { duration: 0.2 }
        }
      >
        :
      </DigitalColonSpan>
      <span>00</span>
    </DigitalClockBadge>
  );
};
