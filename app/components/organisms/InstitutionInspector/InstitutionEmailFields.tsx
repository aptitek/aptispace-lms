import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { alpha } from "@mui/material/styles";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import { useTranslation } from "react-i18next";
import { FONT_FAMILIES, RECURSIVE_PRESETS } from "~/tokens/typography";

export function InstitutionEmailPreviewBox({
  previewEmail,
}: {
  previewEmail: string;
}) {
  const { t } = useTranslation("common");
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "12px",
        bgcolor: (theme) =>
          theme.palette.surfaceContainer ||
          alpha(theme.palette.primary.main, 0.04),
        border: "1px dashed",
        borderColor: (theme) => alpha(theme.palette.divider, 0.8),
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
      data-testid="inspector-email-preview-box"
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600 }}
      >
        {t("inspector.emailPreview", "Generated Email Preview")}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: FONT_FAMILIES.mono,
          fontVariationSettings: RECURSIVE_PRESETS.mono,
          fontWeight: 700,
          color: "primary.main",
          wordBreak: "break-all",
        }}
      >
        {previewEmail}
      </Typography>
    </Box>
  );
}

export function InstitutionFreeDomainNotice() {
  const { t } = useTranslation("common");
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "12px",
        bgcolor: (theme) => alpha(theme.palette.info.main, 0.06),
        border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.18)}`,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
      data-testid="inspector-free-domain-notice"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <InfoOutlineRoundedIcon fontSize="small" color="info" />
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "info.main", fontSize: "0.8125rem" }}
        >
          {t("inspector.freeDomainNoticeTitle", "Empty = Any Email")}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ lineHeight: 1.4 }}
      >
        {t(
          "inspector.freeDomainNoticeDesc",
          "When the domain is empty, students and staff can use any email address (e.g. personal GitHub or Gmail).",
        )}
      </Typography>
    </Box>
  );
}

export interface InstitutionConstrainedDomainFieldsProps {
  emailDomain: string;
  usernamePattern: string;
  disabled: boolean;
  previewEmail: string;
  onFieldChange: (
    field: "emailDomain" | "usernamePattern",
    nextValue: string,
  ) => void;
  onBlur: (field: "emailDomain" | "usernamePattern") => void;
}

export function InstitutionConstrainedDomainFields({
  emailDomain,
  usernamePattern,
  disabled,
  previewEmail,
  onFieldChange,
  onBlur,
}: InstitutionConstrainedDomainFieldsProps) {
  const { t } = useTranslation("common");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <TextField
        label={t("inspector.emailDomain", "Email Domain")}
        placeholder="e.g. aptitek.io"
        value={emailDomain}
        onChange={(e) => onFieldChange("emailDomain", e.target.value)}
        onBlur={() => onBlur("emailDomain")}
        fullWidth
        size="small"
        disabled={disabled}
        helperText={t(
          "inspector.emailDomainHelper",
          "Email domain for institutional accounts (optional).",
        )}
        data-testid="inspector-institution-domain"
      />

      <TextField
        label={t("inspector.usernamePattern", "Username Format")}
        placeholder="e.g. {first}.{last} or {f}{last}"
        value={usernamePattern}
        onChange={(e) => onFieldChange("usernamePattern", e.target.value)}
        onBlur={() => onBlur("usernamePattern")}
        helperText={t(
          "inspector.usernamePatternHelper",
          "Tokens: {first}, {last}, {first:N}, {last:N}, {f}",
        )}
        fullWidth
        size="small"
        disabled={disabled}
        data-testid="inspector-institution-pattern"
      />

      <InstitutionEmailPreviewBox previewEmail={previewEmail} />
    </Box>
  );
}
