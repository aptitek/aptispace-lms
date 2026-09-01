import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Logo from "../../atoms/Logo/Logo";
import LanguageToggle from "../../atoms/LanguageToggle/LanguageToggle";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle";
import HeaderUserAvatar from "../../molecules/HeaderUserAvatar/HeaderUserAvatar";
import ProfileCardModal from "../ProfileCardModal/ProfileCardModal";
import { logout, stopImpersonation, type AuthUser } from "../../../utils/auth";
import { SOLARIZED_BASE } from "~/tokens/theme";

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
    backgroundColor: isSubtle
      ? "transparent"
      : theme.palette.mode === "dark"
        ? theme.palette.action.disabledBackground
        : theme.palette.background.paper,
    backdropFilter: isSubtle ? "none" : "blur(16px)",
    WebkitBackdropFilter: isSubtle ? "none" : "blur(16px)",
    borderBottom: isSubtle ? "none" : `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create(
      ["background-color", "border-color", "backdrop-filter"],
      { duration: theme.transitions.duration.standard },
    ),

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
  const isDark = theme.palette.mode === "dark";
  return {
    height: 32,
    fontSize: "0.75rem",
    fontWeight: 700,
    borderRadius: "8px",
    padding: theme.spacing(0, 1.25),
    textDecoration: "none",
    color: SOLARIZED_BASE.magenta,
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.magenta, 0.12)
      : alpha(SOLARIZED_BASE.magenta, 0.08),
    border: `1px solid ${
      isDark
        ? alpha(SOLARIZED_BASE.magenta, 0.4)
        : alpha(SOLARIZED_BASE.magenta, 0.3)
    }`,
    "&:hover": {
      backgroundColor: isDark
        ? alpha(SOLARIZED_BASE.magenta, 0.22)
        : alpha(SOLARIZED_BASE.magenta, 0.16),
      borderColor: SOLARIZED_BASE.magenta,
    },
  };
});

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
  const { t } = useTranslation(["auth", "common"]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleActionClick = () => {
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

  return (
    <>
      <HeaderRoot
        $mode={mode}
        className={className}
        data-testid={dataTestId}
        data-mode={mode}
      >
        {mode === "full" && (
          <LeftSlot data-testid="header-brand-slot">
            <Logo size={logoSize} />
          </LeftSlot>
        )}

        <RightSlot data-testid="header-actions-slot">
          {children}
          {user?.role === "admin" && (
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
          )}
          <ThemeToggle size="small" />
          <LanguageToggle size="small" />

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
        <ProfileCardModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onUserUpdated={onUserUpdated}
        />
      )}
    </>
  );
}

export const HeaderBar = Header;
