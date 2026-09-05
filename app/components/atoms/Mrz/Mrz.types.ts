export type { Td1MrzData, MrzValidationResult } from "~/utils/icao9303";
import type { Td1MrzData } from "~/utils/icao9303";

export interface MrzProps {
  cardData?: Td1MrzData;
  lines?: [string, string, string];
  showValidation?: boolean;
  compact?: boolean;
  darkOnLight?: boolean;
  fullWidth?: boolean;
  className?: string;
  testId?: string;
}

/**
 * @deprecated Use MrzProps instead
 */
export type MrzZoneProps = MrzProps;
