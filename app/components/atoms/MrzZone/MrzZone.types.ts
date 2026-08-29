export interface Td1MrzData {
  documentCode?: string; // e.g. "ID" or "I"
  issuingState?: string; // e.g. "APT" or "UTO"
  documentNumber: string; // up to 9 alphanumeric chars
  birthDate?: string; // YYMMDD
  sex?: "M" | "F" | "X" | "<";
  expiryDate?: string; // YYMMDD
  nationality?: string; // 3 chars, e.g. "APT"
  surname: string;
  givenNames?: string;
  optional1?: string;
  optional2?: string;
}

export interface MrzValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface MrzZoneProps {
  cardData?: Td1MrzData;
  lines?: [string, string, string];
  showValidation?: boolean;
  compact?: boolean;
  darkOnLight?: boolean;
  fullWidth?: boolean;
  className?: string;
  testId?: string;
}
