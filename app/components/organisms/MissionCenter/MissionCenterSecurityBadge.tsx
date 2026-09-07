import Box from "@mui/material/Box";
import { useTheme, alpha } from "@mui/material/styles";

export interface SecurityBadgeProps {
  label: string;
  color?: "error" | "warning" | "default" | "primary";
}

export function SecurityBadge({
  label,
  color = "warning",
}: SecurityBadgeProps) {
  const theme = useTheme();
  const mainColor =
    color === "error"
      ? theme.palette.error.main
      : color === "warning"
        ? theme.palette.warning.main
        : color === "primary"
          ? theme.palette.primary.main
          : theme.palette.text.primary;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1,
        py: 0.5,
        borderRadius: (theme) => theme.shape.corners.small,
        border: `1px solid ${alpha(mainColor, 0.3)}`,
        backgroundColor: alpha(mainColor, 0.08),
        color: mainColor,
        fontWeight: 700,
        fontSize: "0.68rem",
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        userSelect: "none",
      }}
    >
      {label}
    </Box>
  );
}
