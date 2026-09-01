import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { CohortConfig } from "~/types/institution";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDateForInput = (dateInput?: string | Date) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (cohort) {
      setName(cohort.name || "");
      setDescription(cohort.description || "");
      setStartDate(formatDateForInput(cohort.startDate));
      setEndDate(formatDateForInput(cohort.endDate));
    }
  }, [cohort]);

  const handleSave = () => {
    onSave({
      id: cohort?.id,
      name,
      description,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  if (!cohort) return null;

  return (
    <Card
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        height: "calc(100vh - 200px)",
        maxHeight: "800px",
        overflowY: "auto",
        position: "sticky",
        top: 24,
      }}
      variant="outlined"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {cohort.id ? "Edit Cohort" : "Add Cohort"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        disabled={isSubmitting}
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        disabled={isSubmitting}
        multiline
        rows={4}
      />
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        fullWidth
        disabled={isSubmitting}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        fullWidth
        disabled={isSubmitting}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Box
        sx={{ mt: "auto", display: "flex", justifyContent: "flex-end", gap: 2 }}
      >
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting || !name}
        >
          Save
        </Button>
      </Box>
    </Card>
  );
}
