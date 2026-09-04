import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enResources from "./locales/en";
import frResources from "./locales/fr";

export const defaultNS = "common";
export const supportedLngs = ["en", "fr"] as const;
export type SupportedLanguage = (typeof supportedLngs)[number];

export const LANGUAGE_STORAGE_KEY = "aptispace_language";

export const resources = {
  en: enResources,
  fr: frResources,
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    // No browser LanguageDetector here. It would run during the initial client
    // render (where navigator/localStorage exist but not on the server), so the
    // first client <html lang="fr"> would diverge from the SSR'd "en" and break
    // hydration. The saved/browser-detected language is applied in a
    // post-hydration effect in root.tsx instead.
    lng: "en",
    fallbackLng: "en",
    supportedLngs: [...supportedLngs],
    defaultNS,
    ns: ["common", "auth", "errors", "meta", "onboarding"],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
} else {
  for (const lng of supportedLngs) {
    const lngResources = resources[lng];
    for (const [ns, bundle] of Object.entries(lngResources)) {
      i18n.addResourceBundle(lng, ns, bundle, true, true);
    }
  }
}

export default i18n;
