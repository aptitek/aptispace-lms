import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import SegmentedChip from "./SegmentedChip";

afterEach(cleanup);

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("SegmentedChip Molecule Component", () => {
  it("exports SegmentedChip component properly", () => {
    expect(SegmentedChip).toBeDefined();
    expect(typeof SegmentedChip).toBe("object"); // forwardRef component
    expect(SegmentedChip.displayName).toBe("SegmentedChip");
  });

  it("renders with segments list and formats labels", () => {
    renderWithTheme(
      <SegmentedChip
        segments={[
          { label: "BUILD", bold: true, background: "#22c55e", color: "#fff" },
          { label: "passing" },
          { label: "v2.4.0", mono: true },
        ]}
        size="small"
        data-testid="build-chip"
      />,
    );

    expect(screen.getByText("BUILD")).toBeDefined();
    expect(screen.getByText("passing")).toBeDefined();
    expect(screen.getByText("v2.4.0")).toBeDefined();
  });

  it("renders with leading and items shorthand", () => {
    renderWithTheme(
      <SegmentedChip
        leading={{ label: "STATUS", bold: true }}
        items={["Healthy", "99.9%"]}
        variant="filled"
      />,
    );

    expect(screen.getByText("STATUS")).toBeDefined();
    expect(screen.getByText("Healthy")).toBeDefined();
    expect(screen.getByText("99.9%")).toBeDefined();
  });

  it("renders structured cohort data correctly with diploma, year and tags", () => {
    const cohortData = {
      diploma: "Master",
      year: 2026,
      tags: ["AI", "Robotics"],
    };

    renderWithTheme(
      <SegmentedChip
        cohort={cohortData}
        size="medium"
        testId="cohort-segmented-chip"
      />,
    );

    expect(screen.getByTestId("cohort-segmented-chip")).toBeDefined();
    expect(screen.getByText("M2026")).toBeDefined();
    expect(screen.getByText("AI")).toBeDefined();
    expect(screen.getByText("Robotics")).toBeDefined();
  });

  it("handles click and delete interactions", () => {
    const handleClick = vi.fn();
    const handleDelete = vi.fn();

    renderWithTheme(
      <SegmentedChip
        segments={[{ label: "Role" }, { label: "Student" }]}
        onClick={handleClick}
        onDelete={handleDelete}
        shape="bun"
        testId="interactive-chip"
      />,
    );

    const chip = screen.getByTestId("interactive-chip");
    fireEvent.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);

    const deleteBtn = screen.getByLabelText(/delete|remove/i);
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it("renders various sizes and shape presets", () => {
    const { unmount } = renderWithTheme(
      <SegmentedChip
        segments={["Small", "Pill"]}
        size="small"
        shape="pill"
        testId="small-chip"
      />,
    );
    expect(screen.getByTestId("small-chip")).toBeDefined();
    unmount();

    renderWithTheme(
      <SegmentedChip
        segments={["Large", "Asymmetric"]}
        size="large"
        shape="asymmetric"
        testId="large-chip"
      />,
    );
    expect(screen.getByTestId("large-chip")).toBeDefined();
  });

  it("supports vertical and responsive orientation", () => {
    const { unmount } = renderWithTheme(
      <SegmentedChip
        segments={["Vertical", "Stack"]}
        orientation="vertical"
        testId="vertical-chip"
      />,
    );
    const verticalChip = screen.getByTestId("vertical-chip");
    expect(verticalChip.getAttribute("data-orientation")).toBe("vertical");
    unmount();

    renderWithTheme(
      <SegmentedChip
        segments={["Responsive", "Stack"]}
        orientation="responsive"
        testId="responsive-chip"
      />,
    );
    const responsiveChip = screen.getByTestId("responsive-chip");
    expect(responsiveChip.getAttribute("data-orientation")).toBe("responsive");
    const dividers = responsiveChip.querySelectorAll("hr");
    expect(dividers).toHaveLength(1);
    expect(dividers[0].classList.contains("MuiDivider-root")).toBe(true);
    expect(dividers[0].classList.contains("MuiDivider-vertical")).toBe(false);
  });
});
