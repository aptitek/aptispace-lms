import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  motion,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LaptopRoundedIcon from "@mui/icons-material/LaptopRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import {
  M3_SPRINGS,
  M3_MOTION_DURATIONS,
  M3_MOTION_EASINGS,
} from "~/tokens/motion";
import type { SwitchSizeConfig } from "~/components/atoms/Switch";
import { PeekingPedestrianLayer } from "./AttendanceSwitch.styles";

const GlyphMotionCenter = styled(motion.div)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const PedestrianMirrorBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "$isMirrored",
})<{ $isMirrored: boolean }>(({ $isMirrored }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: $isMirrored ? "scaleX(-1)" : "scaleX(1)",
  transformOrigin: "center center",
  transition: `transform ${M3_MOTION_DURATIONS.short4}ms ${M3_MOTION_EASINGS.css.standard}`,
}));

export const TrackHoloZone = styled("div", {
  shouldForwardProp: (prop) => prop !== "$position" && prop !== "$cfg",
})<{
  $position: "left" | "right";
  $cfg: SwitchSizeConfig;
}>(({ $position, $cfg }) => ({
  position: "absolute",
  top: "50%",
  [$position === "left" ? "left" : "right"]: $cfg.padX,
  transform: "translateY(-50%)",
  width: $cfg.thumbSize,
  height: $cfg.thumbSize,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  pointerEvents: "none",
}));

const HoloGlyphWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "$active" && prop !== "$activeColor",
})<{
  $active: boolean;
  $activeColor: string;
}>(({ theme, $active, $activeColor }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: $active ? $activeColor : theme.palette.text.secondary,
  opacity: $active ? 0.38 : 0.12,
  transition: `all ${M3_MOTION_DURATIONS.medium2}ms ${M3_MOTION_EASINGS.css.standard}`,
  filter: $active ? `drop-shadow(0 0 2px ${$activeColor})` : "none",
}));

/**
 * MD3 Map Pin with drop-in animation from above (In-Person)
 */
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

/**
 * MD3 Workstation / Laptop glyph (Remote)
 */
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

/**
 * MD3 Walking pedestrian glyph
 */
export const WalkingPedestrianGlyph: React.FC<{ size: number }> = ({
  size,
}) => <DirectionsWalkRoundedIcon sx={{ fontSize: size }} aria-hidden="true" />;

/**
 * Holographic MDI internet/network & home outline rendered in track background
 */
export const HoloNetworkSilhouette: React.FC<{
  cfg: SwitchSizeConfig;
  isInPerson: boolean;
}> = ({ cfg, isInPerson }) => {
  const theme = useTheme();
  const iconSize = Math.round(cfg.thumbIconSize * 1.05);

  return (
    <>
      {/* Left zone: Remote Home Holo Outline */}
      <TrackHoloZone $position="left" $cfg={cfg}>
        <HoloGlyphWrapper
          $active={!isInPerson}
          $activeColor={theme.palette.info.main}
        >
          <HomeRoundedIcon sx={{ fontSize: iconSize }} aria-hidden="true" />
        </HoloGlyphWrapper>
      </TrackHoloZone>

      {/* Right zone: In-Person / Internet Network Holo Outline */}
      <TrackHoloZone $position="right" $cfg={cfg}>
        <HoloGlyphWrapper
          $active={isInPerson}
          $activeColor={theme.palette.success.main}
        >
          <LanguageRoundedIcon sx={{ fontSize: iconSize }} aria-hidden="true" />
        </HoloGlyphWrapper>
      </TrackHoloZone>
    </>
  );
};

/**
 * Peeking Pedestrian Companion
 * Peeks from under the switch circle exactly like the airplane in LanguageSwitch.
 * When switching, animates walking across from under the circle to the other side!
 */
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

  // Horizontally mirror the pedestrian when walking away from in-person (towards remote / left)
  // or when resting/peeking while currently in-person (ready to walk away)
  const isMirrored = isWalking ? walkDirection === "backward" : isInPerson;

  return (
    <PeekingPedestrianLayer
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
    </PeekingPedestrianLayer>
  );
}
