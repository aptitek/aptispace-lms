import type { ReactNode } from "react";
import type { AuthUser } from "~/utils/auth";

export interface AdminLayoutProps {
  user?: AuthUser | null;
  onLogout: () => void;
  tabs: ReactNode;
  children?: ReactNode;
}
