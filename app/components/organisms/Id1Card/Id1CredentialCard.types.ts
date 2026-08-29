import type { Id1BaseCardProps } from "./Id1BaseCard.types";

/** Credential data fields for ID-1 cards */
export interface Id1CardCredential {
  // --- Generic / AptiSpace cadet identity ---
  id?: string;
  name?: string;
  callSign?: string;
  role?: string;
  division?: string;
  clearanceLevel?: string;
  issueDate?: string;
  expiryDate?: string;
  avatarUrl?: string;
  securityCode?: string;
  barcodeValue?: string;

  // --- French CNIe fields (bilingual labels, see FrenchIdCard.layout.ts) ---
  surname?: string; // Nom / Surname
  givenNames?: string; // Prénoms / Given names
  sex?: string; // Sexe / Sex — "M" | "F"
  nationality?: string; // Nationalité / Nationality — "FRA"
  dateOfBirth?: string; // Date de naissance — DD.MM.YYYY
  placeOfBirth?: string; // Lieu de naissance — "PARIS (75)"
  documentNumber?: string; // N° du document — 9 chars
  can?: string; // CAN — 6-digit Card Access Number
  address?: string; // Adresse / Address (multi-line)
  height?: string; // Taille / Height — "1,75 m"
  authority?: string; // Autorité de délivrance / Issuing authority
}

/** Selectable credential layout rendered inside the ID-1 card. */
export type Id1CredentialVariant = "aptispace" | "french-id";

/**
 * Props for Id1CredentialCard - extends Id1BaseCard with credential-specific features.
 * This component combines the base card physical features with credential layouts.
 */
export interface Id1CredentialCardProps extends Omit<
  Id1BaseCardProps,
  "frontContent" | "backContent" | "renderGhostContent"
> {
  // Credential Data & Layout
  credential?: Partial<Id1CardCredential>;
  layout?: Id1CredentialVariant;

  // Content override (use this to provide custom content instead of layout system)
  content?: React.ReactNode;
}
