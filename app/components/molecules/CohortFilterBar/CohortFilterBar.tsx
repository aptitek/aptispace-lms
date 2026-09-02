import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import YearRangePicker from "~/components/molecules/YearRangePicker/YearRangePicker";
import {
  DIPLOMA_OPTIONS,
  COMMON_SPECIALTY_TAGS,
  getSpecialtySlug,
} from "~/utils/cohortFormat";

export interface CohortFilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  diplomaFilter: string;
  onDiplomaFilterChange: (diploma: string) => void;
  yearFilter: string | number;
  onYearFilterChange: (year: string | number) => void;
  tagFilter: string;
  onTagFilterChange: (tag: string) => void;
  startYearMin?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  startYearMax?: number | null;
  onStartYearMaxChange?: (year: number | null) => void;
  availableTags?: string[];
  testId?: string;
}

interface ActiveFilterCriteria {
  query: string;
  diplomaFilter: string;
  yearFilter: string | number;
  tagFilter: string;
  startYearMin: number | null;
  startYearMax: number | null;
}

function checkHasActiveFilters(criteria: ActiveFilterCriteria): boolean {
  if (criteria.query.trim().length > 0) return true;
  if (criteria.diplomaFilter !== "all") return true;
  if (criteria.yearFilter !== "all" && criteria.yearFilter !== "") return true;
  if (criteria.tagFilter !== "all") return true;
  return criteria.startYearMin !== null || criteria.startYearMax !== null;
}

function computeNextIncrementYear(yearFilter: string | number): number {
  if (yearFilter === "all" || yearFilter === "") return 1;
  const current = Number(yearFilter);
  return current < 20 ? current + 1 : current;
}

function computeNextDecrementYear(
  yearFilter: string | number,
): string | number {
  if (yearFilter === "all" || yearFilter === "") return 0;
  const current = Number(yearFilter);
  return current > 0 ? current - 1 : "all";
}

function parseCohortYearFilterInput(text: string): string | number {
  const raw = text.trim();
  if (raw === "" || raw.toLowerCase() === "all") return "all";
  const num = parseInt(raw, 10);
  return !isNaN(num) && num >= 0 && num <= 20 ? num : "all";
}

export function CohortFilterBar({
  query,
  onQueryChange,
  diplomaFilter,
  onDiplomaFilterChange,
  yearFilter,
  onYearFilterChange,
  tagFilter,
  onTagFilterChange,
  startYearMin = null,
  onStartYearMinChange,
  startYearMax = null,
  onStartYearMaxChange,
  availableTags,
  testId = "cohort-filter-bar",
}: CohortFilterBarProps) {
  const { t } = useTranslation("common");

  // Merge available tags from cohorts with standard common tags, removing duplicates
  const allTags = Array.from(
    new Set([...(availableTags || []), ...COMMON_SPECIALTY_TAGS]),
  );

  const hasActiveFilters = checkHasActiveFilters({
    query,
    diplomaFilter,
    yearFilter,
    tagFilter,
    startYearMin,
    startYearMax,
  });

  const handleClearFilters = () => {
    onQueryChange("");
    onDiplomaFilterChange("all");
    onYearFilterChange("all");
    onTagFilterChange("all");
    if (onStartYearMinChange) onStartYearMinChange(null);
    if (onStartYearMaxChange) onStartYearMaxChange(null);
  };

  const endAdornment = query ? (
    <InputAdornment position="end">
      <IconButton
        size="small"
        onClick={() => onQueryChange("")}
        aria-label={t("common:clearSearch", "Clear search")}
      >
        <ClearIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </InputAdornment>
  ) : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        alignItems: "center",
        width: "100%",
        p: 2,
        mb: 2.5,
        borderRadius: "12px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
      data-testid={testId}
    >
      {/* Diploma Filter */}
      <TextField
        select
        size="small"
        label={t("diplomas.title", "Diploma")}
        value={diplomaFilter}
        onChange={(e) => onDiplomaFilterChange(e.target.value)}
        sx={{ minWidth: 150 }}
        data-testid="cohort-diploma-filter"
      >
        <MenuItem value="all">
          <em>{t("diplomas.all", "All Diplomas")}</em>
        </MenuItem>
        {DIPLOMA_OPTIONS.map((opt) => (
          <MenuItem key={opt.code} value={opt.code}>
            {opt.code} – {t(opt.labelKey, opt.defaultLabel)}
          </MenuItem>
        ))}
      </TextField>

      {/* Year Filter: Number field with -+ */}
      <TextField
        size="small"
        label={t("cohortYear.title", "Year")}
        placeholder={t("cohortYear.all", "All")}
        value={yearFilter === "all" ? "" : yearFilter}
        onChange={(e) =>
          onYearFilterChange(parseCohortYearFilterInput(e.target.value))
        }
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={() =>
                    onYearFilterChange(computeNextDecrementYear(yearFilter))
                  }
                  aria-label={t("cohortYear.decrease", "Decrease year")}
                  sx={{ p: 0.5 }}
                  data-testid="cohort-year-decrement"
                >
                  <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() =>
                    onYearFilterChange(computeNextIncrementYear(yearFilter))
                  }
                  aria-label={t("cohortYear.increase", "Increase year")}
                  sx={{ p: 0.5 }}
                  data-testid="cohort-year-increment"
                >
                  <AddRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          },
          htmlInput: {
            inputMode: "numeric",
            pattern: "[0-9]*",
            style: { textAlign: "center" },
            "data-testid": "cohort-year-filter",
          },
        }}
        sx={{
          width: 140,
          "& input": { textAlign: "center" },
        }}
        data-testid="cohort-year-filter-container"
      />

      {/* Start Year Range Filter */}
      {onStartYearMinChange && onStartYearMaxChange && (
        <YearRangePicker
          startYearMin={startYearMin}
          startYearMax={startYearMax}
          onStartYearMinChange={onStartYearMinChange}
          onStartYearMaxChange={onStartYearMaxChange}
          testId="cohort-start-year-range-picker"
        />
      )}

      {/* Specialty / Tag Filter */}
      <TextField
        select
        size="small"
        label={t("specialties.title", "Subject / Specialty")}
        value={tagFilter}
        onChange={(e) => onTagFilterChange(e.target.value)}
        sx={{ minWidth: 170 }}
        data-testid="cohort-tag-filter"
      >
        <MenuItem value="all">
          <em>{t("specialties.all", "All Subjects")}</em>
        </MenuItem>
        {allTags.map((tag) => {
          const slug = getSpecialtySlug(tag);
          const label = t(`specialties.${slug}`, tag);
          return (
            <MenuItem key={tag} value={tag}>
              {label !== tag ? `${label} (${tag})` : tag}
            </MenuItem>
          );
        })}
      </TextField>

      {/* Search Input */}
      <TextField
        size="small"
        placeholder={t(
          "cohortFilter.searchPlaceholder",
          "Search cohorts by name, description, tags...",
        )}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment,
          },
        }}
        sx={{
          flex: 1,
          minWidth: 200,
        }}
        data-testid="cohort-search-field"
      />

      {/* Reset filters button */}
      {hasActiveFilters && (
        <Button
          size="small"
          variant="text"
          color="secondary"
          onClick={handleClearFilters}
          startIcon={<FilterListRoundedIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
          data-testid="cohort-clear-filters-button"
        >
          {t("cohortFilter.clearFilters", "Clear filters")}
        </Button>
      )}
    </Box>
  );
}

export default CohortFilterBar;
