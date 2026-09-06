import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import Footer from "./Footer";

function renderFooter(props?: React.ComponentProps<typeof Footer>) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>
        <Footer {...props} />
      </ThemeProvider>
    </I18nextProvider>,
  );
}

describe("Footer Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders floating footer with crafted by chip", () => {
    renderFooter({ "data-testid": "app-footer" });

    const footer = screen.getByTestId("app-footer");
    expect(footer).toBeDefined();

    const chip = screen.getByTestId("crafted-by-chip");
    expect(chip).toBeDefined();
    expect(chip.getAttribute("href")).toBe("https://aptitek.io");
    expect(chip.getAttribute("target")).toBe("_blank");
  });
});
