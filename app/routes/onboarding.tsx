import { useState, useEffect, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, type ActionFunctionArgs } from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import OnboardingCard from "~/components/organisms/OnboardingCard/OnboardingCard";
import EmailField from "~/components/molecules/EmailField/EmailField";
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
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BadgeIcon from "@mui/icons-material/Badge";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import SchoolIcon from "@mui/icons-material/School";
import {
  OnboardingContainer,
  FormPanel,
  Title,
  FormRoot,
  TwoColGrid,
  PreviewPanel,
  ActionButton,
  SubmitButton,
} from "./onboarding.styles";

export const CADET_FIXED_DOMAIN = "cadet.aptispace.io";

export const AVAILABLE_SCHOOLS: SchoolConfig[] = [
  {
    id: "school-aptispace-orbital",
    name: "AptiSpace Orbital Academy",
    slug: "aptispace-orbital-academy",
    logoUrl: "/favicon.svg",
    emailDomain: "cadet.aptispace.io",
    emailPattern: "{first}.{last}@{domain}",
  },
  {
    id: "school-quantum-aerospace",
    name: "Quantum Aerospace Institute",
    slug: "quantum-aerospace",
    logoUrl: null,
    emailDomain: "quantum.aptispace.io",
    emailPattern: "{first}.{last}@{domain}",
  },
  {
    id: "school-polytechnique-spatiale",
    name: "École Polytechnique Spatiale",
    slug: "polytechnique-spatiale",
    logoUrl: null,
    emailDomain: "polytechnique.aptispace.io",
    emailPattern: "{f}{last}@{domain}",
  },
];

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData().catch(() => new FormData());
  const rawEmail = String(formData.get("email") || "");
  const validation = validateFixedDomainEmail(rawEmail, CADET_FIXED_DOMAIN);

  if (!validation.isValid) {
    return Response.json(
      {
        error: validation.error,
        code: "UNAUTHORIZED_EMAIL_DOMAIN",
      },
      { status: 400 },
    );
  }

  return Response.json({
    success: true,
    email: validation.fullEmail,
  });
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

const DEFAULT_AVATAR_URL =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

const CLEARANCES = [
  "LEVEL-1 TRAINEE",
  "LEVEL-2 CADET",
  "LEVEL-3 PILOT",
  "LEVEL-4 OMNI",
  "LEVEL-5 COSMIC",
];

const DIVISIONS = [
  "Orbital Flight Dynamics",
  "Astrobiology & Habitats",
  "Deep Space Propulsion",
  "Quantum Navigation & Comms",
];

