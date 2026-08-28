import { useState, forwardRef, useImperativeHandle } from "react";
import { Card, HolographicLayer } from "deckfx";
import Electronics from "../../atoms/Electronics/Electronics";
import Guilloche from "../../atoms/Guilloche/Guilloche";
import {
  type Id1CardProps,
  type Id1CardHandle,
  type Id1CardSideConfig,
} from "./Id1Card.types";
import {
  CardFaceContainer,
  ContentOverlay,
  TransparentCardWrapper,
  getDimensions,
} from "./Id1Card.styles";

interface GuillocheLayerProps {
  config: Id1CardSideConfig;
  fallbackSeed: string;
}

function CardGuillocheLayer({ config, fallbackSeed }: GuillocheLayerProps) {
  if (config.showGuilloche === false) {
    return null;
  }

  return (
    <Guilloche
      seed={config.guillocheSeed || fallbackSeed}
      variant={config.guillocheVariant || "holo-spectrum"}
      density={config.guillocheDensity || "medium"}
      opacity={config.guillocheOpacity ?? 0.42}
      noiseIntensity={config.guillocheNoiseIntensity ?? 0.5}
      holographic={true}
    />
  );
}

interface ElectronicsLayerProps {
  config: Id1CardSideConfig;
  isBack: boolean;
}

function CardElectronicsLayer({ config, isBack }: ElectronicsLayerProps) {
  if (!config.showElectronics) {
    return null;
  }

  return (
    <Electronics
      finish={config.electronicsFinish || "gold"}
      showNfcAntenna={config.showNfcAntenna !== false}
      showChip={config.showChip ?? !isBack}
      showInnerCoil={config.showInnerCoil !== false}
      opacity={config.electronicsOpacity ?? (isBack ? 0.65 : 0.85)}
      mirrored={config.electronicsMirrored ?? false}
    />
  );
}

interface MaskedFoilLayerProps {
  config: Id1CardSideConfig;
  holoStrength: number;
}

function CardMaskedFoilLayer({ config, holoStrength }: MaskedFoilLayerProps) {
  if (!config.maskUrl) {
    return null;
  }

  return (
    <HolographicLayer
      active={true}
      holoStrength={holoStrength}
      variant={
        config.guillocheVariant === "solarized-gold" ? "gold" : "rainbow"
      }
      maskUrl={config.maskUrl}
      maskSize={config.maskSize || "contain"}
      maskPosition={config.maskPosition || "center"}
      maskRepeat={config.maskRepeat || "no-repeat"}
    />
  );
}

interface SideProps {
  sideConfig: Id1CardSideConfig;
  isBack: boolean;
  isTransparent?: boolean;
  holoStrength: number;
  userContent?: React.ReactNode;
}

function RenderCardSide({
  sideConfig,
  isBack,
  isTransparent,
  holoStrength,
  userContent,
}: SideProps) {
  const fallbackSeed = isBack ? "APTI-ID1-BACK" : "APTI-ID1-FRONT";

  return (
    <CardFaceContainer isBack={isBack} isTransparent={isTransparent}>
      <CardGuillocheLayer config={sideConfig} fallbackSeed={fallbackSeed} />
      <CardElectronicsLayer config={sideConfig} isBack={isBack} />
      <CardMaskedFoilLayer config={sideConfig} holoStrength={holoStrength} />
      {userContent && (
        <ContentOverlay isTransparent={isTransparent}>
          {userContent}
        </ContentOverlay>
      )}
    </CardFaceContainer>
  );
}

const defaultFront: Id1CardSideConfig = {
  showElectronics: true,
  electronicsFinish: "gold",
  showNfcAntenna: true,
  showChip: true,
  showInnerCoil: true,
  showGuilloche: true,
  guillocheVariant: "holo-spectrum",
  guillocheSeed: "APTI-7810-FRONT",
};

const defaultBack: Id1CardSideConfig = {
  showElectronics: false,
  electronicsFinish: "gold",
  showNfcAntenna: true,
  showChip: false,
  showInnerCoil: true,
  showGuilloche: true,
  guillocheVariant: "holo-spectrum",
  guillocheSeed: "APTI-7810-BACK",
};

function extractMaskConfig(props: Id1CardProps): Partial<Id1CardSideConfig> {
  const maskObj: Partial<Id1CardSideConfig> = {};
  if (props.maskUrl) maskObj.maskUrl = props.maskUrl;
  if (props.maskSize) maskObj.maskSize = props.maskSize;
  if (props.maskPosition) maskObj.maskPosition = props.maskPosition;
  if (props.maskRepeat) maskObj.maskRepeat = props.maskRepeat;
  return maskObj;
}

