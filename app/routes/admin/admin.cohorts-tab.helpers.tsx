import type { TFunction } from "i18next";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import {
  parseCohortName,
  DIPLOMA_OPTIONS,
  getSpecialtySlug,
} from "~/utils/cohortFormat";
import SegmentedChip from "~/components/molecules/SegmentedChip/SegmentedChip";

export interface CohortFilterOptions {
  cohortStartYearMin: number | null;
  cohortStartYearMax: number | null;
  cohortDiplomaFilter: string;
  cohortYearFilter: string | number;
  cohortTagFilter: string;
  cohortSearchQuery: string;
}

export function matchesCohortDateRange(
  startDate?: string | Date | null,
  minYear?: number | null,
  maxYear?: number | null,
): boolean {
  if (minYear == null && maxYear == null) return true;
  if (!startDate) return false;
  const yr = new Date(startDate).getFullYear();
  if (isNaN(yr)) return false;
  if (minYear != null && yr < minYear) return false;
  if (maxYear != null && yr > maxYear) return false;
  return true;
}

export function matchesCohortSearch(
  c: CohortWithInstitution,
  tags: string[],
  query: string,
): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  const nameMatch = (c.name || "").toLowerCase().includes(q);
  const descMatch = Boolean(c.description?.toLowerCase().includes(q));
  const tagMatch = tags.some((t) => t.toLowerCase().includes(q));
  return nameMatch || descMatch || tagMatch;
}

export function matchesCohortDiploma(diploma: string, filter: string): boolean {
  if (filter === "all") return true;
  return diploma === filter.toUpperCase();
}

export function matchesCohortYear(
  year: number,
  filter: string | number,
): boolean {
  if (filter === "all" || filter === "") return true;
  return year === Number(filter);
}

export function matchesCohortTag(tags: string[], filter: string): boolean {
  if (filter === "all") return true;
  const lowerFilter = filter.toLowerCase();
  return tags.some((t) => t.toLowerCase() === lowerFilter);
}

export function extractCohortFilterAttributes(c: CohortWithInstitution) {
  const parsed = parseCohortName(c.name);
  const diploma = (c.diploma || parsed.diploma || "").trim().toUpperCase();
  const year = c.year ?? parsed.year ?? 0;
  const tags = c.tags && c.tags.length > 0 ? c.tags : parsed.tags;
  return { diploma, year, tags };
}

export function matchesCohortFilter(
  c: CohortWithInstitution,
  options: CohortFilterOptions,
): boolean {
  if (
    !matchesCohortDateRange(
      c.startDate,
      options.cohortStartYearMin,
      options.cohortStartYearMax,
    )
  ) {
    return false;
  }

  const { diploma, year, tags } = extractCohortFilterAttributes(c);

  if (!matchesCohortDiploma(diploma, options.cohortDiplomaFilter)) return false;
  if (!matchesCohortYear(year, options.cohortYearFilter)) return false;
  if (!matchesCohortTag(tags, options.cohortTagFilter)) return false;
  return matchesCohortSearch(c, tags, options.cohortSearchQuery);
}

export function isCohortCardSelected(
  cohort: CohortWithInstitution,
  selectedCohort: CohortWithInstitution | null,
): boolean {
  if (!selectedCohort) return false;
  if (selectedCohort.id && cohort.id) {
    return selectedCohort.id === cohort.id;
  }
  return Boolean(
    selectedCohort.name && cohort.name && selectedCohort.name === cohort.name,
  );
}

export function renderDiplomaFilterChip(
  diplomaCode: string | number,
  t: TFunction,
) {
  if (diplomaCode === "all") {
    return (
      <SegmentedChip
        segments={[{ label: t("diplomas.all", "All Diplomas") }]}
        size="small"
      />
    );
  }
  const opt = DIPLOMA_OPTIONS.find((o) => o.code === diplomaCode);
  return (
    <SegmentedChip
      cohort={{
        diploma: String(diplomaCode),
        tags: opt ? [t(opt.labelKey, opt.defaultLabel)] : undefined,
      }}
      size="small"
    />
  );
}

export function renderSpecialtyFilterChip(tag: string | number, t: TFunction) {
  if (tag === "all") {
    return (
      <SegmentedChip
        segments={[{ label: t("filterBar.allTags", "All Specialties") }]}
        size="small"
      />
    );
  }
  const tagStr = String(tag);
  const slug = getSpecialtySlug(tagStr);
  const localized = t(`specialties.${slug}`, tagStr);
  const segments =
    localized.toLowerCase() !== tagStr.toLowerCase()
      ? [{ label: tagStr, bold: true }, { label: localized }]
      : [{ label: tagStr, bold: true }];
  return <SegmentedChip segments={segments} size="small" />;
}
