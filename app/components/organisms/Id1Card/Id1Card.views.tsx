import React from "react";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import { type Id1CardSide, type Id1CardCredential } from "./Id1Card.types";
import {
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
} from "./Id1Card.styles";

export const DEFAULT_CREDENTIAL: Required<Id1CardCredential> = {
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

export interface SideViewProps {
  credential?: Partial<Id1CardCredential>;
  isPortrait?: boolean;
}

export function BackCredentialView({ credential, isPortrait }: SideViewProps) {
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

export function FrontCredentialView({ credential, isPortrait }: SideViewProps) {
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

export interface CredentialContentProps {
  credential?: Partial<Id1CardCredential>;
  side: Id1CardSide;
  isPortrait?: boolean;
}

export function DefaultCredentialContent({
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
