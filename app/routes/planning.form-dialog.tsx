import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";

import type { ClassWithDetails } from "~/services/classService";
import { SoftDialog } from "./planning.styles";
import {
  toDatetimeLocalString,
  type InstructorOption,
  type SessionOption,
} from "./planning.types";

export interface ClassFormDialogProps {
  editingClass: ClassWithDetails | null;
  sessions: SessionOption[];
  instructors: InstructorOption[];
  onClose: () => void;
  onSaved: (savedClass: ClassWithDetails) => void;
}

interface FormState {
  sessionId: string;
  title: string;
  type: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

function computeInitialTimes(editingClass: ClassWithDetails | null) {
  if (editingClass) {
    return {
      startTime: toDatetimeLocalString(new Date(editingClass.startTime)),
      endTime: toDatetimeLocalString(new Date(editingClass.endTime)),
    };
  }
  const now = Date.now();
  return {
    startTime: toDatetimeLocalString(new Date(now + 3600000)),
    endTime: toDatetimeLocalString(new Date(now + 7200000)),
  };
}

function getInitialFormState(
  editingClass: ClassWithDetails | null,
  firstSessionId: string,
  firstInstructorId: string,
): FormState {
  const times = computeInitialTimes(editingClass);
  if (editingClass) {
    return {
      sessionId: editingClass.sessionId,
      title: editingClass.title,
      type: editingClass.type,
      instructorId: editingClass.instructorId ?? "",
      location: editingClass.location ?? "",
      description: editingClass.description ?? "",
      startTime: times.startTime,
      endTime: times.endTime,
    };
  }
  return {
    sessionId: firstSessionId,
    title: "",
    type: "lecture",
    instructorId: firstInstructorId,
    location: "",
    description: "",
    startTime: times.startTime,
    endTime: times.endTime,
  };
}

async function submitClassForm(
  formState: FormState,
  editingId: string | undefined,
): Promise<{ class?: ClassWithDetails; error?: string }> {
  const method = editingId ? "PUT" : "POST";
  const payload = {
    id: editingId,
    sessionId: formState.sessionId,
    title: formState.title,
    type: formState.type,
    instructorId: formState.instructorId || null,
    startTime: new Date(formState.startTime).toISOString(),
    endTime: new Date(formState.endTime).toISOString(),
    location: formState.location || null,
    description: formState.description || null,
  };

  const res = await fetch("/api/classes", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return (await res.json()) as { class?: ClassWithDetails; error?: string };
}

interface FormFieldsProps {
  formState: FormState;
  updateField: (key: keyof FormState, val: string) => void;
  sessions: SessionOption[];
  instructors: InstructorOption[];
}

function FormFields({
  formState,
  updateField,
  sessions,
  instructors,
}: FormFieldsProps) {
  const { t } = useTranslation("common");

  return (
    <>
      <TextField
        select
        label={t("planning.form.sessionLabel")}
        value={formState.sessionId}
        onChange={(e) => updateField("sessionId", e.target.value)}
        required
        fullWidth
        size="small"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
      >
        {sessions.map((s) => (
          <MenuItem key={s.id} value={s.id}>
            {s.courseTitle} ({s.cohortName})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label={t("planning.form.classTitle")}
        value={formState.title}
        onChange={(e) => updateField("title", e.target.value)}
        placeholder={t("planning.form.titlePlaceholder")}
        required
        fullWidth
        size="small"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <TextField
          select
          label={t("planning.form.formatType")}
          value={formState.type}
          onChange={(e) => updateField("type", e.target.value)}
          required
          fullWidth
          size="small"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        >
          <MenuItem value="lecture">{t("planning.types.lecture")}</MenuItem>
          <MenuItem value="lab">{t("planning.types.lab")}</MenuItem>
          <MenuItem value="workshop">{t("planning.types.workshop")}</MenuItem>
          <MenuItem value="exam">{t("planning.types.exam")}</MenuItem>
        </TextField>

        <TextField
          select
          label={t("planning.form.instructorLabel")}
          value={formState.instructorId}
          onChange={(e) => updateField("instructorId", e.target.value)}
          fullWidth
          size="small"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        >
          <MenuItem value="">{t("planning.form.unassigned")}</MenuItem>
          {instructors.map((inst) => (
            <MenuItem key={inst.id} value={inst.id}>
              {inst.name} ({inst.role})
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <TextField
          label={t("planning.form.startTime")}
          type="datetime-local"
          value={formState.startTime}
          onChange={(e) => updateField("startTime", e.target.value)}
          required
          fullWidth
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />

        <TextField
          label={t("planning.form.endTime")}
          type="datetime-local"
          value={formState.endTime}
          onChange={(e) => updateField("endTime", e.target.value)}
          required
          fullWidth
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </Box>

      <TextField
        label={t("planning.form.locationLabel")}
        value={formState.location}
        onChange={(e) => updateField("location", e.target.value)}
        placeholder={t("planning.form.locationPlaceholder")}
        fullWidth
        size="small"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
      />

      <TextField
        label={t("planning.form.notesLabel")}
        value={formState.description}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder={t("planning.form.notesPlaceholder")}
        multiline
        rows={3}
        fullWidth
        size="small"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
      />
    </>
  );
}

export function ClassFormDialog({
  editingClass,
  sessions,
  instructors,
  onClose,
  onSaved,
}: ClassFormDialogProps) {
  const { t } = useTranslation("common");

  const [formState, setFormState] = useState<FormState>(() =>
    getInitialFormState(
      editingClass,
      sessions[0]?.id ?? "",
      instructors[0]?.id ?? "",
    ),
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateField = (key: keyof FormState, val: string) => {
    setFormState((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formState.sessionId ||
      !formState.title ||
      !formState.startTime ||
      !formState.endTime
    ) {
      setErrorMsg(t("planning.messages.requiredFields"));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const result = await submitClassForm(formState, editingClass?.id);
      if (result.class) {
        onSaved(result.class);
      } else {
        setErrorMsg(result.error ?? t("planning.messages.saveFailed"));
      }
    } catch {
      setErrorMsg(t("planning.messages.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = editingClass
    ? t("planning.form.editTitle")
    : t("planning.form.createTitle");

  const submitText = isSubmitting
    ? t("planning.form.saving")
    : editingClass
      ? t("planning.form.updateBtn")
      : t("planning.form.createBtn");

  return (
    <SoftDialog open onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>{dialogTitle}</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: "12px" }}>
              {errorMsg}
            </Alert>
          )}

          <FormFields
            formState={formState}
            updateField={updateField}
            sessions={sessions}
            instructors={instructors}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ borderRadius: "10px", fontWeight: 700 }}
          >
            {t("planning.form.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ borderRadius: "10px", fontWeight: 700, px: 3 }}
          >
            {submitText}
          </Button>
        </DialogActions>
      </form>
    </SoftDialog>
  );
}
