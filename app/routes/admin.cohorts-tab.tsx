import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import SchoolCard, {
  SchoolCardSkeleton,
} from "~/components/molecules/SchoolCard/SchoolCard";
import CohortCard, {
  CohortCardSkeleton,
} from "~/components/molecules/CohortCard/CohortCard";
import InstitutionFilterBar from "~/components/molecules/InstitutionFilterBar/InstitutionFilterBar";
import InstitutionInspector from "~/components/organisms/InstitutionInspector/InstitutionInspector";
import CohortInspector from "~/components/organisms/CohortInspector/CohortInspector";
import CohortFilterBar from "~/components/molecules/CohortFilterBar/CohortFilterBar";
import { parseCohortName } from "~/utils/cohortFormat";
import { normalizeInstitutionType } from "~/tokens/institutions";
import {
  TabPanelContainer,
  MainColumn,
  SideColumn,
  MD3CollectionGrid,
} from "./admin.styles";

export interface AdminCohortsTabPanelProps {
  schools: SchoolConfig[];
  cohorts: CohortWithInstitution[];
  schoolStudentCounts: Record<string, number>;
  cohortStudentCounts: Record<string, number>;
  selectedSchool: SchoolConfig | null;
  selectedSchoolForEdit: SchoolConfig | null;
  selectedCohortForEdit: CohortWithInstitution | null;
  onSchoolClick: (school: SchoolConfig) => void;
  onCohortClick: (cohort: CohortConfig) => void;
  onCreateNewSchool: () => void;
  onCreateNewCohort: () => void;
  onCloseSchoolEdit: () => void;
  onCloseCohortEdit: () => void;
  onSaveInstitution: (payload: {
    id?: string;
    name: string;
    slug: string;
    type?: string;
    logoUrl?: string;
    emailDomain?: string;
    usernamePattern?: string;
  }) => void;
  onSaveCohort: (payload: {
    id?: string;
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    diploma?: string;
    year?: number | null;
    tags?: string[];
  }) => void;
  isSubmitting: boolean;
}

interface CohortFilterOptions {
  cohortStartYearMin: number | null;
  cohortStartYearMax: number | null;
  cohortDiplomaFilter: string;
  cohortYearFilter: string | number;
  cohortTagFilter: string;
  cohortSearchQuery: string;
}

