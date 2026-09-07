import React, { useState } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import { Tabs, Tab, VerticalTabs, VerticalTab } from "./index";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={appTheme}>{ui}</ThemeProvider>);
}

function ControlledHorizontalTabs({
  onChangeSpy,
}: {
  onChangeSpy?: (val: string) => void;
}) {
  const [val, setVal] = useState("users");
  return (
    <Tabs
      value={val}
      onChange={(_, next) => {
        setVal(next);
        onChangeSpy?.(next);
      }}
      aria-label="Admin tabs"
    >
      <Tab value="users" label="Users" data-testid="tab-users" />
      <Tab
        value="cohorts"
        label="Cohorts"
        badge={<span data-testid="badge-cohorts">12</span>}
        data-testid="tab-cohorts"
      />
      <Tab
        value="disabled"
        label="Disabled"
        disabled
        data-testid="tab-disabled"
      />
    </Tabs>
  );
}

function ControlledVerticalTabs({
  onChangeSpy,
}: {
  onChangeSpy?: (val: string) => void;
}) {
  const [val, setVal] = useState("home");
  return (
    <Tabs
      orientation="vertical"
      value={val}
      onChange={(_, next) => {
        setVal(next);
        onChangeSpy?.(next);
      }}
      aria-label="Main navigation"
    >
      <Tab
        value="home"
        label="Home"
        icon={<span data-testid="icon-home">🏠</span>}
        data-testid="tab-home"
      />
      <Tab
        value="planning"
        label="Planning"
        icon={<span data-testid="icon-planning">📅</span>}
        badge={<span data-testid="badge-planning">3</span>}
        data-testid="tab-planning"
      />
    </Tabs>
  );
}

describe("Tabs & Tab atom", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Horizontal (Normal) Tabs", () => {
    it("renders horizontal tabs and responds to selection", () => {
      const changeSpy = vi.fn();
      renderWithTheme(<ControlledHorizontalTabs onChangeSpy={changeSpy} />);

      const usersTab = screen.getByTestId("tab-users");
      const cohortsTab = screen.getByTestId("tab-cohorts");

      expect(usersTab).toBeDefined();
      expect(cohortsTab).toBeDefined();
      expect(usersTab.getAttribute("aria-selected")).toBe("true");
      expect(cohortsTab.getAttribute("aria-selected")).toBe("false");
      expect(screen.getByTestId("badge-cohorts").textContent).toBe("12");

      fireEvent.click(cohortsTab);
      expect(changeSpy).toHaveBeenCalledWith("cohorts");
      expect(cohortsTab.getAttribute("aria-selected")).toBe("true");
    });

    it("respects disabled tabs", () => {
      const changeSpy = vi.fn();
      renderWithTheme(<ControlledHorizontalTabs onChangeSpy={changeSpy} />);

      const disabledTab = screen.getByTestId("tab-disabled");
      expect((disabledTab as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(disabledTab);
      expect(changeSpy).not.toHaveBeenCalled();
    });
  });

  describe("Vertical Tab Variant", () => {
    it("inherits vertical variant inside Tabs with orientation='vertical'", () => {
      const changeSpy = vi.fn();
      renderWithTheme(<ControlledVerticalTabs onChangeSpy={changeSpy} />);

      const homeTab = screen.getByTestId("tab-home");
      const planningTab = screen.getByTestId("tab-planning");

      expect(homeTab).toBeDefined();
      expect(planningTab).toBeDefined();
      expect(screen.getByTestId("icon-home")).toBeDefined();
      expect(screen.getByTestId("icon-planning")).toBeDefined();
      expect(homeTab.textContent).toContain("Home");
      expect(planningTab.textContent).toContain("Planning");

      fireEvent.click(planningTab);
      expect(changeSpy).toHaveBeenCalledWith("planning");
    });

    it("forwards orientation='vertical' to MuiTabs so root has MuiTabs-vertical and indicator is vertical", () => {
      renderWithTheme(
        <Tabs
          orientation="vertical"
          value="home"
          data-testid="vertical-tabs-root"
        >
          <Tab value="home" label="Home" data-testid="tab-home" />
          <Tab value="planning" label="Planning" data-testid="tab-planning" />
        </Tabs>,
      );

      const root = screen.getByTestId("vertical-tabs-root");
      expect(root.className).toContain("MuiTabs-vertical");
    });

    it("supports VerticalTabs and VerticalTab convenience aliases", () => {
      const handleChange = vi.fn();
      renderWithTheme(
        <VerticalTabs value="test" onChange={handleChange}>
          <VerticalTab
            value="test"
            label="Alias"
            icon={<span data-testid="alias-icon">★</span>}
            data-testid="alias-tab"
          />
        </VerticalTabs>,
      );

      const aliasTab = screen.getByTestId("alias-tab");
      expect(aliasTab).toBeDefined();
      expect(screen.getByTestId("alias-icon")).toBeDefined();
      expect(aliasTab.textContent).toContain("Alias");
    });
  });
});
