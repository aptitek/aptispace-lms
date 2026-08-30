import {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
  type MouseEvent,
} from "react";
import { Card, type CardLayer, type CardShadow } from "deckfx";
import type { Transition } from "framer-motion";
import Electronics from "../../atoms/Electronics/Electronics";
import type {
  ElectronicsFinish,
  ElectronicsChipPosition,
} from "../../atoms/Electronics/Electronics.types";
import type {
  GuillocheVariant,
  GuillocheDensity,
} from "../../atoms/Guilloche/Guilloche.types";
import { generateGuillocheMaskDataUrl } from "../../atoms/Guilloche/guillocheMath";
import type {
  IdCardProps,
  IdCardSide,
  IdCardOrientation,
  IdCardSize,
  IdCardFlipDirection,
  IdHoloLayer,
  IdHoloVariant,
} from "./IdCard.types";
import {
  CardFaceContainer,
  ContentOverlay,
  TransparentGhostOverlay,
  FlipPerspectiveStage,
  MotionFlipFlipper,
  CardFaceWrapper,
  getDimensions,
} from "./IdCard.styles";

function resolveHoloVariant(
  variant?: IdHoloVariant,
): "default" | "rainbow" | "cosmic" | "gold" {
  switch (variant) {
    case "cosmic-crimson":
    case "cosmic":
      return "cosmic";
    case "solarized-gold":
    case "gold":
      return "gold";
    case "rainbow":
      return "rainbow";
    case "holo-spectrum":
    case "cyber-cyan":
    case "default":
    default:
      return "default";
  }
}

function getGuillocheSeed(
  customSeed: string | undefined,
  isBack: boolean,
): string {
  if (customSeed) return customSeed;
  return isBack ? "APTI-ID1-BACK" : "APTI-ID1-FRONT";
}

function resolveChipView(
  props: IdCardProps,
  isBack: boolean,
  isTransparent: boolean,
): "front" | "back" | "none" {
  if (isBack && props.backChipView) return props.backChipView;
  if (!isBack && props.frontChipView) return props.frontChipView;
  if (props.chipView) return props.chipView;
  return isBack ? (isTransparent ? "back" : "none") : "front";
}

function resolveElectronicsRotation(
  props: IdCardProps,
  isBack: boolean,
  defaultRotation: number,
): number {
  if (isBack && props.backElectronicsRotation !== undefined) {
    return props.backElectronicsRotation;
  }
  if (!isBack && props.frontElectronicsRotation !== undefined) {
    return props.frontElectronicsRotation;
  }
  return defaultRotation;
}

interface ReverseGhostLayerProps {
  isTransparent?: boolean;
  faceSide: IdCardSide;
  isVertical: boolean;
  opacity: number;
  renderGhostContent?: (side: IdCardSide) => ReactNode;
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
  side: "front" as IdCardSide,
  enableFlip: true,
  flipOnClick: false,
  flipDirection: "horizontal" as IdCardFlipDirection,
  orientation: "landscape" as IdCardOrientation,
  size: "responsive" as IdCardSize,
  transparent: false,
  transparentGhostOpacity: 0.22,
  showGlare: true,
  glareOpacity: 0.45,
  maxTilt: 16,
  scaleOnHover: 1.04,
  shadow: "xl" as CardShadow,
  holographic: true,
  holoStrength: 0.75,
  holoVariant: "default" as IdHoloVariant,
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
  testId: "id1-card",
};

interface ElectronicsLayerProps {
  conf: typeof DEFAULT_CARD_PROPS;
  props: IdCardProps;
  faceSide: IdCardSide;
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
  const chipView = resolveChipView(props, isBack, isTransparent);
  const rotation = resolveElectronicsRotation(
    props,
    isBack,
    conf.electronicsRotation,
  );
  const electronicsOpacity = props.electronicsOpacity ?? (isBack ? 0.65 : 0.85);
  const electronicsMirrored = props.electronicsMirrored ?? isBack;

  return (
    <Electronics
      side={faceSide}
      finish={conf.electronicsFinish}
      chipPosition={conf.chipPosition}
      rotation={rotation}
      showNfcAntenna={showNfcAntenna}
      showChip={conf.showChip}
      chipView={chipView}
      showInnerCoil={showInnerCoil}
      opacity={electronicsOpacity}
      mirrored={electronicsMirrored}
    />
  );
}

