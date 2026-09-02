import { useState, useRef, useCallback, useMemo } from "react";
import type { FetcherWithComponents } from "react-router";
import type { OnboardingProfile } from "~/types/profile";
import type { SchoolConfig } from "~/types/institution";
import { validateFixedDomainEmail } from "~/utils/emailSecurity";
import {
  CADET_FIXED_DOMAIN,
  resolveDefaultProfile,
  formatEmailDomain,
  extractEmailPrefix,
  buildMrzData,
  computeMissingFields,
} from "./onboarding.helpers";

export interface UseOnboardingProfileOptions {
  initialProfile?: OnboardingProfile;
  school: SchoolConfig;
  fetcher: FetcherWithComponents<unknown>;
  userId?: number | string;
  notifyError?: (err: unknown, opts: Record<string, unknown>) => void;
}

export function useOnboardingProfile(options: UseOnboardingProfileOptions) {
  const { initialProfile, school, fetcher, userId, notifyError } = options;

  const [profile, setProfile] = useState<OnboardingProfile>(() =>
    resolveDefaultProfile(initialProfile),
  );

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const syncProfileToDb = useCallback(
    (nextProfile: OnboardingProfile) => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        const formData = new FormData();
        formData.set("actionType", "update_draft");
        formData.set("firstName", nextProfile.firstName.trim());
        formData.set("familyName", nextProfile.familyName.trim().toUpperCase());
        formData.set("email", nextProfile.email.trim());
        formData.set("schoolId", school.id);
        formData.set("avatarUrl", nextProfile.avatarUrl || "");
        fetcher.submit(formData, { method: "post" });
      }, 500);
    },
    [fetcher, school.id],
  );

  const emailDomain = school.emailDomain || CADET_FIXED_DOMAIN;
  const formattedEmailDomain = formatEmailDomain(emailDomain);
  const emailPrefix = useMemo(
    () => extractEmailPrefix(profile.email),
    [profile.email],
  );

  const mrzData = useMemo(
    () =>
      buildMrzData(school.id, userId, profile.firstName, profile.familyName),
    [school.id, userId, profile.familyName, profile.firstName],
  );

  const handleCardFieldChange = useCallback(
    (field: string, value: string) => {
      setProfile((prev) => {
        const next = { ...prev };
        if (field === "firstName") {
          next.firstName = value;
        } else if (field === "familyName") {
          next.familyName = value.toUpperCase();
        } else if (field === "emailPrefix") {
          const cleanPrefix = value.trim();
          const cleanDomain = emailDomain.replace(/^@+/, "");
          next.email = cleanPrefix ? `${cleanPrefix}@${cleanDomain}` : "";
        }
        syncProfileToDb(next);
        return next;
      });
    },
    [emailDomain, syncProfileToDb],
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    try {
      const res = await fetch("/api/avatar/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = (await res.json()) as { url?: string };
        if (data.url) {
          const next = { ...profile, avatarUrl: data.url };
          setProfile(next);
          syncProfileToDb(next);
        }
      }
    } catch (err) {
      notifyError?.(err, { source: "avatar.upload" });
    }
  };

  return {
    profile,
    setProfile,
    emailDomain,
    formattedEmailDomain,
    emailPrefix,
    mrzData,
    handleCardFieldChange,
    fileInputRef,
    handleAvatarEditClick,
    handleAvatarFileChange,
  };
}

export function useOnboardingValidation(
  profile: OnboardingProfile,
  emailDomain: string,
  t: (key: string, opts?: Record<string, unknown>) => string,
) {
  const isFirstNameFilled = profile.firstName.trim().length > 0;
  const isFamilyNameFilled = profile.familyName.trim().length > 0;
  const emailValidation = useMemo(
    () =>
      validateFixedDomainEmail(
        profile.email,
        emailDomain || CADET_FIXED_DOMAIN,
      ),
    [profile.email, emailDomain],
  );
  const isEmailFilled = emailValidation.isValid;
  const isFormComplete =
    isFirstNameFilled && isFamilyNameFilled && isEmailFilled;

  const missingFieldsList = useMemo(
    () =>
      computeMissingFields(
        isFirstNameFilled,
        isFamilyNameFilled,
        isEmailFilled,
      ),
    [isFirstNameFilled, isFamilyNameFilled, isEmailFilled],
  );

  const fabTooltipText = useMemo(() => {
    if (isFormComplete) {
      return t("onboarding:requirements.tooltipReady", {
        defaultValue:
          "All required fields valid! Click to issue your official ID-1 credential.",
      });
    }
    const missingNames = missingFieldsList
      .map((key) => t(`onboarding:requirements.${key}`))
      .join(", ");
    return t("onboarding:requirements.tooltipIncomplete", {
      defaultValue:
        "Please fill in {{missing}} directly on the card to enable validation.",
      missing: missingNames,
    });
  }, [isFormComplete, missingFieldsList, t]);

  return {
    isFirstNameFilled,
    isFamilyNameFilled,
    isEmailFilled,
    isFormComplete,
    missingFieldsCount: missingFieldsList.length,
    fabTooltipText,
  };
}

export function useOnboardingSubmit(
  isFormComplete: boolean,
  profile: OnboardingProfile,
  schoolId: string,
  fetcher: FetcherWithComponents<unknown>,
) {
  return useCallback(() => {
    if (!isFormComplete) return;

    const formData = new FormData();
    formData.set("actionType", "validate_credential");
    formData.set("firstName", profile.firstName.trim());
    formData.set("familyName", profile.familyName.trim().toUpperCase());
    formData.set("email", profile.email.trim());
    formData.set("schoolId", schoolId);
    formData.set("avatarUrl", profile.avatarUrl || "");

    fetcher.submit(formData, { method: "post" });
  }, [fetcher, isFormComplete, profile, schoolId]);
}

export function resolveOnboardingRole(
  role?: string,
): "student" | "instructor" | "admin" {
  if (role === "instructor" || role === "admin") return role;
  return "student";
}
