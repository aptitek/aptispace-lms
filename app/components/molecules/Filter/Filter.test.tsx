import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import Filter from "./Filter";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("Generic Filter Molecule", () => {
  it("renders with compound components", () => {
    const handleSearchChange = vi.fn();
    const handleSelectChange = vi.fn();
    const handleClear = vi.fn();

    renderWithProviders(
      <Filter testId="compound-filter">
        <Filter.Select
          label="Category"
          value="cat1"
          onChange={handleSelectChange}
          options={[
            { value: "cat1", label: "Category 1" },
            { value: "cat2", label: "Category 2" },
          ]}
          testId="compound-select"
        />
        <Filter.Number value={5} testId="compound-number" />
        <Filter.Range
          startYearMin={2020}
          startYearMax={2024}
          testId="compound-range"
        />
        <Filter.Clear onClear={handleClear} testId="compound-clear" />
        <Filter.Spacer />
        <Filter.Search
          value="test-search"
          onChange={handleSearchChange}
          placeholder="Search items..."
          testId="compound-search"
        />
      </Filter>,
    );

    expect(screen.getByTestId("compound-filter")).toBeDefined();
    expect(screen.getByTestId("compound-select")).toBeDefined();
    expect(screen.getByTestId("compound-number")).toBeDefined();
    expect(screen.getByTestId("compound-range")).toBeDefined();
    expect(screen.getByTestId("compound-clear")).toBeDefined();
    expect(screen.getByTestId("compound-search")).toBeDefined();

    // Trigger clear button click
    fireEvent.click(screen.getByTestId("compound-clear"));
    expect(handleClear).toHaveBeenCalledTimes(1);

    // Trigger search change
    const searchInput = screen
      .getByTestId("compound-search")
      .querySelector("input") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "new-query" } });
    expect(handleSearchChange).toHaveBeenCalledWith("new-query");
  });

  it("renders with declarative fields and search configuration", () => {
    const onSearchChange = vi.fn();
    const onSelectChange = vi.fn();
    const onRangeMinChange = vi.fn();
    const onRangeMaxChange = vi.fn();
    const onClear = vi.fn();

    renderWithProviders(
      <Filter
        testId="declarative-filter"
        fields={[
          {
            type: "select",
            id: "status",
            label: "Status",
            value: "active",
            onChange: onSelectChange,
            options: [
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ],
            testId: "status-select",
          },
          {
            type: "number",
            id: "count",
            label: "Count",
            value: 10,
            onChange: vi.fn(),
            testId: "count-picker",
          },
          {
            type: "range",
            id: "years",
            startYearMin: 2021,
            startYearMax: 2025,
            onStartYearMinChange: onRangeMinChange,
            onStartYearMaxChange: onRangeMaxChange,
            testId: "year-range-field",
          },
          {
            type: "custom",
            id: "custom-badge",
            render: () => (
              <span data-testid="custom-rendered-element">Custom Element</span>
            ),
          },
        ]}
        search={{
          value: "query string",
          onChange: onSearchChange,
          placeholder: "Search anything...",
          testId: "search-field",
        }}
        onClear={onClear}
        hasActiveFilters={true}
      />,
    );

    expect(screen.getByTestId("declarative-filter")).toBeDefined();
    expect(screen.getByTestId("status-select")).toBeDefined();
    expect(screen.getByTestId("count-picker")).toBeDefined();
    expect(screen.getByTestId("year-range-field")).toBeDefined();
    expect(screen.getByTestId("custom-rendered-element")).toBeDefined();
    expect(screen.getByTestId("declarative-filter-clear")).toBeDefined();
    expect(screen.getByTestId("search-field")).toBeDefined();

    // Clicking clear
    fireEvent.click(screen.getByTestId("declarative-filter-clear"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("hides clear button in declarative mode when hasActiveFilters is false", () => {
    renderWithProviders(
      <Filter
        testId="declarative-clean-filter"
        fields={[]}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />,
    );

    expect(screen.queryByTestId("declarative-clean-filter-clear")).toBeNull();
  });
});
