import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import FilterBar from "./FilterBar";

describe("Generic FilterBar Molecule", () => {
  it("renders as compound component with children", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <FilterBar testId="compound-filter-bar">
            <FilterBar.Search
              value="test"
              placeholder="Search something..."
              testId="custom-search"
            />
            <FilterBar.Number value={2} label="Level" testId="custom-number" />
          </FilterBar>
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.getByTestId("compound-filter-bar")).toBeDefined();
    expect(screen.getByTestId("custom-search")).toBeDefined();
    expect(screen.getByTestId("custom-number")).toBeDefined();
  });

  it("renders as student/user filter preset with role, school, cohort, and search", () => {
    const onQueryChange = vi.fn();
    const onRoleChange = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <FilterBar
            query=""
            onQueryChange={onQueryChange}
            roleFilter="all"
            onRoleFilterChange={onRoleChange}
            schoolFilter="all"
            onSchoolFilterChange={() => {}}
            schools={[]}
            cohortFilter="all"
            onCohortFilterChange={() => {}}
            cohorts={[]}
            testId="user-filter-bar"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.getByTestId("user-filter-bar")).toBeDefined();
    expect(screen.getByTestId("filter-role-select")).toBeDefined();
    expect(screen.getByTestId("filter-search-input")).toBeDefined();
  });
});
