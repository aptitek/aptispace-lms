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
