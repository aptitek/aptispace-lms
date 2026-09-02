import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { CohortConfig } from "~/types/institution";
import {
  type AcademicPeriodType,
  getAcademicYearDates,
  getAcademicYearOptions,
} from "~/utils/academicYear";
import {
  CohortInspectorHeader,
  CohortAcademicShortcuts,
  CohortDurationBanner,
  CohortDatePickerFields,
  CohortInspectorActions,
} from "./CohortInspector.components";

function formatDateForInput(dateInput?: string | Date | null): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function detectActiveYear(startDate?: string): number | null {
  if (!startDate) return null;
  const d = new Date(startDate);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-12
  // If month is before Sep (e.g. spring semester in Feb), start year was year - 1
  return month < 8 ? year - 1 : year;
}

interface CohortFormValues {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

function hasFormChanged(a: CohortFormValues, b: CohortFormValues): boolean {
  return (
    a.name !== b.name ||
    a.description !== b.description ||
    a.startDate !== b.startDate ||
    a.endDate !== b.endDate
  );
}

interface CohortInspectorProps {
  cohort: CohortConfig | null;
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function CohortInspector({
  cohort,
  onClose,
  onSave,
  isSubmitting = false,
}: CohortInspectorProps) {
  const { t } = useTranslation("common");
  const isEditing = Boolean(cohort?.id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPeriod, setSelectedPeriod] =
    useState<AcademicPeriodType>("fullAcademic");

  const savedValuesRef = useRef<CohortFormValues>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (cohort) {
      const initial: CohortFormValues = {
        name: cohort.name || "",
        description: cohort.description || "",
        startDate: formatDateForInput(cohort.startDate),
        endDate: formatDateForInput(cohort.endDate),
      };
      setName(initial.name);
      setDescription(initial.description);
      setStartDate(initial.startDate);
      setEndDate(initial.endDate);
      savedValuesRef.current = initial;
    }
  }, [cohort]);

  const activeYear = detectActiveYear(startDate);

  const triggerSave = (updates?: Partial<CohortFormValues>) => {
    if (!isEditing || !cohort?.id) return;
    const next: CohortFormValues = {
      name,
      description,
      startDate,
      endDate,
      ...updates,
    };
    if (!next.name.trim()) return;
    if (!hasFormChanged(savedValuesRef.current, next)) return;

    savedValuesRef.current = next;
    onSave({
      id: cohort.id,
      name: next.name.trim(),
      description: next.description.trim() || undefined,
      startDate: next.startDate || undefined,
      endDate: next.endDate || undefined,
    });
  };

  const handleSelectYear = (year: number) => {
    const dates = getAcademicYearDates(year, selectedPeriod);
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    triggerSave({ startDate: dates.startDate, endDate: dates.endDate });
  };

  const handleSelectPeriod = (period: AcademicPeriodType) => {
    setSelectedPeriod(period);
    const targetYear =
      activeYear || getAcademicYearOptions()[1] || new Date().getFullYear();
    const dates = getAcademicYearDates(targetYear, period);
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    triggerSave({ startDate: dates.startDate, endDate: dates.endDate });
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  if (!cohort) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          height: "calc(100vh - 200px)",
          maxHeight: "850px",
          overflowY: "auto",
          position: "sticky",
          top: 24,
        }}
        variant="outlined"
        data-testid="cohort-inspector-card"
      >
        <CohortInspectorHeader isEditing={isEditing} onClose={onClose} />

        <TextField
          label={t("inspector.institutionName", "Name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => triggerSave({ name })}
          fullWidth
          disabled={isSubmitting}
          required
          data-testid="cohort-name-input"
        />

        <TextField
          label={t("inspector.description", "Description")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => triggerSave({ description })}
          fullWidth
          disabled={isSubmitting}
          multiline
          rows={3}
          data-testid="cohort-description-input"
        />

        <CohortAcademicShortcuts
          selectedPeriod={selectedPeriod}
          onSelectPeriod={handleSelectPeriod}
          onSelectYear={handleSelectYear}
          activeYear={activeYear}
        />

        <CohortDatePickerFields
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(newStart) => {
            setStartDate(newStart);
            triggerSave({ startDate: newStart });
          }}
          onEndDateChange={(newEnd) => {
            setEndDate(newEnd);
            triggerSave({ endDate: newEnd });
          }}
          disabled={isSubmitting}
        />

        <CohortDurationBanner startDate={startDate} endDate={endDate} />

        <CohortInspectorActions
          onClose={onClose}
          onCreate={handleCreate}
          isEditing={isEditing}
          disabled={isSubmitting}
          isSaveDisabled={!name.trim()}
        />
      </Card>
    </LocalizationProvider>
  );
}
