import React from "react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

// Icons
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import ViewWeekRoundedIcon from "@mui/icons-material/ViewWeekRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SKELETON_EVENTS = [
  { id: "skel-event-1", col: 1, top: 40, height: 110, color: "indigo" },
  { id: "skel-event-2", col: 2, top: 120, height: 140, color: "teal" },
  { id: "skel-event-3", col: 3, top: 70, height: 95, color: "amber" },
  { id: "skel-event-4", col: 4, top: 160, height: 130, color: "red" },
  { id: "skel-event-5", col: 5, top: 60, height: 120, color: "indigo" },
];

function getPastelColor(colorName: string): string {
  switch (colorName) {
    case "teal":
      return "rgba(20, 184, 166, 0.2)";
    case "amber":
      return "rgba(245, 158, 11, 0.22)";
    case "red":
      return "rgba(239, 68, 68, 0.2)";
    case "indigo":
    default:
      return "rgba(99, 102, 241, 0.22)";
  }
}

function CalendarSkeletonToolbar() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        pb: 2,
        borderBottom: (theme) =>
          `1px solid ${alpha(theme.palette.divider, 0.4)}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Skeleton
          variant="rounded"
          width={76}
          height={36}
          sx={{ borderRadius: "10px" }}
        />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton
          variant="rounded"
          width={180}
          height={28}
          sx={{ borderRadius: "8px", ml: 1 }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {["Day", "Week", "Month", "Agenda"].map((view) => (
          <Skeleton
            key={view}
            variant="rounded"
            width={64}
            height={32}
            sx={{ borderRadius: "10px" }}
          />
        ))}
      </Box>
    </Box>
  );
}

function CalendarSkeletonGrid() {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Day header columns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          pt: 1,
          pb: 1,
        }}
      >
        {WEEKDAYS.map((day) => (
          <Box
            key={day}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              py: 0.75,
              borderRadius: "12px",
              bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3),
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.secondary" }}
            >
              {day}
            </Typography>
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        ))}
      </Box>

      {/* Grid with simulated event blocks */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 520,
          borderRadius: "16px",
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          p: 1,
        }}
      >
        {/* Columns */}
        {WEEKDAYS.map((day) => (
          <Box
            key={day}
            sx={{
              position: "relative",
              height: "100%",
              borderRadius: "12px",
              borderRight: (theme) =>
                `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
              "&:last-child": { borderRight: "none" },
            }}
          />
        ))}

        {/* Shimmer Event Cards */}
        {SKELETON_EVENTS.map((item) => (
          <Box
            key={item.id}
            sx={{
              position: "absolute",
              left: `calc(${((item.col - 1) * 100) / 7}% + 12px)`,
              width: `calc(${100 / 7}% - 20px)`,
              top: `${item.top}px`,
              height: `${item.height}px`,
              borderRadius: "14px",
              p: 1.5,
              bgcolor: getPastelColor(item.color),
              boxShadow: "0 4px 14px -4px rgba(0,0,0,0.1)",
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Skeleton
              variant="rounded"
              width="70%"
              height={16}
              sx={{ borderRadius: "6px" }}
            />
            <Skeleton
              variant="rounded"
              width="90%"
              height={12}
              sx={{ borderRadius: "4px" }}
            />
            <Skeleton
              variant="rounded"
              width="50%"
              height={10}
              sx={{ borderRadius: "4px", mt: "auto" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function CalendarSkeleton() {
  const { t } = useTranslation("common");

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "740px",
        p: { xs: 2, sm: 3 },
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CalendarSkeletonToolbar />
      <CalendarSkeletonGrid />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: "text.secondary" }}
        >
          {t("planning.loadingCalendar", "Loading interactive calendar...")}
        </Typography>
      </Box>
    </Box>
  );
}

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
  isFiltered: boolean;
  selectedType: string;
  isAdmin: boolean;
  onResetFilter: () => void;
  onAddClass: () => void;
  onShowGrid: () => void;
}

export function CalendarEmptyState({
  isFiltered,
  selectedType,
  isAdmin,
  onResetFilter,
  onAddClass,
  onShowGrid,
}: CalendarEmptyStateProps) {
  const { t } = useTranslation("common");

  const typeLabel = t(`planning.types.${selectedType}`, selectedType);
  const title = isFiltered
    ? t(
        "planning.states.noFilteredClassesTitle",
        `No ${typeLabel} Classes Found`,
        { type: typeLabel },
      )
    : t("planning.states.noClassesTitle", "No Classes Scheduled");

  const description = isFiltered
    ? t(
        "planning.states.noFilteredClassesDesc",
        `There are no classes matching the '${typeLabel}' format filter.`,
        { type: typeLabel },
      )
    : isAdmin
      ? t(
          "planning.states.noClassesAdminDesc",
          "No classes have been scheduled yet. Click 'Add Class' to create your first lecture, lab, or workshop.",
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
        {isFiltered && (
          <Button
            variant="contained"
            size="medium"
            startIcon={<FilterAltOffRoundedIcon />}
            onClick={onResetFilter}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 2.5,
              py: 1,
            }}
          >
            {t("planning.states.showAllClasses", "Show All Classes")}
          </Button>
        )}

        {isAdmin && (
          <Button
            variant={isFiltered ? "outlined" : "contained"}
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
