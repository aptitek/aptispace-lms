import { useState, useEffect, useRef } from "react";
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
import type { SchoolConfig } from "~/types/institution";

interface InstitutionFormValues {
  name: string;
  slug: string;
  type: string;
  logoUrl: string;
}

function resolveNextFormValues(
  current: InstitutionFormValues,
  updates?: Partial<InstitutionFormValues>,
): InstitutionFormValues {
  return {
    name: (updates?.name ?? current.name).trim(),
    slug: (updates?.slug ?? current.slug).trim(),
    type: updates?.type ?? current.type,
    logoUrl: (updates?.logoUrl ?? current.logoUrl).trim(),
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
    prev.logoUrl !== next.logoUrl
  );
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
  }) => void;
  isSubmitting?: boolean;
}

export default function InstitutionInspector({
  institution,
  onClose,
  onSave,
  isSubmitting = false,
}: InstitutionInspectorProps) {
  const { t } = useTranslation("common");
  const isEditing = Boolean(institution?.id);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("academic");
  const [logoUrl, setLogoUrl] = useState("");

  const savedValuesRef = useRef<InstitutionFormValues>({
    name: "",
    slug: "",
    type: "academic",
    logoUrl: "",
  });

  useEffect(() => {
    if (institution) {
      const initial: InstitutionFormValues = {
        name: institution.name || "",
        slug: institution.slug || "",
        type: institution.type || "academic",
        logoUrl: institution.logoUrl || "",
      };

      setName(initial.name);
      setSlug(initial.slug);
      setType(initial.type);
      setLogoUrl(initial.logoUrl);
      savedValuesRef.current = initial;
    }
  }, [institution]);

  const triggerSave = (updates?: Partial<InstitutionFormValues>) => {
    if (!isEditing || !institution?.id) return;
    const current = { name, slug, type, logoUrl };
    const next = resolveNextFormValues(current, updates);
    if (!next.name || !next.slug) return;
    if (!hasFormValuesChanged(savedValuesRef.current, next)) return;

    savedValuesRef.current = next;
    onSave({
      id: institution.id,
      name: next.name,
      slug: next.slug,
      type: next.type,
      logoUrl: next.logoUrl || undefined,
    });
  };

  const handleCreate = () => {
    if (!name.trim() || !slug.trim()) return;
    onSave({
      name: name.trim(),
      slug: slug.trim(),
      type,
      logoUrl: logoUrl.trim() || undefined,
    });
  };

  if (!institution) return null;

  return (
    <Card
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
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
        value={logoUrl}
        defaultValue={institution.logoUrl || ""}
        name={name || t("inspector.institutionName", "Institution Name")}
        shape="landscape"
        size="lg"
        width="100%"
        height={80}
        objectFit="contain"
        editable={!isSubmitting}
        onChange={(newUrl) => {
          setLogoUrl(newUrl);
          triggerSave({ logoUrl: newUrl });
        }}
        testId="inspector-institution-avatar"
      />

      <TextField
        label={t("inspector.institutionName", "Name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => triggerSave({ name })}
        fullWidth
        disabled={isSubmitting}
        required
      />
      <TextField
        label={t("inspector.institutionSlug", "Slug")}
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        onBlur={() => triggerSave({ slug })}
        fullWidth
        disabled={isSubmitting}
        required
      />
      <TextField
        select
        label={t("inspector.institutionType", "Type")}
        value={type}
        onChange={(e) => {
          const newType = e.target.value;
          setType(newType);
          triggerSave({ type: newType });
        }}
        fullWidth
        disabled={isSubmitting}
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

      {!isEditing && (
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button onClick={onClose} disabled={isSubmitting}>
            {t("inspector.cancel", "Cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={isSubmitting || !name.trim() || !slug.trim()}
          >
            {t("inspector.create", "Create")}
          </Button>
        </Box>
      )}
    </Card>
  );
}
