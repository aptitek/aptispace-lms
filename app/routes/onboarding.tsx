import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useLoaderData,
  useFetcher,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import OnboardingCard from "~/components/organisms/OnboardingCard/OnboardingCard";
import type {
  CohortConfig,
  OnboardingProfile,
} from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import { validateFixedDomainEmail } from "~/utils/emailSecurity";
import { logout } from "~/utils/auth";
import { useStatusCenter } from "~/utils/statusCenterContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SyncIcon from "@mui/icons-material/Sync";
import {
  CardWorkspaceContainer,
  FabDockPanel,
  RequirementsList,
  RequirementPill,
  M3ExtendedFab,
} from "./onboarding.styles";
import {
  CADET_FIXED_DOMAIN,
  AVAILABLE_SCHOOLS,
  resolveDefaultProfile,
  computeMissingFields,
} from "./onboarding.helpers";
import {
  handleOnboardingAction,
  handleOnboardingLoader,
} from "./onboarding.helpers.server";

export { CADET_FIXED_DOMAIN, AVAILABLE_SCHOOLS };

export async function loader({ request, context }: LoaderFunctionArgs) {
  return handleOnboardingLoader(request, context);
}

export async function action({ request, context }: ActionFunctionArgs) {
  return handleOnboardingAction(request, context);
}

export function meta() {
  return [
    { title: "AptiSpace LMS • Student Onboarding" },
    {
      name: "description",
      content:
        "Configure your ISO/IEC 7810 ID-1 official identification card and begin your learning journey.",
    },
  ];
}

interface RequirementsDockProps {
  isFirstNameFilled: boolean;
  isFamilyNameFilled: boolean;
  isEmailFilled: boolean;
  isFormComplete: boolean;
  missingFieldsCount: number;
  isSaving: boolean;
  fabTooltipText: string;
  onValidate: () => void;
}

