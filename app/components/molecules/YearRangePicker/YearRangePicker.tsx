import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";

export interface YearRangePickerProps {
  startYearMin: number | null;
  onStartYearMinChange: (year: number | null) => void;
  startYearMax: number | null;
  onStartYearMaxChange: (year: number | null) => void;
  label?: string;
  testId?: string;
}

function parseYearInput(text: string): number | null {
  if (!text.trim()) return null;
  const num = parseInt(text, 10);
  if (isNaN(num)) return null;
  return num;
}

interface YearInputSlotProps {
  value: number | null;
  placeholder: string;
  onChange: (year: number | null) => void;
  testId: string;
}

function YearInputField({
  value,
  placeholder,
  onChange,
  testId,
}: YearInputSlotProps) {
  return (
    <TextField
      size="small"
      type="number"
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(parseYearInput(e.target.value))}
      slotProps={{
        htmlInput: {
          min: 1990,
          max: 2100,
          step: 1,
          style: { padding: "4px 6px", width: 55, textAlign: "center" },
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          fontSize: "0.85rem",
        },
      }}
      data-testid={testId}
    />
  );
}

export function YearRangePicker({
  startYearMin,
  startYearMax,
  onStartYearMinChange,
  onStartYearMaxChange,
  label,
  testId = "year-range-picker",
}: YearRangePickerProps) {
  const { t } = useTranslation("common");
  const displayLabel = label || t("filterBar.startYearRange", "Start Year");
  const hasValue = startYearMin !== null || startYearMax !== null;

  const handleClear = () => {
    onStartYearMinChange(null);
    onStartYearMaxChange(null);
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        p: "4px 10px",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: hasValue ? "primary.main" : "divider",
        bgcolor: hasValue ? "action.hover" : "transparent",
        transition: "all 0.2s ease-in-out",
      }}
      data-testid={testId}
    >
      <DateRangeRoundedIcon
        fontSize="small"
        sx={{
          color: hasValue ? "primary.main" : "text.secondary",
          flexShrink: 0,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: hasValue ? "primary.main" : "text.secondary",
          whiteSpace: "nowrap",
        }}
      >
        {displayLabel}:
      </Typography>

      <YearInputField
        value={startYearMin}
        placeholder={t("filterBar.yearFrom", "From")}
        onChange={onStartYearMinChange}
        testId="year-range-from"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ userSelect: "none" }}
      >
        –
      </Typography>

      <YearInputField
        value={startYearMax}
        placeholder={t("filterBar.yearTo", "To")}
        onChange={onStartYearMaxChange}
        testId="year-range-to"
      />

      {hasValue && (
        <IconButton
          size="small"
          onClick={handleClear}
          aria-label={t("filterBar.clearYearRange", "Clear year range")}
          sx={{ p: 0.5 }}
          data-testid="year-range-clear-button"
        >
          <ClearIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  );
}

export default YearRangePicker;
