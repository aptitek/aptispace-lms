import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useNavigate,
  useLoaderData,
  useFetcher,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import OnboardingCard from "~/components/organisms/OnboardingCard/OnboardingCard";
import type {
  SchoolConfig,
  CohortConfig,
  OnboardingProfile,
} from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import type {
  IdCardOrientation,
  IdCardSide,
} from "~/components/molecules/IdCard/IdCard.types";
import { validateFixedDomainEmail } from "~/utils/emailSecurity";
import { formatInstitutionalEmail } from "~/components/organisms/OnboardingCard/OnboardingCard.utils";
import { authGuard } from "~/utils/session.server";
import { isUserProfileComplete } from "~/services/userService";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BadgeIcon from "@mui/icons-material/Badge";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SchoolIcon from "@mui/icons-material/School";
import SyncIcon from "@mui/icons-material/Sync";
import {
  OnboardingContainer,
  Title,
  ActionButton,
  CardWorkspaceContainer,
  FabDockPanel,
  RequirementsList,
  RequirementPill,
  M3ExtendedFab,
} from "./onboarding.styles";
import {
  CADET_FIXED_DOMAIN,
  AVAILABLE_SCHOOLS,
  resolveSchool,
  buildInitialProfile,
  resolveDefaultProfile,
  computeMissingFields,
} from "./onboarding.helpers";
import { handleOnboardingAction } from "./onboarding.helpers.server";

export { CADET_FIXED_DOMAIN, AVAILABLE_SCHOOLS };

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context, { allowAnonymous: true });
  const dbUser = auth?.user;
  const initialProfile = buildInitialProfile(dbUser ?? undefined);
  const isComplete = isUserProfileComplete(dbUser ?? null);

  return {
    userId: auth?.session?.userId ?? dbUser?.id ?? null,
    profile: initialProfile,
    isComplete,
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  return handleOnboardingAction(request, context);
}

