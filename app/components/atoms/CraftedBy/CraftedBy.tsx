import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export interface CraftedByProps {
  size?: "small" | "medium";
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  id?: string;
  "data-testid"?: string;
}

export default function CraftedBy({
  size = "small",
  href = "https://aptitek.io",
  target = "_blank",
  rel = "noopener noreferrer",
  className,
  id,
  "data-testid": testId = "crafted-by",
}: CraftedByProps) {
  const { t } = useTranslation("common");
  const isSmall = size === "small";

  return (
    <Chip
      component="a"
      href={href}
      target={target}
      rel={rel}
      aria-label={t("craftedByAria")}
      label={t("craftedBy")}
      clickable
      className={className}
      id={id}
      data-testid={testId}
      sx={(theme) => ({
        height: isSmall ? 28 : 32,
        borderRadius: "14px",
        backgroundColor: alpha(theme.palette.action.hover, 0.45),
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily,
        fontSize: isSmall ? "0.75rem" : "0.825rem",
        fontWeight: 500,
        cursor: "pointer",
        textDecoration: "none",
        transition:
          "transform 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease",

        "& .MuiChip-icon": {
          marginLeft: isSmall ? "6px" : "8px",
          marginRight: "-2px",
        },
        "& .MuiChip-label": {
          paddingLeft: isSmall ? "6px" : "8px",
          paddingRight: isSmall ? "8px" : "10px",
        },
        "&:hover": {
          color: theme.palette.text.primary,
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          transform: "translateY(-1px)",
          boxShadow: `0 4px 12px ${alpha(theme.palette.action.focus, 0.3)}`,
        },
      })}
      icon={
        <Box
          component="img"
          src="/aptitek-logo.svg"
          alt="Aptitek"
          sx={{
            height: isSmall ? "14px" : "18px",
            width: "auto",
            objectFit: "contain",
            display: "block",
          }}
        />
      }
    />
  );
}
