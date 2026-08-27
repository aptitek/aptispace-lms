import { type ButtonHTMLAttributes } from "react";
import { styled } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import CircularProgress from "@mui/material/CircularProgress";

export interface GitHubButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
  label?: string;
}

const StyledButton = styled("button")<{ fullWidth?: boolean }>(({
  theme,
  fullWidth,
}) => {
  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1.5),
    width: fullWidth ? "100%" : "auto",
    padding: theme.spacing(1.5, 3),
    borderRadius: radius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.button.fontSize ?? "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: theme.transitions.create(
      ["background-color", "border-color", "box-shadow", "transform"],
      {
        duration: theme.transitions.duration.shorter,
      },
    ),
    boxShadow: `0 4px 14px ${theme.palette.action.hover}`,
    outline: "none",

    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.light,
      transform: "translateY(-1px)",
      boxShadow: `0 6px 20px ${theme.palette.action.focus}`,
    },

    "&:active": {
      transform: "translateY(0)",
      backgroundColor: theme.palette.action.selected,
    },

    "&:focus-visible": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${theme.palette.action.focus}`,
    },

    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
    },
  };
});

const IconWrapper = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "inherit",
  "& .MuiSvgIcon-root": {
    fontSize: theme.typography.h5.fontSize ?? "1.5rem",
  },
}));

export default function GitHubButton({
  loading = false,
  fullWidth = true,
  label = "Sign in with GitHub",
  disabled,
  ...rest
}: GitHubButtonProps) {
  return (
    <StyledButton
      type="button"
      fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <IconWrapper>
          <GitHubIcon />
        </IconWrapper>
      )}
      <span>{loading ? "Authenticating..." : label}</span>
    </StyledButton>
  );
}