interface IdCardFaceProps {
  conf: typeof DEFAULT_CARD_PROPS;
  props: IdCardProps;
  faceSide: IdCardSide;
  dims: { width: number | string; height: number | string };
}

function IdCardFace({ conf, props, faceSide, dims }: IdCardFaceProps) {
  const isBack = faceSide === "back";
  const seed = getGuillocheSeed(props.guillocheSeed, isBack);

  const mergedLayers = useMemo(() => {
    const rawLayers = Array.isArray(props.holoLayers) ? props.holoLayers : [];
    const activeHoloLayers: IdHoloLayer[] = rawLayers
      .map((layer) => {
        if (typeof layer === "string") {
          return {
            id: `holo-string-${layer}`,
            src: layer,
            holographic: true,
            side: "front" as const,
          };
        }
        return layer as IdHoloLayer;
      })
      .filter((layer) => {
        return (
          layer.side === "both" ||
          layer.side === faceSide ||
          (!layer.side && faceSide === "front")
        );
      });

    const normalizedHoloLayers = activeHoloLayers.map((layer) => {
      let holographicOption: CardLayer["holographic"] = false;
      if (layer.holographic) {
        holographicOption = {
          variant: resolveHoloVariant(conf.holoVariant),
          holoStrength: layer.holoStrength ?? conf.holoStrength ?? 1,
        };
      }
      return {
        ...layer,
        holographic: holographicOption,
      } as CardLayer;
    });

    const guillocheHoloLayers: CardLayer[] = [];
    if (conf.showGuilloche && conf.holographic) {
      const maskDataUrl = generateGuillocheMaskDataUrl({
        seed,
        density: conf.guillocheDensity,
        noiseIntensity: conf.guillocheNoiseIntensity,
      });

      guillocheHoloLayers.push({
        id: `guilloche-holo-${faceSide}`,
        maskUrl: maskDataUrl,
        maskSize: "100% 100%",
        maskPosition: "center",
        maskRepeat: "no-repeat",
        holographic: {
          variant: resolveHoloVariant(conf.holoVariant),
          holoStrength: conf.holoStrength ?? 1,
          blendMode: "color-dodge",
        },
        opacity: conf.guillocheOpacity ?? 0.85,
        zIndex: 1,
      });
    }

    return [
      ...guillocheHoloLayers,
      ...normalizedHoloLayers,
      ...(props.layers || []),
    ];
  }, [
    props.holoLayers,
    props.layers,
    faceSide,
    conf.holoVariant,
    conf.holoStrength,
    conf.showGuilloche,
    conf.holographic,
    conf.guillocheDensity,
    conf.guillocheNoiseIntensity,
    conf.guillocheOpacity,
    seed,
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
      holographic={
        conf.holographic
          ? {
              variant: resolveHoloVariant(conf.holoVariant),
              holoStrength: conf.holoStrength ?? 1,
            }
          : false
      }
      layers={mergedLayers}
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

        {content && (
          <ContentOverlay isTransparent={conf.transparent}>
            {content}
          </ContentOverlay>
        )}
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
 * IdCard - Physical Card Credential Molecule
 *
 * Provides the physical credential substrate with security features:
 * - ISO/IEC 7810 ID-1 standard dimensions (85.60 mm × 53.98 mm)
 * - Procedural Guilloche security rosettes & mask reflection
 * - Embedded Electronics (Microchip + NFC Antenna)
 * - Dynamic Holographic foil & Glare effects
 * - 3D Flip physics (Horizontal & Vertical axes)
 * - Transparent acrylic glassmorphic substrate with ghosting layer
 */
export const IdCard = forwardRef<HTMLDivElement, IdCardProps>((props, ref) => {
  const conf = { ...DEFAULT_CARD_PROPS, ...props };
  const [internalFlipped, setInternalFlipped] = useState(
    props.isFlipped ??
      (props.side !== undefined ? props.side === "back" : conf.side === "back"),
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

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
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
      <IdCardFace
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
          <IdCardFace
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
          <IdCardFace
            conf={conf}
            props={props}
            faceSide="back"
            dims={{ width: "100%", height: "100%" }}
          />
        </CardFaceWrapper>
      </MotionFlipFlipper>
    </FlipPerspectiveStage>
  );
});

IdCard.displayName = "IdCard";

export const Id1Card = IdCard;
export default IdCard;
