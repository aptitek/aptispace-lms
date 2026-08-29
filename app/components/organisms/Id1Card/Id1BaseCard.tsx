import React, { forwardRef, useState, useEffect, useMemo } from "react";
import { Card, type CardShadow } from "deckfx";
import type { Transition } from "framer-motion";
import Electronics from "../../atoms/Electronics/Electronics";
import Guilloche from "../../atoms/Guilloche/Guilloche";
import { generateGuillocheMaskDataUrl } from "../../atoms/Guilloche/guillocheMath";
import type {
  ElectronicsFinish,
  ElectronicsChipPosition,
} from "../../atoms/Electronics/Electronics.types";
import type {
  GuillocheVariant,
  GuillocheDensity,
} from "../../atoms/Guilloche/Guilloche.types";
import type {
  Id1BaseCardProps,
  Id1CardSide,
  Id1CardOrientation,
  Id1CardSize,
  Id1CardFlipDirection,
} from "./Id1BaseCard.types";
import {
  CardFaceContainer,
  ContentOverlay,
  TransparentGhostOverlay,
  FlipPerspectiveStage,
  MotionFlipFlipper,
  CardFaceWrapper,
  getDimensions,
} from "./Id1Card.styles";

function getGuillocheSeed(
  customSeed: string | undefined,
  isBack: boolean,
): string {
  if (customSeed) return customSeed;
  return isBack ? "APTI-ID1-BACK" : "APTI-ID1-FRONT";
}

function getHoloVariant(
  variant: string | undefined,
): "default" | "rainbow" | "cosmic" | "gold" {
  if (variant === "solarized-gold") return "gold";
  if (
    variant === "cyber-cyan" ||
    variant === "cosmic-crimson" ||
    variant === "deep-space"
  ) {
    return "cosmic";
  }
  return "rainbow";
}

function resolveChipView(
  propsChipView: "front" | "back" | "none" | undefined,
  isBack: boolean,
  isTransparent: boolean,
): "front" | "back" | "none" {
  if (propsChipView) return propsChipView;
  if (isBack) {
    return isTransparent ? "back" : "none";
  }
  return "front";
}

interface CardContentOverlayProps {
  children?: React.ReactNode;
  transparent?: boolean;
}

function CardContentOverlay({
  children,
  transparent,
}: CardContentOverlayProps) {
  return (
    <ContentOverlay isTransparent={transparent}>{children}</ContentOverlay>
  );
}

interface ReverseGhostLayerProps {
  isTransparent?: boolean;
  faceSide: Id1CardSide;
  isVertical: boolean;
  opacity: number;
  renderGhostContent?: (side: Id1CardSide) => React.ReactNode;
}

function ReverseGhostLayer({
  isTransparent,
  faceSide,
  isVertical,
  opacity,
  renderGhostContent,
}: ReverseGhostLayerProps) {
  if (!isTransparent || !renderGhostContent) return null;

  const reverseSide = faceSide === "front" ? "back" : "front";

  return (
    <TransparentGhostOverlay
      isMirrored={true}
      isVertical={isVertical}
      opacity={opacity}
    >
      {renderGhostContent(reverseSide)}
    </TransparentGhostOverlay>
  );
}

const DEFAULT_CARD_PROPS = {
  side: "front" as Id1CardSide,
  enableFlip: true,
  flipOnClick: false,
  flipDirection: "horizontal" as Id1CardFlipDirection,
  orientation: "landscape" as Id1CardOrientation,
  size: "responsive" as Id1CardSize,
  transparent: false,
  transparentGhostOpacity: 0.22,
  showGlare: true,
  glareOpacity: 0.45,
  maxTilt: 16,
  scaleOnHover: 1.04,
  shadow: "xl" as CardShadow,
  holographic: true,
  holoStrength: 0.75,
  showElectronics: true,
  electronicsFinish: "gold" as ElectronicsFinish,
  chipPosition: "left" as ElectronicsChipPosition,
  electronicsRotation: 0,
  showChip: true,
  showGuilloche: true,
  guillocheVariant: "holo-spectrum" as GuillocheVariant,
  guillocheDensity: "medium" as GuillocheDensity,
  guillocheOpacity: 0.42,
  guillocheNoiseIntensity: 0.5,
  testId: "id1-base-card",
};

