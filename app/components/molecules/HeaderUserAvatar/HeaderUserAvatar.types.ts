import type { AuthUser } from "../../../utils/auth";

export interface HeaderUserAvatarProps {
  user: AuthUser;
  onLogout?: () => void;
  onReturnToAdmin?: () => void;
  onAvatarClick?: () => void;
  size?: number;
  className?: string;
  testId?: string;
}
