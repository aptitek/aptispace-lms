import { styled, alpha, type Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Chip from "~/components/atoms/Chip/Chip";
import StatusGatewayTrigger from "~/components/molecules/StatusCenter/StatusGatewayTrigger";

export interface FooterProps {
  className?: string;
}

const FooterRoot = styled("footer")(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  width: "100%",
  padding: theme.spacing(2, 4),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: theme.typography.caption.fontSize ?? "0.75rem",
  color: theme.palette.text.secondary,
  boxSizing: "border-box",
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
  backdropFilter: "blur(12px)",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

const FooterLeft = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

const CopyrightText = styled("span")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
}));

const FooterRight = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export default function Footer({ className }: FooterProps) {
  const { t } = useTranslation(["common", "meta"]);
  const currentYear = new Date().getFullYear();

  return (
    <FooterRoot className={className} data-testid="footer-container">
      <FooterLeft>
        <CopyrightText>
          &copy; {currentYear} {t("meta:appName", "Aptispace LMS")}.{" "}
          {t("allRightsReserved", "All rights reserved.")}
        </CopyrightText>
      </FooterLeft>
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
          height: 28,
          px: 0.5,
          borderRadius: "8px",
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.background.paper, 0.95),
          borderColor: (theme: Theme) => alpha(theme.palette.divider, 0.7),
          color: "text.primary",
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.02em",
          textDecoration: "none",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: (theme: Theme) =>
              alpha(theme.palette.primary.main, 0.1),
            borderColor: (theme: Theme) => theme.palette.primary.main,
          },
        }}
      />
      <FooterRight>
        <StatusGatewayTrigger />
      </FooterRight>
    </FooterRoot>
  );
}
