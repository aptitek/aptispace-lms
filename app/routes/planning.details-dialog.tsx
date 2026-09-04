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
  const initial = instructor.displayName?.[0] || instructor.firstName?.[0];
  const name =
    instructor.displayName ||
    `${instructor.firstName} ${instructor.lastName}`.trim();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "16px",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
        border: (theme) =>
          `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Avatar
        src={instructor.avatarUrl || undefined}
        sx={{ width: 44, height: 44, bgcolor: "primary.main" }}
      >
        {initial || <PersonRoundedIcon />}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {name}
          </Typography>
          <Box
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              px: 1,
              py: 0.2,
              borderRadius: "6px",
              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
              color: "secondary.main",
            }}
          >
            {instructorLabel}
          </Box>
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
  const parts = [
    `${classItem.title} (${classItem.type.toUpperCase()})`,
    `${labels.course}: ${classItem.session.course.title}`,
    `${labels.date}: ${formatTimeRange(start, end)}`,
    `${labels.location}: ${classItem.location || labels.virtualCampus}`,
    `${labels.instructor}: ${classItem.instructor?.displayName || labels.instructor}`,
  ];
  return parts.join("\n");
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

  const typeLabel = t(`planning.types.${classItem.type}`);

  return (
    <SoftDialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              px: 1.25,
              py: 0.35,
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
            }}
          >
            {typeLabel}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {t("planning.details.title")}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label={t("planning.details.close")}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            {classItem.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            {classItem.session.course.title}
            {cohortSubtitle}
          </Typography>
        </Box>

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
              {formatTimeRange(start, end)} (
              {calculateDurationHours(start, end)})
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LocationOnRoundedIcon
              fontSize="small"
              sx={{ color: "primary.main" }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {classItem.location || t("planning.details.virtualCampus")}
            </Typography>
          </Box>
        </Box>

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
