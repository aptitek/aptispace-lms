import { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import WifiIcon from "@mui/icons-material/Wifi";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import Electronics from "../../atoms/Electronics/Electronics";
import Guilloche from "../../atoms/Guilloche/Guilloche";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import type { ElectronicsFinish } from "../../atoms/Electronics/Electronics.types";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";
import { type Id1CardProps, type Id1CardCredential } from "./Id1Card.types";
import {
  CardWrapper,
  CardInner,
  CardFace,
  CardHeaderRow,
  CardBrandGroup,
  AgencyIcon,
  AgencyTitle,
  StandardSub,
  SecurityIconsRow,
  MiddleRow,
  ChipAndPhoto,
  EmvChip,
  ContactlessSymbol,
  HolographicSeal,
  PhotoContainer,
  CredentialDetailBox,
  BadgeRow,
  ClearancePill,
  CadetIdSpan,
  CadetName,
  CadetRole,
  CadetDivision,
  CardBottomRow,
  DatesContainer,
  DateVal,
  CallSignVal,
  MagneticStripe,
  BackContentWrapper,
  SignatureLabelsRow,
  SignatureSection,
  SignatureStrip,
  CvvBox,
  BackNoticeRow,
  BackFinePrint,
  BackQrBox,
  FlipBadge,
} from "./Id1Card.styles";

export interface Id1CardHandle {
  flip: () => void;
  setFlipped: (isNextFlipped: boolean) => void;
}

const defaultCredential: Id1CardCredential = {
  id: "APTI-7810-0942",
  name: "ALEX MERCER",
  callSign: "AETH-9042",
  role: "MISSION SPECIALIST",
  division: "ORBITAL DYNAMICS & ASTROPHYSICS",
  clearanceLevel: "LEVEL-4 OMNI",
  issueDate: "2026-08",
  expiryDate: "2030-08",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  securityCode: "781",
  barcodeValue: "APTI-7810-ID1-CADET-VALID",
};

interface CardSideProps {
  card: Id1CardCredential;
  isPortrait?: boolean;
  interactive?: boolean;
  showElectronics?: boolean;
  showNfcAntenna?: boolean;
  electronicsFinish?: ElectronicsFinish;
  showGuilloche?: boolean;
  guillocheVariant?: GuillocheVariant;
}

function CardFrontContent({
  card,
  isPortrait,
  interactive,
  showElectronics = true,
  showNfcAntenna = true,
  electronicsFinish = "gold",
  showGuilloche = true,
  guillocheVariant = "holo-spectrum",
}: CardSideProps) {
  const { t } = useTranslation("onboarding");

  return (
    <CardFace isBack={false}>
      {showGuilloche && (
        <Guilloche
          seed={card.id || card.name}
          variant={guillocheVariant}
          opacity={0.3}
        />
      )}

      {showElectronics && (
        <Electronics
          finish={electronicsFinish}
          showNfcAntenna={showNfcAntenna}
          showChip={false}
          showInnerCoil
          opacity={0.7}
        />
      )}

      <CardHeaderRow>
        <CardBrandGroup>
          <AgencyIcon src="/favicon.svg" alt="AptiSpace Crest" />
          <div>
            <AgencyTitle>APTISPACE EXPLORATION CORPS</AgencyTitle>
            <StandardSub>ISO/IEC 7810 ID-1 IDENTIFICATION BADGE</StandardSub>
          </div>
        </CardBrandGroup>

        <SecurityIconsRow>
          <ContactlessSymbol title="ISO/IEC 14443 Contactless RF">
            <WifiIcon />
          </ContactlessSymbol>
          <HolographicSeal title="ISO/IEC 7810 Holographic Optical Security" />
        </SecurityIconsRow>
      </CardHeaderRow>

      <MiddleRow isPortrait={Boolean(isPortrait)}>
        <ChipAndPhoto>
          <EmvChip title="ISO/IEC 7816-2 Smart Contact Microchip (Position X=162.5, Y=244.9)">
            <div className="chip-grid" />
            <div className="chip-center" />
          </EmvChip>

          <PhotoContainer>
            <img src={card.avatarUrl} alt={card.name} />
            <div className="scan-line" />
            <div className="corner-bracket top-left" />
            <div className="corner-bracket top-right" />
            <div className="corner-bracket bottom-left" />
            <div className="corner-bracket bottom-right" />
          </PhotoContainer>
        </ChipAndPhoto>

        <CredentialDetailBox>
          <BadgeRow>
            <ClearancePill>{card.clearanceLevel}</ClearancePill>
            <CadetIdSpan>{card.id}</CadetIdSpan>
          </BadgeRow>

          <CadetName>{card.name}</CadetName>
          <CadetRole>{card.role}</CadetRole>
          <CadetDivision>DIV: {card.division}</CadetDivision>
        </CredentialDetailBox>
      </MiddleRow>

      <CardBottomRow>
        <DatesContainer>
          <span>
            ISS: <DateVal>{card.issueDate}</DateVal>
          </span>
          <span>
            EXP: <DateVal>{card.expiryDate}</DateVal>
          </span>
          <span>
            CALLSIGN: <CallSignVal>{card.callSign}</CallSignVal>
          </span>
        </DatesContainer>

        {interactive && (
          <FlipBadge>
            <AutorenewIcon />
            <span>{t("card.flipToBack", "Flip")}</span>
          </FlipBadge>
        )}
      </CardBottomRow>
    </CardFace>
  );
}

function buildMrzData(card: Id1CardCredential) {
  const surname = (card.name || "MERCER").split(" ")[1] || "MERCER";
  const givenNames = (card.name || "ALEX").split(" ")[0] || "ALEX";
  const documentNumber = (card.id || "0942").replace(/[^0-9]/g, "").slice(0, 9);
  const expiryDate =
    (card.expiryDate || "3008").replace("-", "").slice(0, 4) + "01";

  return {
    documentNumber,
    surname,
    givenNames,
    birthDate: "950412",
    expiryDate,
    sex: "M" as const,
    issuingState: "APT",
    nationality: "APT",
  };
}

function CardBackContent({ card }: CardSideProps) {
  const mrzData = buildMrzData(card);

  return (
    <CardFace isBack={true}>
      <MagneticStripe />

      <BackContentWrapper>
        <SignatureLabelsRow>
          <span>AUTHORIZED CADET SIGNATURE</span>
          <span>SECURITY KEY</span>
        </SignatureLabelsRow>

        <SignatureSection>
          <SignatureStrip>
            <span>
              {card.name
                ?.toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase()) ||
                "Alex Mercer"}
            </span>
            <FingerprintIcon />
          </SignatureStrip>

          <CvvBox>
            <span>CVV</span>
            <span>{card.securityCode}</span>
          </CvvBox>
        </SignatureSection>
      </BackContentWrapper>

      <BackNoticeRow>
        <BackFinePrint>
          Property of AptiSpace Command. If found, return to nearest
          interstellar terminal. Emergency subspace distress: 1420.405 MHz.
          Standard ISO/IEC 7810 ID-1.
        </BackFinePrint>
        <BackQrBox>
          <QrCode2Icon className="qr-code" />
          <VerifiedUserIcon className="verified-shield" />
        </BackQrBox>
      </BackNoticeRow>

      <MrzZone cardData={mrzData} compact showValidation />
    </CardFace>
  );
}

