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
  institutionId?: string;
  name: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  startYear?: string | number;
  validFrom?: string;
  validUntil?: string;
}
