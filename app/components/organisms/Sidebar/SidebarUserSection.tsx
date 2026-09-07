import React from "react";
import Box from "@mui/material/Box";
import ProfileButton from "~/components/molecules/ProfileButton/ProfileButton";
import type { AuthUser } from "~/utils/auth";
import type { SidebarVariant } from "./Sidebar.types";
import { UserCardSlot } from "./Sidebar.styles";

export interface SidebarUserSectionProps {
  user?: AuthUser | null;
  variant?: SidebarVariant;
  isOnboarding?: boolean;
  onOpenProfile: () => void;
  onAction: () => void;
}

export function SidebarUserSection({
  user,
  variant,
  isOnboarding = false,
  onOpenProfile,
  onAction,
}: SidebarUserSectionProps) {
  if (!user || variant === "ghost") return null;

  const isImpersonating = Boolean(user.impersonating);
  const actionTestId = isImpersonating
    ? "sidebar-return-admin-button"
    : "sidebar-logout-button";

  if (isOnboarding) {
    return (
      <UserCardSlot data-testid="sidebar-user-card">
        <ProfileButton
          user={user}
          variant="logoutOnly"
          extended={false}
          onLogout={onAction}
          onReturnToAdmin={onAction}
          size={40}
          actionTestId={actionTestId}
        />
      </UserCardSlot>
    );
  }

  return (
    <UserCardSlot data-testid="sidebar-user-card">
      <Box
        component="span"
        data-testid="sidebar-user-role-badge"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {user.role}
      </Box>
      <ProfileButton
        user={user}
        variant="default"
        showSlidingPill={true}
        onLogout={onAction}
        onReturnToAdmin={onAction}
        onAvatarClick={onOpenProfile}
        size={40}
        avatarTestId="sidebar-avatar-trigger"
        actionTestId={actionTestId}
      />
    </UserCardSlot>
  );
}

export default SidebarUserSection;
