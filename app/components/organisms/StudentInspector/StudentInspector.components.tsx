import { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import {
  SchoolLogoMini,
  SchoolNameFallbackBadge,
} from "./StudentInspector.styles";
import type { SchoolConfig } from "../OnboardingCard/OnboardingCard.types";

export type ProfileSaveStatus = "idle" | "saving" | "saved" | "error";

export interface SchoolBadgeInlineProps {
  school?: SchoolConfig;
  schoolName?: string;
  testId?: string;
}

export function SchoolBadgeInline({
  school,
  schoolName,
  testId = "school-badge-inline",
}: SchoolBadgeInlineProps) {
  const [imgError, setImgError] = useState(false);
  const displayName = school?.name || schoolName || "Aptitek";
  const logoUrl = school?.logoUrl;

  if (logoUrl && !imgError) {
    return (
      <SchoolLogoMini
        src={logoUrl}
        alt={displayName}
        onError={() => setImgError(true)}
        data-testid={`${testId}-logo`}
      />
    );
  }

  return (
    <SchoolNameFallbackBadge data-testid={`${testId}-name`}>
      {displayName}
    </SchoolNameFallbackBadge>
  );
}

export function SaveStatusIndicator({ status }: { status: ProfileSaveStatus }) {
  const { t } = useTranslation("common");

  if (status === "saving") {
    return (
      <Tooltip title={t("inspector.saving", "Saving...")}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CircularProgress size={14} color="primary" />
          <Typography variant="caption" color="text.secondary">
            {t("inspector.saving", "Saving...")}
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  if (status === "saved") {
    return (
      <Tooltip title={t("inspector.assignmentSaved", "Saved")}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "success.main",
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
      </Tooltip>
    );
  }

  if (status === "error") {
    return (
      <Tooltip title="Failed to save profile changes">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "error.main",
          }}
        >
          <ErrorOutlineRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
      </Tooltip>
    );
  }

  return null;
}
