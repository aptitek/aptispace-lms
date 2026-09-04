import React from "react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";

import { HeroCard } from "./planning.styles";

export interface PlanningHeroProps {
  userRole: "admin" | "instructor" | "student";
  isAdmin: boolean;
  onOpenExport: () => void;
}

export function PlanningHero({
  userRole,
  isAdmin: _isAdmin,
  onOpenExport,
}: PlanningHeroProps) {
  const { t } = useTranslation("common");

  const roleLabel =
    userRole === "admin"
      ? t("planning.roleAdmin")
      : userRole === "instructor"
        ? t("planning.roleInstructor")
        : t("planning.roleStudent");

  return (
    <HeroCard>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
          }}
        >
          <CalendarMonthRoundedIcon />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            {t("planning.title")}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            {roleLabel}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          size="medium"
          startIcon={<LinkRoundedIcon />}
          onClick={onOpenExport}
          sx={{
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 700,
            px: 2,
            py: 1,
          }}
        >
          {t("planning.subscribeExport")}
        </Button>
      </Box>
    </HeroCard>
  );
}
