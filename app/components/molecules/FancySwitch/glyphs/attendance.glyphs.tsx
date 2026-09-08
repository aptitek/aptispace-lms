import React from "react";
import { useTheme } from "@mui/material/styles";
import type { TargetAndTransition, Transition } from "framer-motion";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LaptopRoundedIcon from "@mui/icons-material/LaptopRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { M3_SPRINGS } from "~/tokens/motion";
import type { SwitchSizeConfig } from "~/components/atoms/Switch";
import {
  GlyphMotionCenter,
  PedestrianMirrorBox,
  PeekingCompanionLayer,
  TrackHoloZone,
  HoloGlyphWrapper,
} from "../FancySwitch.styles";

export const MapPinDrop: React.FC<{ size: number }> = ({ size }) => {
  return (
    <GlyphMotionCenter
      key="in-person-pin"
      data-testid="map-pin-glyph"
      initial={{ y: -16, opacity: 0, scale: 0.6 }}
      animate={{ y: 0, opacity: 1, scale: [0.6, 1.15, 1] }}
      exit={{ y: -16, opacity: 0, scale: 0.6 }}
      transition={M3_SPRINGS.expressive.spatial.fast}
    >
      <PlaceRoundedIcon
        sx={{
          fontSize: size,
          color: "common.white",
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
        }}
        aria-hidden="true"
      />
    </GlyphMotionCenter>
  );
};

export const RemoteHomeGlyph: React.FC<{ size: number }> = ({ size }) => {
  return (
    <GlyphMotionCenter
      key="remote-laptop"
      data-testid="remote-laptop-glyph"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={M3_SPRINGS.expressive.effects.fast}
    >
      <LaptopRoundedIcon
        sx={{
          fontSize: size,
          color: "common.white",
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
        }}
        aria-hidden="true"
      />
    </GlyphMotionCenter>
  );
};

export const WalkingPedestrianGlyph: React.FC<{ size: number }> = ({
  size,
}) => <DirectionsWalkRoundedIcon sx={{ fontSize: size }} aria-hidden="true" />;

export const HoloNetworkSilhouette: React.FC<{
  cfg: SwitchSizeConfig;
  isInPerson: boolean;
  isHovered?: boolean;
}> = ({ cfg, isInPerson, isHovered = false }) => {
  const theme = useTheme();
  const iconSize = Math.round(cfg.thumbIconSize * 1.05);

  return (
    <>
      <TrackHoloZone $position="left" $cfg={cfg}>
        <HoloGlyphWrapper
          $active={!isInPerson}
          $activeColor={theme.palette.info.main}
          $isHovered={isHovered}
        >
          <HomeRoundedIcon
            data-testid="holo-house-icon"
            sx={{ fontSize: iconSize }}
            aria-hidden="true"
          />
        </HoloGlyphWrapper>
      </TrackHoloZone>

      <TrackHoloZone $position="right" $cfg={cfg}>
        <HoloGlyphWrapper
          $active={isInPerson}
          $activeColor={theme.palette.success.main}
          $isHovered={isHovered}
        >
          <SchoolRoundedIcon
            data-testid="holo-school-icon"
            sx={{ fontSize: iconSize }}
            aria-hidden="true"
          />
        </HoloGlyphWrapper>
      </TrackHoloZone>
    </>
  );
};

export function PeekingPedestrianCompanion({
  cfg,
  isInPerson,
  isHovered,
  isWalking,
  walkDirection,
}: {
  cfg: SwitchSizeConfig;
  isInPerson: boolean;
  isHovered: boolean;
  isWalking: boolean;
  walkDirection: "forward" | "backward";
}) {
  const pedSize = cfg.thumbIconSize + 3;
  const leftCenterX = cfg.padX - 2 + cfg.thumbSize / 2;
  const rightCenterX = cfg.padX - 2 + cfg.travelX + cfg.thumbSize / 2;
  const halfPed = pedSize / 2;
  const peekOffset = cfg.thumbSize * 0.72;

  const leftTuckedX = leftCenterX - halfPed;
  const leftPeekX = leftTuckedX + peekOffset;
  const rightTuckedX = rightCenterX - halfPed;
  const rightPeekX = rightTuckedX - peekOffset;

  let animateProps: TargetAndTransition;
  let transitionProps: Transition;

  if (isWalking) {
    const isToInPerson = walkDirection === "forward";
    const startX = isToInPerson ? leftPeekX : rightPeekX;
    const endX = isToInPerson ? cfg.width - cfg.padX - 2 : cfg.padX + 2;

    animateProps = {
      x: [startX, endX],
      y: [0, -3, 0, -3, 0],
      scale: [1, 1, 0.6],
      opacity: [1, 1, 0],
    };
    transitionProps = { duration: 0.38, ease: "easeInOut" };
  } else if (isHovered) {
    animateProps = {
      x: isInPerson ? rightPeekX : leftPeekX,
      y: 0,
      scale: 1,
      opacity: 0.95,
    };
    transitionProps = M3_SPRINGS.celestialPeek;
  } else {
    animateProps = {
      x: isInPerson ? rightTuckedX : leftTuckedX,
      y: 0,
      scale: 0.3,
      opacity: 0,
    };
    transitionProps = M3_SPRINGS.standard.effects.fast;
  }

  const isMirrored = isWalking ? walkDirection === "backward" : isInPerson;

  return (
    <PeekingCompanionLayer
      $size={pedSize}
      data-testid="peeking-pedestrian"
      initial={false}
      animate={animateProps}
      transition={transitionProps}
    >
      <PedestrianMirrorBox
        $isMirrored={isMirrored}
        data-testid="pedestrian-mirror-wrapper"
      >
        <WalkingPedestrianGlyph size={pedSize} />
      </PedestrianMirrorBox>
    </PeekingCompanionLayer>
  );
}
