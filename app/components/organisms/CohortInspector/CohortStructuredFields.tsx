import { useState, useEffect, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  DIPLOMA_OPTIONS,
  COMMON_SPECIALTY_TAGS,
  getSpecialtySlug,
} from "~/utils/cohortFormat";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";
import SegmentedChip from "../../molecules/SegmentedChip/SegmentedChip";

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

  const renderDiplomaChip = (diplomaCode: unknown) => {
    const code = String(diplomaCode || "");
    if (!code) {
      return (
        <SegmentedChip
          segments={[{ label: t("diplomas.none", "No Diploma") }]}
          size="small"
        />
      );
    }
    const opt = DIPLOMA_OPTIONS.find((o) => o.code === code);
    return (
      <SegmentedChip
        cohort={{
          diploma: code,
          tags: opt ? [t(opt.labelKey, opt.defaultLabel)] : undefined,
        }}
        size="small"
      />
    );
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        borderRadius: M3_SHAPE_CORNER_STRINGS.large,
        bgcolor: (theme) =>
          theme.palette.surfaceContainerLow || theme.palette.background.paper,
        border: "1px solid",
        borderColor: "divider",
      }}
      data-testid="cohort-structured-fields"
    >
      {/* Live SegmentedChip Badge Preview */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          borderRadius: M3_SHAPE_CORNER_STRINGS.medium,
          bgcolor: (theme) =>
            theme.palette.surfaceContainerHigh ||
            theme.palette.surfaceContainer,
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
        <SegmentedChip
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
          slotProps={{
            inputLabel: { shrink: true },
            select: {
              displayEmpty: true,
              renderValue: (selectedVal) => renderDiplomaChip(selectedVal),
            },
          }}
        >
          <MenuItem
            value=""
            aria-label={t("diplomas.none", "No Diploma")}
            data-testid="cohort-diploma-option-none"
            sx={{ py: 0.75 }}
          >
            {renderDiplomaChip("")}
          </MenuItem>
          {DIPLOMA_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.code}
              value={opt.code}
              aria-label={`${opt.code} – ${t(opt.labelKey, opt.defaultLabel)}`}
              data-testid={`cohort-diploma-option-${opt.code}`}
              sx={{ py: 0.75 }}
            >
              {renderDiplomaChip(opt.code)}
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
        renderOption={(props, option) => {
          const { key, ...liProps } = props;
          const slug = getSpecialtySlug(option);
          const localized = t(`specialties.${slug}`, option);
          const segments =
            localized.toLowerCase() !== option.toLowerCase()
              ? [{ label: option, bold: true }, { label: localized }]
              : [{ label: option, bold: true }];
          return (
            <Box
              component="li"
              key={key}
              {...liProps}
              sx={{
                py: 0.75,
                px: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <SegmentedChip segments={segments} size="small" />
            </Box>
          );
        }}
        renderValue={(value, getItemProps) =>
          value.map((tag: string, index: number) => {
            const { key, onDelete, ...itemProps } = getItemProps({ index });
            const slug = getSpecialtySlug(tag);
            const localized = t(`specialties.${slug}`, tag);
            const segments =
              localized.toLowerCase() !== tag.toLowerCase()
                ? [{ label: tag, bold: true }, { label: localized }]
                : [{ label: tag, bold: true }];
            return (
              <SegmentedChip
                key={key}
                segments={segments}
                size="small"
                onDelete={
                  disabled
                    ? undefined
                    : () =>
                        onDelete(undefined as unknown as React.SyntheticEvent)
                }
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
            placeholder={
              tags.length === 0
                ? t(
                    "specialties.addTagPlaceholder",
                    "Add specialty tag (e.g. AI, Dev, Cyber...)",
                  )
                : undefined
            }
            data-testid="cohort-tags-input"
          />
        )}
      />
    </Card>
  );
}

export default CohortStructuredFields;
