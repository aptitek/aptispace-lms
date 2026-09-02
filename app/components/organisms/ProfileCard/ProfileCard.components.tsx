import { useMemo } from "react";
import Box from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Chip from "../../atoms/Chip/Chip";
import HoloDecorator from "../../atoms/HoloDecorator/HoloDecorator";
import Logo from "../../atoms/Logo/Logo";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import Guilloche, { generateGuillocheMaskDataUrl } from "../../atoms/Guilloche";
import Electronics from "../../atoms/Electronics/Electronics";
import type { Td1MrzData } from "../../atoms/MrzZone/MrzZone.types";

export interface ProfileHeaderChipsProps {
  role: "student" | "instructor" | "admin";
  cohortName?: string;
  year?: string;
}

export function ProfileHeaderChips({
  role,
  cohortName,
  year,
}: ProfileHeaderChipsProps) {
  const { t } = useTranslation(["auth", "common"]);

  if (role === "student") {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {cohortName && (
          <Chip
            label={cohortName}
            size="small"
            variant="outlined"
            data-testid="profile-cohort-chip"
          />
        )}
        {year && (
          <Chip
            label={year}
            size="small"
            color="secondary"
            data-testid="profile-year-chip"
          />
        )}
      </Box>
    );
  }

  const isInstructor = role === "instructor";
  const roleLabel = isInstructor
    ? t("auth:roles.faculty", "Faculty")
    : t("auth:roles.staff", "Staff");
  const testId = isInstructor ? "profile-faculty-chip" : "profile-staff-chip";
  const roleColor = isInstructor ? "info" : "secondary";

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Chip
        label={roleLabel.toUpperCase()}
        size="small"
        color={roleColor}
        variant="outlined"
        data-testid={testId}
      />
      <Chip
        label={t("auth:roles.allCohorts", "All Cohorts").toUpperCase()}
        size="small"
        variant="outlined"
        data-testid="profile-all-cohorts-chip"
      />
    </Box>
  );
}

export interface BackContentProps {
  mrzData?: Td1MrzData;
}

export function BackContent({ mrzData }: BackContentProps) {
  const theme = useTheme();
  const guillocheMask = useMemo(
    () => generateGuillocheMaskDataUrl({ seed: "AptiSpace Academy" }),
    [],
  );

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: alpha(theme.palette.background.paper, 0.15),
        ...theme.applyStyles("dark", {
          bgcolor: alpha(theme.palette.background.default, 0.1),
        }),
      }}
    >
      <Electronics
        side="back"
        chipView="front"
        finish="gold"
        showNfcAntenna
        showInnerCoil
        showChip
        opacity={0.65}
      />
      <HoloDecorator
        type="image"
        maskUrl={guillocheMask}
        maskSize="100% 100%"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Guilloche seed="AptiSpace Academy" opacity={0.3} />
      </HoloDecorator>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          p: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ height: 48, mb: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: "auto" }}>
          <Logo size="large" holo />
        </Box>
      </Box>

      <Box sx={{ width: "100%", position: "relative", zIndex: 1, mt: "auto" }}>
        <MrzZone cardData={mrzData} fullWidth darkOnLight />
      </Box>
    </Box>
  );
}
