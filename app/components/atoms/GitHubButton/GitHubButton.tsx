import type { ComponentProps } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import GitHubIcon from "@mui/icons-material/GitHub";
import CircularProgress from "@mui/material/CircularProgress";

export interface GitHubButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "color"
> {
  loading?: boolean;
  label?: string;
  loadingLabel?: string;
}

export default function GitHubButton({
  loading = false,
  fullWidth = true,
  variant = "outlined",
  label,
  loadingLabel,
  disabled,
  ...rest
}: GitHubButtonProps) {
  const { t } = useTranslation("auth");
  const displayLabel = label ?? t("loginCard.continueWithGitHub");
  const displayLoadingLabel = loadingLabel ?? t("loginCard.authenticating");

  return (
    <Button
      type="button"
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <GitHubIcon />
        )
      }
      {...rest}
    >
      {loading ? displayLoadingLabel : displayLabel}
    </Button>
  );
}