export default function OnboardingPage() {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();

  const [selectedSchool, setSelectedSchool] = useState<SchoolConfig>(
    AVAILABLE_SCHOOLS[0],
  );

  const [selectedCohort] = useState<CohortConfig>({
    id: "cohort-2026",
    name: "Cadet Cohort 2026",
    description: "Avionics and orbital navigation flight cohort.",
  });

  const [profile, setProfile] = useState<OnboardingProfile>({
    firstName: "Alex",
    familyName: "Mercer",
    email: "alex.mercer@cadet.aptispace.io",
    avatarUrl: DEFAULT_AVATAR_URL,
    documentNumber: "0942",
    callSign: "AETH-9042",
    division: "Orbital Flight Dynamics",
    clearanceLevel: "LEVEL-4 OMNI",
  });

  const [orientation, setOrientation] =
    useState<IdCardOrientation>("landscape");
  const [side, setSide] = useState<IdCardSide>("front");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AptiSpace LMS • Cadet Onboarding";
    }
  }, []);

  const handleSchoolChange = (schoolId: string) => {
    const found =
      AVAILABLE_SCHOOLS.find((s) => s.id === schoolId) || AVAILABLE_SCHOOLS[0];
    setSelectedSchool(found);
    setProfile((prev) => ({
      ...prev,
      email: formatInstitutionalEmail(prev.firstName, prev.familyName, found),
    }));
  };

  const handleFirstNameChange = (firstName: string) => {
    setProfile((prev) => ({
      ...prev,
      firstName,
      email: formatInstitutionalEmail(
        firstName,
        prev.familyName,
        selectedSchool,
      ),
    }));
  };

  const handleFamilyNameChange = (familyName: string) => {
    setProfile((prev) => ({
      ...prev,
      familyName,
      email: formatInstitutionalEmail(
        prev.firstName,
        familyName,
        selectedSchool,
      ),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <AuthLayout>
      <OnboardingContainer elevation={0}>
        <FormPanel>
          <Box>
            <Title>
              <BadgeIcon className="badge-icon" />
              <span>{t("title", "Cadet Onboarding")}</span>
            </Title>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t(
                "subtitle",
                "Configure your official ISO/IEC 7810 ID-1 identification card and start your academy journey.",
              )}
            </Typography>
          </Box>

          <FormRoot onSubmit={handleSubmit}>
            <FormControl fullWidth size="small">
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

            <TwoColGrid>
              <TextField
                label="First Name"
                value={profile.firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                size="small"
                required
                fullWidth
              />

              <TextField
                label="Family Name"
                value={profile.familyName}
                onChange={(e) => handleFamilyNameChange(e.target.value)}
                size="small"
                required
                fullWidth
              />
            </TwoColGrid>

            <EmailField
              name="email"
              label={t("form.cadetEmail", "Institutional Academy Email")}
              domain={selectedSchool.emailDomain}
              value={profile.email}
              onEmailChange={(composite) =>
                setProfile((prev) => ({ ...prev, email: composite }))
              }
              variant="outlined"
              size="medium"
              required
              showDomainLock={true}
              helperText={`Auto-computed according to ${selectedSchool.name} format.`}
            />

            <TwoColGrid>
              <TextField
                label={t("form.callSign", "Call Sign")}
                value={profile.callSign}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    callSign: e.target.value,
                  }))
                }
                size="small"
                fullWidth
              />

              <FormControl fullWidth size="small">
                <InputLabel id="clearance-label">
                  {t("form.clearance", "Clearance Level")}
                </InputLabel>
                <Select
                  labelId="clearance-label"
                  label={t("form.clearance", "Clearance Level")}
                  value={profile.clearanceLevel}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      clearanceLevel: e.target.value as string,
                    }))
                  }
                >
                  {CLEARANCES.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TwoColGrid>

            <FormControl fullWidth size="small">
              <InputLabel id="division-label">
                {t("form.division", "Specialization / Division")}
              </InputLabel>
              <Select
                labelId="division-label"
                label={t("form.division", "Specialization / Division")}
                value={profile.division}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    division: e.target.value as string,
                  }))
                }
              >
                {DIVISIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                fontSize: 11,
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <SecurityIcon sx={{ fontSize: 14, color: "success.main" }} />
              <span>
                ISO/IEC 7810 ID-1 • Holographic Foil • Guilloche Security
                Rosette
              </span>
            </Box>

            <SubmitButton
              type="submit"
              variant="contained"
              startIcon={<CheckCircleIcon />}
            >
              {t("form.submit", "Issue Identification Credential")}
            </SubmitButton>
          </FormRoot>
        </FormPanel>

        <PreviewPanel elevation={0}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                color: "primary.light",
                letterSpacing: "1px",
              }}
            >
              {t("form.preview", "Live ID-1 Preview")} (85.60 mm × 53.98 mm)
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
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
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              py: 1.5,
            }}
          >
            <OnboardingCard
              school={selectedSchool}
              cohort={selectedCohort}
              profile={profile}
              onProfileChange={setProfile}
              orientation={orientation}
              size="lg"
              side={side}
              flipOnClick={true}
              onFlip={(newSide) => setSide(newSide)}
              transparent={true}
              holoVariant="rainbow"
            />
          </Box>
        </PreviewPanel>
      </OnboardingContainer>
    </AuthLayout>
  );
}
