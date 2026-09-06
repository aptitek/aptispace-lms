import type { AuthUser } from "~/utils/auth";
import type { HeaderTabItem } from "~/components/molecules/HeaderTabs/HeaderTabs.types";

export interface SidebarProps {
  user?: AuthUser | null;
  tabs?: HeaderTabItem[];
  showTabs?: boolean;
  hoverDelay?: number;
  onLogout?: () => void;
  onReturnToAdmin?: () => void;
  onUserUpdated?: (updatedUser: AuthUser) => void;
  className?: string;
  "data-testid"?: string;
}
