import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import FloatingActionButton from "./FloatingActionButton";

describe("FloatingActionButton Atom", () => {
  it("renders with tooltip and fires onClick", () => {
    const handleClick = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <FloatingActionButton
          tooltip="Create item"
          onClick={handleClick}
          testId="test-fab"
        />
      </ThemeProvider>,
    );

    const btn = screen.getByTestId("test-fab");
    expect(btn).toBeDefined();
    expect(btn.getAttribute("aria-label")).toBe("Create item");

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
