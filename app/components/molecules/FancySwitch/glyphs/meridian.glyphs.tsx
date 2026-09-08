import React, { useId } from "react";
import { styled, useTheme } from "@mui/material/styles";
import type { TargetAndTransition, Transition } from "framer-motion";
import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import { M3_SPRINGS } from "~/tokens/motion";
import { UK_FLAG_COLORS, FRENCH_FLAG_COLORS } from "~/tokens/namedColors";
import type { SwitchSizeConfig } from "~/components/atoms/Switch";
import {
  PeekingCompanionLayer,
  CountryMapZone,
  ArcOverlaySvg,
} from "../FancySwitch.styles";

const FRANCE_MAP_PATH =
  "M 16.1 2.8 L 17.2 3.6 L 18.0 4.4 L 18.8 4.6 L 19.6 5.6 L 20.6 6.2 L 21.7 6.9 L 22.7 7.0 L 23.2 8.7 L 22.4 10.9 L 21.8 11.2 L 20.4 13.0 L 20.5 13.4 L 21.5 14.0 L 21.9 15.5 L 21.2 16.5 L 21.4 17.7 L 22.5 18.9 L 21.3 20.1 L 18.5 20.1 L 17.5 19.9 L 14.8 20.8 L 14.0 22.0 L 12.5 21.3 L 10.9 20.5 L 9.3 20.4 L 7.6 19.5 L 7.5 19.0 L 8.5 15.9 L 9.5 15.3 L 8.9 13.1 L 7.8 10.1 L 7.2 9.4 L 6.4 8.5 L 4.2 7.3 L 4.9 6.7 L 6.2 6.0 L 9.3 6.8 L 9.9 4.5 L 12.1 5.3 L 14.4 2.7 L 16.0 2.7 Z";

const UK_MAP_PATH =
  "M 16.2 2.6 L 14.9 4.1 L 16.9 4.8 L 16.5 6.7 L 15.5 7.6 L 14.4 8.4 L 16.9 11.2 L 18.2 14.1 L 17.4 14.5 L 18.6 16.8 L 20.4 17.7 L 19.6 19.2 L 18.3 20.0 L 19.5 20.9 L 16.6 21.4 L 14.3 21.3 L 12.8 21.0 L 10.7 21.5 L 8.6 21.8 L 10.6 20.3 L 13.3 19.4 L 12.3 19.2 L 11.1 18.2 L 11.2 17.2 L 12.2 15.7 L 11.9 15.1 L 13.9 14.6 L 14.2 13.9 L 13.9 12.6 L 13.6 11.0 L 12.4 11.0 L 12.5 9.6 L 12.8 8.0 L 12.2 8.2 L 12.0 8.3 L 11.7 8.5 L 12.5 6.6 L 11.5 6.1 L 12.3 4.6 L 12.9 3.5 L 13.5 2.7 L 14.2 2.1 L 16.4 2.4 L 16.3 2.5 Z";

const MapSvg = styled("svg")({
  display: "block",
  overflow: "visible",
});

const SilhouettePath = styled("path")({
  transition: "all 0.3s ease",
});

export const FranceMapSilhouette: React.FC<{
  size: number;
  active: boolean;
}> = ({ size, active }) => {
  const theme = useTheme();
  const fillColor = active ? theme.palette.primary.main : "currentColor";
  const strokeColor = active
    ? theme.palette.primary.main
    : theme.palette.divider;

  return (
    <MapSvg
      width={size}
      height={size}
      viewBox="0 0 28 25"
      fill="none"
      aria-hidden="true"
    >
      <SilhouettePath
        d={FRANCE_MAP_PATH}
        fill={fillColor}
        fillOpacity={active ? 0.28 : 0.08}
        stroke={strokeColor}
        strokeWidth={active ? 1.2 : 0.8}
      />
    </MapSvg>
  );
};

export const UkMapSilhouette: React.FC<{
  size: number;
  active: boolean;
}> = ({ size, active }) => {
  const theme = useTheme();
  const fillColor = active ? theme.palette.primary.main : "currentColor";
  const strokeColor = active
    ? theme.palette.primary.main
    : theme.palette.divider;

  return (
    <MapSvg
      width={size}
      height={size}
      viewBox="0 0 28 25"
      fill="none"
      aria-hidden="true"
    >
      <SilhouettePath
        d={UK_MAP_PATH}
        fill={fillColor}
        fillOpacity={active ? 0.28 : 0.08}
        stroke={strokeColor}
        strokeWidth={active ? 1.2 : 0.8}
      />
    </MapSvg>
  );
};

export const UkFlag: React.FC<{ size: number }> = ({ size }) => {
  const rawId = useId();
  const clipId = `uk-flag-${rawId.replace(/:/g, "")}`;

  return (
    <MapSvg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="16" cy="16" r="16" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="32" height="32" fill={UK_FLAG_COLORS.blue} />
        <path
          d="M0 0 L32 32 M32 0 L0 32"
          stroke={UK_FLAG_COLORS.white}
          strokeWidth="5.33"
        />
        <path
          d="M0 0 L32 32 M32 0 L0 32"
          stroke={UK_FLAG_COLORS.red}
          strokeWidth="2.67"
        />
        <path
          d="M16 0 V32 M0 16 H32"
          stroke={UK_FLAG_COLORS.white}
          strokeWidth="8"
        />
        <path
          d="M16 0 V32 M0 16 H32"
          stroke={UK_FLAG_COLORS.red}
          strokeWidth="4.8"
        />
      </g>
    </MapSvg>
  );
};

