import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
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

const MD3ChipAnchor = styled("a", {
  shouldForwardProp: (prop) => prop !== "$size",
})<{ $size: "small" | "medium" }>(({ theme, $size }) => {
  const isSmall = $size === "small";
  const isDark = theme.palette.mode === "dark";

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: isSmall ? 28 : 32,
    padding: isSmall ? "0 10px 0 12px" : "0 12px 0 14px",
    borderRadius: 8, // MD3 Small rounded shape
    backgroundColor: isDark
      ? alpha(theme.palette.background.paper, 0.75)
      : alpha(theme.palette.background.paper, 0.95),
    border: `1px solid ${
      isDark
        ? alpha(theme.palette.divider, 0.9)
        : alpha(theme.palette.divider, 0.7)
    }`,
    boxShadow: isDark
      ? "0 1px 3px rgba(0, 0, 0, 0.35)"
      : "0 1px 3px rgba(0, 0, 0, 0.08)",
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: isSmall ? "0.75rem" : "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
    outline: "none",
    transition:
      "background-color 0.2s cubic-bezier(0.2, 0, 0, 1), border-color 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1), transform 0.2s cubic-bezier(0.2, 0, 0, 1)",

    "&:hover": {
      backgroundColor: isDark
        ? alpha(theme.palette.primary.main, 0.18)
        : alpha(theme.palette.primary.main, 0.1),
      borderColor: theme.palette.primary.main,
      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
      transform: "translateY(-1px)",
    },

    "&:active": {
      transform: "translateY(0)",
      backgroundColor: isDark
        ? alpha(theme.palette.primary.main, 0.26)
        : alpha(theme.palette.primary.main, 0.16),
    },

    "&:focus-visible": {
      outline: "none",
      borderColor: theme.palette.primary.light,
      boxShadow: `0 0 0 2px ${theme.palette.background.default}, 0 0 0 4px ${theme.palette.primary.main}`,
    },
  };
});

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
    <MD3ChipAnchor
      $size={size}
      href={href}
      target={target}
      rel={rel}
      aria-label={t("craftedByAria", "Crafted by Aptitek")}
      className={className}
      id={id}
      data-testid={testId}
    >
      <Box
        component="span"
        sx={{
          color: "text.primary",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {t("craftedBy")}
      </Box>
      <Box
        component="img"
        src="/aptitek-logo.svg"
        alt="Aptitek"
        sx={{
          height: isSmall ? "14px" : "17px",
          width: "auto",
          objectFit: "contain",
          display: "block",
          ml: 0.75,
        }}
      />
    </MD3ChipAnchor>
  );
}
