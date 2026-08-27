import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "~/i18n";

export interface LanguageToggleProps {
  className?: string;
  size?: "small" | "medium";
}

const ToggleWrapper = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

const IconIndicator = styled(LanguageIcon)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  opacity: 0.8,
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => {
  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    backgroundColor: theme.palette.action.hover,
    borderRadius: radius * 1.25,
    padding: theme.spacing(0.25),
    border: `1px solid ${theme.palette.divider}`,
    height: 30,

    "& .MuiToggleButtonGroup-grouped": {
      border: 0,
      borderRadius: radius,
      color: theme.palette.text.secondary,
      padding: theme.spacing(0.25, 1),
      fontSize: "0.75rem",
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      minWidth: 34,
      lineHeight: 1,
      transition: theme.transitions.create(
        ["background-color", "color", "box-shadow", "transform"],
        {
          duration: theme.transitions.duration.shorter,
        },
      ),

      "&:hover": {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.text.primary,
      },

      "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: `0 2px 8px ${theme.palette.action.focus}`,

        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      },

      "&:not(:first-of-type)": {
        marginLeft: theme.spacing(0.25),
      },
    },
  };
});

export default function LanguageToggle({
  className,
  size = "small",
}: LanguageToggleProps) {
  const { i18n, t } = useTranslation("common");

  const currentLang = (
    i18n.resolvedLanguage ||
    i18n.language ||
    "en"
  ).startsWith("fr")
    ? "fr"
    : "en";

  const handleLanguageChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextLanguage: SupportedLanguage | null,
  ) => {
    if (nextLanguage && nextLanguage !== currentLang) {
      i18n.changeLanguage(nextLanguage);
      if (typeof document !== "undefined") {
        document.documentElement.lang = nextLanguage;
      }
    }
  };

  return (
    <ToggleWrapper
      className={className}
      role="region"
      aria-label={t("language.toggleLabel")}
    >
      <IconIndicator aria-hidden="true" />
      <StyledToggleButtonGroup
        value={currentLang}
        exclusive
        onChange={handleLanguageChange}
        aria-label={t("language.toggleLabel")}
        size={size}
      >
        <ToggleButton
          value="en"
          aria-label={t("language.switchToEn")}
          title={t("language.en")}
        >
          {t("language.enShort")}
        </ToggleButton>
        <ToggleButton
          value="fr"
          aria-label={t("language.switchToFr")}
          title={t("language.fr")}
        >
          {t("language.frShort")}
        </ToggleButton>
      </StyledToggleButtonGroup>
    </ToggleWrapper>
  );
}
