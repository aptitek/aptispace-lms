import type { BoxProps } from "@mui/material/Box";
import type { Td1MrzData } from "../../atoms/MrzZone/MrzZone.types";

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
   * Cohort name to display in the badge
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
}