export function meta() {
  return [
    { title: "AptiSpace LMS • Cadet Credential Onboarding" },
    {
      name: "description",
      content:
        "Configure your ISO/IEC 7810 ID-1 official identification card and begin your AptiSpace interstellar journey.",
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
          Credential Readiness
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Fill out the required card fields to unlock validation.
        </Typography>
      </Box>

      <RequirementsList>
        <RequirementPill isComplete={isFirstNameFilled}>
          <span>First Name</span>
          {isFirstNameFilled ? (
            <CheckCircleIcon sx={{ fontSize: 16 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
          )}
        </RequirementPill>

        <RequirementPill isComplete={isFamilyNameFilled}>
          <span>Family Name</span>
          {isFamilyNameFilled ? (
            <CheckCircleIcon sx={{ fontSize: 16 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
          )}
        </RequirementPill>

        <RequirementPill isComplete={isEmailFilled}>
          <span>Institutional Email</span>
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
              ? "✓ Ready to Validate"
              : `${3 - missingFieldsCount} / 3 Completed`
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
            label="Saving..."
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
            <CheckCircleIcon sx={{ fontSize: 22 }} />
            <span>Issue Identification Credential</span>
          </M3ExtendedFab>
        </Box>
      </Tooltip>
    </FabDockPanel>
  );
}

export default function OnboardingPage() {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [selectedSchool, setSelectedSchool] = useState<SchoolConfig>(
    AVAILABLE_SCHOOLS[0],
  );

  const [selectedCohort] = useState<CohortConfig>({
    id: "cohort-2026",
    name: "Cadet Cohort 2026",
    description: "Avionics and orbital navigation flight cohort.",
  });

  const [profile, setProfile] = useState<OnboardingProfile>(() =>
    resolveDefaultProfile(loaderData?.profile),
  );

  const [orientation, setOrientation] =
    useState<IdCardOrientation>("landscape");
  const [side, setSide] = useState<IdCardSide>("front");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AptiSpace LMS • Cadet Onboarding";
    }
  }, []);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const syncProfileToDb = useCallback(
    (nextProfile: OnboardingProfile, school: SchoolConfig) => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        const formData = new FormData();
        formData.set("actionType", "update_draft");
        formData.set("firstName", nextProfile.firstName);
        formData.set("familyName", nextProfile.familyName);
        formData.set("email", nextProfile.email);
        formData.set("schoolId", school.id);
        formData.set("avatarUrl", nextProfile.avatarUrl || "");
        fetcher.submit(formData, { method: "post" });
      }, 500);
    },
    [fetcher],
  );

  const handleProfileChange = useCallback(
    (nextProfile: OnboardingProfile) => {
      setProfile(nextProfile);
      syncProfileToDb(nextProfile, selectedSchool);
    },
    [syncProfileToDb, selectedSchool],
  );

  const handleSchoolChange = (schoolId: string) => {
    const found = resolveSchool(schoolId);
    setSelectedSchool(found);
    const updated = {
      ...profile,
      email: formatInstitutionalEmail(
        profile.firstName,
        profile.familyName,
        found,
      ),
    };
    setProfile(updated);
    syncProfileToDb(updated, found);
  };

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
      return "All required fields valid! Click to issue your official ID-1 credential.";
    }
    return `Please fill in ${missingFieldsList.join(", ")} directly on the card to enable validation.`;
  }, [isFormComplete, missingFieldsList]);

  const handleValidateAndSubmit = () => {
    if (!isFormComplete) return;

    const formData = new FormData();
    formData.set("actionType", "validate_credential");
    formData.set("firstName", profile.firstName);
    formData.set("familyName", profile.familyName);
    formData.set("email", profile.email);
    formData.set("schoolId", selectedSchool.id);
    formData.set("avatarUrl", profile.avatarUrl || "");

    fetcher.submit(formData, { method: "post" });
    navigate("/");
  };

  return (
    <AuthLayout>
      <OnboardingContainer elevation={0} sx={{ gridTemplateColumns: "1fr" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            pb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box>
            <Title>
              <BadgeIcon className="badge-icon" />
              <span>{t("title", "Cadet Credential Onboarding")}</span>
            </Title>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t(
                "subtitle",
                "Fill in your name and credentials directly on your official ISO/IEC 7810 ID-1 card below.",
              )}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel id="school-select-label">
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 16 }} />
                  <span>Enrolled Academy / School</span>
                </Box>
              </InputLabel>
              <Select
                labelId="school-select-label"
                value={selectedSchool.id}
                label="Enrolled Academy / School"
                onChange={(e) => handleSchoolChange(e.target.value as string)}
              >
                {AVAILABLE_SCHOOLS.map((sch) => (
                  <MenuItem key={sch.id} value={sch.id}>
                    {sch.name} (@{sch.emailDomain})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <CardWorkspaceContainer>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
              <ActionButton
                type="button"
                variant="outlined"
                size="small"
                onClick={() =>
                  setOrientation((prev) =>
                    prev === "landscape" ? "portrait" : "landscape",
                  )
                }
                title="Toggle Orientation"
              >
                <ScreenRotationIcon sx={{ fontSize: "14px" }} />
                <span>
                  {orientation === "landscape" ? "Portrait" : "Landscape"}
                </span>
              </ActionButton>

              <ActionButton
                type="button"
                onClick={() =>
                  setSide((prev) => (prev === "front" ? "back" : "front"))
                }
                title="Switch Card Side"
              >
                <AutorenewIcon sx={{ fontSize: "14px" }} />
                <span>
                  {side === "front"
                    ? t("card.flipToBack", "View Back Side")
                    : t("card.flipToFront", "View Front Side")}
                </span>
              </ActionButton>
            </Box>

            <OnboardingCard
              school={selectedSchool}
              cohort={selectedCohort}
              profile={profile}
              onProfileChange={handleProfileChange}
              orientation={orientation}
              size="lg"
              side={side}
              flipOnClick={true}
              onFlip={(newSide) => setSide(newSide)}
              transparent={true}
              holoVariant="rainbow"
            />
          </Box>

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
      </OnboardingContainer>
    </AuthLayout>
  );
}
