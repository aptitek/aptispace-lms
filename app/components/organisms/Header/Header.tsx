import type { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import Logo from "../../atoms/Logo/Logo";
import LanguageToggle from "../../atoms/LanguageToggle/LanguageToggle";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle";
import RoleChip from "../../atoms/RoleChip/RoleChip";
import { logout, type AuthUser } from "../../../utils/auth";

export type HeaderMode = "subtle" | "full";

export interface HeaderProps {
  mode?: HeaderMode;
  logoSize?: "small" | "medium";
  user?: AuthUser | null;
  onLogout?: () => void;
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

const LeftSlot = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

const RightSlot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),

  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1),
  },
}));

const UserBadge = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1.25),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
  fontSize: "0.85rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const LogoutButton = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(0.75),
  padding: theme.spacing(0.75, 1.25),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "transparent",
  color: theme.palette.text.secondary,
  cursor: "pointer",
  fontSize: "0.825rem",
  fontWeight: 600,
  transition: theme.transitions.create(
    ["background-color", "border-color", "color", "transform"],
    { duration: theme.transitions.duration.shorter },
  ),

  "&:hover": {
    backgroundColor: theme.palette.error.main,
    borderColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
    transform: "translateY(-1px)",
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export default function Header({
  mode = "full",
  logoSize = "small",
  user,
  onLogout,
  children,
  className,
  "data-testid": dataTestId = "header",
}: HeaderProps) {
  const { t } = useTranslation("auth");

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    void logout();
  };

  return (
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

        {user && (
          <UserBadge data-testid="header-user-badge">
            <span>{user.name}</span>
            <RoleChip role={user.role} size="small" />
          </UserBadge>
        )}

        <ThemeToggle size="small" />
        <LanguageToggle size="small" />

        {user && (
          <LogoutButton
            type="button"
            onClick={handleLogoutClick}
            aria-label={t("loginCard.logoutAria")}
            data-testid="header-logout-button"
          >
            <LogoutIcon sx={{ fontSize: "1rem" }} />
            <span>{t("loginCard.logout")}</span>
          </LogoutButton>
        )}
      </RightSlot>
    </HeaderRoot>
  );
}

export const HeaderBar = Header;