export const FranceFlag: React.FC<{ size: number }> = ({ size }) => {
  const rawId = useId();
  const clipId = `fr-flag-${rawId.replace(/:/g, "")}`;

  return (
    <MapSvg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="16" cy="16" r="16" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect
          x="0"
          y="0"
          width="10.67"
          height="32"
          fill={FRENCH_FLAG_COLORS.blue}
        />
        <rect
          x="10.67"
          y="0"
          width="10.67"
          height="32"
          fill={FRENCH_FLAG_COLORS.white}
        />
        <rect
          x="21.34"
          y="0"
          width="10.66"
          height="32"
          fill={FRENCH_FLAG_COLORS.red}
        />
      </g>
    </MapSvg>
  );
};

export const MdiAirplaneGlyph: React.FC<{ size: number }> = ({ size }) => (
  <FlightRoundedIcon sx={{ fontSize: size }} aria-hidden="true" />
);

export const FlightAirplane: React.FC<{
  cfg: SwitchSizeConfig;
  isFrench: boolean;
  isHovered: boolean;
  isFlying: boolean;
  flightDirection: "forward" | "backward";
}> = ({ cfg, isFrench, isHovered, isFlying, flightDirection }) => {
  const leftCenterX = cfg.padX - 2 + cfg.puckSize / 2;
  const rightCenterX = cfg.padX - 2 + cfg.travelX + cfg.puckSize / 2;
  const halfPlane = cfg.planeSize / 2;
  const peekOffset = cfg.puckSize * 0.72;

  const leftTuckedX = leftCenterX - halfPlane;
  const leftPeekX = leftTuckedX + peekOffset;
  const rightTuckedX = rightCenterX - halfPlane;
  const rightPeekX = rightTuckedX - peekOffset;

  let animateProps: TargetAndTransition;
  let transitionProps: Transition;

  if (isFlying) {
    const isToFr = flightDirection === "forward";
    const startX = isToFr ? leftPeekX : rightPeekX;
    const endX = isToFr ? cfg.width - cfg.padX : 0;
    const initialRot = isToFr ? 90 : -90;

    animateProps = {
      x: [startX, endX],
      y: [0, -4, 0],
      rotate: [initialRot, initialRot, initialRot],
      scale: [1, 1.1, 0.7],
      opacity: [1, 1, 0],
    };
    transitionProps = { duration: 0.35, ease: "easeInOut" };
  } else if (isHovered) {
    animateProps = {
      x: isFrench ? rightPeekX : leftPeekX,
      y: 0,
      rotate: isFrench ? -90 : 90,
      scale: 1,
      opacity: 0.95,
    };
    transitionProps = M3_SPRINGS.celestialPeek;
  } else {
    animateProps = {
      x: isFrench ? rightTuckedX : leftTuckedX,
      y: 0,
      rotate: isFrench ? -90 : 90,
      scale: 0.3,
      opacity: 0,
    };
    transitionProps = M3_SPRINGS.standard.effects.fast;
  }

  return (
    <PeekingCompanionLayer
      $size={cfg.planeSize}
      data-testid="peeking-airplane"
      initial={false}
      animate={animateProps}
      transition={transitionProps}
    >
      <MdiAirplaneGlyph size={cfg.planeSize} />
    </PeekingCompanionLayer>
  );
};

export const CountrySilhouettes: React.FC<{
  cfg: SwitchSizeConfig;
  isFrench: boolean;
  isHovered: boolean;
}> = ({ cfg, isFrench, isHovered }) => {
  return (
    <>
      <CountryMapZone $position="left" $cfg={cfg}>
        <UkMapSilhouette
          size={cfg.mapWidth}
          active={!isFrench || (isHovered && isFrench)}
        />
      </CountryMapZone>
      <CountryMapZone $position="right" $cfg={cfg}>
        <FranceMapSilhouette
          size={cfg.mapWidth}
          active={isFrench || (isHovered && !isFrench)}
        />
      </CountryMapZone>
    </>
  );
};

export const MeridianFlightTrajectory: React.FC<{ cfg: SwitchSizeConfig }> = ({
  cfg,
}) => {
  const flightStartX = cfg.padX + 2;
  const flightEndX = cfg.width - cfg.padX - 2;
  const flightMidX = cfg.width / 2;
  const flightPath = `M ${flightStartX} ${cfg.arcBaseY} Q ${flightMidX} ${cfg.arcPeakY} ${flightEndX} ${cfg.arcBaseY}`;

  return (
    <ArcOverlaySvg viewBox={`0 0 ${cfg.width} ${cfg.height}`}>
      <path
        d={flightPath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 3"
        opacity={0.4}
      />
    </ArcOverlaySvg>
  );
};
