import { forwardRef, useMemo } from "react";
import { Card } from "deckfx";
import Electronics from "../../atoms/Electronics/Electronics";
import Guilloche from "../../atoms/Guilloche/Guilloche";
import { generateGuillocheMaskDataUrl } from "../../atoms/Guilloche/guillocheMath";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import {
  type Id1CardProps,
  type Id1CardSide,
  type Id1CardCredential,
} from "./Id1Card.types";
import {
  CardFaceContainer,
  ContentOverlay,
  FrontLayoutRoot,
  CardHeaderBar,
  CardBrandTag,
  ClearanceBadge,
  FrontMainBody,
  AvatarFrame,
  CadetDetailsColumn,
  CadetNameText,
  CadetCallSignText,
  CadetRoleText,
  MetaGrid,
  MetaItem,
  MetaLabel,
  MetaValue,
  BackLayoutRoot,
  MagneticStripeBar,
  BackMiddleSection,
  SignaturePanel,
  SecurityCodeTag,
  MrzHolder,
  getDimensions,
} from "./Id1Card.styles";

const DEFAULT_CREDENTIAL: Required<Id1CardCredential> = {
  id: "APTI-7810-9402",
  name: "Alex Mercer",
  callSign: "AETH-9042",
  role: "Mission Specialist",
  division: "Orbital Flight Dynamics",
  clearanceLevel: "LEVEL-4 OMNI",
  issueDate: "2026-08",
  expiryDate: "2030-08",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  securityCode: "781",
  barcodeValue: "APTI-7810-9402",
};

interface SideViewProps {
  credential?: Partial<Id1CardCredential>;
  isPortrait?: boolean;
}

function BackCredentialView({ credential, isPortrait }: SideViewProps) {
  const cred = { ...DEFAULT_CREDENTIAL, ...credential };
  const rawId = cred.id.replace(/[^A-Z0-9]/gi, "");
  const parts = cred.name.trim().split(" ");
  const surname = (parts[parts.length - 1] || "MERCER").toUpperCase();
  const givenNames = (parts.slice(0, -1).join(" ") || "ALEX").toUpperCase();

  return (
    <BackLayoutRoot isPortrait={isPortrait}>
      <MagneticStripeBar />

      <BackMiddleSection>
        <SignaturePanel>
          <span>AUTH SIGNATURE</span>
          <SecurityCodeTag>SEC: {cred.securityCode}</SecurityCodeTag>
        </SignaturePanel>

        <MetaItem>
          <MetaLabel>STANDARD</MetaLabel>
          <MetaValue>ISO 7810 ID-1</MetaValue>
        </MetaItem>
      </BackMiddleSection>

      <MrzHolder>
        <MrzZone
          compact={true}
          cardData={{
            documentNumber: rawId.slice(0, 9),
            surname,
            givenNames,
            issuingState: "APT",
            nationality: "APT",
            sex: "X",
          }}
        />
      </MrzHolder>
    </BackLayoutRoot>
  );
}

function FrontCredentialView({ credential, isPortrait }: SideViewProps) {
  const cred = { ...DEFAULT_CREDENTIAL, ...credential };

  return (
    <FrontLayoutRoot isPortrait={isPortrait}>
      <CardHeaderBar>
        <CardBrandTag>
          <span>✦</span>
          <span>AptiSpace Academy</span>
        </CardBrandTag>
        <ClearanceBadge>{cred.clearanceLevel}</ClearanceBadge>
      </CardHeaderBar>

      <FrontMainBody isPortrait={isPortrait}>
        <AvatarFrame size={isPortrait ? 60 : 54}>
          <img src={cred.avatarUrl} alt={cred.name} />
        </AvatarFrame>

        <CadetDetailsColumn>
          <CadetNameText>{cred.name}</CadetNameText>
          <CadetCallSignText>CALLSIGN: {cred.callSign}</CadetCallSignText>
          <CadetRoleText>{cred.role}</CadetRoleText>
        </CadetDetailsColumn>
      </FrontMainBody>

      <MetaGrid isPortrait={isPortrait}>
        <MetaItem>
          <MetaLabel>Cadet ID</MetaLabel>
          <MetaValue>{cred.id}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Division</MetaLabel>
          <MetaValue>{cred.division}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Expires</MetaLabel>
          <MetaValue>{cred.expiryDate}</MetaValue>
        </MetaItem>
      </MetaGrid>
    </FrontLayoutRoot>
  );
}

