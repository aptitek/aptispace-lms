import { useState, useEffect, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, type ActionFunctionArgs } from "react-router";
import { styled, type Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import Id1Card from "~/components/molecules/Id1Card/Id1Card";
import EditableAvatar from "~/components/molecules/EditableAvatar/EditableAvatar";
import type {
  Id1CardOrientation,
  Id1CardSide,
} from "~/components/molecules/Id1Card/Id1Card.types";
import {
  type CadetProfile,
  CardFrontContent,
  CardBackContent,
} from "./onboarding.card";
import FixedDomainEmailField from "~/components/molecules/FixedDomainEmailField/FixedDomainEmailField";
import { validateFixedDomainEmail } from "~/utils/emailSecurity";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BadgeIcon from "@mui/icons-material/Badge";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";

export const CADET_FIXED_DOMAIN = "cadet.aptispace.io";

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

const OnboardingContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1.25fr",
  gap: theme.spacing(4),
  maxWidth: "1180px",
  width: "100%",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 30px 60px rgba(0, 0, 0, 0.3), 0 0 35px ${theme.palette.action.focus}`,
  boxSizing: "border-box",
  zIndex: 2,
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    maxWidth: "600px",
    padding: theme.spacing(2.5),
  },
}));

const FormPanel = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

const Title = styled("h1")(({ theme }) => ({
  margin: 0,
  fontSize: "1.65rem",
  fontWeight: 800,
  color: theme.palette.text.primary,
  letterSpacing: "-0.01em",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& .badge-icon": {
    color: theme.palette.primary.light,
    fontSize: "1.8rem",
  },
}));

const FormRoot = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const FormGroup = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
}));

const TwoColGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(1.5),
}));

const Label = styled("label")(({ theme }) => ({
  fontSize: "0.8rem",
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const formControlBase = (theme: Theme) => ({
  padding: "10px 14px",
  borderRadius: "8px",
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.2s ease",
  "&:focus": {
    borderColor: theme.palette.primary.light,
    boxShadow: `0 0 0 2px ${theme.palette.action.focus}`,
  },
});

const Input = styled("input")(({ theme }) => formControlBase(theme));
const Select = styled("select")(({ theme }) => ({
  ...formControlBase(theme),
  cursor: "pointer",
}));

const PreviewPanel = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2.5),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: "16px",
  border: `1px dashed ${theme.palette.divider}`,
}));

const ActionButton = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  padding: "8px 16px",
  borderRadius: "8px",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.primary.light,
  fontWeight: 700,
  fontSize: "0.825rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    borderColor: theme.palette.primary.main,
    transform: "translateY(-1px)",
  },
}));

const SubmitButton = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  width: "100%",
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.background.default,
  fontWeight: 800,
  fontSize: "0.95rem",
  letterSpacing: "0.5px",
  cursor: "pointer",
  marginTop: theme.spacing(1),
  boxShadow: `0 4px 14px ${theme.palette.action.focus}`,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    boxShadow: `0 6px 20px ${theme.palette.action.focus}`,
    transform: "translateY(-1px)",
  },
}));

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

  const [profile, setProfile] = useState<CadetProfile>({
    id: "APTI-7810-9402",
    name: "Alex Mercer",
    email: "alex.mercer@cadet.aptispace.io",
    callSign: "AETH-9042",
    division: "Orbital Flight Dynamics",
    clearanceLevel: "LEVEL-4 OMNI",
    securityCode: "781",
    avatarUrl: DEFAULT_AVATAR_URL,
  });

  const [orientation, setOrientation] =
    useState<Id1CardOrientation>("landscape");
  const [side, setSide] = useState<Id1CardSide>("front");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AptiSpace LMS • Cadet Onboarding";
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <AuthLayout>
      <OnboardingContainer>
        <FormPanel>
          <div>
            <Title>
              <BadgeIcon className="badge-icon" />
              {t("title", "Cadet Onboarding")}
            </Title>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t(
                "subtitle",
                "Initialize your flight credential badge and configure your academy clearance profile.",
              )}
            </Typography>
          </div>

          <FormRoot onSubmit={handleSubmit}>
            <FormGroup>
              <EditableAvatar
                value={profile.avatarUrl}
                defaultValue={DEFAULT_AVATAR_URL}
                onChange={(newAvatarUrl) =>
                  setProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }))
                }
                label={t("form.avatarLabel", "Biometric Facial Portrait")}
                helperText={t(
                  "form.avatarHelp",
                  "Drag & drop image, paste, enter URL, or click upload to R2.",
                )}
                shape="biometric"
                size="sm"
              />
            </FormGroup>

            <FormGroup>
              <Label>{t("form.cadetName", "Cadet Full Name")}</Label>
              <Input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>{t("form.cadetEmail", "Official Academy Email")}</Label>
              <FixedDomainEmailField
                name="email"
                domain={CADET_FIXED_DOMAIN}
                value={profile.email}
                placeholder="cadet.username"
                helperText={t(
                  "form.emailHelp",
                  `Domain is locked to @${CADET_FIXED_DOMAIN} for security.`,
                )}
                onEmailChange={(composite) =>
                  setProfile((prev) => ({ ...prev, email: composite }))
                }
                required
              />
            </FormGroup>

            <TwoColGrid>
              <FormGroup>
                <Label>{t("form.callSign", "Call Sign")}</Label>
                <Input
                  type="text"
                  value={profile.callSign}
                  onChange={(e) =>
                    setProfile({ ...profile, callSign: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>{t("form.clearance", "Clearance Level")}</Label>
                <Select
                  value={profile.clearanceLevel}
                  onChange={(e) =>
                    setProfile({ ...profile, clearanceLevel: e.target.value })
                  }
                >
                  {CLEARANCES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </TwoColGrid>

            <FormGroup>
              <Label>{t("form.division", "Specialization / Division")}</Label>
              <Select
                value={profile.division}
                onChange={(e) =>
                  setProfile({ ...profile, division: e.target.value })
                }
              >
                {DIVISIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </FormGroup>

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
                Standard ISO/IEC 7810 ID-1 • EMV ISO/IEC 7816 Smart Credential
              </span>
            </Box>

            <SubmitButton type="submit">
              <CheckCircleIcon />
              {t("form.submit", "Issue Identification Credential")}
            </SubmitButton>
          </FormRoot>
        </FormPanel>

        <PreviewPanel>
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
            <Id1Card
              orientation={orientation}
              size="lg"
              side={side}
              flipOnClick={true}
              onFlip={(newSide) => setSide(newSide)}
              frontContent={
                <CardFrontContent profile={profile} orientation={orientation} />
              }
              backContent={<CardBackContent profile={profile} />}
            />
          </Box>
        </PreviewPanel>
      </OnboardingContainer>
    </AuthLayout>
  );
}
