import Box from "@mui/material/Box";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTranslation } from "react-i18next";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";
import type { AuthUser } from "~/utils/auth";
import { isUnnamedUser } from "~/components/atoms/Avatar/Avatar";
import { M3_SPRINGS, M3_MOTION_DURATIONS } from "~/tokens/motion";
import {
  UserCardSlot,
  UserDetailsText,
  UserNameHeading,
  UserRoleCaption,
  LogoutActionButton,
  AdminReturnActionButton,
} from "./Sidebar.styles";

function computeUserInitials(name?: string): string | null {
  if (!name || isUnnamedUser(name)) return null;
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;
  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
}

function SidebarUserAvatarSlot({
  user,
  userInitials,
  onClick,
}: {
  user: AuthUser;
  userInitials: string | null;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={user.name || "User Profile"}
      data-testid="sidebar-avatar-trigger"
      sx={{
        width: 40,
        height: 40,
        minWidth: 40,
        minHeight: 40,
        borderRadius: "50%",
        border: "none",
        padding: 0,
        cursor: "pointer",
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "0.875rem",
        overflow: "hidden",
        outline: "none",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        transition: "transform 150ms ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
        "&:focus-visible": {
          outline: "2px solid currentColor",
          outlineOffset: "2px",
        },
      }}
    >
      {user.avatarUrl ? (
        <Box
          component="img"
          src={user.avatarUrl}
          alt={user.name}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : userInitials ? (
        userInitials
      ) : (
        <PersonRoundedIcon sx={{ fontSize: 20 }} />
      )}
    </Box>
  );
}

function SidebarUserActionButton({
  isImpersonating,
  actionLabel,
  onClick,
}: {
  isImpersonating: boolean;
  actionLabel: string;
  onClick: () => void;
}) {
  return (
    <Tooltip title={actionLabel} placement="top" arrow>
      {isImpersonating ? (
        <AdminReturnActionButton
          onClick={onClick}
          aria-label={actionLabel}
          data-testid="sidebar-return-admin-button"
          size="small"
        >
          <AdminPanelSettingsRoundedIcon sx={{ fontSize: "1.1rem" }} />
        </AdminReturnActionButton>
      ) : (
        <LogoutActionButton
          onClick={onClick}
          aria-label={actionLabel}
          data-testid="sidebar-logout-button"
          size="small"
        >
          <LogoutRoundedIcon sx={{ fontSize: "1.05rem" }} />
        </LogoutActionButton>
      )}
    </Tooltip>
  );
}

function SidebarUserDetails({
  name,
  role,
  isExtended,
}: {
  name?: string;
  role?: string;
  isExtended: boolean;
}) {
  const transition = isExtended
    ? M3_SPRINGS.expressive.spatial.default
    : { duration: M3_MOTION_DURATIONS.s.short2 };

  return (
    <UserDetailsText
      initial={false}
      animate={{
        opacity: isExtended ? 1 : 0,
        width: isExtended ? "auto" : 0,
      }}
      transition={transition}
    >
      <UserNameHeading title={name}>{name || "User"}</UserNameHeading>
      <UserRoleCaption>{role || "member"}</UserRoleCaption>
    </UserDetailsText>
  );
}

function resolveActionLabel(
  isImpersonating: boolean,
  t: (key: string, fallback: string) => string,
): string {
  return isImpersonating
    ? t("loginCard.returnToAdmin", "Return to Admin Account")
    : t("loginCard.logoutAria", "Sign out of your account");
}

export interface SidebarUserSectionProps {
  user?: AuthUser | null;
  isExtended: boolean;
  onOpenProfile: () => void;
  onAction: () => void;
}

export function SidebarUserSection({
  user,
  isExtended,
  onOpenProfile,
  onAction,
}: SidebarUserSectionProps) {
  const { t } = useTranslation("auth");

  if (!user) return null;

  const isImpersonating = Boolean(user.impersonating);
  const userInitials = computeUserInitials(user.name);
  const actionLabel = resolveActionLabel(isImpersonating, t);
  const tooltipPlacement = isExtended ? "top" : "right";

  return (
    <UserCardSlot data-testid="sidebar-user-card">
      <Tooltip
        title={user.name || t("loginCard.profileAria", "Profile")}
        placement={tooltipPlacement}
        arrow
      >
        <div>
          <SidebarUserAvatarSlot
            user={user}
            userInitials={userInitials}
            onClick={onOpenProfile}
          />
        </div>
      </Tooltip>

      <SidebarUserDetails
        name={user.name}
        role={user.role}
        isExtended={isExtended}
      />

      {isExtended && (
        <SidebarUserActionButton
          isImpersonating={isImpersonating}
          actionLabel={actionLabel}
          onClick={onAction}
        />
      )}
    </UserCardSlot>
  );
}

export default SidebarUserSection;
