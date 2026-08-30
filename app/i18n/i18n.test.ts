import { describe, it, expect } from "vitest";
import i18n from "./index";
import enResources from "./locales/en";
import frResources from "./locales/fr";

describe("i18n Internationalization", () => {
  it("initializes with default language fallback", () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.options.fallbackLng).toEqual(["en"]);
  });

  it("contains identical top-level namespace keys for en and fr", () => {
    const enNamespaces = Object.keys(enResources).sort();
    const frNamespaces = Object.keys(frResources).sort();
    expect(enNamespaces).toEqual(frNamespaces);
  });

  it("translates common namespace strings correctly in English and French", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("common:systemStatus.gateway")).toBe(
      "STATION GATEWAY: ONLINE",
    );
    expect(i18n.t("common:craftedBy")).toBe("Crafted by");

    await i18n.changeLanguage("fr");
    expect(i18n.t("common:systemStatus.gateway")).toBe(
      "PASSERELLE STATION : EN LIGNE",
    );
    expect(i18n.t("common:craftedBy")).toBe("Créé par");
  });

  it("translates auth loginCard strings correctly in English and French", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("auth:loginCard.securityNote")).toBe(
      "OAuth 2.0 Encrypted • Single Sign-On",
    );

    await i18n.changeLanguage("fr");
    expect(i18n.t("auth:loginCard.securityNote")).toBe(
      "Chiffré OAuth 2.0 • Authentification Unique (SSO)",
    );
  });

  it("translates dev impersonation tool and roles properly", async () => {
    await i18n.changeLanguage("fr");
    expect(i18n.t("auth:devTool.title")).toBe(
      "Outil d'usurpation d'identité Dev",
    );
    expect(i18n.t("auth:devTool.modeBadge")).toBe("DEV UNIQUEMENT");
    expect(i18n.t("auth:devTool.roles.student")).toBe("Étudiant");

    await i18n.changeLanguage("en");
    expect(i18n.t("auth:devTool.title")).toBe("Dev Impersonation Tool");
    expect(i18n.t("auth:devTool.modeBadge")).toBe("DEV ONLY");
    expect(i18n.t("auth:devTool.roles.student")).toBe("Student");
  });

  it("translates emailField strings and error interpolation in English and French", async () => {
    await i18n.changeLanguage("en");
    expect(
      i18n.t("common:emailField.errors.noAtAllowed", {
        domain: "cadet.aptispace.io",
      }),
    ).toBe(
      "Do not enter '@'. Domain @cadet.aptispace.io is added automatically.",
    );
    expect(
      i18n.t("common:emailField.errors.autofillAdjusted", {
        enteredDomain: "gmail.com",
        domain: "cadet.aptispace.io",
      }),
    ).toBe(
      "Autofilled domain @gmail.com was adjusted to institutional domain @cadet.aptispace.io.",
    );

    await i18n.changeLanguage("fr");
    expect(
      i18n.t("common:emailField.errors.noAtAllowed", {
        domain: "cadet.aptispace.io",
      }),
    ).toBe(
      "Ne saisissez pas '@'. Le domaine @cadet.aptispace.io est ajouté automatiquement.",
    );
    expect(
      i18n.t("common:emailField.errors.autofillAdjusted", {
        enteredDomain: "gmail.com",
        domain: "cadet.aptispace.io",
      }),
    ).toBe(
      "Le domaine autofourni @gmail.com a été ajusté au domaine institutionnel @cadet.aptispace.io.",
    );
  });
});
