import { useState, useMemo, useEffect, forwardRef } from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import IdCard from "../../molecules/IdCard/IdCard";
import EditableAvatar from "../../molecules/EditableAvatar/EditableAvatar";
import EmailField from "../../molecules/EmailField/EmailField";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import aptispaceLogoRaw from "../../../../public/aptispace-logo.svg?raw";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";
import type { IdHoloLayer } from "../../molecules/IdCard/IdCard.types";
import type {
  OnboardingCardProps,
  OnboardingProfile,
  OnboardingHoloVariant,
  SchoolConfig,
} from "./OnboardingCard.types";
import {
  formatInstitutionalEmail,
  buildTd1MrzData,
  calculateCohortValidity,
} from "./OnboardingCard.utils";
import {
  CardFrontContainer,
  SchoolHeaderRow,
  SchoolBrandingHolder,
  SchoolFallbackText,
  CohortValidityContainer,
  CardMainBody,
  AvatarCol,
  FieldsList,
  FieldListItem,
  CardBackContainer,
  BackMainArea,
  BackLeftContactCol,
  BackRightContentCol,
  FullWidthMrzHolder,
} from "./OnboardingCard.styles";

const DEFAULT_PROFILE_TEMPLATE: OnboardingProfile = {
  firstName: "Alex",
  familyName: "Mercer",
  email: "alex.mercer@cadet.aptispace.io",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  documentNumber: "0942",
  callSign: "AETH-9042",
  clearanceLevel: "LEVEL-4 OMNI",
  division: "Orbital Flight Dynamics",
};

function resolveGuillocheVariant(
  variant?: OnboardingHoloVariant,
): GuillocheVariant {
  if (variant === "gold") return "solarized-gold";
  if (variant === "cosmic") return "cosmic-crimson";
  return "holo-spectrum";
}

function resolveGuillocheSeed(school: SchoolConfig): string {
  return school.id || school.name || school.slug || "APTISPACE-SCHOOL";
}

function createInitialProfile(
  controlled?: OnboardingProfile,
  defaultProfile?: OnboardingProfile,
  school?: SchoolConfig,
): OnboardingProfile {
  const base = controlled || defaultProfile || DEFAULT_PROFILE_TEMPLATE;
  if (!base.email && school) {
    return {
      ...base,
      email: formatInstitutionalEmail(base.firstName, base.familyName, school),
    };
  }
  return base;
}

interface UseProfileStateParams {
  school: SchoolConfig;
  controlledProfile?: OnboardingProfile;
  defaultProfile?: OnboardingProfile;
  onProfileChange?: (profile: OnboardingProfile) => void;
}

function useOnboardingProfileState({
  school,
  controlledProfile,
  defaultProfile,
  onProfileChange,
}: UseProfileStateParams) {
  const [internalProfile, setInternalProfile] = useState<OnboardingProfile>(
    () => createInitialProfile(controlledProfile, defaultProfile, school),
  );
  const [isEmailCustomized, setIsEmailCustomized] = useState<boolean>(false);

  const activeProfile = controlledProfile || internalProfile;

  const handleUpdate = (patch: Partial<OnboardingProfile>) => {
    const next: OnboardingProfile = { ...activeProfile, ...patch };
    if (!controlledProfile) {
      setInternalProfile(next);
    }
    onProfileChange?.(next);
  };

  const handleFirstNameChange = (firstName: string) => {
    const patch: Partial<OnboardingProfile> = { firstName };
    if (!isEmailCustomized) {
      patch.email = formatInstitutionalEmail(
        firstName,
        activeProfile.familyName,
        school,
      );
    }
    handleUpdate(patch);
  };

  const handleFamilyNameChange = (familyName: string) => {
    const patch: Partial<OnboardingProfile> = { familyName };
    if (!isEmailCustomized) {
      patch.email = formatInstitutionalEmail(
        activeProfile.firstName,
        familyName,
        school,
      );
    }
    handleUpdate(patch);
  };

  const handleEmailChange = (email: string) => {
    setIsEmailCustomized(true);
    handleUpdate({ email });
  };

  const handleAvatarChange = (avatarUrl: string) => {
    handleUpdate({ avatarUrl });
  };

  useEffect(() => {
    if (!isEmailCustomized) {
      const computed = formatInstitutionalEmail(
        activeProfile.firstName,
        activeProfile.familyName,
        school,
      );
      if (computed !== activeProfile.email) {
        const next: OnboardingProfile = { ...activeProfile, email: computed };
        if (!controlledProfile) {
          setInternalProfile(next);
        }
        onProfileChange?.(next);
      }
    }
  }, [
    school,
    isEmailCustomized,
    activeProfile,
    controlledProfile,
    onProfileChange,
  ]);

  return {
    activeProfile,
    handleFirstNameChange,
    handleFamilyNameChange,
    handleEmailChange,
    handleAvatarChange,
  };
}

