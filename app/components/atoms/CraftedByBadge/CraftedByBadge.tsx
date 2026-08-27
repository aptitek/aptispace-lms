import { type AnchorHTMLAttributes } from "react";
import { styled } from "@mui/material/styles";

export interface CraftedByBadgeProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "small" | "medium";
}

const BadgeLink = styled("a")<{ badgeSize: "small" | "medium" }>(({
  theme,
  badgeSize,
}) => {
  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding:
      badgeSize === "small" ? theme.spacing(0.5, 1) : theme.spacing(0.75, 1.5),
    borderRadius: radius * 1.5,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.secondary,
    textDecoration: "none",
    fontSize:
      badgeSize === "small"
        ? (theme.typography.caption.fontSize ?? "0.75rem")
        : "0.825rem",
    fontWeight: 500,
    lineHeight: 1,
    transition: theme.transitions.create(
      ["background-color", "border-color", "box-shadow", "transform"],
      {
        duration: theme.transitions.duration.shorter,
      },
    ),
    outline: "none",

    "&:hover": {
      backgroundColor: theme.palette.action.selected,
      borderColor: theme.palette.primary.main,
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px ${theme.palette.action.focus}`,
    },

    "&:focus-visible": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.action.focus}`,
    },
  };
});

const LabelText = styled("span")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "inherit",
  fontWeight: 500,
  letterSpacing: "0.02em",
}));

const LogoImg = styled("img")<{ badgeSize: "small" | "medium" }>(({
  badgeSize,
}) => {
  const height = badgeSize === "small" ? 14 : 18;
  return {
    height,
    width: "auto",
    display: "block",
    objectFit: "contain",
    flexShrink: 0,
  };
});

export default function CraftedByBadge({
  size = "small",
  href = "https://aptitek.io",
  target = "_blank",
  rel = "noopener noreferrer",
  ...rest
}: CraftedByBadgeProps) {
  return (
    <BadgeLink
      href={href}
      target={target}
      rel={rel}
      badgeSize={size}
      aria-label="Crafted by Aptitek"
      {...rest}
    >
      <LabelText>Crafted by</LabelText>
      <LogoImg src="/aptitek-logo.svg" alt="Aptitek" badgeSize={size} />
    </BadgeLink>
  );
}
