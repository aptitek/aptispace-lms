import type { UserRole, AccountDefinition } from "~/utils/auth";

export type RoleFilterOption = "all" | UserRole;

export interface DevImpersonatorProps {
  /**
   * Callback fired when an account is selected for impersonation.
   */
  onSelectAccount?: (account: AccountDefinition) => void;

  /**
   * Legacy callback for selecting by persona role (backward compatibility).
   */
  onSelectPersona?: (personaRole: UserRole) => void;

  /**
   * Optional callback when a new account is created.
   */
  onAccountCreated?: (account: AccountDefinition) => void;

  /**
   * ID of the currently authenticated / active user session.
   */
  currentUserId?: string;

  /**
   * Whether an action or initial fetch is loading.
   */
  loading?: boolean;

  /**
   * Optional pre-populated list of accounts (useful for Storybook and testing).
   */
  initialAccounts?: AccountDefinition[];

  /**
   * Optional custom CSS class name.
   */
  className?: string;

  /**
   * Test identifier.
   */
  "data-testid"?: string;
}
