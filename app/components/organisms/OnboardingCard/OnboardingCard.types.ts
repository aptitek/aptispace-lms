import type {
  Id1CardOrientation,
  Id1CardSide,
  Id1CardSize,
} from "../../molecules/Id1Card/Id1Card.types";

export type OnboardingHoloVariant = "default" | "rainbow" | "cosmic" | "gold";

export interface SchoolConfig {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string | null;
  emailDomain?: string;
  emailPattern?: string; // e.g. "{first}.{last}@{domain}" or "{f}{last}@{domain}"
}

export interface CohortConfig {
  id?: string;
  name: string;
  description?: string;
}

export interface OnboardingProfile {
  firstName: string;
  familyName: string;
  email: string;
  avatarUrl: string;
  documentNumber?: string;
  callSign?: string;
  clearanceLevel?: string;
  division?: string;
  nationality?: string;
  sex?: "M" | "F" | "X" | "<";
  birthDate?: string;
  expiryDate?: string;
}

export interface OnboardingCardProps {
  /**
   * School / Institution information
   */
  school: SchoolConfig;
  /**
   * Cohort / Class information
   */
  cohort?: CohortConfig;
  /**
   * Cadet / Student profile state (controlled)
   */
  profile?: OnboardingProfile;
  /**
   * Default profile state (uncontrolled)
   */
  defaultProfile?: OnboardingProfile;
  /**
   * Callback fired when any profile attribute (names, email, avatar) updates
   */
  onProfileChange?: (profile: OnboardingProfile) => void;
  /**
   * Active card side ("front" | "back")
   * @default "front"
   */
  side?: Id1CardSide;
  /**
   * Controlled 3D flipped state
   */
  isFlipped?: boolean;
  /**
   * Callback fired when card side flips
   */
  onFlip?: (side: Id1CardSide) => void;
  /**
   * Callback fired with boolean flipped state
   */
  onFlipChange?: (isFlipped: boolean) => void;
  /**
   * Allow clicking the card surface to flip in 3D
   * @default false
   */
  flipOnClick?: boolean;
  /**
   * Card orientation
   * @default "landscape"
   */
  orientation?: Id1CardOrientation;
  /**
   * Card size preset
   * @default "responsive"
   */
  size?: Id1CardSize;
  /**
   * Holographic theme variant
   * @default "rainbow"
   */
  holoVariant?: OnboardingHoloVariant;
  /**
   * Whether card is transparent glassmorphic acrylic
   * @default true
   */
  transparent?: boolean;
  /**
   * Whether the card fields are read only or interactive inputs
   * @default false
   */
  readOnly?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Accessible test ID
   */
  testId?: string;
}
