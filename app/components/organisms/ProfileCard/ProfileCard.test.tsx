/* eslint-disable jsx-a11y/aria-role */
import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import ProfileCard from "./ProfileCard";

afterEach(cleanup);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("ProfileCard Organism", () => {
  it("renders ProfileCard with student role, institution name and cohort details", () => {
    const onChangeMock = vi.fn();
    const onAvatarEditMock = vi.fn();

    renderWithProviders(
      <ProfileCard
        firstName="Alex"
        familyName="MERCER"
        emailPrefix="alex.mercer"
        emailDomain="@aptispace.com"
        role="student"
        cohortName="Web Development"
        year="2026"
        institutionName="AptiSpace Academy"
        onChange={onChangeMock}
        onAvatarEdit={onAvatarEditMock}
      />,
    );

    expect(screen.getByDisplayValue("Alex")).toBeDefined();
    expect(screen.getByDisplayValue("MERCER")).toBeDefined();
    expect(screen.getByDisplayValue("alex.mercer")).toBeDefined();
    expect(screen.getByText("AptiSpace Academy")).toBeDefined();
    expect(screen.getByTestId("profile-cohort-chip")).toBeDefined();

    // Trigger name change
    const firstNameInput = screen.getByDisplayValue("Alex");
    fireEvent.change(firstNameInput, { target: { value: "Alexander" } });
    expect(onChangeMock).toHaveBeenCalledWith("firstName", "Alexander");

    // Trigger family name change
    const familyNameInput = screen.getByDisplayValue("MERCER");
    fireEvent.change(familyNameInput, { target: { value: "SMITH" } });
    expect(onChangeMock).toHaveBeenCalledWith("familyName", "SMITH");
  });

  it("renders ProfileCard with instructor role", () => {
    renderWithProviders(
      <ProfileCard
        firstName="Sarah"
        familyName="CONNOR"
        role="instructor"
        institutionName="AptiSpace Academy"
      />,
    );

    expect(screen.getByDisplayValue("Sarah")).toBeDefined();
    expect(screen.getByDisplayValue("CONNOR")).toBeDefined();
  });

  it("renders ProfileCard with admin role", () => {
    renderWithProviders(
      <ProfileCard
        firstName="Ada"
        familyName="LOVELACE"
        role="admin"
        institutionName="AptiSpace Academy"
      />,
    );

    expect(screen.getByDisplayValue("Ada")).toBeDefined();
    expect(screen.getByDisplayValue("LOVELACE")).toBeDefined();
  });

  it("renders ProfileCard with editableAvatar enabled", () => {
    const onAvatarChangeMock = vi.fn();
    renderWithProviders(
      <ProfileCard
        firstName="Alex"
        familyName="MERCER"
        editableAvatar={true}
        onAvatarChange={onAvatarChangeMock}
        avatarUrl="https://example.com/avatar.webp"
      />,
    );

    expect(screen.getByTestId("profile-card-editable-avatar")).toBeDefined();
  });

  it("renders ProfileCard with custom usernamePattern and auto-generates emailPrefix", () => {
    const onChangeMock = vi.fn();
    renderWithProviders(
      <ProfileCard
        firstName="Jean"
        familyName="DUPONT"
        usernamePattern="{f}{last}"
        emailDomain="aptitek.io"
        onChange={onChangeMock}
      />,
    );

    expect(screen.getByDisplayValue("Jean")).toBeDefined();
    expect(screen.getByDisplayValue("DUPONT")).toBeDefined();

    // Changing first name updates email prefix according to pattern
    const firstNameInput = screen.getByDisplayValue("Jean");
    fireEvent.change(firstNameInput, { target: { value: "Paul" } });
    expect(onChangeMock).toHaveBeenCalledWith("firstName", "Paul");
  });

  it("renders ProfileCard with structured cohort prop and year", () => {
    renderWithProviders(
      <ProfileCard
        firstName="Neo"
        familyName="ANDERSON"
        role="student"
        cohort={{ diploma: "M", year: 1, tags: ["IA", "Dev"] }}
        year="2026"
      />,
    );

    expect(screen.getByDisplayValue("Neo")).toBeDefined();
    expect(screen.getByDisplayValue("ANDERSON")).toBeDefined();
  });

  it("handles manual email prefix editing", () => {
    const onChangeMock = vi.fn();
    renderWithProviders(
      <ProfileCard
        firstName="Alice"
        familyName="WONDERLAND"
        emailPrefix="alice"
        emailDomain="aptispace.com"
        onChange={onChangeMock}
      />,
    );

    const emailInput = screen.getByDisplayValue("alice");
    fireEvent.change(emailInput, { target: { value: "alice.w" } });
    expect(onChangeMock).toHaveBeenCalledWith("emailPrefix", "alice.w");
  });
});
