import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useTranslation } from "react-i18next";
import { CodePreBox } from "./MissionCenter.styles";

export interface MissionCenterJsonModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  payload: unknown;
  onClose: () => void;
}

export function MissionCenterJsonModal({
  open,
  title,
  subtitle,
  payload,
  onClose,
}: MissionCenterJsonModalProps) {
  const { t } = useTranslation(["common"]);
  const [copied, setCopied] = useState(false);

  const formattedText =
    typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            backgroundColor: "background.paper",
          },
        },
      }}
      data-testid="mission-center-json-modal"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2.5 }}>
        <CodePreBox data-testid="json-modal-content">
          {formattedText}
        </CodePreBox>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, justifyContent: "space-between" }}>
        <Button
          startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
          color={copied ? "success" : "primary"}
          size="small"
          onClick={handleCopy}
          data-testid="json-modal-copy-btn"
        >
          {copied
            ? t("common:copied", "Copied!")
            : t("common:copyTrace", "Copy Payload")}
        </Button>
        <Button onClick={onClose} variant="contained" size="small">
          {t("common:close", "Close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
