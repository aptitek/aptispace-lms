import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MaterialSymbol } from "./MaterialSymbol";

describe("MaterialSymbol", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with default MD3 unfilled rounded configuration", () => {
    render(<MaterialSymbol name="search" />);
    const el = screen.getByTestId("material-symbol");

    expect(el).toBeDefined();
    expect(el.textContent).toBe("search");
    expect(el.className).toContain("material-symbols-rounded");
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies aria-label and accessible role when provided", () => {
    render(<MaterialSymbol name="close" aria-label="Close dialog" />);
    const el = screen.getByTestId("material-symbol");

    expect(el.getAttribute("aria-label")).toBe("Close dialog");
    expect(el.getAttribute("aria-hidden")).toBe("false");
  });

  it("supports custom optical sizes and weights", () => {
    render(
      <MaterialSymbol
        name="school"
        size={32}
        weight={600}
        opsz={40}
        data-testid="custom-symbol"
      />,
    );
    const el = screen.getByTestId("custom-symbol");
    expect(el).toBeDefined();
    expect(el.textContent).toBe("school");
  });
});
