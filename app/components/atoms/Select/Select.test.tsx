import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import Select from "./Select";

describe("MD3 Select Atom", () => {
  afterEach(() => {
    cleanup();
  });

  const sampleOptions = [
    { value: "all", label: "All Items" },
    { value: "first", label: "First Item" },
    { value: "second", label: "Second Item" },
  ];

  it("renders with label and options", () => {
    const handleChange = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <Select
          label="Filter Option"
          value="all"
          onChange={handleChange}
          options={sampleOptions}
          data-testid="test-select"
        />
      </ThemeProvider>,
    );

    const select = screen.getByTestId("test-select");
    expect(select).toBeDefined();
    expect(screen.getByText("All Items")).toBeDefined();
  });

  it("supports filled variant and custom renderValue", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <Select
          variant="filled"
          label="Status"
          value="active"
          onChange={() => {}}
          renderValue={(val) => <span data-testid="custom-val">{val}</span>}
          options={[{ value: "active", label: "Active" }]}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("custom-val")).toBeDefined();
    expect(screen.getByTestId("custom-val").textContent).toBe("active");
  });
});
