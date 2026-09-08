import React from "react";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import { M3_SPRINGS } from "~/tokens/motion";
import type { SwitchSizeConfig } from "~/components/atoms/Switch";
import {
  GlyphMotionCenter,
  ArcOverlaySvg,
  PeekingAnchor,
} from "../FancySwitch.styles";

export const HighContrastSunGlyph: React.FC<{ size: number }> = ({ size }) => {
  const theme = useTheme();
  return (
    <LightModeRoundedIcon
      sx={{
        fontSize: size,
        color: theme.palette.common.white,
        filter: `drop-shadow(0 0 4px ${theme.palette.celestial.sun.glow})`,
      }}
      aria-hidden="true"
    />
  );
};

export const HighContrastMoonGlyph: React.FC<{ size: number }> = ({ size }) => {
  const theme = useTheme();
  return (
    <DarkModeRoundedIcon
      sx={{
        fontSize: size,
        color: theme.palette.common.white,
        filter: `drop-shadow(0 0 4px ${theme.palette.celestial.moon.glow})`,
      }}
      aria-hidden="true"
    />
  );
};

export const PeekingSunIcon: React.FC<{ size: number }> = ({ size }) => {
  const theme = useTheme();
  return (
    <WbSunnyRoundedIcon
      sx={{
        fontSize: size,
        color: theme.palette.celestial.sun.main,
        filter: `drop-shadow(0 0 3px ${theme.palette.celestial.sun.glow})`,
      }}
      aria-hidden="true"
    />
  );
};

export const PeekingMoonIcon: React.FC<{ size: number }> = ({ size }) => {
  const theme = useTheme();
  return (
    <NightlightRoundedIcon
      sx={{
        fontSize: size,
        color: theme.palette.celestial.moon.main,
        filter: `drop-shadow(0 0 3px ${theme.palette.celestial.moon.glow})`,
      }}
      aria-hidden="true"
    />
  );
};

export const ActiveZenithGlyph: React.FC<{
  isDark: boolean;
  iconSize: number;
}> = ({ isDark, iconSize }) => {
  return isDark ? (
    <GlyphMotionCenter
      key="zenith-moon"
      initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
      transition={M3_SPRINGS.expressive.effects.fast}
    >
      <HighContrastMoonGlyph size={iconSize} />
    </GlyphMotionCenter>
  ) : (
    <GlyphMotionCenter
      key="zenith-sun"
      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
      transition={M3_SPRINGS.expressive.effects.fast}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={
          process.env.NODE_ENV === "test"
            ? { duration: 0.1 }
            : { repeat: Infinity, duration: 18, ease: "linear" }
        }
      >
        <HighContrastSunGlyph size={iconSize} />
      </motion.div>
    </GlyphMotionCenter>
  );
};

export const HorizonPeekPreview: React.FC<{
  isDark: boolean;
  cfg: SwitchSizeConfig;
  isHovered?: boolean;
}> = ({ isDark, cfg, isHovered = true }) => {
  if (!isHovered) return null;

  return isDark ? (
    <PeekingAnchor
      $position="right"
      $cfg={cfg}
      key="peek-sun"
      data-testid="peeking-sun-preview"
      initial={{ opacity: 0, y: 10, scale: 0.6 }}
      animate={{ opacity: 0.9, y: -2, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.6 }}
      transition={M3_SPRINGS.celestialPeek}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={
          process.env.NODE_ENV === "test"
            ? { duration: 0.1 }
            : { repeat: Infinity, duration: 10, ease: "linear" }
        }
      >
        <PeekingSunIcon size={cfg.peekIconSize} />
      </motion.div>
    </PeekingAnchor>
  ) : (
    <PeekingAnchor
      $position="left"
      $cfg={cfg}
      key="peek-moon"
      data-testid="peeking-moon-preview"
      initial={{ opacity: 0, y: 10, scale: 0.6 }}
      animate={{ opacity: 0.9, y: -2, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.6 }}
      transition={M3_SPRINGS.celestialPeek}
    >
      <motion.div
        animate={{ y: [0, -1.5, 0] }}
        transition={
          process.env.NODE_ENV === "test"
            ? { duration: 0.1 }
            : { repeat: Infinity, duration: 3, ease: "easeInOut" }
        }
      >
        <PeekingMoonIcon size={cfg.peekIconSize} />
      </motion.div>
    </PeekingAnchor>
  );
};

export const CelestialArcLine: React.FC<{ cfg: SwitchSizeConfig }> = ({
  cfg,
}) => {
  const arcStartX = cfg.padX + 2;
  const arcEndX = cfg.width - cfg.padX - 2;
  const arcMidX = cfg.width / 2;
  const arcPath = `M ${arcStartX} ${cfg.arcBaseY} Q ${arcMidX} ${cfg.arcPeakY} ${arcEndX} ${cfg.arcBaseY}`;

  return (
    <ArcOverlaySvg viewBox={`0 0 ${cfg.width} ${cfg.height}`}>
      <path
        d={arcPath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="2.5 3"
        opacity={0.5}
      />
    </ArcOverlaySvg>
  );
};
