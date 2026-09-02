import type { ReactElement } from "react";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import type { ChipShape } from "../components/atoms/Chip/Chip.types";

export type InstitutionType = "school" | "company" | "individual";

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
    label: "Company",
    chipColor: "default", // Neutral gray in MD3 theme
    chipShape: "semicircle", // MD3 semicircle shape
    icon: <BusinessRoundedIcon data-testid="institution-icon-company" />,
  },
  individual: {
    key: "individual",
    label: "Individual",
    chipColor: "default", // Neutral gray in MD3 theme
    chipShape: "square", // MD3 square/rectangle shape
    icon: <PersonRoundedIcon data-testid="institution-icon-individual" />,
  },
};

const INSTITUTION_TYPE_ALIASES: Record<string, InstitutionType> = {
  school: "school",
  academy: "school",
  university: "school",
  college: "school",
  institute: "school",
  education: "school",
  company: "company",
  companies: "company",
  corporate: "company",
  business: "company",
  enterprise: "company",
  organization: "company",
  org: "company",
  individual: "individual",
  individuals: "individual",
  personal: "individual",
  freelance: "individual",
  independent: "individual",
  solo: "individual",
  self: "individual",
  person: "individual",
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
