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

import CohortChip from "../../atoms/CohortChip/CohortChip";
import type { CohortConfig } from "~/types/institution";

export interface ProfileHeaderChipsProps {
  role: "student" | "instructor" | "admin";
  cohort?: CohortConfig;
  cohortName?: string;
  year?: string;
  cohortChipSize?: "small" | "medium" | "large";
}

function resolveChipHeight(size: "small" | "medium" | "large"): number {
  if (size === "large") return 36;
  if (size === "medium") return 28;
  return 22;
}

export function ProfileHeaderChips({
  role,
  cohort,
  cohortName,
  year,
  cohortChipSize = "medium",
}: ProfileHeaderChipsProps) {
  const { t } = useTranslation(["auth", "common"]);

  if (role === "admin") {
    return null;
  }

  const activeCohort =
    cohort || (cohortName ? { name: cohortName } : undefined);
  const chipHeight = resolveChipHeight(cohortChipSize);
  const chipSx = {
    height: chipHeight,
    fontWeight: 700,
    fontSize: cohortChipSize === "large" ? "0.85rem" : "0.78rem",
  };

  if (activeCohort) {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <CohortChip
          cohort={activeCohort}
          size={cohortChipSize}
          data-testid="profile-cohort-chip"
        />
        {year && (
          <Chip
            label={year}
            size="small"
            color="secondary"
            data-testid="profile-year-chip"
            sx={chipSx}
          />
        )}
      </Box>
    );
  }

  if (role === "student") {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {year && (
          <Chip
            label={year}
            size="small"
            color="secondary"
            data-testid="profile-year-chip"
            sx={chipSx}
          />
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Chip
        label={t("auth:roles.allCohorts", "All Cohorts").toUpperCase()}
        size="small"
        variant="outlined"
        data-testid="profile-all-cohorts-chip"
        sx={chipSx}
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
