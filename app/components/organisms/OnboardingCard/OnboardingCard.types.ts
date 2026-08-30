import type {
  IdCardOrientation,
  IdCardSide,
  IdCardSize,
  IdHoloLayer,
} from "../../molecules/IdCard/IdCard.types";

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
  startDate?: string;
  endDate?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface CohortValidity {
  validFrom: string;
  validUntil: string;
  formatted: string;
  startYear: number;
  endYear: number;
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
  side?: IdCardSide;
  /**
   * Controlled 3D flipped state
   */
  isFlipped?: boolean;
  /**
   * Callback fired when card side flips
   */
  onFlip?: (side: IdCardSide) => void;
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
  orientation?: IdCardOrientation;
  /**
   * Card size preset
   * @default "responsive"
   */
  size?: IdCardSize;
  /**
   * Holographic theme variant
   * @default "rainbow"
   */
  holoVariant?: OnboardingHoloVariant;
  /**
   * Holographic strength multiplier
   */
  holoStrength?: number;
  /**
   * Custom or additional holographic layers
   */
  holoLayers?: (string | IdHoloLayer)[];
  /**
   * Whether procedural Guilloche curves are displayed
   * @default true
   */
  showGuilloche?: boolean;
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
   * Whether specular white glare overlay is displayed on tilt/hover
   * @default false
   */
  showGlare?: boolean;
  /**
   * Glare opacity multiplier
   */
  glareOpacity?: number;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Accessible test ID
   */
  testId?: string;
}
