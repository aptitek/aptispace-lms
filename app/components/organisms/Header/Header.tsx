import type { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import Logo from "../../atoms/Logo/Logo";
import LanguageToggle from "../../atoms/LanguageToggle/LanguageToggle";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle";
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

const UserBadge = styled(Box)(({ theme }) => ({
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
            <Chip
              color={
                user.role === "admin"
                  ? "warning"
                  : user.role === "instructor"
                    ? "info"
                    : "success"
              }
              variant="outlined"
              label={t(`devTool.roles.${user.role}`, user.role)}
              size="small"
              sx={{ fontWeight: 700 }}
              data-testid={`role-chip-${user.role}`}
            />
          </UserBadge>
        )}

        <ThemeToggle size="small" />
        <LanguageToggle size="small" />

        {user && (
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={handleLogoutClick}
            aria-label={t("loginCard.logoutAria")}
            data-testid="header-logout-button"
            startIcon={<LogoutIcon sx={{ fontSize: "1rem" }} />}
          >
            {t("loginCard.logout")}
          </Button>
        )}
      </RightSlot>
    </HeaderRoot>
  );
}

export const HeaderBar = Header;
