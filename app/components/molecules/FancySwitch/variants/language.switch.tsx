import React, { forwardRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { M3_SPRINGS } from "~/tokens/motion";
import { LANGUAGE_STORAGE_KEY, type SupportedLanguage } from "~/i18n";
import FancySwitch from "../FancySwitch";
import { ToggleWrapper } from "../FancySwitch.styles";
import type {
  LanguageSwitchProps,
  MeridianSwitchProps,
} from "../FancySwitch.types";
import {
  UkFlag,
  FranceFlag,
  FlightAirplane,
  CountrySilhouettes,
  MeridianFlightTrajectory,
} from "../FancySwitch.glyphs";

function resolveCurrentLanguage(
  propLang: SupportedLanguage | undefined,
  i18nLang: string | undefined,
): SupportedLanguage {
  if (propLang) return propLang;
  if (i18nLang?.startsWith("fr")) return "fr";
  return "en";
}

function getLanguageAriaLabel(
  isFrench: boolean,
  t: (key: string, def: string) => string,
): string {
  return isFrench
    ? t("language.switchToEnglish", "Switch to English")
    : t("language.switchToFrench", "Passer au Français");
}

export const MeridianSwitch = forwardRef<
  HTMLButtonElement,
  MeridianSwitchProps
>((props, ref) => {
  const {
    language,
    onLanguageChange,
    size = "medium",
    disabled = false,
    className = "",
    "data-testid": dataTestId = "meridian-language-switch",
    ...restProps
  } = props;

  const { t, i18n } = useTranslation("common");
  const currentLang = resolveCurrentLanguage(
    language,
    i18n.resolvedLanguage || i18n.language,
  );
  const isFrench = currentLang === "fr";
  const ariaLabel = getLanguageAriaLabel(isFrench, t);

  const handleToggle = (nextChecked: boolean) => {
    const nextLang: SupportedLanguage = nextChecked ? "fr" : "en";
    onLanguageChange?.(nextLang);
  };

  return (
    <FancySwitch
      ref={ref}
      checked={isFrench}
      onChange={handleToggle}
      size={size}
      disabled={disabled}
      ariaLabel={ariaLabel}
      tooltipTitle={ariaLabel}
      className={className}
      data-testid={dataTestId}
      data-lang={currentLang}
      bimodal={true}
      thumbSpring={M3_SPRINGS.flightPuck}
      thumbContent={({ cfg }) => (
        <AnimatePresence mode="wait" initial={false}>
          {isFrench ? (
            <FranceFlag size={cfg.flagSize} />
          ) : (
            <UkFlag size={cfg.flagSize} />
          )}
        </AnimatePresence>
      )}
      peekingElement={({
        isHovered,
        isToggling,
        toggleDirection,
        cfg,
        disabled: isDis,
      }) => (
        <FlightAirplane
          cfg={cfg}
          isFrench={isFrench}
          isHovered={isHovered && !isDis}
          isFlying={isToggling}
          flightDirection={toggleDirection}
        />
      )}
      backgroundDecorations={({ cfg, isHovered }) => (
        <>
          <MeridianFlightTrajectory cfg={cfg} />
          <CountrySilhouettes
            cfg={cfg}
            isFrench={isFrench}
            isHovered={isHovered}
          />
        </>
      )}
      {...restProps}
    />
  );
});

MeridianSwitch.displayName = "MeridianSwitch";

export function LanguageSwitch({
  className,
  size = "small",
  disabled = false,
  "data-testid": dataTestId = "language-toggle",
}: LanguageSwitchProps) {
  const { i18n, t } = useTranslation("common");
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    const lang = i18n.resolvedLanguage || i18n.language;
    return lang?.startsWith("fr") ? "fr" : "en";
  });

  useEffect(() => {
    const onLangChanged = (lng: string) => {
      setCurrentLang(lng.startsWith("fr") ? "fr" : "en");
    };
    i18n.on("languageChanged", onLangChanged);
    return () => {
      i18n.off("languageChanged", onLangChanged);
    };
  }, [i18n]);

  const handleLanguageChange = (nextLang: SupportedLanguage) => {
    setCurrentLang(nextLang);
    void i18n.changeLanguage(nextLang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = nextLang;
    }
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    } catch {
      // Ignore storage access errors
    }
  };

  return (
    <ToggleWrapper
      className={className}
      role="region"
      aria-label={t("language.toggleLabel", "Select language")}
    >
      <MeridianSwitch
        language={currentLang}
        size={size}
        disabled={disabled}
        data-testid={dataTestId}
        onLanguageChange={handleLanguageChange}
      />
    </ToggleWrapper>
  );
}
