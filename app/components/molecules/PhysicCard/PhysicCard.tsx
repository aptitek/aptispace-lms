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
import { holoGradient } from "../../../tokens/holo";

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

const HoloLayer = styled(motion.div, {
  shouldForwardProp: (prop) =>
    typeof prop === "string" && !prop.startsWith("$"),
})<{ $maskImage?: string }>(({ $maskImage }) => {
  const isDirectCss =
    $maskImage?.includes("url(") || $maskImage?.includes("-gradient");
  const maskValue = isDirectCss ? $maskImage : `url("${$maskImage}")`;

  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    mixBlendMode: "screen",
    opacity: 0.8,
    backgroundImage: holoGradient,
    backgroundSize: "200% 200%",
    backgroundPosition: "center",
    ...($maskImage && {
      maskImage: maskValue,
      WebkitMaskImage: maskValue,
      maskSize: "cover",
      WebkitMaskSize: "cover",
      maskPosition: "center",
      WebkitMaskPosition: "center",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
    }),
  };
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
  showHolo,
  holoMaskImage,
  showSheen,
  isTransparent,
  isFlipped,
  sheenX,
  sheenY,
}: {
  cardProps: CardProps;
  frontContent: React.ReactNode;
  isTiltingEnabled: boolean;
  showHolo: boolean;
  holoMaskImage?: string;
  showSheen: boolean;
  isTransparent: boolean;
  isFlipped: boolean;
  sheenX: MotionValue<string>;
  sheenY: MotionValue<string>;
}) {
  return (
    <Card
      {...cardProps}
      sx={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: isTransparent ? "visible" : "hidden",
        WebkitBackfaceVisibility: isTransparent ? "visible" : "hidden",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        transform: "translateZ(1px)",
        opacity: isTransparent && isFlipped ? 0.2 : 1,
        transition: "opacity 0.4s ease-in-out",
        ...(isTransparent && {
          bgcolor: "action.hover",
          backdropFilter: "blur(10px)",
        }),
      }}
    >
      {frontContent}
      {isTiltingEnabled && showSheen ? (
        /* eslint-disable-next-line no-restricted-syntax */
        <SheenLayer style={{ left: sheenX, top: sheenY }} />
      ) : null}
      {showHolo ? (
        <HoloLayer
          $maskImage={holoMaskImage}
          style={
            {
              "--mouse-x": sheenX,
              "--mouse-y": sheenY,
            } as unknown as React.CSSProperties
          }
        />
      ) : null}
    </Card>
  );
}

function PhysicCardBack({
  cardProps,
  backContent,
  isTiltingEnabled,
  showHoloBack,
  holoMaskImageBack,
  showSheen,
  isTransparent,
  isFlipped,
  sheenX,
  sheenY,
}: {
  cardProps: CardProps;
  backContent?: React.ReactNode;
  isTiltingEnabled: boolean;
  showHoloBack: boolean;
  holoMaskImageBack?: string;
  showSheen: boolean;
  isTransparent: boolean;
  isFlipped: boolean;
  sheenX: MotionValue<string>;
  sheenY: MotionValue<string>;
}) {
  if (!backContent) return null;
  return (
    <Card
      {...cardProps}
      sx={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: isTransparent ? "visible" : "hidden",
        WebkitBackfaceVisibility: isTransparent ? "visible" : "hidden",
        transform: "rotateY(180deg) translateZ(1px)",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        opacity: isTransparent && !isFlipped ? 0.2 : 1,
        transition: "opacity 0.4s ease-in-out",
        ...(isTransparent && {
          bgcolor: "action.hover",
          backdropFilter: "blur(10px)",
        }),
      }}
    >
      {backContent}
      {isTiltingEnabled && showSheen ? (
        /* eslint-disable-next-line no-restricted-syntax */
        <SheenLayer style={{ left: sheenX, top: sheenY }} />
      ) : null}
      {showHoloBack ? (
        <HoloLayer
          $maskImage={holoMaskImageBack}
          style={
            {
              "--mouse-x": sheenX,
              "--mouse-y": sheenY,
            } as unknown as React.CSSProperties
          }
        />
      ) : null}
    </Card>
  );
}

function useCardFlip({
  interactive,
  backContent,
  controlledIsFlipped,
  defaultFlipped,
  onFlip,
}: {
  interactive: boolean;
  backContent: React.ReactNode;
  controlledIsFlipped: boolean | undefined;
  defaultFlipped: boolean;
  onFlip?: (isFlipped: boolean) => void;
}) {
  const [uncontrolledIsFlipped, setUncontrolledIsFlipped] =
    useState(defaultFlipped);

  const isControlled = controlledIsFlipped !== undefined;
  const isFlipped = isControlled ? controlledIsFlipped : uncontrolledIsFlipped;
  const canFlip = Boolean(interactive && backContent);

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

  return { isFlipped, canFlip, handleClick };
}

// eslint-disable-next-line complexity
export default function PhysicCard({
  frontContent,
  backContent,
  isFlipped: controlledIsFlipped,
  defaultFlipped = false,
  onFlip,
  ratio,
  tiltStrength = 1,
  interactive = true,
  showHolo = false,
  holoMaskImage,
  showHoloBack = false,
  holoMaskImageBack,
  showSheen = true,
  isTransparent = false,
  sx,
  ...cardProps
}: PhysicCardProps) {
  const isTiltingEnabled = Boolean(interactive && tiltStrength > 0);

  const { isFlipped, canFlip, handleClick } = useCardFlip({
    interactive,
    backContent,
    controlledIsFlipped,
    defaultFlipped,
    onFlip,
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const {
    rotateX,
    rotateY,
    sheenX,
    sheenY,
    handleMouseMove,
    handleMouseLeave,
  } = useCardMotion(isTiltingEnabled, tiltStrength, cardRef);

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
      <TiltContainer
        style={
          {
            rotateX,
            rotateY,
            "--mouse-x": sheenX,
            "--mouse-y": sheenY,
          } as unknown as React.CSSProperties
        }
      >
        <FlipContainer
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={flipTransition}
        >
          <PhysicCardFront
            cardProps={cardProps}
            frontContent={frontContent}
            isTiltingEnabled={isTiltingEnabled}
            showHolo={showHolo}
            holoMaskImage={holoMaskImage}
            showSheen={showSheen}
            isTransparent={isTransparent}
            isFlipped={isFlipped}
            sheenX={sheenX}
            sheenY={sheenY}
          />
          <PhysicCardBack
            cardProps={cardProps}
            backContent={backContent}
            isTiltingEnabled={isTiltingEnabled}
            showHoloBack={showHoloBack}
            holoMaskImageBack={holoMaskImageBack}
            showSheen={showSheen}
            isTransparent={isTransparent}
            isFlipped={isFlipped}
            sheenX={sheenX}
            sheenY={sheenY}
          />
        </FlipContainer>
      </TiltContainer>
    </Box>
  );
}
