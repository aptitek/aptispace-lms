import type { AuthUser } from "../../../utils/auth";

export interface HeaderUserAvatarProps {
  user: AuthUser;
  onLogout?: () => void;
  size?: number;
  className?: string;
  testId?: string;
}