interface CredentialContentProps {
  credential?: Partial<Id1CardCredential>;
  side: Id1CardSide;
  isPortrait?: boolean;
}

function DefaultCredentialContent({
  credential,
  side,
  isPortrait,
}: CredentialContentProps) {
  if (side === "back") {
    return (
      <BackCredentialView credential={credential} isPortrait={isPortrait} />
    );
  }
  return (
    <FrontCredentialView credential={credential} isPortrait={isPortrait} />
  );
}

function getGuillocheSeed(
  customSeed: string | undefined,
  credId: string | undefined,
  isBack: boolean,
): string {
  if (customSeed) return customSeed;
  if (credId) return isBack ? `${credId}-BACK` : credId;
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

interface CardContentOverlayProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  credential?: Partial<Id1CardCredential>;
  side: Id1CardSide;
  isPortrait: boolean;
  transparent?: boolean;
}

function CardContentOverlay({
  children,
  content,
  credential,
  side,
  isPortrait,
  transparent,
}: CardContentOverlayProps) {
  let inner = children;
  if (!inner) inner = content;
  if (!inner) {
    inner = (
      <DefaultCredentialContent
        credential={credential}
        side={side}
        isPortrait={isPortrait}
      />
    );
  }

  return <ContentOverlay isTransparent={transparent}>{inner}</ContentOverlay>;
}

const DEFAULT_CARD_PROPS = {
  side: "front" as const,
  orientation: "landscape" as const,
  size: "responsive" as const,
  transparent: false,
  showGlare: true,
  glareOpacity: 0.45,
  maxTilt: 16,
  scaleOnHover: 1.04,
  shadow: "xl" as const,
  holographic: true,
  holoStrength: 0.75,
  showElectronics: true,
  electronicsFinish: "gold" as const,
  showNfcAntenna: true,
  showInnerCoil: true,
  showGuilloche: true,
  guillocheVariant: "holo-spectrum" as const,
  guillocheDensity: "medium" as const,
  guillocheOpacity: 0.42,
  guillocheNoiseIntensity: 0.5,
  testId: "id1-card",
};

export const Id1Card = forwardRef<HTMLDivElement, Id1CardProps>(
  (props, ref) => {
    const conf = { ...DEFAULT_CARD_PROPS, ...props };
    const isBack = conf.side === "back";
    const isPortrait = conf.orientation === "portrait";

    const dims = getDimensions(
      conf.size,
      conf.orientation,
      props.width,
      props.height,
    );

    const showChip = props.showChip ?? !isBack;
    const electronicsOpacity =
      props.electronicsOpacity ?? (isBack ? 0.65 : 0.85);
    const electronicsMirrored = props.electronicsMirrored ?? isBack;
    const seed = getGuillocheSeed(
      props.guillocheSeed,
      props.credential?.id,
      isBack,
    );

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
        <CardFaceContainer
          ref={ref}
          isBack={isBack}
          isTransparent={conf.transparent}
        >
          {conf.showGuilloche && (
            <Guilloche
              seed={seed}
              variant={conf.guillocheVariant}
              density={conf.guillocheDensity}
              opacity={conf.guillocheOpacity}
              noiseIntensity={conf.guillocheNoiseIntensity}
              holographic={false}
            />
          )}

          {conf.showElectronics && (
            <Electronics
              finish={conf.electronicsFinish}
              showNfcAntenna={conf.showNfcAntenna}
              showChip={showChip}
              showInnerCoil={conf.showInnerCoil}
              opacity={electronicsOpacity}
              mirrored={electronicsMirrored}
            />
          )}

          <CardContentOverlay
            children={props.children}
            content={props.content}
            credential={props.credential}
            side={conf.side}
            isPortrait={isPortrait}
            transparent={conf.transparent}
          />
        </CardFaceContainer>
      </Card>
    );
  },
);

Id1Card.displayName = "Id1Card";

export default Id1Card;
