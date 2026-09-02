import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import {
  ACADEMIC_PERIODS,
  type AcademicPeriodType,
  calculateDurationMonths,
} from "~/utils/academicYear";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import {
  DIPLOMA_OPTIONS,
  YEAR_OPTIONS,
  COMMON_SPECIALTY_TAGS,
  getSpecialtySlug,
} from "~/utils/cohortFormat";

import CohortChip from "../../atoms/CohortChip/CohortChip";

export interface CohortStructuredFieldsProps {
  diploma: string;
  onDiplomaChange: (newDiploma: string) => void;
  year: number;
  onYearChange: (newYear: number) => void;
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
  disabled?: boolean;
}

export function CohortStructuredFields({
  diploma,
  onDiplomaChange,
  year,
  onYearChange,
  tags,
  onTagsChange,
  disabled,
}: CohortStructuredFieldsProps) {
  const { t } = useTranslation("common");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
      data-testid="cohort-structured-fields"
    >
      {/* Live CohortChip Badge Preview */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          borderRadius: 2,
          bgcolor: "action.hover",
          border: "1px dashed",
          borderColor: "divider",
          gap: 1,
        }}
        data-testid="cohort-inspector-preview-box"
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {t("cohortNaming.preview", "Cohort Badge Preview")}
        </Typography>
        <CohortChip
          cohort={{ diploma, year, tags }}
          size="large"
          data-testid="cohort-inspector-preview-chip"
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1.5 }}>
        {/* Diploma Select */}
        <TextField
          select
          label={t("diplomas.title", "Diploma")}
          value={diploma}
          onChange={(e) => onDiplomaChange(e.target.value)}
          disabled={disabled}
          fullWidth
          size="small"
          data-testid="cohort-diploma-input"
        >
          <MenuItem value="">
            <em>{t("diplomas.none", "No Diploma")}</em>
          </MenuItem>
          {DIPLOMA_OPTIONS.map((opt) => (
            <MenuItem key={opt.code} value={opt.code}>
              {opt.code} – {t(opt.labelKey, opt.defaultLabel)}
            </MenuItem>
          ))}
        </TextField>

        {/* Year Select */}
        <TextField
          select
          label={t("cohortYear.title", "Year")}
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          disabled={disabled}
          fullWidth
          size="small"
          data-testid="cohort-year-input"
        >
          {YEAR_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {t(opt.labelKey, opt.defaultLabel)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Specialty / Major Tags */}
      <Autocomplete
        multiple
        freeSolo
        options={COMMON_SPECIALTY_TAGS as unknown as string[]}
        value={tags}
        onChange={(_, newTags) => onTagsChange(newTags)}
        disabled={disabled}
        renderValue={(value, getItemProps) =>
          value.map((tag: string, index: number) => {
            const { key, ...itemProps } = getItemProps({ index });
            const slug = getSpecialtySlug(tag);
            const localized = t(`specialties.${slug}`, tag);
            const chipLabel = localized !== tag ? `${tag} (${localized})` : tag;
            return (
              <Chip
                key={key}
                variant="filled"
                size="small"
                label={chipLabel}
                color="primary"
                {...itemProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label={t("specialties.title", "Subject / Specialty")}
            placeholder={t(
              "specialties.addTagPlaceholder",
              "Add specialty tag (e.g. AI, Dev, Cyber...)",
            )}
            data-testid="cohort-tags-input"
          />
        )}
      />
    </Box>
  );
}

export function CohortInspectorHeader({
  isEditing,
  onClose,
}: {
  isEditing: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation("common");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {isEditing
          ? t("inspector.editCohort", "Edit Cohort")
          : t("inspector.addCohortTitle", "Add Cohort")}
      </Typography>
      <IconButton
        onClick={onClose}
        size="small"
        aria-label={t("inspector.closeAria", "Close inspector")}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}

export function CohortAcademicShortcuts({
  selectedPeriod,
  onSelectPeriod,
  onSelectYear,
  activeYear,
}: {
  selectedPeriod: AcademicPeriodType;
  onSelectPeriod: (period: AcademicPeriodType) => void;
  onSelectYear: (year: number) => void;
  activeYear: number | null;
}) {
  const { t } = useTranslation("common");
  const currentYear = activeYear || new Date().getFullYear();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      data-testid="academic-year-shortcuts"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CalendarMonthRoundedIcon
          fontSize="small"
          sx={{ color: "primary.main" }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {t("inspector.academicShortcuts", "Academic Year Shortcuts")}
        </Typography>
      </Box>

      <TextField
        label={t("inspector.academicYear", "Academic Year")}
        type="number"
        value={currentYear}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          if (!isNaN(num) && num >= 1900 && num <= 2100) {
            onSelectYear(num);
          }
        }}
        helperText={`${currentYear} – ${currentYear + 1}`}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={() => onSelectYear(currentYear - 1)}
                  aria-label="Previous academic year"
                  edge="start"
                >
                  <RemoveRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onSelectYear(currentYear + 1)}
                  aria-label="Next academic year"
                  edge="end"
                >
                  <AddRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        data-testid="academic-year-number-picker"
      />

      <TextField
        select
        label={t("inspector.academicPeriod", "Academic Period")}
        value={selectedPeriod}
        onChange={(e) => onSelectPeriod(e.target.value as AcademicPeriodType)}
        fullWidth
        data-testid="academic-period-select"
      >
        {(Object.keys(ACADEMIC_PERIODS) as AcademicPeriodType[]).map(
          (periodKey) => {
            const period = ACADEMIC_PERIODS[periodKey];
            return (
              <MenuItem key={periodKey} value={periodKey}>
                {t(period.labelKey, period.defaultLabel)}
              </MenuItem>
            );
          },
        )}
      </TextField>
    </Box>
  );
}

