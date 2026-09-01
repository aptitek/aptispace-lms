import { useState, useMemo, useEffect, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import IdCard from "../../molecules/IdCard/IdCard";
import EditableAvatar from "../../molecules/EditableAvatar/EditableAvatar";
import EmailField from "../../molecules/EmailField/EmailField";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import RoleBadge from "../../atoms/RoleBadge/RoleBadge";
import GithubHandle from "../../atoms/GithubHandle/GithubHandle";
import type {
  OnboardingCardProps,
  OnboardingProfile,
  SchoolConfig,
  CohortConfig,
} from "./OnboardingCard.types";
import type { UserRole } from "../../../utils/auth";
import {
  formatInstitutionalEmail,
  buildTd1MrzData,
  calculateCohortValidity,
  resolveGuillocheVariant,
  resolveGuillocheSeed,
  buildHoloLayers,
  createInitialProfile,
  DEFAULT_PROFILE_TEMPLATE,
} from "./OnboardingCard.utils";
import {
  CardFrontContainer,
  SchoolHeaderRow,
  SchoolBrandingHolder,
  SchoolLogoHoloPlaceholder,
  SchoolFallbackText,
  CohortValidityContainer,
  CardMainBody,
  AvatarCol,
  AvatarWrapper,
  FloatingRoleBadgeHolder,
  AvatarGithubHandleHolder,
  FieldsList,
  FieldListItem,
  CardBackContainer,
  BackMainArea,
  BackLeftBrandingCol,
  BackRightContactCol,
  BackAptispaceLogoPlaceholder,
  FullWidthMrzHolder,
} from "./OnboardingCard.styles";

export { buildHoloLayers };

interface UseProfileStateParams {
  school: SchoolConfig;
  controlledProfile?: OnboardingProfile;
  defaultProfile?: OnboardingProfile;
  role?: UserRole;
  githubUsername?: string;
  onProfileChange?: (profile: OnboardingProfile) => void;
}

function useOnboardingProfileState({
  school,
  controlledProfile,
  defaultProfile,
  role,
  githubUsername,
  onProfileChange,
}: UseProfileStateParams) {
  const mergedControlled = useMemo(() => {
    if (!controlledProfile) return undefined;
    return {
      ...controlledProfile,
      role: role ?? controlledProfile.role ?? "student",
      githubUsername: githubUsername ?? controlledProfile.githubUsername,
    };
  }, [controlledProfile, role, githubUsername]);

  const [internalProfile, setInternalProfile] = useState<OnboardingProfile>(
    () => {
      const initial = createInitialProfile(
        controlledProfile,
        defaultProfile,
        school,
      );
      return {
        ...initial,
        role: role ?? initial.role ?? "student",
        githubUsername: githubUsername ?? initial.githubUsername,
      };
    },
  );
  const [isEmailCustomized, setIsEmailCustomized] = useState<boolean>(false);

  const activeProfile = mergedControlled || internalProfile;

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
    const upperFamilyName = familyName.toUpperCase();
    const patch: Partial<OnboardingProfile> = { familyName: upperFamilyName };
    if (!isEmailCustomized) {
      patch.email = formatInstitutionalEmail(
        activeProfile.firstName,
        upperFamilyName,
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
  school: SchoolConfig;
  cohort?: CohortConfig;
  profile: OnboardingProfile;
  readOnly?: boolean;
  onFirstNameChange: (nextValue: string) => void;
  onFamilyNameChange: (nextValue: string) => void;
  onEmailChange: (nextValue: string) => void;
  onAvatarChange: (nextValue: string) => void;
  onFieldBlur?: () => void;
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
  onFieldBlur,
}: FrontFaceProps) {
  const { t } = useTranslation(["onboarding", "common"]);
  const schoolName = school.name || "Aptitek";
  const cohortName =
    cohort?.name || t("card.defaultCohort", "Cohort 2026", { year: 2026 });
  const schoolDomain = school.emailDomain || "aptitek.io";
  const validity = useMemo(() => calculateCohortValidity(cohort), [cohort]);

  return (
    <CardFrontContainer data-testid="onboarding-card-front">
      <SchoolHeaderRow>
        <SchoolBrandingHolder>
          {school.logoUrl ? (
            <SchoolLogoHoloPlaceholder
              role="img"
              aria-label={schoolName}
              data-testid="school-logo"
            />
          ) : (
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
        <AvatarCol onClick={(e) => e.stopPropagation()}>
          <AvatarWrapper data-testid="card-avatar-wrapper">
            <EditableAvatar
              value={profile.avatarUrl}
              defaultValue={DEFAULT_PROFILE_TEMPLATE.avatarUrl}
              name={`${profile.firstName} ${profile.familyName}`}
              onChange={(url) => {
                onAvatarChange(url);
                onFieldBlur?.();
              }}
              shape="biometric"
              size="xl"
              editable={!readOnly}
              mode="image-only"
              testId="card-editable-avatar"
            />
            <FloatingRoleBadgeHolder data-testid="card-role-badge-holder">
              <RoleBadge
                role={profile.role || "student"}
                size="small"
                variant="icon-only"
                testId="card-role-badge"
              />
            </FloatingRoleBadgeHolder>
          </AvatarWrapper>

          <AvatarGithubHandleHolder data-testid="card-github-handle-holder">
            <GithubHandle
              username={profile.githubUsername}
              size="medium"
              testId="card-github-handle"
            />
          </AvatarGithubHandleHolder>
        </AvatarCol>

        <FieldsList disablePadding onClick={(e) => e.stopPropagation()}>
          <FieldListItem disableGutters disablePadding>
            <TextField
              id="card-field-firstname"
              label={t("form.firstName", "First Name")}
              value={profile.firstName}
              disabled={readOnly}
              placeholder={t("form.firstNamePlaceholder", "First name")}
              size="small"
              variant="outlined"
              onChange={(e) => onFirstNameChange(e.target.value)}
              onBlur={onFieldBlur}
              slotProps={{ htmlInput: { "data-testid": "input-firstname" } }}
              fullWidth
            />
          </FieldListItem>

          <FieldListItem disableGutters disablePadding>
            <TextField
              id="card-field-familyname"
              label={t("form.familyName", "Family Name")}
              value={profile.familyName}
              disabled={readOnly}
              placeholder={t("form.familyNamePlaceholder", "Family name")}
              size="small"
              variant="outlined"
              onChange={(e) => onFamilyNameChange(e.target.value.toUpperCase())}
              onBlur={onFieldBlur}
              slotProps={{
                htmlInput: {
                  "data-testid": "input-familyname",
                  style: { textTransform: "uppercase" },
                },
              }}
              fullWidth
            />
          </FieldListItem>

          <FieldListItem disableGutters disablePadding>
            <EmailField
              id="card-field-email"
              label={t("form.email", "Institutional Email")}
              domain={schoolDomain}
              value={profile.email}
              disabled={readOnly}
              size="small"
              variant="outlined"
              showDomainLock={true}
              placeholder={t(
                "common:emailField.usernamePlaceholder",
                "username",
              )}
              onEmailChange={onEmailChange}
              onBlur={onFieldBlur}
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
        <BackLeftBrandingCol data-testid="card-back-branding">
          <BackAptispaceLogoPlaceholder
            role="img"
            aria-label="AptiSpace"
            data-testid="card-back-logo"
          />
        </BackLeftBrandingCol>
        <BackRightContactCol aria-hidden="true" />
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

const DEFAULT_ONBOARDING_PROPS = {
  side: "front" as const,
  flipOnClick: true,
  showGlare: false,
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
      role,
      githubUsername,
      onProfileChange,
      onFieldBlur,
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
      showGlare,
      glareOpacity,
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
      role,
      githubUsername,
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
        onFieldBlur={() => onFieldBlur?.(activeProfile)}
      />
    );

    const backContentNode = (
      <CardBackFace school={school} profile={activeProfile} />
    );

    const ghostFrontNode = (
      <CardFrontFace
        school={school}
        cohort={cohort}
        profile={activeProfile}
        readOnly={true}
        onFirstNameChange={() => {}}
        onFamilyNameChange={() => {}}
        onEmailChange={() => {}}
        onAvatarChange={() => {}}
      />
    );

    const ghostBackNode = (
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
        showGlare={showGlare ?? false}
        glareOpacity={glareOpacity}
        guillocheSeed={guillocheSeed}
        guillocheVariant={guillocheVariant}
        showGuilloche={showGuilloche}
        holographic={true}
        holoStrength={holoStrength}
        holoVariant={holoVariant}
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
          ghostSide === "front" ? ghostFrontNode : ghostBackNode
        }
      />
    );
  },
);

OnboardingCard.displayName = "OnboardingCard";

export default OnboardingCard;