interface FrontFaceProps {
  school: OnboardingCardProps["school"];
  cohort?: OnboardingCardProps["cohort"];
  profile: OnboardingProfile;
  readOnly?: boolean;
  onFirstNameChange: (nextValue: string) => void;
  onFamilyNameChange: (nextValue: string) => void;
  onEmailChange: (nextValue: string) => void;
  onAvatarChange: (nextValue: string) => void;
}

function CardFrontFace({
  school,
  cohort,
  profile,
  readOnly,
  onFirstNameChange,
  onFamilyNameChange,
  onEmailChange,
  onAvatarChange,
}: FrontFaceProps) {
  const schoolName = school.name || "AptiSpace Academy";
  const cohortName = cohort?.name || "Cadet Cohort 2026";
  const schoolDomain = school.emailDomain || "cadet.aptispace.io";
  const validity = useMemo(() => calculateCohortValidity(cohort), [cohort]);

  return (
    <CardFrontContainer data-testid="onboarding-card-front">
      <SchoolHeaderRow>
        <SchoolBrandingHolder>
          {!school.logoUrl && (
            <SchoolFallbackText data-testid="school-logo-fallback">
              {schoolName}
            </SchoolFallbackText>
          )}
        </SchoolBrandingHolder>

        <CohortValidityContainer data-testid="cohort-badge">
          <Chip
            label={cohortName}
            size="small"
            color="primary"
            variant="outlined"
            data-testid="cohort-chip"
          />
          <Chip
            label={validity.formatted}
            size="small"
            variant="outlined"
            sx={{
              color: "text.secondary",
              borderColor: "divider",
              fontSize: "0.7rem",
            }}
            data-testid="validity-badge"
          />
        </CohortValidityContainer>
      </SchoolHeaderRow>

      <CardMainBody>
        <AvatarCol>
          <EditableAvatar
            value={profile.avatarUrl}
            defaultValue={DEFAULT_PROFILE_TEMPLATE.avatarUrl}
            name={`${profile.firstName} ${profile.familyName}`}
            onChange={onAvatarChange}
            shape="biometric"
            size="xl"
            editable={!readOnly}
            mode="image-only"
            testId="card-editable-avatar"
          />
        </AvatarCol>

        <FieldsList disablePadding>
          <FieldListItem disableGutters disablePadding>
            <TextField
              id="card-field-firstname"
              label="First Name"
              value={profile.firstName}
              disabled={readOnly}
              placeholder="First name"
              size="small"
              variant="outlined"
              onChange={(e) => onFirstNameChange(e.target.value)}
              slotProps={{ htmlInput: { "data-testid": "input-firstname" } }}
              fullWidth
            />
          </FieldListItem>

          <FieldListItem disableGutters disablePadding>
            <TextField
              id="card-field-familyname"
              label="Family Name"
              value={profile.familyName}
              disabled={readOnly}
              placeholder="Family name"
              size="small"
              variant="outlined"
              onChange={(e) => onFamilyNameChange(e.target.value)}
              slotProps={{ htmlInput: { "data-testid": "input-familyname" } }}
              fullWidth
            />
          </FieldListItem>

          <FieldListItem disableGutters disablePadding>
            <EmailField
              id="card-field-email"
              label="Institutional Email"
              domain={schoolDomain}
              value={profile.email}
              disabled={readOnly}
              size="small"
              variant="outlined"
              showDomainLock={true}
              placeholder="username"
              onEmailChange={onEmailChange}
              testId="input-email"
            />
          </FieldListItem>
        </FieldsList>
      </CardMainBody>
    </CardFrontContainer>
  );
}

interface BackFaceProps {
  school: OnboardingCardProps["school"];
  profile: OnboardingProfile;
}

function CardBackFace({ school, profile }: BackFaceProps) {
  const mrzData = useMemo(() => {
    return buildTd1MrzData(profile, school);
  }, [profile, school]);

  return (
    <CardBackContainer data-testid="onboarding-card-back">
      <BackMainArea>
        <BackLeftContactCol aria-hidden="true" />
        <BackRightContentCol />
      </BackMainArea>

      <FullWidthMrzHolder>
        <MrzZone
          cardData={mrzData}
          compact={false}
          darkOnLight={true}
          fullWidth={true}
          testId="full-width-mrz-zone"
        />
      </FullWidthMrzHolder>
    </CardBackContainer>
  );
}

