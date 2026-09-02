import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { SchoolConfig } from "~/types/institution";

interface InstitutionInspectorProps {
  institution: SchoolConfig | null;
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    name: string;
    slug: string;
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
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (institution) {
      setName(institution.name || "");
      setSlug(institution.slug || "");
      setLogoUrl(institution.logoUrl || "");
    }
  }, [institution]);

  const handleSave = () => {
    onSave({
      id: institution?.id,
      name,
      slug,
      logoUrl,
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
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {institution.id
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

      <TextField
        label={t("inspector.institutionName", "Name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        disabled={isSubmitting}
        required
      />
      <TextField
        label={t("inspector.institutionSlug", "Slug")}
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        fullWidth
        disabled={isSubmitting}
        required
      />
      <TextField
        label={t("inspector.logoUrl", "Logo URL")}
        value={logoUrl}
        onChange={(e) => setLogoUrl(e.target.value)}
        fullWidth
        disabled={isSubmitting}
      />

      <Box
        sx={{ mt: "auto", display: "flex", justifyContent: "flex-end", gap: 2 }}
      >
        <Button onClick={onClose} disabled={isSubmitting}>
          {t("inspector.cancel", "Cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting || !name || !slug}
        >
          {t("inspector.save", "Save")}
        </Button>
      </Box>
    </Card>
  );
}
