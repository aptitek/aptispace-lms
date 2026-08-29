import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import RoleChip from "~/components/atoms/RoleChip/RoleChip";
import {
  DEV_PERSONAS,
  type PersonaDefinition,
  type UserRole,
} from "~/utils/auth";
import BugReportIcon from "@mui/icons-material/BugReport";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export interface DevImpersonatorProps {
  onSelectPersona?: (personaRole: UserRole) => void;
  loading?: boolean;
}

const DevContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.warning.main}`,
  backgroundColor: alpha(theme.palette.warning.main, 0.04),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

const ToolHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
}));

const HeaderTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  fontSize: theme.typography.caption.fontSize ?? "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.palette.warning.main,

  "& .MuiSvgIcon-root": {
    fontSize: "1rem",
  },
}));

const ModeBadge = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: "0.7rem",
  borderRadius: 4,
  backgroundColor: theme.palette.warning.dark,
  color: theme.palette.warning.contrastText,
  fontWeight: 700,
  fontFamily: "monospace",
  "& .MuiChip-label": {
    paddingLeft: 6,
    paddingRight: 6,
  },
}));

const PersonaList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const PersonaItem = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => {
  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1, 1.5),
    borderRadius: radius * 0.75,
    border: `1px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: isSelected
      ? theme.palette.action.selected
      : theme.palette.background.paper,
    color: theme.palette.text.primary,
    cursor: "pointer",
    textAlign: "left",
    transition: theme.transitions.create(
      ["background-color", "border-color", "transform"],
      {
        duration: theme.transitions.duration.shorter,
      },
    ),

    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.light,
      transform: "translateX(2px)",
    },

    "&:focus-visible": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.action.focus}`,
    },
  };
});

const PersonaDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25),
}));

const PersonaName = styled(Box)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const PersonaEmail = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));

const ActionIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.secondary,
  "& .MuiSvgIcon-root": {
    fontSize: "1.1rem",
  },
}));

export default function DevImpersonator({
  onSelectPersona,
  loading = false,
}: DevImpersonatorProps) {
  const { t } = useTranslation("auth");
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");

  const handleSelect = (persona: PersonaDefinition) => {
    setSelectedRole(persona.role);
    onSelectPersona?.(persona.role);
  };

  return (
    <DevContainer elevation={0} aria-label={t("devTool.ariaLabel")}>
      <ToolHeader>
        <HeaderTitle>
          <BugReportIcon />
          <span>{t("devTool.title")}</span>
        </HeaderTitle>
        <ModeBadge size="small" label={t("devTool.modeBadge")} />
      </ToolHeader>

      <PersonaList role="group" aria-label={t("devTool.groupAriaLabel")}>
        {DEV_PERSONAS.map((persona) => {
          const isSelected = selectedRole === persona.role;
          const translatedName = t(
            `devTool.personas.${persona.role}.name` as const,
            { defaultValue: persona.name },
          );
          const translatedBadge = t(`devTool.roles.${persona.role}` as const, {
            defaultValue: persona.badge,
          });

          return (
            <PersonaItem
              key={persona.id}
              isSelected={isSelected}
              disabled={loading}
              onClick={() => handleSelect(persona)}
              aria-pressed={isSelected}
            >
              <PersonaDetails>
                <PersonaName>
                  <span>{translatedName}</span>
                  <RoleChip role={persona.role} label={translatedBadge} />
                </PersonaName>
                <PersonaEmail variant="caption">{persona.email}</PersonaEmail>
              </PersonaDetails>
              <ActionIcon>
                <ArrowForwardIcon />
              </ActionIcon>
            </PersonaItem>
          );
        })}
      </PersonaList>
    </DevContainer>
  );
}
