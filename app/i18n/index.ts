import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enResources from "./locales/en";
import frResources from "./locales/fr";

export const defaultNS = "common";
export const supportedLngs = ["en", "fr"] as const;
export type SupportedLanguage = (typeof supportedLngs)[number];

export const resources = {
  en: enResources,
  fr: frResources,
} as const;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: [...supportedLngs],
      defaultNS,
      ns: ["common", "auth", "errors", "meta", "onboarding"],
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "aptispace_language",
        caches: ["localStorage"],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