interface ElectronicsLayerProps {
  conf: typeof DEFAULT_CARD_PROPS;
  props: Id1BaseCardProps;
  faceSide: Id1CardSide;
  isBack: boolean;
  isTransparent: boolean;
}

function ElectronicsLayer({
  conf,
  props,
  faceSide,
  isBack,
  isTransparent,
}: ElectronicsLayerProps) {
  if (!conf.showElectronics) return null;

  const showNfcAntenna = props.showNfcAntenna ?? isTransparent;
  const showInnerCoil = props.showInnerCoil ?? isTransparent;
  const chipView = resolveChipView(props.chipView, isBack, isTransparent);
  const electronicsOpacity = props.electronicsOpacity ?? (isBack ? 0.65 : 0.85);
  const electronicsMirrored = props.electronicsMirrored ?? isBack;

  return (
    <Electronics
      side={faceSide}
      finish={conf.electronicsFinish}
      chipPosition={conf.chipPosition}
      rotation={conf.electronicsRotation}
      showNfcAntenna={showNfcAntenna}
      showChip={conf.showChip}
      chipView={chipView}
      showInnerCoil={showInnerCoil}
      opacity={electronicsOpacity}
      mirrored={electronicsMirrored}
    />
  );
}

interface GuillocheLayerProps {
  conf: typeof DEFAULT_CARD_PROPS;
  seed: string;
}

function GuillocheLayer({ conf, seed }: GuillocheLayerProps) {
  if (!conf.showGuilloche) return null;

  return (
    <Guilloche
      seed={seed}
      variant={conf.guillocheVariant}
      density={conf.guillocheDensity}
      opacity={conf.guillocheOpacity}
      noiseIntensity={conf.guillocheNoiseIntensity}
      holographic={false}
    />
  );
}

interface Id1BaseCardFaceProps {
  conf: typeof DEFAULT_CARD_PROPS;
  props: Id1BaseCardProps;
  faceSide: Id1CardSide;
  dims: { width: number | string; height: number | string };
}

function Id1BaseCardFace({
  conf,
  props,
  faceSide,
  dims,
}: Id1BaseCardFaceProps) {
  const isBack = faceSide === "back";

  const seed = getGuillocheSeed(props.guillocheSeed, isBack);
  const effectiveMaskUrl = useMemo(() => {
    if (props.maskUrl) return props.maskUrl;
    if (conf.showGuilloche) {
      return generateGuillocheMaskDataUrl({
        seed,
        density: conf.guillocheDensity,
        noiseIntensity: conf.guillocheNoiseIntensity,
      });
    }
    return undefined;
  }, [
    props.maskUrl,
    conf.showGuilloche,
    seed,
    conf.guillocheDensity,
    conf.guillocheNoiseIntensity,
  ]);

  const holoConfig = useMemo(() => {
    if (!conf.holographic) return false;
    return {
      maskUrl: effectiveMaskUrl,
      maskSize: props.maskSize || "100% 100%",
      maskPosition: props.maskPosition || "center",
      maskRepeat: props.maskRepeat || "no-repeat",
      variant: getHoloVariant(conf.guillocheVariant),
      holoStrength: conf.holoStrength,
    };
  }, [
    conf.holographic,
    effectiveMaskUrl,
    props.maskSize,
    props.maskPosition,
    props.maskRepeat,
    conf.guillocheVariant,
    conf.holoStrength,
  ]);

  const faceContent =
    faceSide === "front" ? props.frontContent : props.backContent;
  const content = faceContent ?? props.children;

  return (
    <Card
      width={dims.width}
      height={dims.height}
      showGlare={conf.showGlare}
      glareOpacity={conf.glareOpacity}
      maxTilt={conf.maxTilt}
      scaleOnHover={conf.scaleOnHover}
      shadow={conf.shadow}
      holographic={holoConfig}
      holoStrength={conf.holoStrength}
      className={props.className}
      containerClassName={props.containerClassName}
      data-testid={conf.testId}
    >
      <CardFaceContainer isBack={isBack} isTransparent={conf.transparent}>
        <ElectronicsLayer
          conf={conf}
          props={props}
          faceSide={faceSide}
          isBack={isBack}
          isTransparent={conf.transparent}
        />

        <ReverseGhostLayer
          isTransparent={conf.transparent}
          faceSide={faceSide}
          isVertical={conf.flipDirection === "vertical"}
          opacity={
            props.transparentGhostOpacity ?? conf.transparentGhostOpacity
          }
          renderGhostContent={props.renderGhostContent}
        />

        <GuillocheLayer conf={conf} seed={seed} />

        <CardContentOverlay transparent={conf.transparent}>
          {content}
        </CardContentOverlay>
      </CardFaceContainer>
    </Card>
  );
}

