import { styled, alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

export const MD3FloatingActionButton = styled(IconButton)(({ theme }) => {
  const primary = theme.palette.primary.main;
  const contrast = theme.palette.primary.contrastText;

  return {
    width: 48,
    height: 48,
    borderRadius: "16px",
    backgroundColor: primary,
    color: contrast,
    boxShadow: `0 4px 14px -2px ${alpha(primary, 0.45)}, 0 2px 6px -1px ${alpha(theme.palette.common.black, 0.2)}`,
    transition: theme.transitions.create(
      ["transform", "box-shadow", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    "&:hover": {
      backgroundColor: theme.palette.primary.dark || primary,
      transform: "scale(1.1)",
      boxShadow: `0 8px 20px -2px ${alpha(primary, 0.55)}, 0 4px 10px -1px ${alpha(theme.palette.common.black, 0.25)}`,
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  };
});
