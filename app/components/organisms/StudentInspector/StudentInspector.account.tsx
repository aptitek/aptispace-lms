import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { alpha } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Avatar from "~/components/atoms/Avatar/Avatar";
import RoleChip from "~/components/molecules/RoleChip/RoleChip";
import type { EntityCardData } from "../../molecules/EntityCard/EntityCard.types";

export interface InspectorAccountSectionProps {
  targetStudent: EntityCardData;
  onUpdateGithub?: (studentId: string, githubId: string) => void;
  isSubmitting?: boolean;
}

export function InspectorAccountSection({
  targetStudent,
  onUpdateGithub,
  isSubmitting = false,
}: InspectorAccountSectionProps) {
  const { t } = useTranslation(["common", "auth"]);
  const [githubId, setGithubId] = useState(targetStudent.githubUsername || "");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setGithubId(targetStudent.githubUsername || "");
  }, [targetStudent.githubUsername]);

  const handleCommit = () => {
    const trimmed = githubId.trim();
    if (trimmed !== (targetStudent.githubUsername || "")) {
      onUpdateGithub?.(targetStudent.id, trimmed);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommit();
    }
  };

  const displayName =
    targetStudent.displayName ||
    `${targetStudent.firstName} ${targetStudent.familyName}`.trim();

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.6)}`,
      }}
      data-testid="inspector-account-section"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={targetStudent.avatarUrl}
          name={displayName}
          width={44}
          height={44}
          role={targetStudent.role}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </Typography>
            <RoleChip
              userRole={targetStudent.role || "student"}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {targetStudent.email}
          </Typography>
        </Box>
      </Box>

      <TextField
        label={t("common:inspector.githubId", "GitHub ID / Username")}
        placeholder="e.g. octocat"
        value={githubId}
        onChange={(e) => setGithubId(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        fullWidth
        size="small"
        disabled={isSubmitting}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <GitHubIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: isSaved ? (
              <InputAdornment position="end">
                <CheckCircleRoundedIcon
                  fontSize="small"
                  color="success"
                  data-testid="inspector-github-saved-icon"
                />
              </InputAdornment>
            ) : undefined,
          },
        }}
        helperText={t(
          "common:inspector.githubHelper",
          "GitHub account identifier for commits and code repositories",
        )}
        data-testid="inspector-github-input"
      />
    </Card>
  );
}
