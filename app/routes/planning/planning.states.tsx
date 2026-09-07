import React from "react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Icons
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ViewWeekRoundedIcon from "@mui/icons-material/ViewWeekRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export { CalendarSkeleton } from "./CalendarSkeleton";

export interface CalendarErrorStateProps {
  onRetry: () => void;
  feedToken: string;
  userId: string;
}

export function CalendarErrorState({
  onRetry,
  feedToken,
  userId,
}: CalendarErrorStateProps) {
  const { t } = useTranslation("common");

  return (
    <Box
      sx={{
        minHeight: "720px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        textAlign: "center",
        gap: 2.5,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.12),
          color: "warning.main",
        }}
      >
        <WarningAmberRoundedIcon sx={{ fontSize: 36 }} />
      </Box>

      <Box sx={{ maxWidth: 500 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}
        >
          {t(
            "planning.states.errorTitle",
            "Unable to Load Interactive Calendar",
          )}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.6 }}
        >
          {t(
            "planning.states.errorDescription",
            "The interactive calendar engine could not be loaded. You can retry or download your schedule directly as an iCal feed.",
          )}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          justifyContent: "center",
          pt: 1,
        }}
      >
        <Button
          variant="contained"
          size="medium"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 1,
          }}
        >
          {t("planning.states.retry", "Retry Loading")}
        </Button>

        <Button
          variant="outlined"
          size="medium"
          startIcon={<DownloadRoundedIcon />}
          href={`/api/calendar/${feedToken}.ics`}
          download={`aptispace-${userId}.ics`}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 1,
          }}
        >
          {t("planning.states.downloadIcs", "Download .ics")}
        </Button>
      </Box>
    </Box>
  );
}

export interface CalendarEmptyStateProps {
  isAdmin: boolean;
  onAddClass: () => void;
  onShowGrid: () => void;
  isFiltered?: boolean;
  selectedFilter?: string;
  onResetFilter?: () => void;
}

export function CalendarEmptyState({
  isAdmin,
  onAddClass,
  onShowGrid,
}: CalendarEmptyStateProps) {
  const { t } = useTranslation("common");

  const title = t("planning.states.noClassesTitle", "No Classes Scheduled");
  const description = isAdmin
    ? t(
        "planning.states.noClassesAdminDesc",
        "No classes have been scheduled yet. Click 'Add Class' to schedule your first class.",
      )
    : t(
        "planning.states.noClassesDesc",
        "There are no academic classes scheduled for your account at this time.",
      );

  return (
    <Box
      sx={{
        minHeight: "720px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        textAlign: "center",
        gap: 2.5,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          color: "primary.main",
        }}
      >
        <CalendarMonthRoundedIcon sx={{ fontSize: 36 }} />
      </Box>

      <Box sx={{ maxWidth: 520 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          justifyContent: "center",
          pt: 1,
        }}
      >
        {isAdmin && (
          <Button
            variant="contained"
            size="medium"
            startIcon={<AddRoundedIcon />}
            onClick={onAddClass}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 2.5,
              py: 1,
            }}
          >
            {t("planning.addClass", "Add Class")}
          </Button>
        )}

        <Button
          variant="outlined"
          size="medium"
          startIcon={<ViewWeekRoundedIcon />}
          onClick={onShowGrid}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 1,
          }}
        >
          {t("planning.states.viewCalendarGrid", "Open Calendar Grid")}
        </Button>
      </Box>
    </Box>
  );
}