function resolveFrontSide(props: Id1CardProps): Id1CardSideConfig {
  const frontSeed = props.guillocheSeed || props.credential?.id;
  const overrides: Partial<Id1CardSideConfig> = {};

  if (props.showElectronics !== undefined)
    overrides.showElectronics = props.showElectronics;
  if (props.electronicsFinish)
    overrides.electronicsFinish = props.electronicsFinish;
  if (props.showGuilloche !== undefined)
    overrides.showGuilloche = props.showGuilloche;
  if (props.guillocheVariant)
    overrides.guillocheVariant = props.guillocheVariant;
  if (frontSeed) overrides.guillocheSeed = frontSeed;

  return Object.assign(
    {},
    defaultFront,
    overrides,
    extractMaskConfig(props),
    props.front,
  );
}

function resolveBackSide(props: Id1CardProps): Id1CardSideConfig {
  const backSeed =
    props.backGuillocheSeed ||
    (props.credential?.id ? `${props.credential.id}-BACK` : undefined);
  const overrides: Partial<Id1CardSideConfig> = {};

  if (props.showBackElectronics !== undefined)
    overrides.showElectronics = props.showBackElectronics;
  if (props.backElectronicsFinish)
    overrides.electronicsFinish = props.backElectronicsFinish;
  if (props.showBackGuilloche !== undefined)
    overrides.showGuilloche = props.showBackGuilloche;
  if (props.backGuillocheVariant)
    overrides.guillocheVariant = props.backGuillocheVariant;
  if (backSeed) overrides.guillocheSeed = backSeed;

  return Object.assign({}, defaultBack, overrides, props.back);
}

const defaultCardProps = {
  orientation: "landscape" as const,
  size: "responsive" as const,
  transparent: false,
  interactive: true,
  holographic: false,
  holoStrength: 0.7,
  showGlare: true,
  glareOpacity: 0.45,
  maxTilt: 16,
  scaleOnHover: 1.04,
  shadow: "xl" as const,
  testId: "id1-deckfx-card",
};

export const Id1Card = forwardRef<Id1CardHandle, Id1CardProps>((props, ref) => {
  const config = { ...defaultCardProps, ...props };
  const [uncontrolledFlipped, setUncontrolledFlipped] = useState(false);
  const isFlipped = props.isFlipped ?? uncontrolledFlipped;

  const updateFlipped = (nextFlipped: boolean) => {
    if (props.isFlipped === undefined) {
      setUncontrolledFlipped(nextFlipped);
    }
    props.onFlipChange?.(nextFlipped);
  };

  useImperativeHandle(ref, () => ({
    flip: () => {
      updateFlipped(!isFlipped);
    },
    setFlipped: (next: boolean) => {
      updateFlipped(next);
    },
  }));

  const dims = getDimensions(
    config.size,
    config.orientation,
    props.width,
    props.height,
  );

  const frontConfig = resolveFrontSide(props);
  const backConfig = resolveBackSide(props);

  return (
    <TransparentCardWrapper isTransparent={config.transparent}>
      <Card
        width={dims.width}
        height={dims.height}
        faceUp={!isFlipped}
        onFlip={(faceUp) => updateFlipped(!faceUp)}
        onClick={
          config.interactive ? () => updateFlipped(!isFlipped) : undefined
        }
        showGlare={config.showGlare}
        glareOpacity={config.glareOpacity}
        maxTilt={config.maxTilt}
        scaleOnHover={config.scaleOnHover}
        shadow={config.shadow}
        holographic={false}
        flipDirection={props.flipDirection}
        flipDuration={props.flipDuration}
        className={props.className}
        containerClassName={props.containerClassName}
        data-testid={config.testId}
        backContent={
          <RenderCardSide
            sideConfig={backConfig}
            isBack={true}
            isTransparent={config.transparent}
            holoStrength={config.holoStrength}
            userContent={props.backContent || props.backChildren}
          />
        }
      >
        <RenderCardSide
          sideConfig={frontConfig}
          isBack={false}
          isTransparent={config.transparent}
          holoStrength={config.holoStrength}
          userContent={props.frontContent || props.children}
        />
      </Card>
    </TransparentCardWrapper>
  );
});

Id1Card.displayName = "Id1Card";

export default Id1Card;
