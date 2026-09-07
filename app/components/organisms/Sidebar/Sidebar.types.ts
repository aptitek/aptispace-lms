import type { AuthUser } from "~/utils/auth";
import type { HeaderTabItem } from "~/components/molecules/HeaderTabs/HeaderTabs.types";

export type SidebarVariant = "default" | "ghost";

export interface SidebarProps {
  variant?: SidebarVariant;
  user?: AuthUser | null;
  tabs?: HeaderTabItem[];
  showTabs?: boolean;
  hoverDelay?: number;
  isOnboarding?: boolean;
  onLogout?: () => void;
  onReturnToAdmin?: () => void;
  onUserUpdated?: (updatedUser: AuthUser) => void;
  className?: string;
  "data-testid"?: string;
}
