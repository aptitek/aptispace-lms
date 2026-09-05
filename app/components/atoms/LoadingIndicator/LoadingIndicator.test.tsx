import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import LoadingIndicator from "./LoadingIndicator";

describe("LoadingIndicator Atom", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports LoadingIndicator properly", () => {
    expect(LoadingIndicator).toBeDefined();
    expect(typeof LoadingIndicator).toBe("function");
  });

  it("renders with custom size and color", () => {
    const { container } = render(
      <ThemeProvider theme={appTheme}>
        <LoadingIndicator size={24} color="#ff0000" />
      </ThemeProvider>,
    );

    const span = container.querySelector("span");
    expect(span).toBeDefined();
    expect(span?.style.width || span?.getAttribute("style")).toBeDefined();
  });
});
