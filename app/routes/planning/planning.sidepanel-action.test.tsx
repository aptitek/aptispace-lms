// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from "vitest";
import React, { useRef } from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import { PlanningSidepanelAction } from "./planning.sidepanel-action";

function TestSidepanelWrapper({ onOpenExport }: { onOpenExport: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} data-testid="calendar-frame-root">
      <div className="MuiEventCalendar-sidePanel">
        <div className="MuiEventCalendar-miniCalendar">Mini Calendar Month</div>
        <div className="MuiEventCalendar-sidePanelDivider" />
      </div>
      <PlanningSidepanelAction
        containerRef={containerRef}
        onOpenExport={onOpenExport}
      />
    </div>
  );
}

describe("PlanningSidepanelAction Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("mounts export button under mini calendar and handles click", () => {
    const onOpenExport = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <TestSidepanelWrapper onOpenExport={onOpenExport} />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const exportBtn = screen.getByTestId("planning-sidepanel-export-btn");
    expect(exportBtn).toBeDefined();

    fireEvent.click(exportBtn);
    expect(onOpenExport).toHaveBeenCalledTimes(1);
  });
});
