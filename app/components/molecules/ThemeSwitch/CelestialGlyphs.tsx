import React from "react";
import { styled } from "@mui/material/styles";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";

const filterIconProp = (prop: PropertyKey) => prop !== "$iconSize";

const StyledSunIcon = styled(LightModeRoundedIcon, {
  shouldForwardProp: filterIconProp,
})<{ $iconSize: number }>(({ theme, $iconSize }) => ({
  fontSize: $iconSize,
  color: theme.palette.common.white,
  filter: `drop-shadow(0 0 4px ${theme.palette.celestial.sun.glow})`,
  display: "block",
}));

const StyledMoonIcon = styled(DarkModeRoundedIcon, {
  shouldForwardProp: filterIconProp,
})<{ $iconSize: number }>(({ theme, $iconSize }) => ({
  fontSize: $iconSize,
  color: theme.palette.common.white,
  filter: `drop-shadow(0 0 4px ${theme.palette.celestial.moon.glow})`,
  display: "block",
}));

const StyledPeekingSun = styled(WbSunnyRoundedIcon, {
  shouldForwardProp: filterIconProp,
})<{ $iconSize: number }>(({ theme, $iconSize }) => ({
  fontSize: $iconSize,
  color: theme.palette.celestial.sun.main,
  filter: `drop-shadow(0 0 3px ${theme.palette.celestial.sun.glow})`,
  display: "block",
}));

const StyledPeekingMoon = styled(NightlightRoundedIcon, {
  shouldForwardProp: filterIconProp,
})<{ $iconSize: number }>(({ theme, $iconSize }) => ({
  fontSize: $iconSize,
  color: theme.palette.celestial.moon.main,
  filter: `drop-shadow(0 0 3px ${theme.palette.celestial.moon.glow})`,
  display: "block",
}));

/**
 * Material Design 3 High-Contrast Sun Glyph
 */
export const HighContrastSunGlyph: React.FC<{ size: number }> = ({ size }) => (
  <StyledSunIcon $iconSize={size} aria-hidden="true" />
);

/**
 * Material Design 3 High-Contrast Moon Glyph
 */
export const HighContrastMoonGlyph: React.FC<{ size: number }> = ({ size }) => (
  <StyledMoonIcon $iconSize={size} aria-hidden="true" />
);

/**
 * Material Design 3 Peeking Horizon Sun Icon
 */
export const PeekingSunIcon: React.FC<{ size: number }> = ({ size }) => (
  <StyledPeekingSun $iconSize={size} aria-hidden="true" />
);

/**
 * Material Design 3 Peeking Horizon Moon Icon
 */
export const PeekingMoonIcon: React.FC<{ size: number }> = ({ size }) => (
  <StyledPeekingMoon $iconSize={size} aria-hidden="true" />
);
