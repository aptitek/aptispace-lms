import { styled, alpha, type Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Chip from "~/components/atoms/Chip/Chip";

export interface FooterProps {
  className?: string;
  "data-testid"?: string;
}

const FloatingFooterRoot = styled("footer")(({ theme }) => ({
  position: "fixed",
  bottom: 16,
  right: 24,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  pointerEvents: "none",
  boxSizing: "border-box",

  [theme.breakpoints.down("sm")]: {
    bottom: 12,
    right: 16,
  },
}));

export default function Footer({
  className,
  "data-testid": dataTestId = "footer-container",
}: FooterProps) {
  const { t } = useTranslation(["common", "meta"]);

  return (
    <FloatingFooterRoot className={className} data-testid={dataTestId}>
      <Chip
        label={t("craftedBy", "Crafted by Aptitek")}
        image="/aptitek-logo.svg"
        imageAlt="Aptitek"
        imagePosition="end"
        imageHeight={14}
        mono
        component="a"
        href="https://aptitek.io"
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        variant="outlined"
        clickable
        testId="crafted-by-chip"
        aria-label={t("craftedByAria", "Crafted by Aptitek")}
        sx={{
          pointerEvents: "auto",
          height: 28,
          px: 0.5,
          borderRadius: "8px",
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.background.paper, 0.85),
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: (theme: Theme) => alpha(theme.palette.divider, 0.6),
          boxShadow: (theme: Theme) =>
            `0 4px 16px ${alpha(theme.palette.common.black, 0.1)}`,
          color: "text.primary",
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.02em",
          textDecoration: "none",
          cursor: "pointer",
          transition: "all 150ms cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": {
            backgroundColor: (theme: Theme) =>
              alpha(theme.palette.primary.main, 0.12),
            borderColor: (theme: Theme) => theme.palette.primary.main,
            transform: "translateY(-1px)",
            boxShadow: (theme: Theme) =>
              `0 6px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
          ...(theme: Theme) =>
            theme.applyStyles("dark", {
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              borderColor: alpha(theme.palette.divider, 0.4),
              boxShadow: `0 4px 18px ${alpha(theme.palette.common.black, 0.4)}`,
            }),
        }}
      />
    </FloatingFooterRoot>
  );
}
