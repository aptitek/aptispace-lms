import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTranslation } from "react-i18next";
import Chip from "../../atoms/Chip/Chip";
import { FONT_FAMILIES } from "~/tokens/typography";
import type { UserCardData } from "./UserCard.types";
import { formatGithubHandle } from "./UserCard.helpers";

export interface CompactGithubChipProps {
  entity: UserCardData;
  editableGithub?: boolean;
  onUpdateGithub?: (userId: string, newGithubUsername: string) => void;
}

export function CompactGithubChip({
  entity,
  editableGithub = false,
  onUpdateGithub,
}: CompactGithubChipProps) {
  const { t } = useTranslation(["auth", "common"]);
  const [isEditingGithub, setIsEditingGithub] = useState(false);
  const [githubInput, setGithubInput] = useState(entity.githubUsername ?? "");

  useEffect(() => {
    setGithubInput(entity.githubUsername ?? "");
  }, [entity.githubUsername]);

  const handleSaveGithub = (event?: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const trimmed = githubInput.trim().replace(/^@/, "");
    onUpdateGithub?.(entity.id, trimmed);
    setIsEditingGithub(false);
  };

  const handleCancelGithub = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setGithubInput(entity.githubUsername ?? "");
    setIsEditingGithub(false);
  };

  if (isEditingGithub) {
    return (
      <Box
        component="form"
        onSubmit={handleSaveGithub}
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          height: 24,
          px: 0.75,
          borderRadius: (theme) => theme.shape?.corners?.medium ?? 12,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          backgroundColor: "background.paper",
        }}
        data-testid="compact-github-edit-form"
      >
        <GitHubIcon sx={{ fontSize: 14, color: "text.secondary" }} />
        <InputBase
          value={githubInput}
          onChange={(event) => setGithubInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              handleCancelGithub();
            }
          }}
          autoFocus
          inputProps={{
            "aria-label": t("common:githubUsername", "GitHub Username"),
            "data-testid": "compact-github-input",
          }}
          sx={{
            fontSize: "0.75rem",
            fontFamily: FONT_FAMILIES.mono,
            width: 100,
            "& input": { p: 0 },
          }}
        />
        <IconButton
          size="small"
          type="submit"
          aria-label={t("common:save", "Save")}
          data-testid="compact-github-save-btn"
          sx={{ p: "2px", color: "success.main" }}
        >
          <CheckRoundedIcon sx={{ fontSize: 13 }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label={t("common:cancel", "Cancel")}
          data-testid="compact-github-cancel-btn"
          onClick={handleCancelGithub}
          sx={{ p: "2px", color: "text.secondary" }}
        >
          <CloseRoundedIcon sx={{ fontSize: 13 }} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        position: "relative",
      }}
    >
      <Chip
        icon={<GitHubIcon sx={{ fontSize: 13 }} data-testid="octocat-icon" />}
        label={formatGithubHandle(entity.githubUsername)}
        size="small"
        variant="outlined"
        mono
        testId="compact-github-handle"
        onClick={
          editableGithub
            ? (event: React.MouseEvent) => {
                event.stopPropagation();
                setIsEditingGithub(true);
              }
            : undefined
        }
        sx={{
          height: 22,
          fontSize: "0.7rem",
          fontWeight: 600,
          backgroundColor: "background.paper",
          border: (theme: { palette: { divider: string } }) =>
            `1px solid ${theme.palette.divider}`,
          "& .MuiChip-label": { px: 0.75 },
          "&:hover": {
            borderColor: "primary.main",
            cursor: editableGithub ? "pointer" : "default",
          },
        }}
      />
      {editableGithub && (
        <IconButton
          size="small"
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            setIsEditingGithub(true);
          }}
          aria-label={t("common:editGithub", "Edit GitHub handle")}
          data-testid="compact-github-edit-btn"
          sx={{
            p: "2px",
            width: 20,
            height: 20,
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <EditRoundedIcon sx={{ fontSize: 13 }} />
        </IconButton>
      )}
    </Box>
  );
}
