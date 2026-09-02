import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import EditableAvatar from "~/components/molecules/EditableAvatar/EditableAvatar";
import InstitutionChip from "~/components/atoms/InstitutionChip/InstitutionChip";
import {
  formatUsernameSamplePreview,
  DEFAULT_USERNAME_PATTERN,
  DEFAULT_EMAIL_DOMAIN,
} from "~/utils/emailFormat";
import type { SchoolConfig } from "~/types/institution";
import { InstitutionEmailCard } from "./InstitutionInspector.components";

interface InstitutionFormValues {
  name: string;
  slug: string;
  type: string;
  logoUrl: string;
  emailDomain: string;
  usernamePattern: string;
}

function cleanTrim(rawValue?: string | null): string {
  if (!rawValue) return "";
  return rawValue.trim();
}

function resolveNextFormValues(
  current: InstitutionFormValues,
  updates?: Partial<InstitutionFormValues>,
): InstitutionFormValues {
  const merged = { ...current, ...updates };
  return {
    name: cleanTrim(merged.name),
    slug: cleanTrim(merged.slug),
    type: merged.type,
    logoUrl: cleanTrim(merged.logoUrl),
    emailDomain: cleanTrim(merged.emailDomain),
    usernamePattern: cleanTrim(merged.usernamePattern),
  };
}

function hasFormValuesChanged(
  prev: InstitutionFormValues,
  next: InstitutionFormValues,
): boolean {
  return (
    prev.name !== next.name ||
    prev.slug !== next.slug ||
    prev.type !== next.type ||
    prev.logoUrl !== next.logoUrl ||
    prev.emailDomain !== next.emailDomain ||
    prev.usernamePattern !== next.usernamePattern
  );
}

function resolvePattern(institution: SchoolConfig): string {
  return (
    institution.usernamePattern ||
    institution.emailPattern ||
    DEFAULT_USERNAME_PATTERN
  );
}

function buildInitialFormValues(
  institution: SchoolConfig | null,
): InstitutionFormValues {
  if (!institution) {
    return {
      name: "",
      slug: "",
      type: "academic",
      logoUrl: "",
      emailDomain: "",
      usernamePattern: DEFAULT_USERNAME_PATTERN,
    };
  }
  return {
    name: institution.name || "",
    slug: institution.slug || "",
    type: institution.type || "academic",
    logoUrl: institution.logoUrl || "",
    emailDomain: institution.emailDomain || "",
    usernamePattern: resolvePattern(institution),
  };
}

