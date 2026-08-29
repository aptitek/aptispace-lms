import React from "react";
import { styled } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";

export const StyledSvg = styled("svg")({
  display: "block",
  overflow: "visible",
});

const filterIconProp = (prop: PropertyKey) => prop !== "$iconSize";

const StyledSunIcon = styled(LightModeIcon, {
  shouldForwardProp: filterIconProp,
})<{ $iconSize: number }>(({ theme, $iconSize }) => ({
  fontSize: $iconSize,
  color: theme.palette.common.white,
  filter: `drop-shadow(0 0 4px ${theme.palette.warning.light})`,
  display: "block",
}));

const StyledMoonIcon = styled(DarkModeIcon, {
  shouldForwardProp: filterIconProp,
})<{ $iconSize: number }>(({ theme, $iconSize }) => ({
  fontSize: $iconSize,
  color: theme.palette.common.white,
  filter: `drop-shadow(0 0 4px ${theme.palette.primary.main})`,
  display: "block",
}));

const StyledPeekingSun = styled(WbSunnyIcon, {
  shouldForwardProp: filterIconProp,
})<{ $iconSize: number }>(({ theme, $iconSize }) => ({
  fontSize: $iconSize,
  color: theme.palette.warning.light,
  filter: `drop-shadow(0 0 3px ${theme.palette.warning.main})`,
  display: "block",
}));

const StyledPeekingMoon = styled(NightlightRoundIcon, {
  shouldForwardProp: filterIconProp,
})<{ $iconSize: number }>(({ theme, $iconSize }) => ({
  fontSize: $iconSize,
  color: theme.palette.primary.main,
  filter: `drop-shadow(0 0 3px ${theme.palette.primary.main})`,
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
