import React from "react";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import BiometricAvatar from "../../atoms/BiometricAvatar/BiometricAvatar";
import {
  type Id1CardCredential,
  type Id1CredentialLayoutProps,
} from "./Id1Card.types";
import {
  FrontLayoutRoot,
  FrontDetailsPanel,
  CardHeaderBar,
  CardBrandTag,
  ClearanceBadge,
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
} from "./Id1CredentialLayout.styles";

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

export interface SideCredentialProps {
  credential?: Partial<Id1CardCredential>;
  isPortrait?: boolean;
  className?: string;
  testId?: string;
}

export function BackCredentialView({
  credential,
  isPortrait,
  className,
  testId = "id1-back-credential",
}: SideCredentialProps) {
  const cred = { ...DEFAULT_CREDENTIAL, ...credential };
  const rawId = cred.id.replace(/[^A-Z0-9]/gi, "");
  const parts = cred.name.trim().split(" ");
  const surname = (parts[parts.length - 1] || "MERCER").toUpperCase();
  const givenNames = (parts.slice(0, -1).join(" ") || "ALEX").toUpperCase();

  return (
    <BackLayoutRoot
      isPortrait={isPortrait}
      className={className}
      data-testid={testId}
    >
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

export function FrontCredentialView({
  credential,
  isPortrait,
  className,
  testId = "id1-front-credential",
}: SideCredentialProps) {
  const cred = { ...DEFAULT_CREDENTIAL, ...credential };

  return (
    <FrontLayoutRoot
      isPortrait={isPortrait}
      className={className}
      data-testid={testId}
    >
      {/* Full-Sized Biometric Portrait conforming to ISO/IEC 19794-5:2011 (35mm x 45mm, 7:9 ratio) */}
      <BiometricAvatar
        src={cred.avatarUrl}
        alt={cred.name}
        isPortrait={isPortrait}
      />

      <FrontDetailsPanel isPortrait={isPortrait}>
        <CardHeaderBar>
          <CardBrandTag>
            <span>✦</span>
            <span>AptiSpace Academy</span>
          </CardBrandTag>
          <ClearanceBadge>{cred.clearanceLevel}</ClearanceBadge>
        </CardHeaderBar>

        <CadetDetailsColumn>
          <CadetNameText>{cred.name}</CadetNameText>
          <CadetCallSignText>CALLSIGN: {cred.callSign}</CadetCallSignText>
          <CadetRoleText>
            {cred.role} • {cred.division}
          </CadetRoleText>
        </CadetDetailsColumn>

        <MetaGrid isPortrait={isPortrait}>
          <MetaItem>
            <MetaLabel>Cadet ID</MetaLabel>
            <MetaValue>{cred.id}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Standard</MetaLabel>
            <MetaValue>ISO 19794-5</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Expires</MetaLabel>
            <MetaValue>{cred.expiryDate}</MetaValue>
          </MetaItem>
        </MetaGrid>
      </FrontDetailsPanel>
    </FrontLayoutRoot>
  );
}

export function Id1CredentialLayout({
  credential,
  side = "front",
  isPortrait = false,
  className,
  testId,
}: Id1CredentialLayoutProps) {
  if (side === "back") {
    return (
      <BackCredentialView
        credential={credential}
        isPortrait={isPortrait}
        className={className}
        testId={testId}
      />
    );
  }

  return (
    <FrontCredentialView
      credential={credential}
      isPortrait={isPortrait}
      className={className}
      testId={testId}
    />
  );
}

// Backward compatibility alias
export const DefaultCredentialContent = Id1CredentialLayout;

export default Id1CredentialLayout;
