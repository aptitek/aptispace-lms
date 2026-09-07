import Box from "@mui/material/Box";
import Card from "~/components/atoms/Card/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { alpha } from "@mui/material/styles";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import LockOutlineRoundedIcon from "@mui/icons-material/LockOutlineRounded";
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
  const activeTab = isConstrained ? "constrained" : "free";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AlternateEmailRoundedIcon
          fontSize="small"
          sx={{ color: "primary.main" }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {t("inspector.emailConfig", "Email Configuration")}
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, nextVal) => onToggleConstraint(nextVal === "constrained")}
        variant="fullWidth"
        aria-label={t("inspector.domainConstraint", "Domain Constraint")}
        data-testid="inspector-domain-constraint-toggle"
        sx={{
          minHeight: 40,
          backgroundColor: (tRef) =>
            tRef.palette.surfaceContainerHigh || tRef.palette.surfaceContainer,
          borderRadius: "8px",
          p: 0.5,
          "& .MuiTabs-indicator": {
            height: "100%",
            borderRadius: "8px",
            backgroundColor: (tRef) =>
              tRef.palette.surfaceContainerLowest ||
              tRef.palette.background.paper,
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            transition: "all 200ms cubic-bezier(0.2, 0, 0, 1)",
            zIndex: 0,
          },
          "& .MuiTab-root": {
            minHeight: 34,
            py: 0.5,
            px: 1.5,
            zIndex: 1,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            color: "text.secondary",
            transition: "color 150ms ease",
            gap: 0.75,
            "&.Mui-selected": {
              color: "primary.main",
              fontWeight: 700,
            },
          },
        }}
      >
        <Tab
          value="free"
          icon={<PublicRoundedIcon sx={{ fontSize: 16 }} />}
          iconPosition="start"
          label={t("inspector.anyEmail", "Any Email")}
          disabled={disabled}
          data-testid="inspector-domain-free-toggle"
        />
        <Tab
          value="constrained"
          icon={<LockOutlineRoundedIcon sx={{ fontSize: 16 }} />}
          iconPosition="start"
          label={t("inspector.domainConstraint", "Domain Constraint")}
          disabled={disabled}
          data-testid="inspector-domain-constrained-toggle"
        />
      </Tabs>
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
        bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
        border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
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
    </Box>
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
      isNested
      sx={{
        p: 2,
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
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
