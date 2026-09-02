import { useEffect, useMemo } from "react";
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
import Chip from "~/components/atoms/Chip/Chip";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import ProfileCard from "~/components/organisms/ProfileCard/ProfileCard";
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
import { CADET_FIXED_DOMAIN, AVAILABLE_SCHOOLS } from "./onboarding.helpers";
import type { SchoolConfig } from "~/types/institution";
import {
  useOnboardingProfile,
  useOnboardingValidation,
  useOnboardingSubmit,
  resolveOnboardingRole,
} from "./onboarding.hooks";
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

function resolveOnboardingCardProps(
  school: SchoolConfig,
  profileRole?: string,
  profileGithub?: string,
  userGithub?: string,
) {
  return {
    role: resolveOnboardingRole(profileRole),
    githubUsername: profileGithub || userGithub,
    logoUrl: school.logoUrl || undefined,
    usernamePattern: school.usernamePattern || school.emailPattern,
  };
}

export default function OnboardingPage() {
  const { t } = useTranslation(["onboarding", "meta", "errors"]);
  const { notifyError } = useStatusCenter();
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const selectedSchool = loaderData.school;

  const {
    profile,
    emailDomain,
    formattedEmailDomain,
    emailPrefix,
    mrzData,
    handleCardFieldChange,
    handleAvatarChange,
  } = useOnboardingProfile({
    initialProfile: loaderData?.profile,
    school: selectedSchool,
    fetcher,
    userId: loaderData?.user?.id,
    notifyError,
  });

  const {
    isFirstNameFilled,
    isFamilyNameFilled,
    isEmailFilled,
    isFormComplete,
    missingFieldsCount,
    fabTooltipText,
  } = useOnboardingValidation(profile, emailDomain, t);

  useEffect(() => {
    processFetcherFeedback(
      fetcher.data as FetcherActionPayload | undefined,
      notifyError,
      t,
    );
  }, [fetcher.data, notifyError, t]);

  const handleValidateAndSubmit = useOnboardingSubmit(
    isFormComplete,
    profile,
    selectedSchool.id,
    fetcher,
  );

  const handleLogout = () => {
    void logout();
  };

  const cardProps = resolveOnboardingCardProps(
    selectedSchool,
    profile.role,
    profile.githubUsername,
    loaderData?.user?.githubUsername,
  );

  const isUserAdmin = cardProps.role === "admin";

  const activeCohort = useMemo(() => {
    if (isUserAdmin) return undefined;
    return (
      loaderData?.cohort || {
        diploma: "M",
        year: 1,
        tags: ["IA", "Dev"],
      }
    );
  }, [loaderData?.cohort, isUserAdmin]);

  const headerUser = useMemo(() => {
    if (!loaderData?.user) return null;
    return {
      ...loaderData.user,
      firstName: profile.firstName,
      familyName: profile.familyName,
      name:
        `${profile.firstName} ${profile.familyName}`.trim() ||
        loaderData.user.name,
      email: profile.email || loaderData.user.email,
      avatarUrl: profile.avatarUrl || loaderData.user.avatarUrl,
      role: cardProps.role,
      githubUsername: cardProps.githubUsername,
      institutionName: selectedSchool.name,
      schoolLogoUrl: cardProps.logoUrl,
      emailDomain: selectedSchool.emailDomain,
      usernamePattern: cardProps.usernamePattern,
      cohort: isUserAdmin ? undefined : activeCohort,
      cohortYear: isUserAdmin ? undefined : "2026",
    };
  }, [
    loaderData?.user,
    activeCohort,
    profile,
    selectedSchool,
    cardProps,
    isUserAdmin,
  ]);

  return (
    <AuthLayout
      headerMode="full"
      user={headerUser}
      onLogout={handleLogout}
      showGalaxy={false}
    >
      <CardWorkspaceContainer>
        <ProfileCard
          schoolLogoUrl={cardProps.logoUrl}
          institutionName={selectedSchool.name}
          cohort={isUserAdmin ? undefined : activeCohort}
          year={isUserAdmin ? undefined : "2026"}
          avatarUrl={profile.avatarUrl}
          role={cardProps.role}
          githubUsername={cardProps.githubUsername}
          firstName={profile.firstName}
          familyName={profile.familyName}
          emailPrefix={emailPrefix}
          emailDomain={formattedEmailDomain}
          usernamePattern={cardProps.usernamePattern}
          mrzData={mrzData}
          onChange={handleCardFieldChange}
          editableAvatar={true}
          onAvatarChange={handleAvatarChange}
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            width: "100%",
            maxWidth: 600,
          }}
        />

        <RequirementsDock
          isFirstNameFilled={isFirstNameFilled}
          isFamilyNameFilled={isFamilyNameFilled}
          isEmailFilled={isEmailFilled}
          isFormComplete={isFormComplete}
          missingFieldsCount={missingFieldsCount}
          isSaving={fetcher.state !== "idle"}
          fabTooltipText={fabTooltipText}
          onValidate={handleValidateAndSubmit}
        />
      </CardWorkspaceContainer>
    </AuthLayout>
  );
}
