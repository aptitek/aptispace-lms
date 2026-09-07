import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import { Icon } from "./Icon";

describe("Icon Atom", () => {
  it("renders with basic props and defaults", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <Icon name="search" />
      </ThemeProvider>,
    );
    const el = screen.getByTestId("icon");
    expect(el).toBeDefined();
    expect(el.textContent).toBe("search");
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("handles boolean and numeric fill props", () => {
    const { rerender } = render(
      <ThemeProvider theme={appTheme}>
        <Icon name="star" fill data-testid="icon-filled" />
      </ThemeProvider>,
    );
    let el = screen.getByTestId("icon-filled");
    expect(el).toBeDefined();
    expect(el.style.fontVariationSettings).toContain("'FILL' 1");

    rerender(
      <ThemeProvider theme={appTheme}>
        <Icon name="star" fill={false} data-testid="icon-filled" />
      </ThemeProvider>,
    );
    el = screen.getByTestId("icon-filled");
    expect(el).toBeDefined();
    expect(el.style.fontVariationSettings).toContain("'FILL' 0");

    rerender(
      <ThemeProvider theme={appTheme}>
        <Icon name="star" fill="true" data-testid="icon-filled" />
      </ThemeProvider>,
    );
    el = screen.getByTestId("icon-filled");
    expect(el.style.fontVariationSettings).toContain("'FILL' 1");

    rerender(
      <ThemeProvider theme={appTheme}>
        <Icon name="star" fill={1} data-testid="icon-filled" />
      </ThemeProvider>,
    );
    el = screen.getByTestId("icon-filled");
    expect(el.style.fontVariationSettings).toContain("'FILL' 1");
  });

  it("handles named string weights and numeric weights", () => {
    const { rerender } = render(
      <ThemeProvider theme={appTheme}>
        <Icon name="favorite" weight="bold" data-testid="icon-weight" />
      </ThemeProvider>,
    );
    let el = screen.getByTestId("icon-weight");
    expect(el).toBeDefined();
    expect(el.style.fontVariationSettings).toContain("'wght' 700");
    expect(el.style.fontWeight).toBe("700");

    rerender(
      <ThemeProvider theme={appTheme}>
        <Icon name="favorite" weight={300} data-testid="icon-weight" />
      </ThemeProvider>,
    );
    el = screen.getByTestId("icon-weight");
    expect(el.style.fontVariationSettings).toContain("'wght' 300");
    expect(el.style.fontWeight).toBe("300");

    rerender(
      <ThemeProvider theme={appTheme}>
        <Icon name="favorite" weight="100" data-testid="icon-weight" />
      </ThemeProvider>,
    );
    el = screen.getByTestId("icon-weight");
    expect(el.style.fontVariationSettings).toContain("'wght' 100");
    expect(el.style.fontWeight).toBe("100");
  });

  it("derives and explicitly overrides opsz", () => {
    const { rerender } = render(
      <ThemeProvider theme={appTheme}>
        <Icon name="settings" size={40} data-testid="icon-opsz" />
      </ThemeProvider>,
    );
    let el = screen.getByTestId("icon-opsz");
    expect(el).toBeDefined();
    expect(el.style.fontVariationSettings).toContain("'opsz' 40");

    rerender(
      <ThemeProvider theme={appTheme}>
        <Icon name="settings" size={24} opsz={48} data-testid="icon-opsz" />
      </ThemeProvider>,
    );
    el = screen.getByTestId("icon-opsz");
    expect(el.style.fontVariationSettings).toContain("'opsz' 48");

    rerender(
      <ThemeProvider theme={appTheme}>
        <Icon name="settings" size={24} opsz="20" data-testid="icon-opsz" />
      </ThemeProvider>,
    );
    el = screen.getByTestId("icon-opsz");
    expect(el.style.fontVariationSettings).toContain("'opsz' 20");
  });

  it("renders with accessible label", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <Icon name="close" aria-label="Close dialog" />
      </ThemeProvider>,
    );
    const el = screen.getByLabelText("Close dialog");
    expect(el).toBeDefined();
    expect(el.getAttribute("aria-hidden")).toBe("false");
  });
});
