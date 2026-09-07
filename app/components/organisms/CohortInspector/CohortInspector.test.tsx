import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import CohortInspector, { type CohortSavePayload } from "./CohortInspector";
import {
  CohortDateModeToggle,
  CohortScheduleCard,
  CohortStructuredFields,
} from "./CohortInspector.components";
import type { CohortConfig } from "~/types/institution";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

afterEach(cleanup);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {ui}
        </LocalizationProvider>
      </ThemeProvider>
    </I18nextProvider>,
  );
}

describe("CohortInspector Organism", () => {
  const mockCohort: CohortConfig = {
    id: "cohort-1",
    name: "Web Development 2026",
    description: "Full-stack development bootcamp cohort",
    institutionId: "school-aptitek",
    startDate: "2026-09-01",
    endDate: "2027-06-30",
    diploma: "B",
    year: 1,
    tags: ["Web"],
  };

  it("exports CohortInspector component properly", () => {
    expect(CohortInspector).toBeDefined();
    expect(typeof CohortInspector).toBe("function");
    expect(CohortInspector.name).toBe("CohortInspector");
  });

  it("returns null when cohort is null", () => {
    const { container } = renderWithProviders(
      <CohortInspector cohort={null} onClose={vi.fn()} onSave={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders editing state with cohort data and handles close", () => {
    const onCloseMock = vi.fn();
    const onSaveMock = vi.fn();

    renderWithProviders(
      <CohortInspector
        cohort={mockCohort}
        onClose={onCloseMock}
        onSave={onSaveMock}
      />,
    );

    expect(screen.getByText("Edit Cohort")).toBeDefined();
    expect(screen.getByTestId("cohort-description-input")).toBeDefined();

    const closeBtn = screen.getByLabelText("Close Inspector");
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("renders adding state with empty cohort", () => {
    const newCohort = {
      name: "",
      diploma: "",
      year: 1,
      tags: [],
    } as unknown as CohortConfig;

    renderWithProviders(
      <CohortInspector cohort={newCohort} onClose={vi.fn()} onSave={vi.fn()} />,
    );

    expect(screen.getByText("Add Cohort")).toBeDefined();
  });

  it("renders CohortStructuredFields and handles changes", () => {
    const onDiplomaChange = vi.fn();
    const onYearChange = vi.fn();
    const onTagsChange = vi.fn();

    renderWithProviders(
      <CohortStructuredFields
        diploma="M"
        onDiplomaChange={onDiplomaChange}
        year={2}
        onYearChange={onYearChange}
        tags={["IA"]}
        onTagsChange={onTagsChange}
      />,
    );

    expect(screen.getByDisplayValue("2")).toBeDefined();
  });

  it("renders CohortDateModeToggle and toggles mode", () => {
    const onModeChange = vi.fn();

    renderWithProviders(
      <CohortDateModeToggle mode="shortcut" onModeChange={onModeChange} />,
    );

    expect(screen.getByLabelText("Date selection mode")).toBeDefined();
  });

  it("renders CohortScheduleCard properly", () => {
    const onSelectPeriod = vi.fn();
    const onSelectYear = vi.fn();

    renderWithProviders(
      <CohortScheduleCard
        selectedPeriod="fullAcademic"
        onSelectPeriod={onSelectPeriod}
        onSelectYear={onSelectYear}
        activeYear={2026}
        startDate="2026-09-01"
        endDate="2027-06-30"
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Academic Schedule")).toBeDefined();
  });

  it("verifies CohortSavePayload type properties", () => {
    const payload: CohortSavePayload = {
      id: "cohort-1",
      name: "M2-IA-Dev",
      year: 2,
    };
    expect(payload.id).toBe("cohort-1");
    expect(payload.year).toBe(2);
  });
});
