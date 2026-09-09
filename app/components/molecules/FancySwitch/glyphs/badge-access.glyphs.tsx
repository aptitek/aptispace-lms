import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  AnimatePresence,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import LockOutlineRoundedIcon from "@mui/icons-material/LockOutlineRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import DoorFrontRoundedIcon from "@mui/icons-material/DoorFrontRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import ContactlessRoundedIcon from "@mui/icons-material/ContactlessRounded";
import {
  M3_SPRINGS,
  M3_MOTION_DURATIONS,
  M3_MOTION_EASINGS,
} from "~/tokens/motion";
import type { SwitchSizeConfig } from "~/components/atoms/Switch";
import {
  GlyphMotionCenter,
  TrackHoloZone,
  HoloGlyphWrapper,
  PeekingCompanionLayer,
  DoorPortalPerspectiveBox,
  DoorSwingPanel,
  AccessBadgePuck,
  CenteredMotionBox,
  BadgeScanRippleAnchor,
} from "../FancySwitch.styles";

export const LockSecureGlyph: React.FC<{
  isUnlocked: boolean;
  size: number;
}> = ({ isUnlocked, size }) => {
  const theme = useTheme();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isUnlocked ? (
        <GlyphMotionCenter
          key="lock-open"
          data-testid="lock-open-glyph"
          initial={{ opacity: 0, scale: 0.5, y: 3 }}
          animate={{ opacity: 1, scale: [0.5, 1.2, 1], y: -0.5 }}
          exit={{ opacity: 0, scale: 0.5, y: -3 }}
          transition={M3_SPRINGS.expressive.spatial.fast}
        >
          <CenteredMotionBox
            initial={{ rotate: -10, y: -1 }}
            animate={{ rotate: [-10, 4, 0], y: 0 }}
            transition={M3_SPRINGS.expressive.spatial.fast}
          >
            <LockOpenRoundedIcon
              sx={{
                fontSize: size,
                color: theme.palette.common.white,
                display: "block",
                filter:
                  "drop-shadow(0 0 4px rgba(255, 255, 255, 0.8)) drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
              }}
              aria-hidden="true"
            />
          </CenteredMotionBox>
        </GlyphMotionCenter>
      ) : (
        <GlyphMotionCenter
          key="lock-closed"
          data-testid="lock-closed-glyph"
          initial={{ opacity: 0, scale: 0.5, y: -3 }}
          animate={{ opacity: 1, scale: [0.5, 1.15, 1], y: -0.5 }}
          exit={{ opacity: 0, scale: 0.5, y: 3 }}
          transition={M3_SPRINGS.expressive.spatial.fast}
        >
          <CenteredMotionBox
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: M3_MOTION_DURATIONS.s.short4 }}
          >
            <LockOutlineRoundedIcon
              sx={{
                fontSize: size,
                color: theme.palette.common.white,
                display: "block",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
              }}
              aria-hidden="true"
            />
          </CenteredMotionBox>
        </GlyphMotionCenter>
      )}
    </AnimatePresence>
  );
};

export const AnimatedDoorPortal: React.FC<{
  isOpen: boolean;
  size: number;
  isHovered?: boolean;
}> = ({ isOpen, size, isHovered = false }) => {
  const theme = useTheme();

  return (
    <DoorPortalPerspectiveBox data-testid="animated-door-portal">
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <DoorSwingPanel
            key="door-open"
            data-testid="door-open-view"
            initial={{ rotateY: 70, opacity: 0.3 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 70, opacity: 0.3 }}
            transition={M3_SPRINGS.expressive.spatial.default}
          >
            <MeetingRoomRoundedIcon
              data-testid="meeting-room-open-icon"
              sx={{
                fontSize: size,
                color: theme.palette.success.main,
                filter: `drop-shadow(0 0 6px ${theme.palette.success.main})`,
                transition: "filter 0.25s ease",
              }}
              aria-hidden="true"
            />
          </DoorSwingPanel>
        ) : (
          <DoorSwingPanel
            key="door-closed"
            data-testid="door-closed-view"
            initial={{ rotateY: -70, opacity: 0.3 }}
            animate={{
              rotateY: isHovered ? -15 : 0,
              opacity: 1,
            }}
            exit={{ rotateY: -70, opacity: 0.3 }}
            transition={M3_SPRINGS.expressive.spatial.default}
          >
            <DoorFrontRoundedIcon
              data-testid="door-front-closed-icon"
              sx={{
                fontSize: size,
                color: isHovered
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
                opacity: isHovered ? 0.9 : 0.45,
                filter: isHovered
                  ? "drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))"
                  : "none",
                transition: "all 0.25s ease",
              }}
              aria-hidden="true"
            />
          </DoorSwingPanel>
        )}
      </AnimatePresence>
    </DoorPortalPerspectiveBox>
  );
};

interface BadgeCoords {
  leftTuckedX: number;
  leftPeekX: number;
  rightTuckedX: number;
  rightPeekX: number;
  badgeSize: number;
  cfg: SwitchSizeConfig;
}

interface BadgeMotionOptions {
  isScanning: boolean;
  isHovered: boolean;
  isUnlocked: boolean;
  scanDirection: "forward" | "backward";
  coords: BadgeCoords;
}

