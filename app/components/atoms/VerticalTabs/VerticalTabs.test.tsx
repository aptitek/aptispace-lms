import { describe, it, expect, vi, afterEach } from "vitest";
import React, { useState } from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { appTheme } from "~/tokens/theme";
import { VerticalTabs, VerticalTab } from "./index";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={appTheme}>{ui}</ThemeProvider>);
}

function ControlledVerticalTabs({
  variant = "default",
  extended = false,
  onChangeSpy,
}: {
  variant?: "default" | "compact";
  extended?: boolean;
  onChangeSpy?: (val: string) => void;
}) {
  const [tab, setTab] = useState("home");

  return (
    <VerticalTabs
      value={tab}
      onChange={(_, next) => {
        setTab(next);
        onChangeSpy?.(next);
      }}
      variant={variant}
      extended={extended}
      data-testid="test-vertical-tabs"
    >
      <VerticalTab
        value="home"
        label="Home"
        icon={<HomeRoundedIcon data-testid="icon-home" />}
        data-testid="tab-home"
      />
      <VerticalTab
        value="users"
        label="Users"
        icon={<GroupRoundedIcon data-testid="icon-users" />}
        badge={<span data-testid="badge-users">5</span>}
        data-testid="tab-users"
      />
      <VerticalTab
        value="settings"
        label="Settings"
        icon={<SettingsRoundedIcon data-testid="icon-settings" />}
        data-testid="tab-settings"
      />
    </VerticalTabs>
  );
}

describe("VerticalTabs & VerticalTab Atom Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports VerticalTabs and VerticalTab properly", () => {
    expect(VerticalTabs).toBeDefined();
    expect(typeof VerticalTabs).toBe("object"); // forwardRef
    expect(VerticalTab).toBeDefined();
    expect(typeof VerticalTab).toBe("object"); // forwardRef
  });

  it("renders default variant with icon and full text side-by-side", () => {
    renderWithTheme(<ControlledVerticalTabs variant="default" />);

    const tabsContainer = screen.getByTestId("test-vertical-tabs");
    expect(tabsContainer).toBeDefined();

    const homeTab = screen.getByTestId("tab-home");
    expect(homeTab).toBeDefined();
    expect(homeTab.textContent).toContain("Home");
    expect(screen.getByTestId("icon-home")).toBeDefined();

    const usersTab = screen.getByTestId("tab-users");
    expect(usersTab.textContent).toContain("Users");
    expect(screen.getByTestId("badge-users")).toBeDefined();
  });

  it("renders compact variant collapsed (extended=false) showing only icon", () => {
    renderWithTheme(
      <ControlledVerticalTabs variant="compact" extended={false} />,
    );

    const homeTab = screen.getByTestId("tab-home");
    expect(homeTab).toBeDefined();
    // Icon is visible
    expect(screen.getByTestId("icon-home")).toBeDefined();
    // In compact collapsed mode, text label is omitted from the tab body and aria-label is used
    expect(homeTab.getAttribute("aria-label")).toBe("Home");
    expect(homeTab.textContent).toBe("");
  });

  it("renders compact variant extended (extended=true) with icon and full text", () => {
    renderWithTheme(
      <ControlledVerticalTabs variant="compact" extended={true} />,
    );

    const homeTab = screen.getByTestId("tab-home");
    expect(homeTab).toBeDefined();
    expect(screen.getByTestId("icon-home")).toBeDefined();
    expect(homeTab.textContent).toContain("Home");

    const usersTab = screen.getByTestId("tab-users");
    expect(usersTab.textContent).toContain("Users");
    expect(screen.getByTestId("badge-users")).toBeDefined();
  });

  it("handles tab selection and onChange event", () => {
    const onChangeSpy = vi.fn();
    renderWithTheme(
      <ControlledVerticalTabs
        variant="compact"
        extended={true}
        onChangeSpy={onChangeSpy}
      />,
    );

    const usersTab = screen.getByTestId("tab-users");
    expect(usersTab.getAttribute("aria-selected")).toBe("false");

    fireEvent.click(usersTab);
    expect(onChangeSpy).toHaveBeenCalledWith("users");
    expect(usersTab.getAttribute("aria-selected")).toBe("true");
  });

  it("works standalone with standard MUI Tabs with orientation='vertical'", () => {
    renderWithTheme(
      <Tabs orientation="vertical" value="settings">
        <VerticalTab
          value="home"
          label="Home"
          icon={<HomeRoundedIcon />}
          data-testid="standalone-home"
        />
        <VerticalTab
          value="settings"
          label="Settings"
          icon={<SettingsRoundedIcon />}
          data-testid="standalone-settings"
        />
      </Tabs>,
    );

    const settingsTab = screen.getByTestId("standalone-settings");
    expect(settingsTab).toBeDefined();
    expect(settingsTab.getAttribute("aria-selected")).toBe("true");
  });
});
