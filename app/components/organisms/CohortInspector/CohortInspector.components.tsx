import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { HoldButton } from "~/components/atoms/HoldButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import type { CohortConfig } from "~/types/institution";

export {
  CohortStructuredFields,
  type CohortStructuredFieldsProps,
} from "./CohortStructuredFields";

export {
  CohortScheduleCard,
  type CohortScheduleCardProps,
  CohortDateModeToggle,
  type CohortDateMode,
  type AcademicPeriodSelection,
  CohortAcademicShortcuts,
  CohortDurationBanner,
  CohortDatePickerFields,
} from "./CohortScheduleCard";

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
        <CloseRoundedIcon />
      </IconButton>
    </Box>
  );
}

export function CohortInspectorActions({
  onClose,
  onCreate,
  onDelete,
  cohort,
  isEditing,
  disabled,
  isSaveDisabled,
}: {
  onClose: () => void;
  onCreate?: () => void;
  onDelete?: (cohort: CohortConfig) => void;
  cohort?: CohortConfig | null;
  isEditing: boolean;
  disabled?: boolean;
  isSaveDisabled?: boolean;
}) {
  const { t } = useTranslation("common");

  if (isEditing) {
    if (!cohort) return null;
    return (
      <Box sx={{ mt: "auto", pt: 1, width: "100%" }}>
        <HoldButton
          variant="outlined"
          color="error"
          size="large"
          holdTime={1000}
          borderThickness={2}
          outlineGap={3.5}
          startIcon={<DeleteOutlineRoundedIcon />}
          onHoldComplete={() => onDelete && onDelete(cohort)}
          data-testid="inspector-delete-cohort-btn"
          wrapperSx={{ width: "100%" }}
          sx={{
            width: "100%",
            height: "44px",
            minHeight: "44px",
            borderRadius: "12px",
            borderWidth: "2px",
            fontWeight: 700,
            textTransform: "none",
            whiteSpace: "nowrap",
            "&:hover": { borderWidth: "2px" },
          }}
        >
          {t("inspector.deleteCohort", "Delete Cohort")}
        </HoldButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: "auto",
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
      }}
    >
      <Button onClick={onClose} disabled={disabled}>
        {t("inspector.cancel", "Cancel")}
      </Button>
      <Button
        variant="contained"
        onClick={onCreate}
        disabled={disabled || isSaveDisabled}
        data-testid="cohort-create-button"
      >
        {t("inspector.create", "Create")}
      </Button>
    </Box>
  );
}
