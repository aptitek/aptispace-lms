import React from "react";
import { styled } from "@mui/material/styles";

export const StyledSvg = styled("svg")({
  display: "block",
  overflow: "visible",
});

const FRANCE_PATH =
  "M 16.1 2.8 L 17.2 3.6 L 18.0 4.4 L 18.8 4.6 L 19.6 5.6 L 20.6 6.2 L 21.7 6.9 L 22.7 7.0 L 23.2 8.7 L 22.4 10.9 L 21.8 11.2 L 20.4 13.0 L 20.5 13.4 L 21.5 14.0 L 21.9 15.5 L 21.2 16.5 L 21.4 17.7 L 22.5 18.9 L 21.3 20.1 L 18.5 20.1 L 17.5 19.9 L 14.8 20.8 L 14.0 22.0 L 12.5 21.3 L 10.9 20.5 L 9.3 20.4 L 7.6 19.5 L 7.5 19.0 L 8.5 15.9 L 9.5 15.3 L 8.9 13.1 L 7.8 10.1 L 7.2 9.4 L 6.4 8.5 L 4.2 7.3 L 4.9 6.7 L 6.2 6.0 L 9.3 6.8 L 9.9 4.5 L 12.1 5.3 L 14.4 2.7 L 16.0 2.7 Z";

const UK_PATH =
  "M 16.2 2.6 L 14.9 4.1 L 16.9 4.8 L 16.5 6.7 L 15.5 7.6 L 14.4 8.4 L 16.9 11.2 L 18.2 14.1 L 17.4 14.5 L 18.6 16.8 L 20.4 17.7 L 19.6 19.2 L 18.3 20.0 L 19.5 20.9 L 16.6 21.4 L 14.3 21.3 L 12.8 21.0 L 10.7 21.5 L 8.6 21.8 L 10.6 20.3 L 13.3 19.4 L 12.3 19.2 L 11.1 18.2 L 11.2 17.2 L 12.2 15.7 L 11.9 15.1 L 13.9 14.6 L 14.2 13.9 L 13.9 12.6 L 13.6 11.0 L 12.4 11.0 L 12.5 9.6 L 12.8 8.0 L 12.2 8.2 L 12.0 8.3 L 11.7 8.5 L 12.5 6.6 L 11.5 6.1 L 12.3 4.6 L 12.9 3.5 L 13.5 2.7 L 14.2 2.1 L 16.4 2.4 L 16.3 2.5 Z";

const MapPathSilhouette = styled("path")<{ $active: boolean }>(
  ({ theme, $active }) => ({
    fill: $active ? theme.palette.primary.main : "currentColor",
    fillOpacity: $active ? 0.28 : 0.08,
    stroke: $active ? theme.palette.primary.main : theme.palette.divider,
    strokeWidth: $active ? 1.2 : 0.8,
    transition: "all 0.3s ease",
  }),
);

export const FranceMapSilhouette: React.FC<{
  size: number;
  active: boolean;
}> = ({ size, active }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox="0 0 28 25"
    fill="none"
    aria-hidden="true"
  >
    <MapPathSilhouette d={FRANCE_PATH} $active={active} />
  </StyledSvg>
);

export const UkMapSilhouette: React.FC<{
  size: number;
  active: boolean;
}> = ({ size, active }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox="0 0 28 25"
    fill="none"
    aria-hidden="true"
  >
    <MapPathSilhouette d={UK_PATH} $active={active} />
  </StyledSvg>
);

const FLAG_RADIUS = 16;
const FLAG_VIEWBOX = 32;

const UkFlagBackground = styled("rect")(({ theme }) => ({
  fill: theme.palette.primary.dark,
}));

const UkFlagWhiteCross = styled("path")(({ theme }) => ({
  stroke: theme.palette.background.default,
}));

const UkFlagRedCross = styled("path")(({ theme }) => ({
  stroke: theme.palette.error.main,
}));

export const UkFlag: React.FC<{ size: number }> = ({ size }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox={`0 0 ${FLAG_VIEWBOX} ${FLAG_VIEWBOX}`}
    aria-hidden="true"
  >
    <clipPath id="uk-circle-flag">
      <circle cx={FLAG_RADIUS} cy={FLAG_RADIUS} r={FLAG_RADIUS} />
    </clipPath>
    <g clipPath="url(#uk-circle-flag)">
      <UkFlagBackground width={FLAG_VIEWBOX} height={FLAG_VIEWBOX} />
      <UkFlagWhiteCross d="M0 0 L32 32 M32 0 L0 32" strokeWidth={5.5} />
      <UkFlagRedCross d="M0 0 L32 32 M32 0 L0 32" strokeWidth={2.5} />
      <UkFlagWhiteCross d="M16 0 V32 M0 16 H32" strokeWidth={9} />
      <UkFlagRedCross d="M16 0 V32 M0 16 H32" strokeWidth={5} />
    </g>
  </StyledSvg>
);

const FR_STRIPE_W = 10.66;
const FR_STRIPE_MID_W = 10.68;
const FR_STRIPE_X3 = 21.34;

const FrStripeBlue = styled("rect")(({ theme }) => ({
  fill: theme.palette.primary.dark,
}));

const FrStripeWhite = styled("rect")(({ theme }) => ({
  fill: theme.palette.background.default,
}));

const FrStripeRed = styled("rect")(({ theme }) => ({
  fill: theme.palette.error.main,
}));

export const FrFlag: React.FC<{ size: number }> = ({ size }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox={`0 0 ${FLAG_VIEWBOX} ${FLAG_VIEWBOX}`}
    aria-hidden="true"
  >
    <clipPath id="fr-circle-flag">
      <circle cx={FLAG_RADIUS} cy={FLAG_RADIUS} r={FLAG_RADIUS} />
    </clipPath>
    <g clipPath="url(#fr-circle-flag)">
      <FrStripeBlue x={0} width={FR_STRIPE_W} height={FLAG_VIEWBOX} />
      <FrStripeWhite
        x={FR_STRIPE_W}
        width={FR_STRIPE_MID_W}
        height={FLAG_VIEWBOX}
      />
      <FrStripeRed x={FR_STRIPE_X3} width={FR_STRIPE_W} height={FLAG_VIEWBOX} />
    </g>
  </StyledSvg>
);

const JetFuselage = styled("path")(({ theme }) => ({
  fill: theme.palette.common?.white ?? "currentColor",
}));

const JetThrust = styled("circle")(({ theme }) => ({
  fill: theme.palette.warning.light,
}));

/**
 * Supersonic Jet Airplane Silhouette for Meridian Travel
 */
export const AirplaneIcon: React.FC<{ size: number }> = ({ size }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <JetThrust cx="3.5" cy="12" r="2" opacity="0.9" />
    <JetFuselage d="M21.5 12L14 7.5L14 3C14 2.45 13.55 2 13 2C12.45 2 12 2.45 12 3L12 7.5L4.5 12L2 12L4 13.5L12 13.5L12 18.5L9.5 20.5L9.5 22L13 21L16.5 22L16.5 20.5L14 18.5L14 13.5L22 13.5L24 12L21.5 12Z" />
  </StyledSvg>
);

const BeaconCircle = styled("circle")(({ theme }) => ({
  stroke: theme.palette.primary.main,
  strokeWidth: 1.5,
}));

export const RunwayBeacon: React.FC<{ size: number }> = ({ size }) => (
  <StyledSvg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <BeaconCircle cx="8" cy="8" r="6" strokeDasharray="2 2" />
    <BeaconCircle cx="8" cy="8" r="2" fill="currentColor" />
  </StyledSvg>
);
