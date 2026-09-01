import type { AuthUser } from "../../../utils/auth";
import type {
  SchoolConfig,
  CohortConfig,
} from "../OnboardingCard/OnboardingCard.types";

export interface ProfileCardModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Close callback
   */
  onClose: () => void;
  /**
   * Active authenticated user
   */
  user: AuthUser;
  /**
   * Optional school/institution configuration
   */
  school?: SchoolConfig;
  /**
   * Optional cohort configuration
   */
  cohort?: CohortConfig;
  /**
   * Callback fired when user is updated and saved
   */
  onUserUpdated?: (updatedUser: AuthUser) => void;
  /**
   * Custom save endpoint (defaults to /api/auth)
   */
  saveEndpoint?: string;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Test identifier
   */
  testId?: string;
}

export type ProfileSaveStatus = "idle" | "saving" | "saved" | "error";

export interface ProfileSavePayload {
  action: "updateProfile";
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}
