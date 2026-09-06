import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import TextField, { SearchField } from "./TextField";

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
});
