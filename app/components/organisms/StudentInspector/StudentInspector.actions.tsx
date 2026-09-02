import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useTranslation } from "react-i18next";
import { HoldButton } from "../../atoms/HoldButton";
import type { EntityCardData } from "../../molecules/EntityCard/EntityCard.types";

export interface InspectorImpersonateButtonProps {
  targetStudent: EntityCardData;
  onImpersonate: (student: EntityCardData) => void;
}

export function InspectorImpersonateButton({
  targetStudent,
  onImpersonate,
}: InspectorImpersonateButtonProps) {
  const { t } = useTranslation(["common", "auth"]);
  const label = t("common:inspector.impersonate", "Impersonate");

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="large"
      startIcon={<LoginRoundedIcon />}
      onClick={() => onImpersonate(targetStudent)}
      data-testid="inspector-impersonate-btn-standalone"
      sx={{
        width: "100%",
        height: "44px",
        minHeight: "44px",
        borderRadius: "12px",
        borderWidth: "2px",
        fontWeight: 700,
        textTransform: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          borderWidth: "2px",
        },
      }}
    >
      {label}
    </Button>
  );
}

export interface InspectorDeleteButtonProps {
  targetStudent: EntityCardData;
  onDelete: (student: EntityCardData) => void;
}

export function InspectorDeleteButton({
  targetStudent,
  onDelete,
}: InspectorDeleteButtonProps) {
  const { t } = useTranslation(["common", "auth"]);
  const label = t("common:inspector.delete", "Delete");

  return (
    <HoldButton
      variant="outlined"
      color="error"
      size="large"
      holdTime={1000}
      borderThickness={2}
      outlineGap={3.5}
      startIcon={<DeleteOutlineRoundedIcon />}
      onHoldComplete={() => onDelete(targetStudent)}
      data-testid="inspector-delete-btn-standalone"
      wrapperSx={{
        width: "100%",
      }}
      sx={{
        width: "100%",
        height: "44px",
        minHeight: "44px",
        borderRadius: "12px",
        borderWidth: "2px",
        fontWeight: 700,
        textTransform: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          borderWidth: "2px",
        },
      }}
    >
      {label}
    </HoldButton>
  );
}

export interface InspectorActionGroupProps {
  targetStudent?: EntityCardData | null;
  onImpersonate?: (student: EntityCardData) => void;
  onDelete?: (student: EntityCardData) => void;
}

export function InspectorActionGroup({
  targetStudent,
  onImpersonate,
  onDelete,
}: InspectorActionGroupProps) {
  if (!targetStudent || (!onImpersonate && !onDelete)) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        mt: 2,
        width: "100%",
      }}
    >
      {onImpersonate && (
        <InspectorImpersonateButton
          targetStudent={targetStudent}
          onImpersonate={onImpersonate}
        />
      )}
      {onDelete && (
        <InspectorDeleteButton
          targetStudent={targetStudent}
          onDelete={onDelete}
        />
      )}
    </Box>
  );
}