const defaultCardConfig = {
  orientation: "landscape" as const,
  size: "responsive" as const,
  interactive: true,
  showElectronics: true,
  showNfcAntenna: true,
  electronicsFinish: "gold" as const,
  showGuilloche: true,
  guillocheVariant: "holo-spectrum" as const,
  testId: "id1-card",
};

export const Id1Card = forwardRef<Id1CardHandle, Id1CardProps>((props, ref) => {
  const config = { ...defaultCardConfig, ...props };
  const [uncontrolledFlipped, setUncontrolledFlipped] = useState(false);
  const isFlipped = props.isFlipped ?? uncontrolledFlipped;

  const updateFlipped = (next: boolean) => {
    if (props.isFlipped === undefined) {
      setUncontrolledFlipped(next);
    }
    props.onFlipChange?.(next);
  };

  useImperativeHandle(ref, () => ({
    flip: () => updateFlipped(!isFlipped),
    setFlipped: (next: boolean) => updateFlipped(next),
  }));

  const card: Id1CardCredential = { ...defaultCredential, ...props.credential };
  const isPortrait = config.orientation === "portrait";

  return (
    <CardWrapper
      cardOrientation={config.orientation}
      cardSize={config.size}
      className={props.className}
      data-testid={config.testId}
      onClick={config.interactive ? () => updateFlipped(!isFlipped) : undefined}
      role="region"
      aria-label={`ISO/IEC 7810 ID-1 Space Identification Card for ${card.name}`}
    >
      <CardInner isFlipped={isFlipped}>
        <CardFrontContent
          card={card}
          isPortrait={isPortrait}
          interactive={config.interactive}
          showElectronics={config.showElectronics}
          showNfcAntenna={config.showNfcAntenna}
          electronicsFinish={config.electronicsFinish}
          showGuilloche={config.showGuilloche}
          guillocheVariant={config.guillocheVariant}
        />
        <CardBackContent card={card} />
      </CardInner>
    </CardWrapper>
  );
});

Id1Card.displayName = "Id1Card";

export default Id1Card;
