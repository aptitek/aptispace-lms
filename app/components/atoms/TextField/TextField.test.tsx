import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import TextField, { SearchField, CompactTextField } from "./TextField";

describe("TextField Atom & Search Variant", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders standard textfield with label and value", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <TextField
          label="Identifier"
          value="STU-100"
          onChange={() => {}}
          data-testid="std-input"
        />
      </ThemeProvider>,
    );

    const input = screen.getByTestId("std-input");
    expect(input).toBeDefined();
    expect(screen.getByDisplayValue("STU-100")).toBeDefined();
  });

  it("renders search variant with search icon and clear button", () => {
    const handleClear = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <TextField
          variant="search"
          value="Calculus"
          placeholder="Search courses..."
          onClear={handleClear}
          data-testid="search-input"
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("search-icon")).toBeDefined();
    const clearBtn = screen.getByTestId("clear-search-button");
    expect(clearBtn).toBeDefined();
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("renders SearchField helper component", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <SearchField value="" placeholder="Type to filter..." />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("search-icon")).toBeDefined();
    expect(screen.getByPlaceholderText("Type to filter...")).toBeDefined();
  });

  describe("Compact Variants", () => {
    it('renders with size="compact"', () => {
      render(
        <ThemeProvider theme={appTheme}>
          <TextField
            size="compact"
            value="Compact value"
            data-testid="compact-size-input"
          />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("compact-size-input")).toBeDefined();
      expect(screen.getByDisplayValue("Compact value")).toBeDefined();
    });

    it("renders with compact={true} shorthand prop", () => {
      render(
        <ThemeProvider theme={appTheme}>
          <TextField
            compact
            value="Compact prop value"
            data-testid="compact-prop-input"
          />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("compact-prop-input")).toBeDefined();
      expect(screen.getByDisplayValue("Compact prop value")).toBeDefined();
    });

    it("renders CompactTextField helper component", () => {
      render(
        <ThemeProvider theme={appTheme}>
          <CompactTextField
            value="Compact component value"
            placeholder="Quick code"
            data-testid="compact-component-input"
          />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("compact-component-input")).toBeDefined();
      expect(screen.getByDisplayValue("Compact component value")).toBeDefined();
    });

    it("renders compact search field with both search icon and compact styling", () => {
      render(
        <ThemeProvider theme={appTheme}>
          <CompactTextField
            variant="search"
            value="Filter text"
            data-testid="compact-search-input"
          />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("compact-search-input")).toBeDefined();
      expect(screen.getByTestId("search-icon")).toBeDefined();
    });

    it("renders with fitContent={true}", () => {
      render(
        <ThemeProvider theme={appTheme}>
          <TextField
            fitContent
            value="Fit content"
            data-testid="fit-content-input"
          />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("fit-content-input")).toBeDefined();
      expect(screen.getByDisplayValue("Fit content")).toBeDefined();
    });
  });
});