function computeBadgeCompanionMotion(options: BadgeMotionOptions): {
  animate: TargetAndTransition;
  transition: Transition;
} {
  const { isScanning, isHovered, isUnlocked, scanDirection, coords } = options;

  if (isScanning) {
    const isToUnlocked = scanDirection === "forward";
    const startX = isToUnlocked ? coords.leftPeekX : coords.rightPeekX;
    const endX = isToUnlocked
      ? coords.cfg.width - coords.cfg.padX - coords.badgeSize
      : coords.cfg.padX;

    return {
      animate: {
        x: [startX, (startX + endX) / 2, endX],
        y: [0, -4, 0],
        rotate: isToUnlocked ? [0, 14, 0] : [0, -14, 0],
        scale: [1, 1.25, 0.7],
        opacity: [1, 1, 0],
      },
      transition: {
        duration: M3_MOTION_DURATIONS.s.medium4,
        ease: M3_MOTION_EASINGS.tuples.standard,
      },
    };
  }

  if (isHovered) {
    return {
      animate: {
        x: isUnlocked ? coords.rightPeekX : coords.leftPeekX,
        y: 0,
        rotate: isUnlocked ? -10 : 10,
        scale: 1.05,
        opacity: 1,
      },
      transition: M3_SPRINGS.celestialPeek,
    };
  }

  return {
    animate: {
      x: isUnlocked ? coords.rightTuckedX : coords.leftTuckedX,
      y: 0,
      rotate: 0,
      scale: 0.3,
      opacity: 0,
    },
    transition: M3_SPRINGS.standard.effects.fast,
  };
}

export const PeekingBadgeCompanion: React.FC<{
  cfg: SwitchSizeConfig;
  isUnlocked: boolean;
  isHovered: boolean;
  isScanning: boolean;
  scanDirection: "forward" | "backward";
}> = ({ cfg, isUnlocked, isHovered, isScanning, scanDirection }) => {
  const theme = useTheme();
  const badgeSize = cfg.thumbIconSize + 2;
  const leftCenterX = cfg.padX - 2 + cfg.thumbSize / 2;
  const rightCenterX = cfg.padX - 2 + cfg.travelX + cfg.thumbSize / 2;
  const halfBadge = badgeSize / 2;
  const peekOffset = cfg.thumbSize * 0.6;

  const motionState = computeBadgeCompanionMotion({
    isScanning,
    isHovered,
    isUnlocked,
    scanDirection,
    coords: {
      leftTuckedX: leftCenterX - halfBadge,
      leftPeekX: leftCenterX - halfBadge + peekOffset,
      rightTuckedX: rightCenterX - halfBadge,
      rightPeekX: rightCenterX - halfBadge - peekOffset,
      badgeSize,
      cfg,
    },
  });

  return (
    <PeekingCompanionLayer
      $size={badgeSize}
      data-testid="peeking-badge"
      initial={false}
      animate={motionState.animate}
      transition={motionState.transition}
    >
      <AccessBadgePuck>
        <BadgeRoundedIcon
          data-testid="peeking-badge-icon"
          sx={{
            fontSize: badgeSize,
            color: isUnlocked
              ? theme.palette.common.white
              : theme.palette.warning.light,
            filter: isUnlocked
              ? "drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))"
              : "drop-shadow(0 0 5px rgba(251, 191, 36, 0.75)) drop-shadow(0 1px 3px rgba(0,0,0,0.4))",
          }}
          aria-hidden="true"
        />
      </AccessBadgePuck>
    </PeekingCompanionLayer>
  );
};

export const HoloAccessScanner: React.FC<{
  cfg: SwitchSizeConfig;
  isUnlocked: boolean;
  isHovered?: boolean;
}> = ({ cfg, isUnlocked, isHovered = false }) => {
  const theme = useTheme();
  const iconSize = Math.round(cfg.thumbIconSize * 1.05);

  return (
    <>
      <TrackHoloZone $position="left" $cfg={cfg}>
        <HoloGlyphWrapper
          $active={!isUnlocked}
          $activeColor={theme.palette.warning.main}
          $isHovered={isHovered}
        >
          <ContactlessRoundedIcon
            data-testid="holo-nfc-icon"
            sx={{ fontSize: iconSize }}
            aria-hidden="true"
          />
        </HoloGlyphWrapper>
      </TrackHoloZone>

      <TrackHoloZone $position="right" $cfg={cfg}>
        <AnimatedDoorPortal
          isOpen={isUnlocked}
          size={iconSize}
          isHovered={isHovered}
        />
      </TrackHoloZone>
    </>
  );
};

export const BadgeScanRippleEffect: React.FC<{
  cfg: SwitchSizeConfig;
  isUnlocked: boolean;
}> = ({ cfg, isUnlocked }) => {
  const theme = useTheme();
  const rippleColor = isUnlocked
    ? theme.palette.success.main
    : theme.palette.warning.main;

  const targetX = isUnlocked
    ? cfg.width - cfg.thumbSize / 2 - cfg.padX
    : cfg.thumbSize / 2 + cfg.padX;

  return (
    <BadgeScanRippleAnchor
      key="badge-scan-ripple"
      data-testid="badge-scan-ripple"
      $x={targetX}
      initial={{ opacity: 0.8, scale: 0.4 }}
      animate={{ opacity: 0, scale: 2.2 }}
      transition={{ duration: M3_MOTION_DURATIONS.s.long1, ease: "easeOut" }}
    >
      <SensorsRoundedIcon
        sx={{
          fontSize: cfg.thumbSize,
          color: rippleColor,
          opacity: 0.75,
        }}
        aria-hidden="true"
      />
    </BadgeScanRippleAnchor>
  );
};
