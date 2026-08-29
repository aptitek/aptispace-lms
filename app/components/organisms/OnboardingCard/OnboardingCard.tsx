import { useState, useMemo, useEffect, forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import { SOLARIZED_BASE } from "../../../tokens/theme";
import IdCard from "../../molecules/IdCard/IdCard";
import EditableAvatar from "../../molecules/EditableAvatar/EditableAvatar";
import EmailField from "../../molecules/EmailField/EmailField";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";
import type {
  OnboardingCardProps,
  OnboardingProfile,
  OnboardingHoloVariant,
  SchoolConfig,
} from "./OnboardingCard.types";
import {
  formatInstitutionalEmail,
  buildTd1MrzData,
} from "./OnboardingCard.utils";
import {
  CardFrontContainer,
  SchoolHeaderRow,
  SchoolBrandingHolder,
  SchoolLogoImg,
  SchoolFallbackText,
  CohortBadge,
  CardMainBody,
  AvatarCol,
  FieldsCol,
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

  return (
    <CardFrontContainer data-testid="onboarding-card-front">
      <SchoolHeaderRow>
        <SchoolBrandingHolder>
          {school.logoUrl ? (
            <SchoolLogoImg
              src={school.logoUrl}
              alt={`${schoolName} Logo`}
              data-testid="school-logo-img"
            />
          ) : (
            <SchoolFallbackText data-testid="school-logo-fallback">
              {schoolName}
            </SchoolFallbackText>
          )}
        </SchoolBrandingHolder>

        <CohortBadge data-testid="cohort-badge">
          <Chip
            label={cohortName}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.68rem",
              fontWeight: 700,
              borderRadius: "6px",
              bgcolor: alpha(SOLARIZED_BASE.base03, 0.4),
              border: `1px solid ${alpha(SOLARIZED_BASE.base3, 0.2)}`,
              color: "text.primary",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </CohortBadge>
      </SchoolHeaderRow>

      <CardMainBody>
        <AvatarCol>
          <EditableAvatar
            value={profile.avatarUrl}
            defaultValue={DEFAULT_PROFILE_TEMPLATE.avatarUrl}
            name={`${profile.firstName} ${profile.familyName}`}
            onChange={onAvatarChange}
            shape="biometric"
            size="lg"
            editable={!readOnly}
            mode="image-only"
            testId="card-editable-avatar"
          />
        </AvatarCol>

        <FieldsCol>
          <TextField
            id="card-field-firstname"
            label="First Name"
            value={profile.firstName}
            disabled={readOnly}
            placeholder="First name"
            size="small"
            variant="filled"
            onChange={(e) => onFirstNameChange(e.target.value)}
            slotProps={{ htmlInput: { "data-testid": "input-firstname" } }}
            fullWidth
          />

          <TextField
            id="card-field-familyname"
            label="Family Name"
            value={profile.familyName}
            disabled={readOnly}
            placeholder="Family name"
            size="small"
            variant="filled"
            onChange={(e) => onFamilyNameChange(e.target.value)}
            slotProps={{ htmlInput: { "data-testid": "input-familyname" } }}
            fullWidth
          />

          <EmailField
            id="card-field-email"
            label="Institutional Email"
            domain={schoolDomain}
            value={profile.email}
            disabled={readOnly}
            size="small"
            variant="filled"
            showDomainLock={true}
            placeholder="username"
            onEmailChange={onEmailChange}
            testId="input-email"
          />
        </FieldsCol>
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

        <BackRightContentCol>
          <Box
            component="img"
            src="/aptispace-logo.svg"
            alt="AptiSpace Logo"
            sx={{
              height: "30px",
              maxWidth: "140px",
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))",
            }}
            data-testid="holo-aptispace-logo"
          />

          <Typography
            variant="caption"
            sx={{
              fontSize: "0.58rem",
              fontWeight: 800,
              letterSpacing: "1.2px",
              color: "primary.light",
              textTransform: "uppercase",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.6)",
            }}
          >
            ISO/IEC 7810 ID-1 • EMV COMPLIANT
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontSize: "0.52rem",
              color: "text.secondary",
              letterSpacing: "0.5px",
            }}
          >
            AUTH SEC CODE: {profile.documentNumber || "0942"} • CLEARANCE
            CERTIFIED
          </Typography>
        </BackRightContentCol>
      </BackMainArea>

      <FullWidthMrzHolder>
        <MrzZone
          cardData={mrzData}
          compact={true}
          darkOnLight={true}
          fullWidth={true}
          testId="full-width-mrz-zone"
        />
      </FullWidthMrzHolder>
    </CardBackContainer>
  );
}

export const OnboardingCard = forwardRef<HTMLDivElement, OnboardingCardProps>(
  (props, ref) => {
    const {
      school,
      cohort,
      profile: controlledProfile,
      defaultProfile,
      onProfileChange,
      side = "front",
      isFlipped: controlledFlipped,
      onFlip,
      onFlipChange,
      flipOnClick = false,
      orientation = "landscape",
      size = "responsive",
      holoVariant = "rainbow",
      transparent = true,
      readOnly = false,
      className,
      testId = "onboarding-card",
    } = props;

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
        holographic={true}
        holoStrength={0.85}
        showElectronics={true}
        chipPosition="left"
        electronicsFinish="gold"
        showChip={true}
        frontChipView="none"
        backChipView="front"
        backElectronicsRotation={180}
        showNfcAntenna={true}
        showInnerCoil={true}
        className={className}
        testId={testId}
        frontContent={
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
        }
        backContent={<CardBackFace school={school} profile={activeProfile} />}
      />
    );
  },
);

OnboardingCard.displayName = "OnboardingCard";

export default OnboardingCard;
