import type { BoxProps } from "@mui/material/Box";
import type { Td1MrzData } from "~/utils/icao9303";
import type { CohortConfig } from "~/types/institution";

export interface ProfileCardProps extends Omit<BoxProps, "onChange"> {
  /**
   * School or institution logo URL
   */
  schoolLogoUrl?: string;
  /**
   * Name of the institution
   */
  institutionName?: string;
  /**
   * Structured cohort or cohort config to display with CohortChip
   */
  cohort?: CohortConfig;
  /**
   * Cohort name to display in the badge (legacy fallback)
   */
  cohortName?: string;
  /**
   * Year to display in the badge
   */
  year?: string;
  /**
   * User's avatar URL
   */
  avatarUrl?: string;
  /**
   * User's role for the chip
   */
  role?: "student" | "instructor" | "admin";
  /**
   * Github username for the badge
   */
  githubUsername?: string;
  /**
   * First name of the user
   */
  firstName?: string;
  /**
   * Family name of the user (will be enforced as uppercase)
   */
  familyName?: string;
  /**
   * Email prefix of the user
   */
  emailPrefix?: string;
  /**
   * Institutional email domain
   */
  emailDomain?: string;
  /**
   * Username / email prefix pattern (e.g. "{first}.{last}", "{f}{last}")
   */
  usernamePattern?: string;
  /**
   * Data for the MRZ zone on the back
   */
  mrzData?: Td1MrzData;
  /**
   * Callback fired when text fields change
   */
  onChange?: (field: string, value: string) => void;
  /**
   * Callback fired when avatar is clicked to edit
   */
  onAvatarEdit?: () => void;
  /**
   * Whether the avatar inside the card is interactive and editable
   */
  editableAvatar?: boolean;
  /**
   * Callback fired when the avatar image URL is updated
   */
  onAvatarChange?: (avatarUrl: string) => void;
  /**
   * Size of the cohort chip in the card header (defaults to "medium")
   */
  cohortChipSize?: "small" | "medium" | "large";
}
