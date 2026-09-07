import type { AuthUser } from "~/utils/auth";

export type ProfileButtonVariant = "default" | "logoutOnly";

export interface ProfileButtonProps {
  user: AuthUser;
  variant?: ProfileButtonVariant;
  onLogout?: () => void;
  onReturnToAdmin?: () => void;
  onAvatarClick?: () => void;
  size?: number;
  className?: string;
  testId?: string;
  avatarTestId?: string;
  actionTestId?: string;
  extended?: boolean;
  showSlidingPill?: boolean;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
