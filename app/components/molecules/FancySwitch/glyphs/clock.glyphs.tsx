import React from "react";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { M3_SPRINGS, M3_MOTION_DURATIONS } from "~/tokens/motion";
import { FONT_FAMILIES } from "~/tokens/typography";
import AnalogClock from "~/components/atoms/AnalogClock";
import { filterDollarProp, GlyphMotionCenter } from "../FancySwitch.styles";

export const ClockDigitPuckText = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{ $fontSize: number }>(({ theme, $fontSize }) => ({
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
}));

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

export const AnalogClockGlyph: React.FC<{
  size: number;
  isAnimating: boolean;
}> = ({ size, isAnimating }) => {
  return (
    <GlyphMotionCenter
      sx={{ width: "100%", height: "100%", color: "common.white" }}
    >
      <AnalogClock
        size={size}
        isAnimating={isAnimating}
        color="currentColor"
        showTicks={false}
        showDialRing={true}
        data-testid="switch-analog-clock"
      />
    </GlyphMotionCenter>
  );
};

export const DigitalClockBadge = styled("div", {
  shouldForwardProp: filterDollarProp,
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
  transition: `opacity ${M3_MOTION_DURATIONS.short4}ms ease, border-color ${M3_MOTION_DURATIONS.short4}ms ease, color ${M3_MOTION_DURATIONS.short4}ms ease`,
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.surfaceContainerHigh,
  }),
}));

export const DigitalColonSpan = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{ $isHovered: boolean }>(({ $isHovered }) => ({
  display: "inline-block",
  padding: 0,
  margin: 0,
  transformOrigin: "center center",
  opacity: $isHovered ? 1 : 0.7,
}));

export const DigitalClockGlyph: React.FC<{
  format: "12h" | "24h";
  fontSize: number;
  isHovered: boolean;
}> = ({ format, fontSize, isHovered }) => {
  const timeHour = format === "24h" ? "24" : "12";

  return (
    <DigitalClockBadge
      $fontSize={fontSize}
      $isHovered={isHovered}
      data-testid="digital-clock-slot"
      aria-hidden="true"
    >
      <span>{timeHour}</span>
      <DigitalColonSpan
        $isHovered={isHovered}
        data-testid="digital-colon"
        animate={
          isHovered
            ? { opacity: [1, 0.2, 1], scale: [1, 1.15, 1] }
            : { opacity: 0.7, scale: 1 }
        }
        transition={
          isHovered
            ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
            : undefined
        }
      >
        :
      </DigitalColonSpan>
      <span>00</span>
    </DigitalClockBadge>
  );
};
