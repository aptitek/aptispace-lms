import { useState } from "react";
import { styled } from "@mui/material/styles";
import BrandLogo from "~/components/atoms/BrandLogo/BrandLogo";
import GitHubButton from "~/components/atoms/GitHubButton/GitHubButton";
import DevImpersonationSelector from "~/components/molecules/DevImpersonationSelector/DevImpersonationSelector";
import {
  loginWithGitHub,
  loginAsPersona,
  type UserRole,
  type AuthUser,
} from "~/utils/auth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export interface LoginCardProps {
  onSuccess?: (user: AuthUser) => void;
  showDevTool?: boolean;
}

const CardContainer = styled("div")(({ theme }) => {
  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    width: "100%",
    maxWidth: 440,
    padding: theme.spacing(4),
    borderRadius: radius * 2,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `0 24px 48px ${theme.palette.action.focus}`,
    backdropFilter: "blur(16px)",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    position: "relative",
    zIndex: 1,

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
      maxWidth: "100%",
    },
  };
});

const HeaderSection = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: theme.spacing(1.5),
}));

const DescriptionText = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
}));

const ActionSection = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const SecurityNote = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(0.75),
  fontSize: theme.typography.caption.fontSize ?? "0.75rem",
  color: theme.palette.text.secondary,

  "& .MuiSvgIcon-root": {
    fontSize: "0.9rem",
    color: theme.palette.success.main,
  },
}));

const StatusBanner = styled("div")(({ theme }) => ({
  padding: theme.spacing(1.25, 1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.selected,
  border: `1px solid ${theme.palette.success.main}`,
  color: theme.palette.success.light,
  fontSize: "0.85rem",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
  },
}));

export default function LoginCard({
  onSuccess,
  showDevTool = import.meta.env.DEV,
}: LoginCardProps) {
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);

  const handleGitHubLogin = async () => {
    setLoading(true);
    try {
      await loginWithGitHub();
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSelect = async (role: UserRole) => {
    setLoading(true);
    try {
      const user = await loginAsPersona(role);
      setActiveUser(user);
      onSuccess?.(user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContainer>
      <HeaderSection>
        <BrandLogo size="medium" />
        <DescriptionText>
          Authenticate securely using your GitHub account to access course
          modules, interactive 3D sandboxes, and personalized learning tracks.
        </DescriptionText>
      </HeaderSection>

      {activeUser && (
        <StatusBanner role="status">
          <CheckCircleIcon />
          <span>
            Connected as <strong>{activeUser.name}</strong> ({activeUser.role})
          </span>
        </StatusBanner>
      )}

      <ActionSection>
        <GitHubButton
          onClick={handleGitHubLogin}
          loading={loading}
          fullWidth
          label="Continue with GitHub"
        />

        <SecurityNote>
          <LockOutlinedIcon />
          <span>OAuth 2.0 Encrypted • Single Sign-On</span>
        </SecurityNote>
      </ActionSection>

      {showDevTool && (
        <DevImpersonationSelector
          onSelectPersona={handlePersonaSelect}
          loading={loading}
        />
      )}
    </CardContainer>
  );
}
