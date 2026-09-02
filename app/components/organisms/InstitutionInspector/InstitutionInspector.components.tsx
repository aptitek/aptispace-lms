import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { alpha } from "@mui/material/styles";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTranslation } from "react-i18next";

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
        borderRadius: 1.5,
        bgcolor: "action.hover",
        border: "1px dashed",
        borderColor: "divider",
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
          fontFamily: "monospace",
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

export function InstitutionEmailCardHeader({
  isConstrained,
  disabled,
  onToggleConstraint,
}: {
  isConstrained: boolean;
  disabled: boolean;
  onToggleConstraint: (checked: boolean) => void;
}) {
  const { t } = useTranslation("common");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AlternateEmailIcon fontSize="small" sx={{ color: "primary.main" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {t("inspector.emailConfig", "Email Configuration")}
        </Typography>
      </Box>

      <ToggleButtonGroup
        value={isConstrained ? "constrained" : "free"}
        exclusive
        onChange={(_, nextValue: string | null) => {
          if (nextValue !== null) {
            onToggleConstraint(nextValue === "constrained");
          }
        }}
        fullWidth
        size="small"
        aria-label={t("inspector.domainConstraint", "Domain Constraint")}
        sx={{
          p: 0.5,
          borderRadius: 2,
          bgcolor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
          "& .MuiToggleButtonGroup-grouped": {
            border: 0,
            borderRadius: 1.5,
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "none",
            gap: 0.75,
            py: 0.6,
            color: "text.secondary",
            "&.Mui-selected": {
              bgcolor: "background.paper",
              color: "primary.main",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "background.paper",
              },
            },
          },
        }}
        data-testid="inspector-domain-constraint-toggle"
      >
        <ToggleButton
          value="free"
          disabled={disabled}
          data-testid="inspector-domain-free-toggle"
        >
          <PublicRoundedIcon sx={{ fontSize: 16 }} />
          {t("inspector.anyEmail", "Any Email")}
        </ToggleButton>
        <ToggleButton
          value="constrained"
          disabled={disabled}
          data-testid="inspector-domain-constrained-toggle"
        >
          <LockOutlinedIcon sx={{ fontSize: 16 }} />
          {t("inspector.domainConstraint", "Domain Constraint")}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export function InstitutionFreeDomainNotice() {
  const { t } = useTranslation("common");
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
        border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
      data-testid="inspector-free-domain-notice"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <InfoOutlinedIcon fontSize="small" color="info" />
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "info.main" }}
        >
          {t("inspector.freeDomainNoticeTitle", "Empty = Any Email")}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {t(
          "inspector.freeDomainNoticeDesc",
          "When the domain is empty, students and staff can use any email address (e.g. personal GitHub or Gmail).",
        )}
      </Typography>
    </Box>
  );
}

export function InstitutionConstrainedDomainFields({
  emailDomain,
  usernamePattern,
  disabled,
  previewEmail,
  onFieldChange,
  onBlur,
}: {
  emailDomain: string;
  usernamePattern: string;
  disabled: boolean;
  previewEmail: string;
  onFieldChange: (
    field: "emailDomain" | "usernamePattern",
    nextValue: string,
  ) => void;
  onBlur: (field: "emailDomain" | "usernamePattern") => void;
}) {
  const { t } = useTranslation("common");

  return (
    <>
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
          "inspector.domainConstraintHelper",
          "Only email addresses matching this domain are authorized.",
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
    </>
  );
}

export interface InstitutionEmailCardProps {
  emailDomain: string;
  usernamePattern: string;
  previewEmail: string;
  disabled: boolean;
  isConstrained: boolean;
  onToggleConstraint: (constrained: boolean) => void;
  onFieldChange: (
    field: "emailDomain" | "usernamePattern",
    nextValue: string,
  ) => void;
  onBlur: (field: "emailDomain" | "usernamePattern") => void;
}

export function InstitutionEmailCard({
  emailDomain,
  usernamePattern,
  previewEmail,
  disabled,
  isConstrained,
  onToggleConstraint,
  onFieldChange,
  onBlur,
}: InstitutionEmailCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.6)}`,
      }}
      data-testid="inspector-institution-email-card"
    >
      <InstitutionEmailCardHeader
        isConstrained={isConstrained}
        disabled={disabled}
        onToggleConstraint={onToggleConstraint}
      />
      {isConstrained ? (
        <InstitutionConstrainedDomainFields
          emailDomain={emailDomain}
          usernamePattern={usernamePattern}
          disabled={disabled}
          previewEmail={previewEmail}
          onFieldChange={onFieldChange}
          onBlur={onBlur}
        />
      ) : (
        <InstitutionFreeDomainNotice />
      )}
    </Card>
  );
}