function buildHoloLayers(
  schoolLogoUrl?: string | null,
  customHoloLayers?: (string | IdHoloLayer)[],
): IdHoloLayer[] {
  const layers: IdHoloLayer[] = [];

  if (schoolLogoUrl) {
    layers.push({
      id: "school-holo-logo",
      src: schoolLogoUrl,
      side: "front",
      left: "3%",
      top: "8%",
      width: "28%",
      height: "9%",
      objectFit: "contain",
      blendMode: "normal",
      opacity: 0.7,
      holographic: true,
    });
  }

  layers.push({
    id: "aptispace-holo-logo",
    src: aptispaceLogoRaw,
    side: "back",
    left: "15%",
    top: "10%",
    width: "70%",
    height: "28%",
    objectFit: "contain",
    blendMode: "normal",
    opacity: 0.7,
    holographic: true,
  });

  if (customHoloLayers && Array.isArray(customHoloLayers)) {
    customHoloLayers.forEach((layerItem, idx) => {
      if (typeof layerItem === "string") {
        layers.push({
          id: `custom-holo-${idx}`,
          src: layerItem,
          holographic: true,
        });
      } else {
        layers.push(layerItem);
      }
    });
  }

  return layers;
}

const DEFAULT_ONBOARDING_PROPS = {
  side: "front" as const,
  flipOnClick: false,
  orientation: "landscape" as const,
  size: "responsive" as const,
  holoVariant: "rainbow" as const,
  holoStrength: 0.85,
  showGuilloche: true,
  transparent: true,
  readOnly: false,
  testId: "onboarding-card",
};

export const OnboardingCard = forwardRef<HTMLDivElement, OnboardingCardProps>(
  (props, ref) => {
    const conf = { ...DEFAULT_ONBOARDING_PROPS, ...props };
    const {
      school,
      cohort,
      profile: controlledProfile,
      defaultProfile,
      onProfileChange,
      side,
      isFlipped: controlledFlipped,
      onFlip,
      onFlipChange,
      flipOnClick,
      orientation,
      size,
      holoVariant,
      holoStrength,
      holoLayers: customHoloLayers,
      showGuilloche,
      transparent,
      readOnly,
      className,
      testId,
    } = conf;

    const {
      activeProfile,
      handleFirstNameChange,
      handleFamilyNameChange,
      handleEmailChange,
      handleAvatarChange,
    } = useOnboardingProfileState({
      school,
      controlledProfile,
      defaultProfile,
      onProfileChange,
    });

    const guillocheSeed = resolveGuillocheSeed(school);
    const guillocheVariant = resolveGuillocheVariant(holoVariant);

    const mergedHoloLayers = useMemo(
      () => buildHoloLayers(school.logoUrl, customHoloLayers),
      [school.logoUrl, customHoloLayers],
    );

    const frontContentNode = (
      <CardFrontFace
        school={school}
        cohort={cohort}
        profile={activeProfile}
        readOnly={readOnly}
        onFirstNameChange={handleFirstNameChange}
        onFamilyNameChange={handleFamilyNameChange}
        onEmailChange={handleEmailChange}
        onAvatarChange={handleAvatarChange}
      />
    );

    const backContentNode = (
      <CardBackFace school={school} profile={activeProfile} />
    );

    return (
      <IdCard
        ref={ref}
        side={side}
        isFlipped={controlledFlipped}
        onFlip={onFlip}
        onFlipChange={onFlipChange}
        flipOnClick={flipOnClick}
        orientation={orientation}
        size={size}
        transparent={transparent}
        guillocheSeed={guillocheSeed}
        guillocheVariant={guillocheVariant}
        showGuilloche={showGuilloche}
        holographic={true}
        holoStrength={holoStrength}
        holoLayers={mergedHoloLayers}
        showElectronics={true}
        chipPosition="left"
        electronicsFinish="gold"
        showChip={true}
        frontChipView="none"
        backChipView="front"
        showNfcAntenna={true}
        showInnerCoil={true}
        className={className}
        testId={testId}
        frontContent={frontContentNode}
        backContent={backContentNode}
        renderGhostContent={(ghostSide) =>
          ghostSide === "front" ? frontContentNode : backContentNode
        }
      />
    );
  },
);

OnboardingCard.displayName = "OnboardingCard";

export default OnboardingCard;
