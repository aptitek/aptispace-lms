import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import InstitutionInspector from "./InstitutionInspector";
import {
  InstitutionEmailCard,
  InstitutionFreeDomainNotice,
  InstitutionConstrainedDomainFields,
} from "./InstitutionInspector.components";
import type { SchoolConfig } from "~/types/institution";

afterEach(cleanup);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("InstitutionInspector Organism", () => {
  const mockInstitution: SchoolConfig = {
    id: "school-1",
    name: "Aptitek Institute",
    slug: "aptitek",
    type: "academic",
    logoUrl: "/aptitek-logo.svg",
    emailDomain: "aptitek.io",
    usernamePattern: "{f}{last}",
  };

  it("exports InstitutionInspector component properly", () => {
    expect(InstitutionInspector).toBeDefined();
    expect(typeof InstitutionInspector).toBe("function");
    expect(InstitutionInspector.name).toBe("InstitutionInspector");
  });

  it("returns null when institution is null", () => {
    const { container } = renderWithProviders(
      <InstitutionInspector
        institution={null}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders editing state with institution data", () => {
    const onCloseMock = vi.fn();
    const onSaveMock = vi.fn();

    renderWithProviders(
      <InstitutionInspector
        institution={mockInstitution}
        onClose={onCloseMock}
        onSave={onSaveMock}
      />,
    );

    expect(screen.getByTestId("institution-inspector-card")).toBeDefined();
    expect(screen.getByDisplayValue("Aptitek Institute")).toBeDefined();
    expect(screen.getByDisplayValue("aptitek")).toBeDefined();
  });

  it("renders add institution mode with Create and Cancel buttons", () => {
    const newInstitution = {
      name: "",
      slug: "",
      type: "academic",
    } as unknown as SchoolConfig;

    const onClose = vi.fn();

    renderWithProviders(
      <InstitutionInspector
        institution={newInstitution}
        onClose={onClose}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByText("Add Institution")).toBeDefined();
    const cancelBtn = screen.getByText("Cancel");
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders InstitutionFreeDomainNotice component", () => {
    renderWithProviders(<InstitutionFreeDomainNotice />);
    expect(screen.getByText("Empty = Any Email")).toBeDefined();
    expect(screen.getByTestId("inspector-free-domain-notice")).toBeDefined();
  });

  it("renders InstitutionConstrainedDomainFields component", () => {
    const onFieldChange = vi.fn();
    const onBlur = vi.fn();

    renderWithProviders(
      <InstitutionConstrainedDomainFields
        emailDomain="aptitek.io"
        usernamePattern="{f}{last}"
        previewEmail="j.doe@aptitek.io"
        disabled={false}
        onFieldChange={onFieldChange}
        onBlur={onBlur}
      />,
    );

    expect(screen.getByDisplayValue("aptitek.io")).toBeDefined();
    expect(screen.getByText("j.doe@aptitek.io")).toBeDefined();
  });

  it("renders InstitutionEmailCard with constraint toggle", () => {
    const onToggle = vi.fn();

    renderWithProviders(
      <InstitutionEmailCard
        emailDomain="aptitek.io"
        usernamePattern="{f}{last}"
        previewEmail="j.doe@aptitek.io"
        disabled={false}
        isConstrained={true}
        onToggleConstraint={onToggle}
        onFieldChange={vi.fn()}
        onBlur={vi.fn()}
      />,
    );

    expect(screen.getByText("Email Configuration")).toBeDefined();
  });

  it("handles tab switching between Free and Constrained in InstitutionEmailCard", () => {
    const onToggle = vi.fn();

    const { rerender } = renderWithProviders(
      <InstitutionEmailCard
        emailDomain="aptitek.io"
        usernamePattern="{f}{last}"
        previewEmail="j.doe@aptitek.io"
        disabled={false}
        isConstrained={true}
        onToggleConstraint={onToggle}
        onFieldChange={vi.fn()}
        onBlur={vi.fn()}
      />,
    );

    const freeTab = screen.getByTestId("inspector-domain-free-toggle");
    fireEvent.click(freeTab);
    expect(onToggle).toHaveBeenCalledWith(false);

    rerender(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <InstitutionEmailCard
            emailDomain=""
            usernamePattern="{f}{last}"
            previewEmail=""
            disabled={false}
            isConstrained={false}
            onToggleConstraint={onToggle}
            onFieldChange={vi.fn()}
            onBlur={vi.fn()}
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const constrainedTab = screen.getByTestId(
      "inspector-domain-constrained-toggle",
    );
    fireEvent.click(constrainedTab);
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