export function CohortDurationBanner({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const { t } = useTranslation("common");
  const durationMonths = calculateDurationMonths(startDate, endDate);

  if (!startDate || !endDate || durationMonths === null) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 1.5,
        bgcolor: "action.selected",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
      data-testid="cohort-duration-banner"
    >
      <DateRangeRoundedIcon fontSize="small" color="primary" />
      <Typography
        variant="caption"
        sx={{ fontWeight: 600, color: "text.primary" }}
      >
        {t("inspector.durationFormat", {
          start: dayjs(startDate).format("MMM D, YYYY"),
          end: dayjs(endDate).format("MMM D, YYYY"),
          duration: t("inspector.durationMonths", {
            count: durationMonths,
            defaultValue: `${durationMonths} months`,
          }),
          defaultValue: `${dayjs(startDate).format("MMM D, YYYY")} → ${dayjs(endDate).format("MMM D, YYYY")} (${durationMonths} months)`,
        })}
      </Typography>
    </Box>
  );
}

export function CohortDatePickerFields({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (newDateString: string) => void;
  onEndDateChange: (newDateString: string) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation("common");
  const startDayjs = startDate ? dayjs(startDate) : null;
  const endDayjs = endDate ? dayjs(endDate) : null;

  return (
    <Stack direction="column" spacing={2}>
      <Box data-testid="cohort-start-date-container">
        <DatePicker
          label={t("inspector.startDate", "Start Date")}
          value={startDayjs}
          onChange={(newValue: Dayjs | null) => {
            onStartDateChange(
              newValue && newValue.isValid()
                ? newValue.format("YYYY-MM-DD")
                : "",
            );
          }}
          disabled={disabled}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "medium",
            },
          }}
        />
      </Box>
      <Box data-testid="cohort-end-date-container">
        <DatePicker
          label={t("inspector.endDate", "End Date")}
          value={endDayjs}
          onChange={(newValue: Dayjs | null) => {
            onEndDateChange(
              newValue && newValue.isValid()
                ? newValue.format("YYYY-MM-DD")
                : "",
            );
          }}
          minDate={startDayjs || undefined}
          disabled={disabled}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "medium",
            },
          }}
        />
      </Box>
    </Stack>
  );
}

export function CohortInspectorActions({
  onClose,
  onCreate,
  isEditing,
  disabled,
  isSaveDisabled,
}: {
  onClose: () => void;
  onCreate?: () => void;
  isEditing: boolean;
  disabled?: boolean;
  isSaveDisabled?: boolean;
}) {
  const { t } = useTranslation("common");
  return (
    <Box
      sx={{
        mt: "auto",
        display: "flex",
        justifyContent: isEditing ? "flex-start" : "flex-end",
        gap: 2,
      }}
    >
      <Button onClick={onClose} disabled={disabled}>
        {t("inspector.cancel", "Cancel")}
      </Button>
      {!isEditing && (
        <Button
          variant="contained"
          onClick={onCreate}
          disabled={disabled || isSaveDisabled}
          data-testid="cohort-create-button"
        >
          {t("inspector.create", "Create")}
        </Button>
      )}
    </Box>
  );
}
