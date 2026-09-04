import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { SoftDialog } from "./planning.styles";

export interface CalendarExportDialogProps {
  open: boolean;
  onClose: () => void;
  feedToken: string;
  isAdmin: boolean;
  userId: string;
  onRegenerateToken: () => void;
  onNotify: (msg: string) => void;
}

export function CalendarExportDialog({
  open,
  onClose,
  feedToken,
  isAdmin,
  userId,
  onRegenerateToken,
  onNotify,
}: CalendarExportDialogProps) {
  const { t } = useTranslation("common");
  const [copied, setCopied] = useState<boolean>(false);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://aptispace.io";
  const httpFeedUrl = `${origin}/api/calendar/${feedToken}.ics`;
  const webcalUrl = httpFeedUrl.replace(/^https?:\/\//, "webcal://");

  const handleCopy = () => {
    navigator.clipboard.writeText(httpFeedUrl);
    setCopied(true);
    onNotify(t("planning.messages.urlCopied"));
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <SoftDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 800,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarMonthRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {t("planning.export.title")}
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
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("planning.export.description")}
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: "16px",
            backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.4),
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.secondary" }}
            >
              {t("planning.export.secureUrlLabel")}
            </Typography>
            <Box
              sx={{
                fontSize: "0.65rem",
                fontWeight: 800,
                px: 1,
                py: 0.2,
                borderRadius: "6px",
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                color: "success.main",
              }}
            >
              RFC 5545
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              size="small"
              value={httpFeedUrl}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                  sx: {
                    borderRadius: "10px",
                    fontSize: "0.82rem",
                    fontFamily: "monospace",
                    bgcolor: (theme) =>
                      alpha(theme.palette.background.paper, 0.8),
                  },
                },
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleCopy}
              startIcon={
                copied ? <CheckCircleRoundedIcon /> : <ContentCopyRoundedIcon />
              }
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                whiteSpace: "nowrap",
                px: 2,
              }}
            >
              {copied ? t("planning.export.copied") : t("planning.export.copy")}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          <Button
            variant="outlined"
            size="medium"
            href={webcalUrl}
            startIcon={<CalendarMonthRoundedIcon />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {t("planning.export.oneClick")}
          </Button>

          <Button
            variant="outlined"
            size="medium"
            href={`/api/calendar/${feedToken}.ics`}
            download={`aptispace-${userId}.ics`}
            startIcon={<DownloadRoundedIcon />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {t("planning.export.downloadIcs")}
          </Button>
        </Box>

        <Box
          sx={{
            p: 1.75,
            borderRadius: "14px",
            backgroundColor: (theme) => alpha(theme.palette.info.main, 0.06),
            border: (theme) =>
              `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", lineHeight: 1.5, display: "block" }}
          >
            {t("planning.export.securityNotice")}
          </Typography>
        </Box>

        {isAdmin && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              {t("planning.export.invalidateQuestion")}
            </Typography>
            <Button
              size="small"
              color="warning"
              variant="text"
              startIcon={<RefreshRoundedIcon />}
              onClick={onRegenerateToken}
              sx={{
                borderRadius: "8px",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {t("planning.export.regenerateBtn")}
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{ borderRadius: "10px", fontWeight: 700 }}
        >
          {t("planning.export.done")}
        </Button>
      </DialogActions>
    </SoftDialog>
  );
}
