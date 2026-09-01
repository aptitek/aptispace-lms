import type { AuthUser } from "../../../utils/auth";

export interface HeaderUserAvatarProps {
  user: AuthUser;
  onLogout?: () => void;
  onAvatarClick?: () => void;
  size?: number;
  className?: string;
  testId?: string;
}
