import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
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

export {
  CohortStructuredFields,
  type CohortStructuredFieldsProps,
} from "./CohortStructuredFields";

export type AcademicPeriodSelection = AcademicPeriodType | "custom";

export type CohortDateMode = "shortcut" | "picker";

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

export function CohortDateModeToggle({
  mode,
  onModeChange,
}: {
  mode: CohortDateMode;
  onModeChange: (nextMode: CohortDateMode) => void;
}) {
  const { t } = useTranslation("common");

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={(_, nextMode) => {
        if (nextMode) onModeChange(nextMode);
      }}
      fullWidth
      size="small"
      aria-label={t("inspector.dateModeAria", "Date selection mode")}
      sx={{
        p: 0.5,
        borderRadius: 2,
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
        "& .MuiToggleButtonGroup-grouped": {
          border: 0,
          borderRadius: 1.5,
          fontWeight: 600,
          fontSize: "0.8rem",
          textTransform: "none",
          gap: 0.75,
          py: 0.6,
          color: "text.secondary",
          "&.Mui-selected": {
            bgcolor: "background.paper",
            color: "primary.main",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "background.paper",
            },
          },
        },
      }}
      data-testid="cohort-date-mode-toggle"
    >
      <ToggleButton value="shortcut" data-testid="cohort-date-mode-shortcut">
        <CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />
        {t("inspector.academicShortcuts", "Academic Year")}
      </ToggleButton>
      <ToggleButton value="picker" data-testid="cohort-date-mode-picker">
        <DateRangeRoundedIcon sx={{ fontSize: 16 }} />
        {t("inspector.customDates", "Custom Range")}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export function CohortAcademicShortcuts({
  selectedPeriod,
  onSelectPeriod,
  onSelectYear,
  activeYear,
  disabled = false,
}: {
  selectedPeriod: AcademicPeriodSelection;
  onSelectPeriod: (period: AcademicPeriodSelection) => void;
  onSelectYear: (year: number) => void;
  activeYear: number | null;
  disabled?: boolean;
}) {
  const { t } = useTranslation("common");
  const currentYear = activeYear || new Date().getFullYear();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
      }}
      data-testid="academic-year-shortcuts"
    >
      <TextField
        label={t("inspector.academicYear", "Academic Year")}
        type="number"
        size="small"
        value={currentYear}
        disabled={disabled}
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
                  disabled={disabled}
                  sx={{ p: 0.5 }}
                >
                  <RemoveRoundedIcon sx={{ fontSize: 16 }} />
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
                  disabled={disabled}
                  sx={{ p: 0.5 }}
                >
                  <AddRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          },
          htmlInput: {
            min: 1900,
            max: 2100,
            style: { textAlign: "center" },
          },
        }}
        sx={{
          flex: 1,
          "& input": { textAlign: "center" },
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              display: "none",
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
        data-testid="academic-year-number-picker"
      />

      <TextField
        select
        size="small"
        label={t("inspector.academicPeriod", "Academic Period")}
        value={selectedPeriod}
        disabled={disabled}
        onChange={(e) =>
          onSelectPeriod(e.target.value as AcademicPeriodSelection)
        }
        sx={{ flex: 1 }}
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
        <Divider sx={{ my: 0.5 }} />
        <MenuItem value="custom" data-testid="academic-period-custom">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DateRangeRoundedIcon
              sx={{ fontSize: 16, color: "primary.main" }}
            />
            {t("inspector.periodCustom", "Custom Range...")}
          </Box>
        </MenuItem>
      </TextField>
    </Box>
  );
}

export interface CohortScheduleCardProps {
  selectedPeriod: AcademicPeriodSelection;
  onSelectPeriod: (period: AcademicPeriodSelection) => void;
  onSelectYear: (year: number) => void;
  activeYear: number | null;
  startDate: string;
  endDate: string;
  onStartDateChange: (newDateString: string) => void;
  onEndDateChange: (newDateString: string) => void;
  disabled?: boolean;
}

export function CohortScheduleCard({
  selectedPeriod,
  onSelectPeriod,
  onSelectYear,
  activeYear,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false,
}: CohortScheduleCardProps) {
  const { t } = useTranslation("common");

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        borderColor: "divider",
        bgcolor: "action.hover",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
      data-testid="cohort-year-card"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CalendarMonthRoundedIcon
          sx={{ fontSize: 18, color: "primary.main" }}
        />
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {t("inspector.academicSchedule", "Academic Schedule")}
        </Typography>
      </Box>

      <CohortAcademicShortcuts
        selectedPeriod={selectedPeriod}
        onSelectPeriod={onSelectPeriod}
        onSelectYear={onSelectYear}
        activeYear={activeYear}
        disabled={disabled}
      />

      <Collapse in={selectedPeriod === "custom"}>
        <Box sx={{ pt: 0.5 }}>
          <CohortDatePickerFields
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            disabled={disabled}
          />
        </Box>
      </Collapse>

      <CohortDurationBanner startDate={startDate} endDate={endDate} />
    </Card>
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
        py: 0.75,
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: 1.5,
      }}
    >
      <Box sx={{ minWidth: 0 }} data-testid="cohort-start-date-container">
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
              size: "small",
            },
          }}
        />
      </Box>
      <Box sx={{ minWidth: 0 }} data-testid="cohort-end-date-container">
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
              size: "small",
            },
          }}
        />
      </Box>
    </Box>
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
