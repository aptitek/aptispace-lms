import React, { useState } from "react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { ClassWithDetails } from "~/services/classService";
import { SoftDialog } from "./planning.styles";
import {
  formatTimeRange,
  calculateDurationHours,
  buildMailtoUrl,
} from "./planning.types";

interface InstructorInfoProps {
  instructor: NonNullable<ClassWithDetails["instructor"]>;
  instructorLabel: string;
}

function InstructorInfo({ instructor, instructorLabel }: InstructorInfoProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderRadius: "16px",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
        border: (theme) =>
          `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={instructor.avatarUrl || undefined}
          sx={{
            width: 44,
            height: 44,
            fontWeight: 800,
            fontSize: "1rem",
            backgroundColor: "primary.main",
          }}
        >
          {instructor.firstName?.[0] || instructor.displayName?.[0] || "I"}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {instructor.displayName ||
              `${instructor.firstName} ${instructor.lastName}`}
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}
          >
            <PersonRoundedIcon
              fontSize="inherit"
              sx={{ color: "text.secondary" }}
            />
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              {instructorLabel}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <EmailRoundedIcon
            fontSize="inherit"
            sx={{ color: "text.secondary" }}
          />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {instructor.role === "admin" ? "Admin Faculty" : "Course Faculty"}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {instructor.email || "faculty@aptispace.io"}
        </Typography>
      </Box>
    </Box>
  );
}

function formatClassSnippet(
  classItem: ClassWithDetails,
  start: Date,
  end: Date,
  labels: {
    course: string;
    date: string;
    location: string;
    instructor: string;
    virtualCampus: string;
  },
): string {
  const formatLabel = classItem.isRemote ? "Remote / Online" : "In-Person";
  const parts = [
    `${classItem.title}${classItem.isRemote ? " (Remote)" : ""}`,
    `Format: ${formatLabel}`,
    `${labels.course}: ${classItem.session.course.title}`,
    `${labels.date}: ${formatTimeRange(start, end)}`,
    `${labels.location}: ${classItem.location || labels.virtualCampus}`,
    `${labels.instructor}: ${classItem.instructor?.displayName || labels.instructor}`,
  ];
  return parts.join("\n");
}

interface ClassDetailsHeaderProps {
  isRemote: boolean;
  onClose: () => void;
}

function ClassDetailsHeader({ isRemote, onClose }: ClassDetailsHeaderProps) {
  const { t } = useTranslation("common");
  return (
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip
          arrow
          title={
            isRemote
              ? t("planning.tooltips.remoteBadge", "Remote Class")
              : t("planning.tooltips.inPersonBadge", "In-Person Class")
          }
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              cursor: "help",
              gap: 0.5,
              px: 1.25,
              py: 0.35,
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 800,
              backgroundColor: (theme) =>
                isRemote
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.success.main, 0.12),
              color: isRemote ? "primary.main" : "success.main",
            }}
          >
            {isRemote ? (
              <DevicesRoundedIcon sx={{ fontSize: "0.95rem" }} />
            ) : (
              <LocationOnRoundedIcon sx={{ fontSize: "0.95rem" }} />
            )}
            {isRemote
              ? t("planning.details.remoteBadge", "Remote")
              : t("planning.details.inPersonBadge", "In-Person")}
          </Box>
        </Tooltip>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {t("planning.details.title")}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={onClose}
        aria-label={t("planning.details.close")}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </DialogTitle>
  );
}

interface ClassScheduleCardProps {
  start: Date;
  end: Date;
  isRemote: boolean;
  location?: string | null;
}

function ClassScheduleCard({
  start,
  end,
  isRemote,
  location,
}: ClassScheduleCardProps) {
  const { t } = useTranslation("common");
  const virtualLabel = t(
    "planning.details.virtualCampus",
    "Online (Virtual Campus)",
  );
  const campusLabel = t("planning.details.onCampus", "AptiSpace Campus");
  const displayLocation = location || (isRemote ? virtualLabel : campusLabel);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "16px",
        backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.5),
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <AccessTimeRoundedIcon
          fontSize="small"
          sx={{ color: "primary.main" }}
        />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatTimeRange(start, end)} ({calculateDurationHours(start, end)})
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {isRemote ? (
          <DevicesRoundedIcon fontSize="small" sx={{ color: "primary.main" }} />
        ) : (
          <LocationOnRoundedIcon
            fontSize="small"
            sx={{ color: "primary.main" }}
          />
        )}
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {displayLocation}
        </Typography>
      </Box>
    </Box>
  );
}

export interface ClassDetailsDialogProps {
  classItem: ClassWithDetails;
  isAdmin: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClassDetailsDialog({
  classItem,
  isAdmin,
  onClose,
  onEdit,
  onDelete,
}: ClassDetailsDialogProps) {
  const { t } = useTranslation("common");
  const [copied, setCopied] = useState<boolean>(false);
  const start = new Date(classItem.startTime);
  const end = new Date(classItem.endTime);

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(
      formatClassSnippet(classItem, start, end, {
        course: t("planning.form.sessionLabel"),
        date: t("planning.form.startTime"),
        location: t("planning.form.locationLabel"),
        instructor: t("planning.details.instructor"),
        virtualCampus: t("planning.details.virtualCampus"),
      }),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cohortSubtitle = classItem.session.cohort
    ? ` • ${classItem.session.cohort.diploma} (${t("cohortYear.title")} ${classItem.session.cohort.year})`
    : "";

  return (
    <SoftDialog open onClose={onClose} maxWidth="sm" fullWidth>
      <ClassDetailsHeader isRemote={classItem.isRemote} onClose={onClose} />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
            {classItem.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            {classItem.session.course.title}
            {cohortSubtitle}
          </Typography>
        </Box>

        <ClassScheduleCard
          start={start}
          end={end}
          isRemote={classItem.isRemote}
          location={classItem.location}
        />

        {classItem.instructor && (
          <InstructorInfo
            instructor={classItem.instructor}
            instructorLabel={t("planning.details.instructor")}
          />
        )}

        {classItem.description && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                mb: 0.5,
                display: "block",
              }}
            >
              {t("planning.details.notesSyllabus")}
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", color: "text.primary" }}
            >
              {classItem.description}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", pt: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<EmailRoundedIcon />}
            href={buildMailtoUrl(classItem)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              flex: 1,
            }}
          >
            {t("planning.details.mailAsEvent")}
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadRoundedIcon />}
            href={`/api/classes/${classItem.id}?format=ics`}
            download={`class-${classItem.id}.ics`}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {t("planning.details.saveIcs")}
          </Button>

          <Tooltip
            title={
              copied
                ? t("planning.details.copied")
                : t("planning.details.copyDetails")
            }
          >
            <IconButton
              size="small"
              onClick={handleCopyDetails}
              sx={{
                borderRadius: "12px",
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              {copied ? (
                <CheckCircleRoundedIcon color="success" />
              ) : (
                <ContentCopyRoundedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 2, display: "flex", justifyContent: "space-between" }}
      >
        {isAdmin ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="text"
              color="error"
              size="small"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={onDelete}
              sx={{ borderRadius: "10px", fontWeight: 700 }}
            >
              {t("planning.details.delete")}
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditRoundedIcon />}
              onClick={onEdit}
              sx={{ borderRadius: "10px", fontWeight: 700 }}
            >
              {t("planning.details.edit")}
            </Button>
          </Box>
        ) : (
          <Box />
        )}
        <Button
          onClick={onClose}
          sx={{ borderRadius: "10px", fontWeight: 700 }}
        >
          {t("planning.details.close")}
        </Button>
      </DialogActions>
    </SoftDialog>
  );
}