function getFlipAnimationTarget(
  isFlipped: boolean,
  flipDirection: "horizontal" | "vertical",
) {
  if (flipDirection === "vertical") {
    return { rotateX: isFlipped ? 180 : 0 };
  }
  return { rotateY: isFlipped ? 180 : 0 };
}

function getFlipTransitionConfig(flipDuration?: number): Transition {
  if (flipDuration) {
    return {
      duration: flipDuration,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    };
  }
  return { type: "spring", stiffness: 220, damping: 24, mass: 0.8 };
}

/**
 * Id1BaseCard - Base physical ID-1 card component
 *
 * Handles the physical card substrate with security features:
 * - ISO/IEC 7810 ID-1 dimensions (85.6mm × 53.98mm)
 * - Holographic effects and glare
 * - Embedded electronics (NFC antenna, chip)
 * - Guilloche security patterns
 * - 3D flip animation
 * - Transparent card variants with ghost layers
 *
 * This is the base layer; content is provided via frontContent/backContent props.
 */
export const Id1BaseCard = forwardRef<HTMLDivElement, Id1BaseCardProps>(
  (props, ref) => {
    const conf = { ...DEFAULT_CARD_PROPS, ...props };
    const [internalFlipped, setInternalFlipped] = useState(
      props.isFlipped ??
        (props.side !== undefined
          ? props.side === "back"
          : conf.side === "back"),
    );

    const controlledSide = props.side;
    const controlledIsFlipped = props.isFlipped;

    useEffect(() => {
      if (controlledIsFlipped !== undefined) {
        setInternalFlipped(controlledIsFlipped);
      } else if (controlledSide !== undefined) {
        setInternalFlipped(controlledSide === "back");
      }
    }, [controlledSide, controlledIsFlipped]);

    const isFlipped =
      controlledIsFlipped !== undefined ? controlledIsFlipped : internalFlipped;

    const dims = getDimensions(
      conf.size,
      conf.orientation,
      props.width,
      props.height,
    );

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (conf.flipOnClick) {
        const nextFlipped = !isFlipped;
        setInternalFlipped(nextFlipped);
        props.onFlipChange?.(nextFlipped);
        props.onFlip?.(nextFlipped ? "back" : "front");
      }
      props.onClick?.(e);
    };

    if (!conf.enableFlip) {
      return (
        <Id1BaseCardFace
          conf={conf}
          props={props}
          faceSide={isFlipped ? "back" : "front"}
          dims={dims}
        />
      );
    }

    return (
      <FlipPerspectiveStage
        ref={ref}
        stageWidth={dims.width}
        stageHeight={dims.height}
        isClickable={conf.flipOnClick}
        onClick={handleCardClick}
        className={props.className}
        data-testid={conf.testId}
      >
        <MotionFlipFlipper
          animate={getFlipAnimationTarget(isFlipped, conf.flipDirection)}
          transition={getFlipTransitionConfig(conf.flipDuration)}
        >
          <CardFaceWrapper isActive={!isFlipped} isBack={false}>
            <Id1BaseCardFace
              conf={conf}
              props={props}
              faceSide="front"
              dims={{ width: "100%", height: "100%" }}
            />
          </CardFaceWrapper>

          <CardFaceWrapper
            isActive={isFlipped}
            isBack={true}
            isVertical={conf.flipDirection === "vertical"}
          >
            <Id1BaseCardFace
              conf={conf}
              props={props}
              faceSide="back"
              dims={{ width: "100%", height: "100%" }}
            />
          </CardFaceWrapper>
        </MotionFlipFlipper>
      </FlipPerspectiveStage>
    );
  },
);

Id1BaseCard.displayName = "Id1BaseCard";

export default Id1BaseCard;
