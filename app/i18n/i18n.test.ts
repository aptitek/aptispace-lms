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
    expect(i18n.t("common:craftedBy")).toBe("Conçu par");
  });

  it("translates auth loginCard strings correctly in English and French", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("auth:loginCard.securityNote")).toBe(
      "OAuth 2.0 Encrypted • Single Sign-On",
    );
    expect(i18n.t("auth:pending")).toBe("Pending");
    expect(i18n.t("auth:noInstitutionalEmail")).toBe("No institutional email");
    expect(i18n.t("auth:impersonateUser", { name: "Alice" })).toBe(
      "Impersonate Alice",
    );

    await i18n.changeLanguage("fr");
    expect(i18n.t("auth:loginCard.securityNote")).toBe(
      "Chiffré OAuth 2.0 • Authentification Unique (SSO)",
    );
    expect(i18n.t("auth:pending")).toBe("En attente");
    expect(i18n.t("auth:noInstitutionalEmail")).toBe(
      "Aucun email institutionnel",
    );
    expect(i18n.t("auth:impersonateUser", { name: "Alice" })).toBe(
      "Emprunter l'identité de Alice",
    );
  });

  it("translates dev impersonation tool and roles properly", async () => {
    await i18n.changeLanguage("fr");
    expect(i18n.t("auth:devTool.title")).toBe(
      "Outil d'usurpation d'identité Dev",
    );
    expect(i18n.t("auth:devTool.modeBadge")).toBe("DEV UNIQUEMENT");
    expect(i18n.t("auth:devTool.roles.student")).toBe("Étudiant");
    expect(i18n.t("auth:roles.faculty")).toBe("Corps professoral");
    expect(i18n.t("auth:roles.staff")).toBe("Personnel");

    await i18n.changeLanguage("en");
    expect(i18n.t("auth:devTool.title")).toBe("Dev Impersonation Tool");
    expect(i18n.t("auth:devTool.modeBadge")).toBe("DEV ONLY");
    expect(i18n.t("auth:devTool.roles.student")).toBe("Student");
    expect(i18n.t("auth:roles.faculty")).toBe("Faculty");
    expect(i18n.t("auth:roles.staff")).toBe("Staff");
  });

  it("translates inspector, studentGrid, filterBar, and admin management strings in English and French", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("common:inspector.title")).toBe("Student Inspector");
    expect(i18n.t("common:inspector.assignmentTitle")).toBe(
      "Institution & Cohort Assignment",
    );
    expect(i18n.t("common:filterBar.role")).toBe("Role");
    expect(i18n.t("common:filterBar.searchPlaceholder")).toBe(
      "Search users...",
    );
    expect(i18n.t("common:admin.schoolsTitle")).toBe("Schools & Institutions");
    expect(i18n.t("common:studentGrid.title")).toBe("Registered Students");
    expect(i18n.t("common:studentGrid.clearFilter")).toBe("Clear filter");
    expect(i18n.t("common:admin.tabs.students")).toBe("Students");
    expect(i18n.t("common:inspector.addButton")).toBe("Add");

    await i18n.changeLanguage("fr");
    expect(i18n.t("common:inspector.title")).toBe("Inspecteur d'Étudiant");
    expect(i18n.t("common:inspector.assignmentTitle")).toBe(
      "Affectation Établissement & Cohorte",
    );
    expect(i18n.t("common:filterBar.role")).toBe("Rôle");
    expect(i18n.t("common:filterBar.searchPlaceholder")).toBe(
      "Rechercher des utilisateurs...",
    );
    expect(i18n.t("common:admin.schoolsTitle")).toBe("Écoles & Établissements");
    expect(i18n.t("common:inspector.addButton")).toBe("Ajouter");
    expect(i18n.t("common:studentGrid.title")).toBe("Étudiants Inscrits");
    expect(i18n.t("common:studentGrid.clearFilter")).toBe("Effacer le filtre");
    expect(i18n.t("common:admin.tabs.students")).toBe("Étudiants");
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
