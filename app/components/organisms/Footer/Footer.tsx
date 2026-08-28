import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import CraftedByBadge from "~/components/atoms/CraftedByBadge/CraftedByBadge";

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

const CopyrightText = styled("span")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "inherit",
  letterSpacing: "0.02em",
}));

const FooterRight = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(1),
  },
}));

const SystemStatus = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontFamily: "monospace",
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  letterSpacing: "0.05em",
}));

const StatusDot = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 8px ${theme.palette.success.main}`,
  display: "inline-block",
}));

export default function Footer({ className }: FooterProps) {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();

  return (
    <FooterRoot className={className}>
      <CopyrightText>{t("copyright", { year: currentYear })}</CopyrightText>
      <CraftedByBadge size="small" />
      <FooterRight>
        <SystemStatus>
          <StatusDot />
          <span>{t("systemStatus.gateway")}</span>
        </SystemStatus>
      </FooterRight>
    </FooterRoot>
  );
}
