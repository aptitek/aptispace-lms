import { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import WifiIcon from "@mui/icons-material/Wifi";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import Electronics from "../../atoms/Electronics/Electronics";
import type { ElectronicsFinish } from "../../atoms/Electronics/Electronics.types";
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
  MrzZone,
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

const buildMrzLines = (card: Id1CardCredential) => {
  const sanitizedName = (card.name || "CADET")
    .toUpperCase()
    .replace(/[^A-Z]/g, "<");
  const sanitizedId = (card.id || "APTI7810").replace(/[^A-Z0-9]/g, "");
  return {
    line1: `IDAPT${sanitizedId.padEnd(9, "<")}<<<<<<<<<<<<<<<<<<`.slice(0, 30),
    line2: `2608284M3008287APT<<<<<<<<<<<4`.slice(0, 30),
    line3: `${sanitizedName}<<<<<<<<<<<<<<<<<<<<<<<<<<<<`.slice(0, 30),
  };
};

interface CardSideProps {
  card: Id1CardCredential;
  isPortrait?: boolean;
  interactive?: boolean;
  showElectronics?: boolean;
  showNfcAntenna?: boolean;
  electronicsFinish?: ElectronicsFinish;
}

function CardFrontContent({
  card,
  isPortrait,
  interactive,
  showElectronics = true,
  showNfcAntenna = true,
  electronicsFinish = "gold",
}: CardSideProps) {
  const { t } = useTranslation("onboarding");

  return (
    <CardFace isBack={false}>
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

function CardBackContent({ card }: CardSideProps) {
  const mrz = buildMrzLines(card);

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
                .replace(/\b\w/g, (c) => c.toUpperCase()) || "Alex Mercer"}
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

      <MrzZone>
        <div>{mrz.line1}</div>
        <div>{mrz.line2}</div>
        <div>{mrz.line3}</div>
      </MrzZone>
    </CardFace>
  );
}

export const Id1Card = forwardRef<Id1CardHandle, Id1CardProps>((props, ref) => {
  const {
    credential,
    orientation = "landscape",
    size = "responsive",
    isFlipped: controlledFlipped,
    onFlipChange,
    interactive = true,
    showElectronics = true,
    showNfcAntenna = true,
    electronicsFinish = "gold",
    className,
    testId = "id1-card",
  } = props;

  const [uncontrolledFlipped, setUncontrolledFlipped] = useState(false);
  const isFlipped = controlledFlipped ?? uncontrolledFlipped;

  const updateFlipped = (next: boolean) => {
    if (controlledFlipped === undefined) {
      setUncontrolledFlipped(next);
    }
    onFlipChange?.(next);
  };

  useImperativeHandle(ref, () => ({
    flip: () => updateFlipped(!isFlipped),
    setFlipped: (next: boolean) => updateFlipped(next),
  }));

  const card: Id1CardCredential = { ...defaultCredential, ...credential };
  const isPortrait = orientation === "portrait";

  return (
    <CardWrapper
      cardOrientation={orientation}
      cardSize={size}
      className={className}
      data-testid={testId}
      onClick={interactive ? () => updateFlipped(!isFlipped) : undefined}
      role="region"
      aria-label={`ISO/IEC 7810 ID-1 Space Identification Card for ${card.name}`}
    >
      <CardInner isFlipped={isFlipped}>
        <CardFrontContent
          card={card}
          isPortrait={isPortrait}
          interactive={interactive}
          showElectronics={showElectronics}
          showNfcAntenna={showNfcAntenna}
          electronicsFinish={electronicsFinish}
        />
        <CardBackContent card={card} />
      </CardInner>
    </CardWrapper>
  );
});

Id1Card.displayName = "Id1Card";

export default Id1Card;
