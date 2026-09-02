import { useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Logo from "../../atoms/Logo/Logo";
import LanguageToggle from "../../atoms/LanguageToggle/LanguageToggle";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle";
import HeaderUserAvatar from "../../molecules/HeaderUserAvatar/HeaderUserAvatar";
import FullScreenModal from "../../molecules/FullScreenModal/FullScreenModal";
import ProfileCard from "../ProfileCard/ProfileCard";
import type { Td1MrzData } from "../../atoms/MrzZone/MrzZone.types";
import type { CohortConfig } from "../../../types/institution";
import { logout, stopImpersonation, type AuthUser } from "../../../utils/auth";

export type HeaderMode = "subtle" | "full";

export interface HeaderProps {
  mode?: HeaderMode;
  logoSize?: "small" | "medium";
  user?: AuthUser | null;
  onLogout?: () => void;
  onReturnToAdmin?: () => void;
  onUserUpdated?: (updatedUser: AuthUser) => void;
  children?: ReactNode;
  className?: string;
  "data-testid"?: string;
}

export type HeaderBarProps = HeaderProps;

const HeaderRoot = styled("header", {
  shouldForwardProp: (prop) => prop !== "$mode",
})<{ $mode: HeaderMode }>(({ theme, $mode }) => {
  const isSubtle = $mode === "subtle";

  return {
    position: "relative",
    zIndex: 10,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: isSubtle ? "flex-end" : "space-between",
    padding: theme.spacing(2, 4),
    backgroundColor: isSubtle ? "transparent" : theme.palette.background.paper,
    backdropFilter: isSubtle ? "none" : "blur(16px)",
    WebkitBackdropFilter: isSubtle ? "none" : "blur(16px)",
    borderBottom: isSubtle ? "none" : `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create(
      ["background-color", "border-color", "backdrop-filter"],
      { duration: theme.transitions.duration.standard },
    ),
    ...(isSubtle
      ? {}
      : theme.applyStyles("dark", {
          backgroundColor: theme.palette.action.disabledBackground,
        })),

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1.5, 2),
      flexWrap: "wrap",
      gap: theme.spacing(1),
    },
  };
});

const LeftSlot = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

const RightSlot = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),

  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1),
  },
}));

const AdminHeaderButton = styled(Button)(({ theme }) => {
  return {
    height: 32,
    fontSize: "0.75rem",
    fontWeight: 700,
    borderRadius: "8px",
    padding: theme.spacing(0, 1.25),
    textDecoration: "none",
    color: theme.palette.secondary.main,
    backgroundColor: alpha(theme.palette.secondary.main, 0.08),
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
    "&:hover": {
      backgroundColor: alpha(theme.palette.secondary.main, 0.16),
      borderColor: theme.palette.secondary.main,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.secondary.main, 0.12),
      border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
      "&:hover": {
        backgroundColor: alpha(theme.palette.secondary.main, 0.22),
        borderColor: theme.palette.secondary.main,
      },
    }),
  };
});

interface HeaderProfileCardModalProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: (updatedUser: AuthUser) => void;
}

function parseUserNames(name?: string) {
  if (!name) return { firstName: "USER", familyName: "" };
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], familyName: "" };
  }
  return {
    firstName: parts.slice(0, -1).join(" "),
    familyName: parts[parts.length - 1],
  };
}

function resolveModalEmail(email?: string, domain?: string) {
  const hasFixedDomain = Boolean(domain && domain.trim().length > 0);
  if (!hasFixedDomain) {
    return { emailPrefix: email, emailDomain: undefined };
  }
  const emailPrefix = email?.includes("@") ? email.split("@")[0] : email;
  const emailDomain = domain?.startsWith("@") ? domain : `@${domain}`;
  return { emailPrefix, emailDomain };
}

function resolveModalDocNumber(id?: string): string {
  if (!id) return "0942";
  const cleaned = id
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 9)
    .toUpperCase();
  return cleaned || "0942";
}

function resolveModalMrzData(
  user: AuthUser,
  firstName: string,
  familyName: string,
): Td1MrzData {
  return {
    documentNumber: resolveModalDocNumber(user.id),
    surname: (familyName || firstName || "USER").toUpperCase(),
    givenNames: (firstName || "USER").toUpperCase(),
    birthDate: "000101",
    expiryDate: "300828",
    sex: "M",
    issuingState: "APT",
    nationality: "APT",
  };
}

const DEFAULT_MODAL_COHORT: CohortConfig = {
  diploma: "M",
  year: 1,
  tags: ["IA", "Dev"],
};

function resolveModalCohort(cohort?: CohortConfig): CohortConfig {
  if (!cohort) return DEFAULT_MODAL_COHORT;
  return {
    id: cohort.id,
    name: cohort.name ?? undefined,
    diploma: cohort.diploma ?? undefined,
    year: cohort.year ?? undefined,
    tags: cohort.tags ?? undefined,
  };
}

function HeaderProfileCardModal({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}: HeaderProfileCardModalProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  useEffect(() => {
    setAvatarUrl(user.avatarUrl);
  }, [user.avatarUrl]);

  const handleAvatarChange = (newUrl: string) => {
    setAvatarUrl(newUrl);
    onUserUpdated?.({ ...user, avatarUrl: newUrl });
  };

  const parsed = parseUserNames(user.name);
  const firstName = user.firstName ?? parsed.firstName;
  const familyName = user.familyName ?? parsed.familyName;

  const { emailPrefix, emailDomain } = resolveModalEmail(
    user.email,
    user.emailDomain,
  );
  const mrzData = resolveModalMrzData(user, firstName, familyName);
  const cohort = resolveModalCohort(user.cohort);

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={620}
      testId="header-profile-card-modal"
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          p: { xs: 1, sm: 2 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ProfileCard
          schoolLogoUrl={user.schoolLogoUrl || "/aptitek-logo.svg"}
          institutionName={user.institutionName || "Aptitek"}
          cohort={user.role === "admin" ? undefined : cohort}
          year={user.role === "admin" ? undefined : user.cohortYear || "2026"}
          avatarUrl={avatarUrl}
          role={user.role}
          githubUsername={user.githubUsername}
          firstName={firstName}
          familyName={familyName}
          emailPrefix={emailPrefix}
          emailDomain={emailDomain}
          usernamePattern={user.usernamePattern || "{first}.{last}"}
          mrzData={mrzData}
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
      </Box>
    </FullScreenModal>
  );
}

function createHeaderActionHandler(
  user?: AuthUser | null,
  onLogout?: () => void,
  onReturnToAdmin?: () => void,
) {
  return () => {
    if (user?.impersonating) {
      if (onReturnToAdmin) {
        onReturnToAdmin();
        return;
      }
      void stopImpersonation();
      return;
    }

    if (onLogout) {
      onLogout();
      return;
    }
    void logout();
  };
}

function AdminNavButton({
  user,
  onReturnToAdmin,
}: {
  user: AuthUser;
  onReturnToAdmin?: () => void;
}) {
  const { t } = useTranslation(["auth", "common"]);

  if (user.impersonating && onReturnToAdmin) {
    return (
      <AdminHeaderButton
        variant="outlined"
        size="small"
        onClick={onReturnToAdmin}
        data-testid="header-return-admin-btn"
      >
        {t("auth:backToAdmin", "Return to Admin")}
      </AdminHeaderButton>
    );
  }

  if (user.role === "admin" && !user.impersonating) {
    return (
      <AdminHeaderButton
        href="/admin"
        size="small"
        variant="outlined"
        startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
        aria-label={t(
          "auth:adminButtonAria",
          "Access administration management",
        )}
        data-testid="header-admin-link"
      >
        {t("auth:adminButton", "Admin")}
      </AdminHeaderButton>
    );
  }

  return null;
}

export default function Header({
  mode = "full",
  logoSize = "small",
  user,
  onLogout,
  onReturnToAdmin,
  onUserUpdated,
  children,
  className,
  "data-testid": dataTestId = "header",
}: HeaderProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const handleActionClick = createHeaderActionHandler(
    user,
    onLogout,
    onReturnToAdmin,
  );

  return (
    <>
      <HeaderRoot
        $mode={mode}
        className={className}
        data-testid={dataTestId}
        role="banner"
      >
        {mode !== "subtle" && (
          <LeftSlot>
            <Logo size={logoSize} data-testid="header-main-logo" />
          </LeftSlot>
        )}

        <RightSlot>
          {children}

          {user && (
            <AdminNavButton user={user} onReturnToAdmin={onReturnToAdmin} />
          )}

          <ThemeToggle data-testid="header-theme-toggle" />
          <LanguageToggle data-testid="header-language-toggle" />

          {user && (
            <HeaderUserAvatar
              user={user}
              onLogout={handleActionClick}
              onReturnToAdmin={handleActionClick}
              onAvatarClick={() => setIsProfileModalOpen(true)}
              data-testid="header-user-avatar"
            />
          )}
        </RightSlot>
      </HeaderRoot>

      {user && (
        <HeaderProfileCardModal
          user={user}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onUserUpdated={onUserUpdated}
        />
      )}
    </>
  );
}

export const HeaderBar = Header;
