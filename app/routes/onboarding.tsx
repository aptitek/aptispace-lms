import { useState, useEffect, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import Id1Card from "~/components/organisms/Id1Card/Id1Card";
import type {
  Id1CardCredential,
  Id1CardOrientation,
  Id1CardSide,
} from "~/components/organisms/Id1Card/Id1Card.types";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BadgeIcon from "@mui/icons-material/Badge";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";

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
  boxShadow: `0 30px 60px rgba(0, 0, 0, 0.6), 0 0 35px ${theme.palette.action.focus}`,
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

const Subtitle = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
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

const Input = styled("input")(({ theme }) => ({
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
}));

const Select = styled("select")(({ theme }) => ({
  padding: "10px 14px",
  borderRadius: "8px",
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
  outline: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:focus": {
    borderColor: theme.palette.primary.light,
    boxShadow: `0 0 0 2px ${theme.palette.action.focus}`,
  },
}));

const SecurityNoteBox = styled("div")(({ theme }) => ({
  fontSize: "11px",
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  "& .security-icon": {
    fontSize: "14px",
    color: theme.palette.success.main,
  },
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

const PreviewHeader = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const PreviewTitle = styled("span")(({ theme }) => ({
  fontSize: "11px",
  fontWeight: 800,
  color: theme.palette.primary.light,
  letterSpacing: "1px",
  textTransform: "uppercase",
}));

const ControlBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  flexWrap: "wrap",
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

const CardCenterHolder = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(1.5, 0),
}));

export default function OnboardingPage() {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Id1CardCredential>({
    id: "APTI-7810-9402",
    name: "Alex Mercer",
    callSign: "AETH-9042",
    role: "Mission Specialist",
    division: "Orbital Flight Dynamics",
    clearanceLevel: "LEVEL-4 OMNI",
    issueDate: "2026-08",
    expiryDate: "2030-08",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    securityCode: "781",
  });

  const [orientation, setOrientation] =
    useState<Id1CardOrientation>("landscape");
  const [side, setSide] = useState<Id1CardSide>("front");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AptiSpace LMS • Cadet Onboarding";
    }
  }, []);

  const handleToggleOrientation = () => {
    setOrientation((prev) => (prev === "landscape" ? "portrait" : "landscape"));
  };

  const handleToggleSide = () => {
    setSide((prev) => (prev === "front" ? "back" : "front"));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <AuthLayout>
      <OnboardingContainer>
        {/* Left column: Form configuration */}
        <FormPanel>
          <div>
            <Title>
              <BadgeIcon className="badge-icon" />
              {t("title", "Cadet Onboarding")}
            </Title>
            <Subtitle>
              {t(
                "subtitle",
                "Initialize your flight credential badge and configure your academy clearance profile.",
              )}
            </Subtitle>
          </div>

          <FormRoot onSubmit={handleSubmit}>
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
                  <option value="LEVEL-1 TRAINEE">LEVEL-1 TRAINEE</option>
                  <option value="LEVEL-2 CADET">LEVEL-2 CADET</option>
                  <option value="LEVEL-3 PILOT">LEVEL-3 PILOT</option>
                  <option value="LEVEL-4 OMNI">LEVEL-4 OMNI</option>
                  <option value="LEVEL-5 COSMIC">LEVEL-5 COSMIC</option>
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
                <option value="Orbital Flight Dynamics">
                  Orbital Flight Dynamics
                </option>
                <option value="Astrobiology & Habitats">
                  Astrobiology & Habitats
                </option>
                <option value="Deep Space Propulsion">
                  Deep Space Propulsion
                </option>
                <option value="Quantum Navigation & Comms">
                  Quantum Navigation & Comms
                </option>
              </Select>
            </FormGroup>

            <SecurityNoteBox>
              <SecurityIcon className="security-icon" />
              <span>
                Standard ISO/IEC 7810 ID-1 • EMV ISO/IEC 7816 Smart Credential
              </span>
            </SecurityNoteBox>

            <SubmitButton type="submit">
              <CheckCircleIcon />
              {t("form.submit", "Issue Identification Credential")}
            </SubmitButton>
          </FormRoot>
        </FormPanel>

        {/* Right column: ID-1 Live Card Preview */}
        <PreviewPanel>
          <PreviewHeader>
            <PreviewTitle>
              {t("form.preview", "Live ID-1 Preview")} (85.60 mm × 53.98 mm)
            </PreviewTitle>

            <ControlBar>
              <ActionButton
                type="button"
                onClick={handleToggleOrientation}
                title="Toggle Orientation"
              >
                <ScreenRotationIcon style={{ fontSize: "14px" }} />
                <span>
                  {orientation === "landscape" ? "Portrait" : "Landscape"}
                </span>
              </ActionButton>

              <ActionButton
                type="button"
                onClick={handleToggleSide}
                title="Switch Card Side"
              >
                <AutorenewIcon style={{ fontSize: "14px" }} />
                <span>
                  {side === "front"
                    ? t("card.flipToBack", "View Back Side")
                    : t("card.flipToFront", "View Front Side")}
                </span>
              </ActionButton>
            </ControlBar>
          </PreviewHeader>

          <CardCenterHolder>
            <Id1Card
              credential={profile}
              orientation={orientation}
              size="lg"
              side={side}
            />
          </CardCenterHolder>
        </PreviewPanel>
      </OnboardingContainer>
    </AuthLayout>
  );
}