function RequirementsDock({
  isFirstNameFilled,
  isFamilyNameFilled,
  isEmailFilled,
  isFormComplete,
  missingFieldsCount,
  isSaving,
  fabTooltipText,
  onValidate,
}: RequirementsDockProps) {
  const { t } = useTranslation("onboarding");

  return (
    <FabDockPanel>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="overline"
          sx={{
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "primary.light",
            display: "block",
            mb: 0.5,
          }}
        >
          {t("requirements.title", "Complete to Continue")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t(
            "requirements.subtitle",
            "Fill in your name on the card to continue to the academy.",
          )}
        </Typography>
      </Box>

      <RequirementsList>
        <RequirementPill isComplete={isFirstNameFilled}>
          <span>{t("requirements.firstName", "First Name")}</span>
          {isFirstNameFilled ? (
            <CheckCircleIcon sx={{ fontSize: 16 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
          )}
        </RequirementPill>

        <RequirementPill isComplete={isFamilyNameFilled}>
          <span>{t("requirements.familyName", "Family Name")}</span>
          {isFamilyNameFilled ? (
            <CheckCircleIcon sx={{ fontSize: 16 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
          )}
        </RequirementPill>

        <RequirementPill isComplete={isEmailFilled}>
          <span>{t("requirements.email", "Institutional Email")}</span>
          {isEmailFilled ? (
            <CheckCircleIcon sx={{ fontSize: 16 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
          )}
        </RequirementPill>
      </RequirementsList>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          mt: 0.5,
        }}
      >
        <Chip
          label={
            isFormComplete
              ? t("requirements.readyChip", "✓ Ready to Continue")
              : t("requirements.progressChip", "{{completed}} / 3 Completed", {
                  completed: 3 - missingFieldsCount,
                })
          }
          size="small"
          color={isFormComplete ? "success" : "default"}
          variant={isFormComplete ? "filled" : "outlined"}
          sx={{ fontWeight: 700, fontSize: "0.75rem" }}
        />

        {isSaving ? (
          <Chip
            icon={
              <SyncIcon
                sx={{ fontSize: 14, animation: "spin 1s linear infinite" }}
              />
            }
            label={t("requirements.saving", "Saving...")}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
        ) : null}
      </Box>

      <Tooltip title={fabTooltipText} arrow placement="top">
        <Box sx={{ width: "100%", mt: 1 }}>
          <M3ExtendedFab
            isReady={isFormComplete}
            disabled={!isFormComplete}
            onClick={onValidate}
            data-testid="m3-validation-fab"
            fullWidth
          >
            <span>{t("form.submit", "Complete & Continue")}</span>
            <ArrowForwardRoundedIcon
              sx={{
                fontSize: 26,
                ml: 0.5,
                transition: "transform 0.25s cubic-bezier(0.2, 0, 0, 1)",
                "button:hover &": {
                  transform: "translateX(4px)",
                },
              }}
            />
          </M3ExtendedFab>
        </Box>
      </Tooltip>
    </FabDockPanel>
  );
}

interface FetcherActionPayload {
  success?: boolean;
  redirect?: string;
  draftSaved?: boolean;
  error?: string;
  errorCode?: string;
  code?: string;
}

function processFetcherFeedback(
  payload: FetcherActionPayload | undefined,
  notifyError: (err: unknown, opts: Record<string, unknown>) => void,
  t: (key: string, opts?: Record<string, unknown>) => string,
) {
  if (!payload) return;

  if (payload.success && payload.redirect) {
    window.location.href = payload.redirect;
    return;
  }

  const errCode = payload.errorCode || payload.code;
  if (payload.error || errCode) {
    const code = errCode || "DATABASE_ERROR";
    const translatedMessage = t(`errors:${code}`, {
      defaultValue: payload.error || t("errors:unexpected"),
    });

    notifyError(new Error(translatedMessage), {
      title: t("errors:errorTitle", {
        defaultValue: "System Diagnostic Alert",
      }),
      message: translatedMessage,
      errorCode: code,
      source: "onboarding.action",
    });
  }
}

export default function OnboardingPage() {
  const { t } = useTranslation(["onboarding", "meta", "errors"]);
  const { notifyError } = useStatusCenter();
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const selectedSchool = loaderData?.school ?? AVAILABLE_SCHOOLS[0];

  const selectedCohort = useMemo<CohortConfig>(
    () => ({
      id: "cohort-2026",
      name: t("card.defaultCohort", "Cohort 2026", { year: 2026 }),
      description: t(
        "card.defaultCohortDescription",
        "Academic training and course cohort.",
      ),
    }),
    [t],
  );

  const [profile, setProfile] = useState<OnboardingProfile>(() =>
    resolveDefaultProfile(loaderData?.profile),
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = t(
        "meta:onboarding.title",
        "AptiSpace LMS • Student Onboarding",
      );
    }
  }, [t]);

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
        formData.set("schoolId", selectedSchool.id);
        formData.set("avatarUrl", nextProfile.avatarUrl || "");
        fetcher.submit(formData, { method: "post" });
      }, 500);
    },
    [fetcher, selectedSchool.id],
  );

  const handleProfileChange = useCallback(
    (nextProfile: OnboardingProfile) => {
      setProfile(nextProfile);
      syncProfileToDb(nextProfile);
    },
    [syncProfileToDb],
  );

  const isFirstNameFilled = profile.firstName.trim().length > 0;
  const isFamilyNameFilled = profile.familyName.trim().length > 0;
  const emailValidation = useMemo(
    () =>
      validateFixedDomainEmail(
        profile.email,
        selectedSchool.emailDomain || CADET_FIXED_DOMAIN,
      ),
    [profile.email, selectedSchool.emailDomain],
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
      return t(
        "onboarding:requirements.tooltipReady",
        "All required fields valid! Click to issue your official ID-1 credential.",
      );
    }
    const missingNames = missingFieldsList
      .map((key) => t(`onboarding:requirements.${key}`))
      .join(", ");
    return t(
      "onboarding:requirements.tooltipIncomplete",
      "Please fill in {{missing}} directly on the card to enable validation.",
      { missing: missingNames },
    );
  }, [isFormComplete, missingFieldsList, t]);

  useEffect(() => {
    processFetcherFeedback(
      fetcher.data as FetcherActionPayload | undefined,
      notifyError,
      t,
    );
  }, [fetcher.data, notifyError, t]);

  const handleValidateAndSubmit = () => {
    if (!isFormComplete) return;

    const formData = new FormData();
    formData.set("actionType", "validate_credential");
    formData.set("firstName", profile.firstName.trim());
    formData.set("familyName", profile.familyName.trim().toUpperCase());
    formData.set("email", profile.email.trim());
    formData.set("schoolId", selectedSchool.id);
    formData.set("avatarUrl", profile.avatarUrl || "");

    fetcher.submit(formData, { method: "post" });
  };

  const handleLogout = () => {
    void logout();
  };

  return (
    <AuthLayout
      headerMode="full"
      user={loaderData.user}
      onLogout={handleLogout}
      showGalaxy={false}
    >
      <CardWorkspaceContainer>
        <OnboardingCard
          school={selectedSchool}
          cohort={selectedCohort}
          profile={profile}
          onProfileChange={handleProfileChange}
          orientation="landscape"
          size="lg"
          flipOnClick={true}
          showGlare={false}
          transparent={true}
          holoVariant="rainbow"
        />

        <RequirementsDock
          isFirstNameFilled={isFirstNameFilled}
          isFamilyNameFilled={isFamilyNameFilled}
          isEmailFilled={isEmailFilled}
          isFormComplete={isFormComplete}
          missingFieldsCount={missingFieldsList.length}
          isSaving={fetcher.state !== "idle"}
          fabTooltipText={fabTooltipText}
          onValidate={handleValidateAndSubmit}
        />
      </CardWorkspaceContainer>
    </AuthLayout>
  );
}
