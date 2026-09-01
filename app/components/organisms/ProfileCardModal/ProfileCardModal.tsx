import { useState, useEffect, useRef, useCallback } from "react";
import OnboardingCard from "../OnboardingCard/OnboardingCard";
import { isUnnamedUser } from "../../atoms/Avatar/Avatar";
import type {
  OnboardingProfile,
  SchoolConfig,
  CohortConfig,
} from "../OnboardingCard/OnboardingCard.types";
import type {
  ProfileCardModalProps,
  ProfileSaveStatus,
} from "./ProfileCardModal.types";
import FullScreenModal from "../../molecules/FullScreenModal/FullScreenModal";
import type { AuthUser } from "../../../utils/auth";

const DEFAULT_SCHOOL: SchoolConfig = {
  id: "school-aptitek",
  name: "Aptitek",
  slug: "aptitek",
  logoUrl: "/aptitek-logo.svg",
  emailDomain: "aptitek.io",
  emailPattern: "{first}.{last}@{domain}",
};

const DEFAULT_COHORT: CohortConfig = {
  id: "cohort-2026",
  name: "Cohort 2026",
  description: "Academic training and course cohort.",
};

function userToProfile(user: AuthUser): OnboardingProfile {
  const rawName = (user.name || "").trim();
  if (isUnnamedUser(rawName)) {
    return {
      firstName: "",
      familyName: "",
      email: user.email || "",
      avatarUrl: user.avatarUrl || "",
      role: user.role,
      githubUsername: user.githubUsername,
    };
  }
  const parts = rawName.split(/\s+/).filter(Boolean);
  const firstName =
    parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] || "";
  const familyName =
    parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
  return {
    firstName,
    familyName,
    email: user.email || "",
    avatarUrl: user.avatarUrl || "",
    role: user.role,
    githubUsername: user.githubUsername,
  };
}

function isProfileIdentical(
  a: OnboardingProfile | null,
  b: OnboardingProfile,
): boolean {
  if (!a) return false;
  return (
    a.firstName === b.firstName &&
    a.familyName === b.familyName &&
    a.email === b.email &&
    a.avatarUrl === b.avatarUrl &&
    a.role === b.role &&
    a.githubUsername === b.githubUsername
  );
}

function resolveUpdatedAuthUser(
  user: AuthUser,
  savedProfile: OnboardingProfile,
  accountPayload?: AuthUser,
): AuthUser {
  if (accountPayload) return accountPayload;
  return {
    ...user,
    name: `${savedProfile.firstName} ${savedProfile.familyName}`.trim(),
    email: savedProfile.email,
    avatarUrl: savedProfile.avatarUrl,
    role: savedProfile.role ?? user.role,
    githubUsername: savedProfile.githubUsername ?? user.githubUsername,
  };
}

export function ProfileCardModal({
  isOpen,
  onClose,
  user,
  school = DEFAULT_SCHOOL,
  cohort,
  onUserUpdated,
  saveEndpoint = "/api/auth",
  className,
  testId = "profile-card-modal",
}: ProfileCardModalProps) {
  const [currentProfile, setCurrentProfile] = useState<OnboardingProfile>(() =>
    userToProfile(user),
  );
  const [, setSaveStatus] = useState<ProfileSaveStatus>("idle");
  const lastSavedProfileRef = useRef<OnboardingProfile>(userToProfile(user));
  const currentProfileRef = useRef<OnboardingProfile>(currentProfile);

  useEffect(() => {
    currentProfileRef.current = currentProfile;
  }, [currentProfile]);

  useEffect(() => {
    if (isOpen) {
      const initial = userToProfile(user);
      setCurrentProfile(initial);
      lastSavedProfileRef.current = initial;
      setSaveStatus("idle");
    }
  }, [isOpen, user]);

  const performSave = useCallback(
    async (profileToSave: OnboardingProfile) => {
      if (isProfileIdentical(lastSavedProfileRef.current, profileToSave)) {
        return;
      }

      setSaveStatus("saving");

      try {
        const response = await fetch(saveEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateProfile",
            userId: user.id,
            firstName: profileToSave.firstName,
            lastName: profileToSave.familyName,
            email: profileToSave.email,
            avatarUrl: profileToSave.avatarUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save profile changes.");
        }

        const payload = (await response.json().catch(() => ({}))) as {
          account?: AuthUser;
        };
        lastSavedProfileRef.current = { ...profileToSave };
        setSaveStatus("saved");

        if (onUserUpdated) {
          onUserUpdated(
            resolveUpdatedAuthUser(user, profileToSave, payload.account),
          );
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [saveEndpoint, user, onUserUpdated],
  );

  const handleProfileChange = (nextProfile: OnboardingProfile) => {
    setCurrentProfile(nextProfile);
  };

  const handleFieldBlur = (blurredProfile: OnboardingProfile) => {
    void performSave(blurredProfile);
  };

  const handleModalClose = () => {
    void performSave(currentProfileRef.current);
    onClose();
  };

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={handleModalClose}
      className={className}
      maxWidth={580}
      testId={testId}
    >
      <OnboardingCard
        school={school}
        cohort={cohort || DEFAULT_COHORT}
        profile={currentProfile}
        onProfileChange={handleProfileChange}
        onFieldBlur={handleFieldBlur}
        orientation="landscape"
        size="lg"
        flipOnClick={true}
        showGlare={false}
        transparent={true}
        holoVariant="rainbow"
        testId="modal-onboarding-card"
      />
    </FullScreenModal>
  );
}

export default ProfileCardModal;
