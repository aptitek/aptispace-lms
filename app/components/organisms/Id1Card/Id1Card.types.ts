export type {
  Id1CardSide,
  Id1CardOrientation,
  Id1CardSize,
  Id1CardFlipDirection,
  Id1BaseCardProps,
  ISO_7810_ID1_Type,
  ISO_19794_5_BIOMETRICS_Type,
} from "./Id1BaseCard.types";

export type {
  Id1CardCredential,
  Id1CredentialVariant,
  Id1CredentialCardProps,
  Id1CredentialCardProps as Id1CardProps,
} from "./Id1CredentialCard.types";

export { ISO_7810_ID1, ISO_19794_5_BIOMETRICS } from "./Id1BaseCard.types";

import type {
  Id1CardCredential,
  Id1CredentialVariant,
} from "./Id1CredentialCard.types";
import type { Id1CardSide } from "./Id1BaseCard.types";

export interface Id1CredentialLayoutProps {
  credential?: Partial<Id1CardCredential>;
  side?: Id1CardSide;
  isPortrait?: boolean;
  className?: string;
  testId?: string;
  layout?: Id1CredentialVariant;
}
