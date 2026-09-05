import type { ReactElement } from "react";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import type { ExpressiveShapeName } from "./shapes";

export type ChipShape = ExpressiveShapeName | string | number;

export type InstitutionType = "school" | "company";

export interface InstitutionConfig {
  key: InstitutionType;
  label: string;
  chipColor:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | "default";
  chipShape: ChipShape;
  icon: ReactElement;
}

export const INSTITUTION_CONFIGS: Record<InstitutionType, InstitutionConfig> = {
  school: {
    key: "school",
    label: "School",
    chipColor: "info", // Cyan in MD3 theme
    chipShape: "clamshell", // MD3 clamshell shape
    icon: <SchoolRoundedIcon data-testid="institution-icon-school" />,
  },
  company: {
    key: "company",
    label: "Institution",
    chipColor: "warning", // Yellow in MD3 theme
    chipShape: "semicircle", // MD3 semicircle shape
    icon: <BusinessRoundedIcon data-testid="institution-icon-company" />,
  },
};

const INSTITUTION_TYPE_ALIASES: Record<string, InstitutionType> = {
  academic: "school",
  school: "school",
  academy: "school",
  university: "school",
  college: "school",
  institute: "school",
  education: "school",
  company: "company",
  companies: "company",
  institution: "company",
  institutions: "company",
  corporate: "company",
  business: "company",
  enterprise: "company",
  organization: "company",
  org: "company",
  individual: "school",
  individuals: "school",
  personal: "school",
  freelance: "school",
  independent: "school",
  solo: "school",
  self: "school",
  person: "school",
};

export function normalizeInstitutionType(
  type?: string | null,
): InstitutionType {
  const norm = (type || "").toLowerCase().trim();
  return INSTITUTION_TYPE_ALIASES[norm] ?? "school";
}

export function getInstitutionConfig(type?: string | null): InstitutionConfig {
  const normalized = normalizeInstitutionType(type);
  return INSTITUTION_CONFIGS[normalized];
}
