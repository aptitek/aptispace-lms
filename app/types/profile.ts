import type { UserRole } from "../utils/auth";

export interface OnboardingProfile {
  firstName: string;
  familyName: string;
  email: string;
  avatarUrl: string;
  role?: UserRole;
  githubUsername?: string;
  documentNumber?: string;
  nationality?: string;
  sex?: "M" | "F" | "X" | "<";
  birthDate?: string;
  expiryDate?: string;
}

export interface CohortValidity {
  validFrom: string;
  validUntil: string;
  formatted: string;
  startYear: number;
  endYear: number;
}
