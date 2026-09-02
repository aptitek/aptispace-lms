import { useState, useEffect, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  DIPLOMA_OPTIONS,
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

  const [localYear, setLocalYear] = useState<string>(String(year ?? 0));

  useEffect(() => {
    setLocalYear(String(year ?? 0));
  }, [year]);

  const handleDecrementYear = () => {
    const next = Math.max(0, (year || 0) - 1);
    setLocalYear(String(next));
    onYearChange(next);
  };

  const handleIncrementYear = () => {
    const next = (year || 0) + 1;
    setLocalYear(String(next));
    onYearChange(next);
  };

  const handleYearChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    setLocalYear(rawValue);
    const trimmed = rawValue.trim();
    if (trimmed === "") {
      onYearChange(0);
    } else {
      const parsed = parseInt(trimmed, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        onYearChange(parsed);
      }
    }
  };

  const handleYearBlur = () => {
    if (localYear.trim() === "") {
      setLocalYear("0");
      onYearChange(0);
    }
  };

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

        {/* Year Number Field with -+ */}
        <TextField
          type="number"
          label={t("cohortYear.title", "Year")}
          value={localYear}
          onChange={handleYearChange}
          onBlur={handleYearBlur}
          disabled={disabled}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    onClick={handleDecrementYear}
                    disabled={disabled || (year || 0) <= 0}
                    aria-label={t("cohortYear.decrease", "Decrease year")}
                    sx={{ p: 0.5 }}
                    data-testid="cohort-year-decrement"
                    edge="start"
                  >
                    <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleIncrementYear}
                    disabled={disabled}
                    aria-label={t("cohortYear.increase", "Increase year")}
                    sx={{ p: 0.5 }}
                    data-testid="cohort-year-increment"
                    edge="end"
                  >
                    <AddRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ),
            },
            htmlInput: {
              min: 0,
              max: 20,
              inputMode: "numeric",
              pattern: "[0-9]*",
              style: { textAlign: "center" },
            },
          }}
          sx={{
            "& input": { textAlign: "center" },
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
              {
                display: "none",
              },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
          data-testid="cohort-year-input"
        />
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

export default CohortStructuredFields;
