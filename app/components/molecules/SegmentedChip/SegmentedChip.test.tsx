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

  it("allows in-place editing when editable prop is set", () => {
    const handleSegmentEdit = vi.fn();
    const handleSegmentOnEdit = vi.fn();

    renderWithTheme(
      <SegmentedChip
        segments={[
          { label: "EditableTag", onEdit: handleSegmentOnEdit },
          { label: "StaticTag" },
        ]}
        editable
        onSegmentEdit={handleSegmentEdit}
        testId="editable-chip"
      />,
    );

    // Initial label check
    expect(screen.getByText("EditableTag")).toBeDefined();

    // Click on the first segment to enter edit mode
    const firstSegmentContent = screen.getByTestId(
      "editable-chip-seg-0-content",
    );
    fireEvent.click(firstSegmentContent);

    // Input should be present
    const input = screen.getByTestId(
      "editable-chip-seg-0-input",
    ) as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input.value).toBe("EditableTag");

    // Change input value and press Enter to commit
    fireEvent.change(input, { target: { value: "UpdatedTag" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Verify input is closed and new text is displayed in-place
    expect(screen.queryByTestId("editable-chip-seg-0-input")).toBeNull();
    expect(screen.getByText("UpdatedTag")).toBeDefined();

    // Callbacks should have been called
    expect(handleSegmentOnEdit).toHaveBeenCalledWith("UpdatedTag");
    expect(handleSegmentEdit).toHaveBeenCalledWith(
      0,
      "UpdatedTag",
      expect.objectContaining({ label: "EditableTag" }),
    );
  });

  it("allows canceling edit on Escape key without committing", () => {
    const handleSegmentEdit = vi.fn();

    renderWithTheme(
      <SegmentedChip
        segments={[{ label: "OriginalText" }]}
        editable
        onSegmentEdit={handleSegmentEdit}
        testId="escape-chip"
      />,
    );

    // Click to edit
    const content = screen.getByTestId("escape-chip-seg-0-content");
    fireEvent.click(content);

    const input = screen.getByTestId(
      "escape-chip-seg-0-input",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "DiscardedChanges" } });

    // Press Escape
    fireEvent.keyDown(input, { key: "Escape", code: "Escape" });

    // Edit mode should close, text reverts to original
    expect(screen.queryByTestId("escape-chip-seg-0-input")).toBeNull();
    expect(screen.getByText("OriginalText")).toBeDefined();
    expect(handleSegmentEdit).not.toHaveBeenCalled();
  });

  it("commits edit on blur", () => {
    const handleSegmentEdit = vi.fn();

    renderWithTheme(
      <SegmentedChip
        segments={[{ label: "BlurTag" }]}
        editable
        onSegmentEdit={handleSegmentEdit}
        testId="blur-chip"
      />,
    );

    const content = screen.getByTestId("blur-chip-seg-0-content");
    fireEvent.click(content);

    const input = screen.getByTestId(
      "blur-chip-seg-0-input",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "BlurredResult" } });
    fireEvent.blur(input);

    expect(screen.queryByTestId("blur-chip-seg-0-input")).toBeNull();
    expect(screen.getByText("BlurredResult")).toBeDefined();
    expect(handleSegmentEdit).toHaveBeenCalledWith(
      0,
      "BlurredResult",
      expect.anything(),
    );
  });

  it("respects per-segment editable override", () => {
    renderWithTheme(
      <SegmentedChip
        segments={[
          { label: "ReadOnlySegment", editable: false },
          { label: "ExplicitlyEditable", editable: true },
        ]}
        testId="override-chip"
      />,
    );

    // Segment 0 has editable: false -> clicking should NOT open input
    const segment0 = screen.getByTestId("override-chip-seg-0-content");
    fireEvent.click(segment0);
    expect(screen.queryByTestId("override-chip-seg-0-input")).toBeNull();

    // Segment 1 has editable: true -> clicking SHOULD open input
    const segment1 = screen.getByTestId("override-chip-seg-1-content");
    fireEvent.click(segment1);
    expect(screen.getByTestId("override-chip-seg-1-input")).toBeDefined();
  });

  it("supports double-click edit trigger", () => {
    renderWithTheme(
      <SegmentedChip
        segments={[{ label: "DoubleClickTag" }]}
        editable
        editTrigger="doubleClick"
        testId="double-click-chip"
      />,
    );

    const content = screen.getByTestId("double-click-chip-seg-0-content");

    // Single click should NOT trigger edit
    fireEvent.click(content);
    expect(screen.queryByTestId("double-click-chip-seg-0-input")).toBeNull();

    // Double click SHOULD trigger edit
    fireEvent.doubleClick(content);
    expect(screen.getByTestId("double-click-chip-seg-0-input")).toBeDefined();
  });

  it("prevents editing when chip is disabled", () => {
    renderWithTheme(
      <SegmentedChip
        segments={[{ label: "DisabledTag" }]}
        editable
        disabled
        testId="disabled-chip"
      />,
    );

    const content = screen.getByTestId("disabled-chip-seg-0-content");
    fireEvent.click(content);
    expect(screen.queryByTestId("disabled-chip-seg-0-input")).toBeNull();
  });
});