function matchesCohortDateRange(
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

function matchesCohortSearch(
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

function matchesCohortDiploma(diploma: string, filter: string): boolean {
  if (filter === "all") return true;
  return diploma === filter.toUpperCase();
}

function matchesCohortYear(year: number, filter: string | number): boolean {
  if (filter === "all" || filter === "") return true;
  return year === Number(filter);
}

function matchesCohortTag(tags: string[], filter: string): boolean {
  if (filter === "all") return true;
  const lowerFilter = filter.toLowerCase();
  return tags.some((t) => t.toLowerCase() === lowerFilter);
}

function extractCohortFilterAttributes(c: CohortWithInstitution) {
  const parsed = parseCohortName(c.name);
  const diploma = (c.diploma || parsed.diploma || "").trim().toUpperCase();
  const year = c.year ?? parsed.year ?? 0;
  const tags = c.tags && c.tags.length > 0 ? c.tags : parsed.tags;
  return { diploma, year, tags };
}

function matchesCohortFilter(
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

export function AdminCohortsTabPanel({
  schools,
  cohorts,
  schoolStudentCounts,
  cohortStudentCounts,
  selectedSchool,
  selectedSchoolForEdit,
  selectedCohortForEdit,
  onSchoolClick,
  onCohortClick,
  onCreateNewSchool,
  onCreateNewCohort,
  onCloseSchoolEdit,
  onCloseCohortEdit,
  onSaveInstitution,
  onSaveCohort,
  isSubmitting,
}: AdminCohortsTabPanelProps) {
  const { t } = useTranslation("common");
  const [institutionQuery, setInstitutionQuery] = useState("");
  const [institutionTypeFilter, setInstitutionTypeFilter] = useState("all");

  const [cohortStartYearMin, setCohortStartYearMin] = useState<number | null>(
    null,
  );
  const [cohortStartYearMax, setCohortStartYearMax] = useState<number | null>(
    null,
  );

  // Cohort Grid Filter State
  const [cohortDiplomaFilter, setCohortDiplomaFilter] = useState<string>("all");
  const [cohortYearFilter, setCohortYearFilter] = useState<string | number>(
    "all",
  );
  const [cohortTagFilter, setCohortTagFilter] = useState<string>("all");
  const [cohortSearchQuery, setCohortSearchQuery] = useState<string>("");

  const hasCohortsInspectorOpen = Boolean(
    selectedSchoolForEdit || selectedCohortForEdit,
  );

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      if (institutionTypeFilter !== "all") {
        const normType = normalizeInstitutionType(school.type);
        const targetNorm = normalizeInstitutionType(institutionTypeFilter);
        if (normType !== targetNorm) return false;
      }
      if (institutionQuery.trim()) {
        const q = institutionQuery.toLowerCase().trim();
        const nameMatch = school.name.toLowerCase().includes(q);
        const slugMatch = school.slug?.toLowerCase().includes(q);
        if (!nameMatch && !slugMatch) return false;
      }
      return true;
    });
  }, [schools, institutionQuery, institutionTypeFilter]);

  const schoolCohorts = useMemo(() => {
    if (!selectedSchool) return [];
    return cohorts.filter((c) => c.institutionId === selectedSchool.id);
  }, [cohorts, selectedSchool]);

  const availableSchoolTags = useMemo(() => {
    const tagSet = new Set<string>();
    schoolCohorts.forEach((c) => {
      const parsed = parseCohortName(c.name);
      const tags = c.tags && c.tags.length > 0 ? c.tags : parsed.tags;
      tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [schoolCohorts]);

  const filteredCohorts = useMemo(() => {
    if (!selectedSchool) return [];
    return schoolCohorts.filter((c) =>
      matchesCohortFilter(c, {
        cohortStartYearMin,
        cohortStartYearMax,
        cohortDiplomaFilter,
        cohortYearFilter,
        cohortTagFilter,
        cohortSearchQuery,
      }),
    );
  }, [
    schoolCohorts,
    selectedSchool,
    cohortStartYearMin,
    cohortStartYearMax,
    cohortDiplomaFilter,
    cohortYearFilter,
    cohortTagFilter,
    cohortSearchQuery,
  ]);

  return (
    <TabPanelContainer
      hasSidePanel={hasCohortsInspectorOpen}
      role="tabpanel"
      id="admin-tabpanel-1"
      aria-labelledby="admin-tab-1"
      data-testid="admin-tabpanel-cohorts"
    >
      <MainColumn>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            {t("admin.schoolsTitle", "Schools & Institutions")}
          </Typography>

          <InstitutionFilterBar
            query={institutionQuery}
            onQueryChange={setInstitutionQuery}
            typeFilter={institutionTypeFilter}
            onTypeFilterChange={setInstitutionTypeFilter}
            startYearMin={cohortStartYearMin}
            onStartYearMinChange={setCohortStartYearMin}
            startYearMax={cohortStartYearMax}
            onStartYearMaxChange={setCohortStartYearMax}
          />

          <MD3CollectionGrid data-testid="schools-zone">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.id || school.name}
                school={school}
                studentCount={
                  school.id ? schoolStudentCounts[school.id] || 0 : 0
                }
                isSelected={Boolean(
                  selectedSchool?.id && selectedSchool.id === school.id,
                )}
                onClick={onSchoolClick}
              />
            ))}
            <SchoolCardSkeleton onClick={onCreateNewSchool} />
          </MD3CollectionGrid>
        </Box>

        {selectedSchool && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              {t("admin.cohortsForSchool", {
                school: selectedSchool.name,
                defaultValue: `Cohorts for ${selectedSchool.name}`,
              })}
            </Typography>

            <CohortFilterBar
              query={cohortSearchQuery}
              onQueryChange={setCohortSearchQuery}
              diplomaFilter={cohortDiplomaFilter}
              onDiplomaFilterChange={setCohortDiplomaFilter}
              yearFilter={cohortYearFilter}
              onYearFilterChange={setCohortYearFilter}
              tagFilter={cohortTagFilter}
              onTagFilterChange={setCohortTagFilter}
              availableTags={availableSchoolTags}
            />

            <MD3CollectionGrid data-testid="cohorts-zone">
              {filteredCohorts.map((cohort) => (
                <CohortCard
                  key={cohort.id || cohort.name}
                  cohort={cohort}
                  studentCount={
                    cohort.id ? cohortStudentCounts[cohort.id] || 0 : 0
                  }
                  onClick={onCohortClick}
                />
              ))}
              <CohortCardSkeleton onClick={onCreateNewCohort} />
            </MD3CollectionGrid>
          </Box>
        )}
      </MainColumn>

      {hasCohortsInspectorOpen && (
        <SideColumn>
          {selectedSchoolForEdit && (
            <InstitutionInspector
              institution={selectedSchoolForEdit}
              onClose={onCloseSchoolEdit}
              onSave={onSaveInstitution}
              isSubmitting={isSubmitting}
            />
          )}

          {selectedCohortForEdit && (
            <CohortInspector
              cohort={selectedCohortForEdit}
              onClose={onCloseCohortEdit}
              onSave={onSaveCohort}
              isSubmitting={isSubmitting}
            />
          )}
        </SideColumn>
      )}
    </TabPanelContainer>
  );
}
export default AdminCohortsTabPanel;
