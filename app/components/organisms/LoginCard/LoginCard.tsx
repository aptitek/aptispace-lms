import { useState } from "react";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import { LoadingIndicator } from "react-material-expressive";
import Logo from "~/components/atoms/Logo/Logo";
import DevImpersonator from "~/components/molecules/DevImpersonator/DevImpersonator";
import {
  loginWithGitHub,
  loginAsAccount,
  type AuthUser,
  type AccountDefinition,
} from "~/utils/auth";
import { useStatusCenter } from "~/utils/statusCenterContext";
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
  const { t } = useTranslation(["auth", "errors"]);
  const { notifyError } = useStatusCenter();
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);

  const handleGitHubLogin = async () => {
    setLoading(true);
    try {
      await loginWithGitHub();
    } catch (err) {
      notifyError(err, {
        title: t("errors:errorTitle", "System Diagnostic Alert"),
        message: t("errors:UNAUTHENTICATED", "Authentication failed."),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = async (account: AccountDefinition) => {
    setLoading(true);
    try {
      const user = await loginAsAccount(account);
      setActiveUser(user);
      onSuccess?.(user);
    } catch (err) {
      notifyError(err, {
        title: t("errors:errorTitle", "System Diagnostic Alert"),
        message: t(
          "errors:IMPERSONATION_FAILED",
          "Failed to initiate impersonation session.",
        ),
        contextData: { role: account.role, accountId: account.id },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContainer>
      <HeaderSection>
        <Logo size="medium" />
        <DescriptionText>{t("loginCard.description")}</DescriptionText>
      </HeaderSection>

      {activeUser && (
        <StatusBanner role="status">
          <CheckCircleIcon />
          <span>
            {t("loginCard.connectedAs")} <strong>{activeUser.name}</strong> (
            {t(`devTool.roles.${activeUser.role}` as const, {
              defaultValue: activeUser.role,
            })}
            )
          </span>
        </StatusBanner>
      )}

      <ActionSection>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          disabled={loading}
          aria-busy={loading}
          onClick={handleGitHubLogin}
          startIcon={
            loading ? (
              <LoadingIndicator className="!size-5 [&>svg]:!size-5" />
            ) : (
              <GitHubIcon />
            )
          }
        >
          {loading
            ? t("loginCard.authenticating")
            : t("loginCard.continueWithGitHub")}
        </Button>

        <SecurityNote>
          <LockOutlinedIcon />
          <span>{t("loginCard.securityNote")}</span>
        </SecurityNote>
      </ActionSection>

      {showDevTool && (
        <DevImpersonator
          onSelectAccount={handleAccountSelect}
          currentUserId={activeUser?.id}
          loading={loading}
        />
      )}
    </CardContainer>
  );
}