interface InstitutionInspectorProps {
  institution: SchoolConfig | null;
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    name: string;
    slug: string;
    type?: string;
    logoUrl?: string;
    emailDomain?: string;
    usernamePattern?: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function InstitutionInspector({
  institution,
  onClose,
  onSave,
  isSubmitting,
}: InstitutionInspectorProps) {
  const { t } = useTranslation("common");
  const isEditing = Boolean(institution?.id);
  const disabled = Boolean(isSubmitting);

  const [form, setForm] = useState<InstitutionFormValues>(() =>
    buildInitialFormValues(institution),
  );

  const [isDomainConstrained, setIsDomainConstrained] = useState(() =>
    Boolean(
      institution?.emailDomain && institution.emailDomain.trim().length > 0,
    ),
  );

  const currentInstitutionIdRef = useRef<string | undefined>(institution?.id);
  const savedValuesRef = useRef<InstitutionFormValues>(
    buildInitialFormValues(institution),
  );

  useEffect(() => {
    if (!institution) return;
    const isDifferent = institution.id !== currentInstitutionIdRef.current;
    currentInstitutionIdRef.current = institution.id;

    if (isDifferent) {
      const initial = buildInitialFormValues(institution);
      setForm(initial);
      savedValuesRef.current = initial;
      setIsDomainConstrained(Boolean(initial.emailDomain));
    } else {
      savedValuesRef.current = buildInitialFormValues(institution);
    }
  }, [institution]);

  const preview = useMemo(() => {
    const domain = form.emailDomain.trim();
    return formatUsernameSamplePreview(
      form.usernamePattern || DEFAULT_USERNAME_PATTERN,
      domain || DEFAULT_EMAIL_DOMAIN,
    );
  }, [form.usernamePattern, form.emailDomain]);

  const handleToggleConstraint = (constrained: boolean) => {
    setIsDomainConstrained(constrained);
    if (!constrained) {
      handleFieldChange("emailDomain", "");
      triggerSave({ emailDomain: "" });
    } else {
      const nextDomain =
        form.emailDomain.trim() ||
        (form.slug ? `${form.slug}.edu` : "institution.edu");
      handleFieldChange("emailDomain", nextDomain);
      triggerSave({ emailDomain: nextDomain });
    }
  };

  const triggerSave = (updates?: Partial<InstitutionFormValues>) => {
    if (!isEditing || !institution?.id) return;
    const next = resolveNextFormValues(form, updates);
    if (!next.name || !next.slug) return;
    if (!hasFormValuesChanged(savedValuesRef.current, next)) return;

    savedValuesRef.current = next;
    onSave({
      id: institution.id,
      name: next.name,
      slug: next.slug,
      type: next.type,
      logoUrl: next.logoUrl || undefined,
      emailDomain: next.emailDomain,
      usernamePattern: next.usernamePattern || undefined,
    });
  };

  const handleFieldChange = (
    field: keyof InstitutionFormValues,
    textValue: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: textValue }));
  };

  const handleCreate = () => {
    if (!form.name.trim() || !form.slug.trim()) return;
    onSave({
      name: form.name.trim(),
      slug: form.slug.trim(),
      type: form.type,
      logoUrl: form.logoUrl.trim() || undefined,
      emailDomain: form.emailDomain.trim() || undefined,
      usernamePattern: form.usernamePattern.trim() || undefined,
    });
  };

  if (!institution) return null;

  return (
    <Card
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        height: "calc(100vh - 200px)",
        maxHeight: "800px",
        overflowY: "auto",
        position: "sticky",
        top: 24,
      }}
      variant="outlined"
      data-testid="institution-inspector-card"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {isEditing
            ? t("inspector.editInstitution", "Edit Institution")
            : t("inspector.addInstitution", "Add Institution")}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("inspector.closeAria", "Close inspector")}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <EditableAvatar
        mode="image-only"
        value={form.logoUrl}
        defaultValue={institution.logoUrl || ""}
        name={form.name || t("inspector.institutionName", "Institution Name")}
        shape="landscape"
        size="lg"
        width="100%"
        height={80}
        objectFit="contain"
        editable={!disabled}
        onChange={(newUrl) => {
          handleFieldChange("logoUrl", newUrl);
          triggerSave({ logoUrl: newUrl });
        }}
        testId="inspector-institution-avatar"
      />

      <TextField
        label={t("inspector.institutionName", "Name")}
        value={form.name}
        onChange={(e) => handleFieldChange("name", e.target.value)}
        onBlur={() => triggerSave({ name: form.name })}
        fullWidth
        disabled={disabled}
        required
      />
      <TextField
        label={t("inspector.institutionSlug", "Slug")}
        value={form.slug}
        onChange={(e) => handleFieldChange("slug", e.target.value)}
        onBlur={() => triggerSave({ slug: form.slug })}
        fullWidth
        disabled={disabled}
        required
      />
      <TextField
        select
        label={t("inspector.institutionType", "Type")}
        value={form.type}
        onChange={(e) => {
          handleFieldChange("type", e.target.value);
          triggerSave({ type: e.target.value });
        }}
        fullWidth
        disabled={disabled}
        slotProps={{
          select: {
            renderValue: (selectedVal) => (
              <InstitutionChip
                institutionType={String(selectedVal)}
                size="small"
              />
            ),
          },
        }}
      >
        <MenuItem value="academic" sx={{ py: 0.75 }}>
          <InstitutionChip institutionType="school" size="small" />
        </MenuItem>
        <MenuItem value="company" sx={{ py: 0.75 }}>
          <InstitutionChip institutionType="company" size="small" />
        </MenuItem>
      </TextField>

      <InstitutionEmailCard
        emailDomain={form.emailDomain}
        usernamePattern={form.usernamePattern}
        previewEmail={preview.email}
        disabled={disabled}
        isConstrained={isDomainConstrained}
        onToggleConstraint={handleToggleConstraint}
        onFieldChange={handleFieldChange}
        onBlur={(field) => triggerSave({ [field]: form[field] })}
      />

      {!isEditing && (
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button onClick={onClose} disabled={disabled}>
            {t("inspector.cancel", "Cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={disabled || !form.name.trim() || !form.slug.trim()}
          >
            {t("inspector.create", "Create")}
          </Button>
        </Box>
      )}
    </Card>
  );
}
