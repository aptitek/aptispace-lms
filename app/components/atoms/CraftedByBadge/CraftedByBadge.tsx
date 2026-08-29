import { styled, alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import "@material/web/chips/assist-chip.js";

export interface CraftedByBadgeProps {
  size?: "small" | "medium";
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  id?: string;
  "data-testid"?: string;
}

const BadgeContainer = styled("div")<{ badgeSize: "small" | "medium" }>(({
  theme,
  badgeSize,
}) => {
  const isSmall = badgeSize === "small";

  return {
    display: "inline-flex",
    alignItems: "center",

    "& md-assist-chip": {
      fontFamily: theme.typography.fontFamily,
      cursor: "pointer",
      transition: "transform 0.18s ease, box-shadow 0.18s ease",

      /* MD3 Assist Chip Tokens */
      "--md-assist-chip-container-shape": "14px",
      "--md-assist-chip-container-color": alpha(
        theme.palette.action.hover,
        0.45,
      ),
      "--md-assist-chip-outline-color": alpha(theme.palette.divider, 0.8),
      "--md-assist-chip-label-text-color": theme.palette.text.secondary,
      "--md-assist-chip-hover-label-text-color": theme.palette.text.primary,
      "--md-assist-chip-hover-outline-color": theme.palette.primary.main,
      "--md-assist-chip-hover-state-layer-color": theme.palette.primary.main,
      "--md-assist-chip-focus-outline-color": theme.palette.primary.main,
      "--md-assist-chip-icon-size": isSmall ? "14px" : "18px",
      "--md-assist-chip-label-text-size": isSmall ? "0.75rem" : "0.825rem",
      "--md-assist-chip-label-text-weight": "500",
      "--md-assist-chip-label-text-font": theme.typography.fontFamily,
      "--md-assist-chip-container-height": isSmall ? "28px" : "32px",
      "--md-assist-chip-leading-space": isSmall ? "8px" : "10px",
      "--md-assist-chip-trailing-space": isSmall ? "8px" : "10px",
      "--md-assist-chip-icon-label-space": "6px",

      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: `0 4px 12px ${alpha(theme.palette.action.focus, 0.3)}`,
      },
    },

    "& .badge-logo": {
      height: isSmall ? "14px" : "18px",
      width: "auto",
      objectFit: "contain",
      display: "block",
    },
  };
});

export default function CraftedByBadge({
  size = "small",
  href = "https://aptitek.io",
  target = "_blank",
  rel = "noopener noreferrer",
  className,
  id,
  "data-testid": testId = "crafted-by-badge",
}: CraftedByBadgeProps) {
  const { t } = useTranslation("common");

  return (
    <BadgeContainer
      badgeSize={size}
      className={className}
      id={id}
      data-testid={testId}
    >
      <md-assist-chip
        href={href}
        target={target}
        rel={rel}
        aria-label={t("craftedByAria")}
        label={t("craftedBy")}
      >
        <img
          slot="icon"
          src="/aptitek-logo.svg"
          alt="Aptitek"
          className="badge-logo"
        />
      </md-assist-chip>
    </BadgeContainer>
  );
}
