import { useState, useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Card, { type CardProps } from "@mui/material/Card";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import type { PhysicCardProps } from "./PhysicCard.types";

const TiltContainer = styled(motion.div)({
  width: "100%",
  height: "100%",
  position: "relative",
  transformStyle: "preserve-3d",
});

const FlipContainer = styled(motion.div)({
  width: "100%",
  height: "100%",
  position: "relative",
  transformStyle: "preserve-3d",
});

const SheenLayer = styled(motion.div)({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)",
  transform: "translate(-50%, -50%)",
  width: "200%",
  height: "200%",
  mixBlendMode: "overlay",
});

function useCardMotion(
  isTiltingEnabled: boolean,
  tiltStrength: number,
  cardRef: React.RefObject<HTMLDivElement | null>,
) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(
    springY,
    [-0.5, 0.5],
    [`${15 * tiltStrength}deg`, `-${15 * tiltStrength}deg`],
  );
  const rotateY = useTransform(
    springX,
    [-0.5, 0.5],
    [`-${15 * tiltStrength}deg`, `${15 * tiltStrength}deg`],
  );

  const sheenX = useTransform(springX, [-0.5, 0.5], ["100%", "0%"]);
  const sheenY = useTransform(springY, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isTiltingEnabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    if (!isTiltingEnabled) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return {
    rotateX,
    rotateY,
    sheenX,
    sheenY,
    handleMouseMove,
    handleMouseLeave,
  };
}

function PhysicCardFront({
  cardProps,
  frontContent,
  isTiltingEnabled,
  sheenX,
  sheenY,
}: {
  cardProps: CardProps;
  frontContent: React.ReactNode;
  isTiltingEnabled: boolean;
  sheenX: MotionValue<string>;
  sheenY: MotionValue<string>;
}) {
  return (
    <Card
      {...cardProps}
      sx={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        overflow: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      {frontContent}
      {isTiltingEnabled ? (
        /* eslint-disable-next-line no-restricted-syntax */
        <SheenLayer style={{ left: sheenX, top: sheenY }} />
      ) : null}
    </Card>
  );
}

function PhysicCardBack({
  cardProps,
  backContent,
}: {
  cardProps: CardProps;
  backContent?: React.ReactNode;
}) {
  if (!backContent) return null;
  return (
    <Card
      {...cardProps}
      sx={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        overflow: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      {backContent}
    </Card>
  );
}

export default function PhysicCard({
  frontContent,
  backContent,
  isFlipped: controlledIsFlipped,
  defaultFlipped = false,
  onFlip,
  ratio,
  tiltStrength = 1,
  interactive = true,
  sx,
  ...cardProps
}: PhysicCardProps) {
  const [uncontrolledIsFlipped, setUncontrolledIsFlipped] =
    useState(defaultFlipped);

  const isControlled = controlledIsFlipped !== undefined;
  const isFlipped = isControlled ? controlledIsFlipped : uncontrolledIsFlipped;
  const isTiltingEnabled = Boolean(interactive && tiltStrength > 0);
  const canFlip = Boolean(interactive && backContent);

  const cardRef = useRef<HTMLDivElement>(null);
  const {
    rotateX,
    rotateY,
    sheenX,
    sheenY,
    handleMouseMove,
    handleMouseLeave,
  } = useCardMotion(isTiltingEnabled, tiltStrength, cardRef);

  const handleClick = () => {
    if (canFlip) {
      const newState = !isFlipped;
      if (!isControlled) {
        setUncontrolledIsFlipped(newState);
      }
      if (onFlip) {
        onFlip(newState);
      }
    }
  };

  const flipTransition = {
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
    mass: 1,
  };

  return (
    <Box
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      sx={{
        perspective: "1000px",
        width: "100%",
        height: "100%",
        aspectRatio: ratio,
        cursor: canFlip ? "pointer" : "default",
        ...sx,
      }}
    >
      {/* eslint-disable-next-line no-restricted-syntax */}
      <TiltContainer style={{ rotateX, rotateY }}>
        <FlipContainer
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={flipTransition}
        >
          <PhysicCardFront
            cardProps={cardProps}
            frontContent={frontContent}
            isTiltingEnabled={isTiltingEnabled}
            sheenX={sheenX}
            sheenY={sheenY}
          />
          <PhysicCardBack cardProps={cardProps} backContent={backContent} />
        </FlipContainer>
      </TiltContainer>
    </Box>
  );
}
