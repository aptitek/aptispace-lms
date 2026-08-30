import { forwardRef, useState, useEffect, useMemo } from "react";
import { Card, type CardLayer, type CardShadow } from "deckfx";
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
  IdCardContainer,
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
  if (customSeed) {
    return isBack ? `${customSeed}-BACK` : `${customSeed}-FRONT`;
  }
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
  renderGhostContent?: (side: IdCardSide) => React.ReactNode;
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

function useIdCardFlipState(props: IdCardProps, defaultSide: IdCardSide) {
  const [internalFlipped, setInternalFlipped] = useState(
    props.isFlipped ??
      (props.side !== undefined
        ? props.side === "back"
        : defaultSide === "back"),
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

  return { isFlipped, setInternalFlipped };
}

function useIdCardMergedLayers(
  conf: typeof DEFAULT_CARD_PROPS,
  props: IdCardProps,
  frontSeed: string,
  backSeed: string,
): CardLayer[] {
  return useMemo(() => {
    const rawLayers = Array.isArray(props.holoLayers) ? props.holoLayers : [];
    const activeHoloLayers: IdHoloLayer[] = rawLayers.map((layer) => {
      if (typeof layer === "string") {
        return {
          id: `holo-string-${layer}`,
          src: layer,
          holographic: true,
          side: "front" as const,
        };
      }
      return layer as IdHoloLayer;
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
      const frontMask = generateGuillocheMaskDataUrl({
        seed: frontSeed,
        density: conf.guillocheDensity,
        noiseIntensity: conf.guillocheNoiseIntensity,
      });

      const backMask = generateGuillocheMaskDataUrl({
        seed: backSeed,
        density: conf.guillocheDensity,
        noiseIntensity: conf.guillocheNoiseIntensity,
      });

      guillocheHoloLayers.push({
        id: "guilloche-holo-front",
        side: "front",
        maskUrl: frontMask,
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
        holoOnly: true,
      });

      guillocheHoloLayers.push({
        id: "guilloche-holo-back",
        side: "back",
        maskUrl: backMask,
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
        holoOnly: true,
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
    conf.holoVariant,
    conf.holoStrength,
    conf.showGuilloche,
    conf.holographic,
    conf.guillocheDensity,
    conf.guillocheNoiseIntensity,
    conf.guillocheOpacity,
    frontSeed,
    backSeed,
  ]);
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
  const { isFlipped, setInternalFlipped } = useIdCardFlipState(
    props,
    conf.side,
  );

  const dims = getDimensions(
    conf.size,
    conf.orientation,
    props.width,
    props.height,
  );

  const handleCardClick = () => {
    if (conf.flipOnClick) {
      const nextFlipped = !isFlipped;
      setInternalFlipped(nextFlipped);
      props.onFlipChange?.(nextFlipped);
      props.onFlip?.(nextFlipped ? "back" : "front");
    }
    props.onClick?.();
  };

  const frontSeed = getGuillocheSeed(props.guillocheSeed, false);
  const backSeed = getGuillocheSeed(props.guillocheSeed, true);

  const mergedLayers = useIdCardMergedLayers(conf, props, frontSeed, backSeed);

  return (
    <IdCardContainer
      ref={ref}
      className={props.containerClassName}
      data-testid={conf.testId}
      isClickable={conf.flipOnClick}
    >
      <Card
        width={dims.width}
        height={dims.height}
        faceUp={!isFlipped}
        flipDirection={conf.flipDirection}
        flipDuration={conf.flipDuration}
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
        onClick={handleCardClick}
        className={props.className}
        backContent={
          <CardFaceContainer isBack={true} isTransparent={conf.transparent}>
            <ElectronicsLayer
              conf={conf}
              props={props}
              faceSide="back"
              isBack={true}
              isTransparent={conf.transparent}
            />
            <ReverseGhostLayer
              isTransparent={conf.transparent}
              faceSide="back"
              isVertical={conf.flipDirection === "vertical"}
              opacity={
                props.transparentGhostOpacity ?? conf.transparentGhostOpacity
              }
              renderGhostContent={props.renderGhostContent}
            />
            {props.backContent && (
              <ContentOverlay isTransparent={conf.transparent}>
                {props.backContent}
              </ContentOverlay>
            )}
          </CardFaceContainer>
        }
      >
        <CardFaceContainer isBack={false} isTransparent={conf.transparent}>
          <ElectronicsLayer
            conf={conf}
            props={props}
            faceSide="front"
            isBack={false}
            isTransparent={conf.transparent}
          />
          <ReverseGhostLayer
            isTransparent={conf.transparent}
            faceSide="front"
            isVertical={conf.flipDirection === "vertical"}
            opacity={
              props.transparentGhostOpacity ?? conf.transparentGhostOpacity
            }
            renderGhostContent={props.renderGhostContent}
          />
          <ContentOverlay isTransparent={conf.transparent}>
            {props.frontContent ?? props.children}
          </ContentOverlay>
        </CardFaceContainer>
      </Card>
    </IdCardContainer>
  );
});

IdCard.displayName = "IdCard";

export const Id1Card = IdCard;
export default IdCard;
