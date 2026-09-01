import type { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Logo from "../../atoms/Logo/Logo";
import LanguageToggle from "../../atoms/LanguageToggle/LanguageToggle";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle";
import HeaderUserAvatar from "../../molecules/HeaderUserAvatar/HeaderUserAvatar";
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

export default function Header({
  mode = "full",
  logoSize = "small",
  user,
  onLogout,
  children,
  className,
  "data-testid": dataTestId = "header",
}: HeaderProps) {
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
        <ThemeToggle size="small" />
        <LanguageToggle size="small" />

        {user && (
          <HeaderUserAvatar
            user={user}
            onLogout={handleLogoutClick}
            data-testid="header-user-avatar"
          />
        )}
      </RightSlot>
    </HeaderRoot>
  );
}

export const HeaderBar = Header;
