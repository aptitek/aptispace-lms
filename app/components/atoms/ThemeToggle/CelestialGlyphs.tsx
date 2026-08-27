import React from "react";
import { styled } from "@mui/material/styles";

export const StyledSvg = styled("svg")({
  display: "block",
  overflow: "visible",
});

const SunCoreCircle = styled("circle")(({ theme }) => ({
  fill: theme.palette.common?.white ?? "currentColor",
}));

const SunBeamGroup = styled("g")(({ theme }) => ({
  stroke: theme.palette.common?.white ?? "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
}));

/**
 * High-contrast, distance-optimized Sun Glyph
 */
export const HighContrastSunGlyph: React.FC<{ size: number }> = ({ size }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <SunCoreCircle cx="12" cy="12" r="5.5" />
    <SunBeamGroup>
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22.5" y2="12" />
      <line x1="4.5" y1="4.5" x2="6.3" y2="6.3" />
      <line x1="17.7" y1="17.7" x2="19.5" y2="19.5" />
      <line x1="4.5" y1="19.5" x2="6.3" y2="17.7" />
      <line x1="17.7" y1="6.3" x2="19.5" y2="4.5" />
    </SunBeamGroup>
  </StyledSvg>
);

const MoonCrescentPath = styled("path")(({ theme }) => ({
  fill: theme.palette.background.default,
  stroke: theme.palette.primary.light,
  strokeWidth: 1.2,
  strokeLinejoin: "round",
}));

const MoonStarSpark = styled("circle")(({ theme }) => ({
  fill: theme.palette.info.light,
}));

/**
 * High-contrast, distance-optimized Moon Glyph
 */
export const HighContrastMoonGlyph: React.FC<{ size: number }> = ({ size }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <MoonCrescentPath d="M20.5 13.2C19.8 17.6 15.8 21 11 21C5.5 21 1 16.5 1 11C1 6.2 4.4 2.2 8.8 1.5C8.1 2.9 7.7 4.5 7.7 6.2C7.7 12 12.4 16.7 18.2 16.7C19 16.7 19.8 16.5 20.5 16.2V13.2Z" />
    <MoonStarSpark cx="17.5" cy="5.5" r="1.6" />
    <MoonStarSpark cx="14" cy="9" r="1.1" opacity="0.8" />
  </StyledSvg>
);

const PeekingSunCenter = styled("circle")(({ theme }) => ({
  fill: theme.palette.warning.light,
}));

const PeekingSunRays = styled("g")(({ theme }) => ({
  stroke: theme.palette.warning.dark,
  strokeWidth: 1.8,
  strokeLinecap: "round",
}));

/**
 * Peeking Horizon Sun Icon (Warm Solar Flare)
 */
export const PeekingSunIcon: React.FC<{ size: number }> = ({ size }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <PeekingSunCenter cx="10" cy="10" r="5" />
    <PeekingSunRays>
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="10" y1="16" x2="10" y2="18" />
      <line x1="2" y1="10" x2="4" y2="10" />
      <line x1="16" y1="10" x2="18" y2="10" />
      <line x1="4.3" y1="4.3" x2="5.8" y2="5.8" />
      <line x1="14.2" y1="14.2" x2="15.7" y2="15.7" />
      <line x1="4.3" y1="15.7" x2="5.8" y2="14.2" />
      <line x1="14.2" y1="5.8" x2="15.7" y2="4.3" />
    </PeekingSunRays>
  </StyledSvg>
);

const PeekingMoonBody = styled("path")(({ theme }) => ({
  fill: theme.palette.info.light,
  stroke: theme.palette.primary.main,
  strokeWidth: 1.4,
}));

const PeekingMoonSpark = styled("circle")(({ theme }) => ({
  fill: theme.palette.background.default,
}));

/**
 * Peeking Horizon Moon Icon (Cool Lunar Twilight)
 */
export const PeekingMoonIcon: React.FC<{ size: number }> = ({ size }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <PeekingMoonBody d="M16 11C15.4 14.5 12.3 17 8.5 17C4.4 17 1 13.6 1 9.5C1 5.7 3.5 2.6 7 2C6.4 3.1 6.1 4.4 6.1 5.7C6.1 10.3 9.8 14 14.4 14C15 14 15.5 13.9 16 13.7V11Z" />
    <PeekingMoonSpark cx="14" cy="4.5" r="1.2" />
  </StyledSvg>
);
