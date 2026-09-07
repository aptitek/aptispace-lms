import React from "react";
import { alpha, type Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SKELETON_EVENTS = [
  { id: "skel-event-1", col: 1, top: 40, height: 110, color: "indigo" },
  { id: "skel-event-2", col: 2, top: 120, height: 140, color: "teal" },
  { id: "skel-event-3", col: 3, top: 80, height: 95, color: "amber" },
  { id: "skel-event-4", col: 4, top: 160, height: 130, color: "red" },
  { id: "skel-event-5", col: 5, top: 64, height: 120, color: "indigo" },
];

function getPastelColor(colorName: string, theme: Theme): string {
  switch (colorName) {
    case "teal":
      return alpha(theme.palette.info.light, 0.2);
    case "amber":
      return alpha(theme.palette.warning.main, 0.22);
    case "red":
      return alpha(theme.palette.error.main, 0.2);
    case "indigo":
    default:
      return alpha(theme.palette.secondary.main, 0.22);
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
          sx={{ borderRadius: "9999px" }}
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
            sx={{ borderRadius: "9999px" }}
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
              bgcolor: (theme) =>
                theme.palette.surfaceContainerLow ||
                theme.palette.background.paper,
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
        {SKELETON_EVENTS.map((skeletonEvent) => (
          <Box
            key={skeletonEvent.id}
            sx={{
              position: "absolute",
              left: `calc(${((skeletonEvent.col - 1) * 100) / 7}% + 12px)`,
              width: `calc(${100 / 7}% - 20px)`,
              top: `${skeletonEvent.top}px`,
              height: `${skeletonEvent.height}px`,
              borderRadius: "16px",
              p: 1.5,
              bgcolor: (theme) => getPastelColor(skeletonEvent.color, theme),
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
              sx={{ borderRadius: "4px" }}
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

export default CalendarSkeleton;
