import { useState } from "react";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { useTranslation } from "react-i18next";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";
import type { AuthUser } from "~/utils/auth";
import { M3_SPRINGS, M3_MOTION_DURATIONS } from "~/tokens/motion";
import Chip from "~/components/atoms/Chip/Chip";
import ProfileButton from "~/components/molecules/ProfileButton/ProfileButton";
import type { SidebarVariant } from "./Sidebar.types";
import {
  UserCardSlot,
  UserDetailsText,
  UserNameHeading,
  LogoutActionButton,
  AdminReturnActionButton,
} from "./Sidebar.styles";

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
      $isExtended={isExtended}
      initial={false}
      animate={{
        opacity: isExtended ? 1 : 0,
        width: isExtended ? "auto" : 0,
      }}
      transition={transition}
    >
      <UserNameHeading title={name}>{name || "User"}</UserNameHeading>
      <Chip
        userRole={role}
        size="small"
        testId="sidebar-user-role-badge"
        sx={{
          mt: 0.5,
          fontWeight: 700,
          maxWidth: "100%",
        }}
      />
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
  variant?: SidebarVariant;
  isOnboarding?: boolean;
  isExtended: boolean;
  onOpenProfile: () => void;
  onAction: () => void;
}

function resolveActionTestId(isImpersonating: boolean) {
  return isImpersonating
    ? "sidebar-return-admin-button"
    : "sidebar-logout-button";
}

interface OnboardingUserSlotProps {
  user: AuthUser;
  isEffectiveExtended: boolean;
  isImpersonating: boolean;
  onAction: () => void;
}

function OnboardingUserSlot({
  user,
  isEffectiveExtended,
  isImpersonating,
  onAction,
}: OnboardingUserSlotProps) {
  return (
    <UserCardSlot
      $isExtended={isEffectiveExtended}
      data-testid="sidebar-user-card"
      sx={{ justifyContent: isEffectiveExtended ? "flex-start" : "center" }}
    >
      <ProfileButton
        user={user}
        variant="logoutOnly"
        extended={isEffectiveExtended}
        onLogout={onAction}
        onReturnToAdmin={onAction}
        size={40}
        actionTestId={resolveActionTestId(isImpersonating)}
      />
    </UserCardSlot>
  );
}

export function SidebarUserSection({
  user,
  variant,
  isOnboarding = false,
  isExtended,
  onOpenProfile,
  onAction,
}: SidebarUserSectionProps) {
  const { t } = useTranslation("auth");
  const [isSelfHovered, setIsSelfHovered] = useState(false);

  if (!user) return null;

  const isGhost = variant === "ghost";
  const isEffectiveExtended = !isGhost && (isExtended || isSelfHovered);
  const isImpersonating = Boolean(user.impersonating);
  const actionLabel = resolveActionLabel(isImpersonating, t);

  if (isOnboarding) {
    return (
      <OnboardingUserSlot
        user={user}
        isEffectiveExtended={isEffectiveExtended}
        isImpersonating={isImpersonating}
        onAction={onAction}
      />
    );
  }

  const hoverHandlers = isGhost
    ? {}
    : {
        onMouseEnter: () => setIsSelfHovered(true),
        onMouseLeave: () => setIsSelfHovered(false),
      };

  return (
    <UserCardSlot
      $isExtended={isEffectiveExtended}
      data-testid="sidebar-user-card"
      {...hoverHandlers}
    >
      <ProfileButton
        user={user}
        variant="default"
        onLogout={onAction}
        onReturnToAdmin={onAction}
        onAvatarClick={onOpenProfile}
        size={40}
        avatarTestId="sidebar-avatar-trigger"
        actionTestId={resolveActionTestId(isImpersonating)}
        showSlidingPill={false}
      />

      {!isGhost && (
        <SidebarUserDetails
          name={user.name}
          role={user.role}
          isExtended={isEffectiveExtended}
        />
      )}

      {isEffectiveExtended && (
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
