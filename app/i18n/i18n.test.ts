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
      "SYSTEM STATUS: OPERATIONAL",
    );
    expect(i18n.t("common:systemStatus.terminalTitle")).toBe(
      "SYSTEM STATUS & DIAGNOSTICS",
    );
    expect(i18n.t("common:craftedBy")).toBe("Crafted by");

    await i18n.changeLanguage("fr");
    expect(i18n.t("common:systemStatus.gateway")).toBe(
      "STATUT SYSTÈME : EN LIGNE",
    );
    expect(i18n.t("common:systemStatus.terminalTitle")).toBe(
      "STATUT DU SYSTÈME ET DIAGNOSTICS",
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
        domain: "aptitek.io",
      }),
    ).toBe("Do not enter '@'. Domain @aptitek.io is added automatically.");
    expect(
      i18n.t("common:emailField.errors.autofillAdjusted", {
        enteredDomain: "gmail.com",
        domain: "aptitek.io",
      }),
    ).toBe(
      "Autofilled domain @gmail.com was adjusted to institutional domain @aptitek.io.",
    );

    await i18n.changeLanguage("fr");
    expect(
      i18n.t("common:emailField.errors.noAtAllowed", {
        domain: "aptitek.io",
      }),
    ).toBe(
      "Ne saisissez pas '@'. Le domaine @aptitek.io est ajouté automatiquement.",
    );
    expect(
      i18n.t("common:emailField.errors.autofillAdjusted", {
        enteredDomain: "gmail.com",
        domain: "aptitek.io",
      }),
    ).toBe(
      "Le domaine autofourni @gmail.com a été ajusté au domaine institutionnel @aptitek.io.",
    );
  });

  it("translates avatar strings and upload errors in English and French", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("common:avatar.edit")).toBe("EDIT");
    expect(i18n.t("common:avatar.clickToEdit")).toBe("Click to edit avatar");
    expect(i18n.t("common:avatar.modalTitle")).toBe("Edit Profile Avatar");
    expect(i18n.t("common:avatar.errors.invalidFileType")).toBe(
      "Please select a valid image file (PNG, JPG, WebP, SVG)",
    );

    await i18n.changeLanguage("fr");
    expect(i18n.t("common:avatar.edit")).toBe("MODIFIER");
    expect(i18n.t("common:avatar.clickToEdit")).toBe(
      "Cliquer pour modifier l'avatar",
    );
    expect(i18n.t("common:avatar.modalTitle")).toBe(
      "Modifier l'avatar du profil",
    );
    expect(i18n.t("common:avatar.errors.invalidFileType")).toBe(
      "Veuillez sélectionner un fichier image valide (PNG, JPG, WebP, SVG)",
    );
  });

  it("translates onboarding card, form, and requirements strings in English and French", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("onboarding:title")).toBe("AptiSpace Student Onboarding");
    expect(i18n.t("onboarding:form.firstName")).toBe("First Name");
    expect(i18n.t("onboarding:form.familyName")).toBe("Family Name");
    expect(i18n.t("onboarding:form.email")).toBe("Institutional Email");
    expect(i18n.t("onboarding:form.submit")).toBe("Complete & Continue");
    expect(i18n.t("onboarding:requirements.title")).toBe(
      "Complete to Continue",
    );
    expect(i18n.t("onboarding:requirements.readyChip")).toBe(
      "✓ Ready to Continue",
    );
    expect(
      i18n.t("onboarding:requirements.progressChip", { completed: 2 }),
    ).toBe("2 / 3 Completed");
    expect(i18n.t("onboarding:card.mrzValid")).toBe("ICAO OK");

    await i18n.changeLanguage("fr");
    expect(i18n.t("onboarding:title")).toBe(
      "Intégration des étudiants AptiSpace",
    );
    expect(i18n.t("onboarding:form.firstName")).toBe("Prénom");
    expect(i18n.t("onboarding:form.familyName")).toBe("Nom de famille");
    expect(i18n.t("onboarding:form.email")).toBe("Email institutionnel");
    expect(i18n.t("onboarding:form.submit")).toBe("Valider et continuer");
    expect(i18n.t("onboarding:requirements.title")).toBe(
      "Complétez pour continuer",
    );
    expect(i18n.t("onboarding:requirements.readyChip")).toBe(
      "✓ Prêt à continuer",
    );
    expect(
      i18n.t("onboarding:requirements.progressChip", { completed: 2 }),
    ).toBe("2 / 3 Complétés");
    expect(i18n.t("onboarding:card.mrzValid")).toBe("ICAO OK");
    expect(i18n.t("onboarding:card.mrzInvalid")).toBe("ERR VÉRIF");
  });

  it("translates onboarding metadata in English and French", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("meta:onboarding.title")).toBe(
      "AptiSpace LMS • Student Onboarding",
    );

    await i18n.changeLanguage("fr");
    expect(i18n.t("meta:onboarding.title")).toBe(
      "AptiSpace LMS • Intégration Étudiant",
    );
  });
});
