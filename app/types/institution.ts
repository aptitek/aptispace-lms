export interface SchoolConfig {
  id: string;
  name: string;
  slug?: string;
  type?: "academic" | "company" | string;
  logoUrl?: string | null;
  emailDomain?: string;
  usernamePattern?: string; // e.g. "{first}.{last}" or "{f}{last}"
  emailPattern?: string; // legacy alias
}

export interface CohortConfig {
  id?: string;
  institutionId?: string;
  name: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  startYear?: string | number;
  validFrom?: string;
  validUntil?: string;
}
