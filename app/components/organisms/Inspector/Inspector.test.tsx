import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Inspector,
  InspectorHeader,
  InspectorBody,
  InspectorActions,
} from "./Inspector";

afterEach(cleanup);

describe("Inspector Organism", () => {
  it("exports Inspector and subcomponents properly", () => {
    expect(Inspector).toBeDefined();
    expect(InspectorHeader).toBeDefined();
    expect(InspectorBody).toBeDefined();
    expect(InspectorActions).toBeDefined();
    expect(Inspector.Header).toBe(InspectorHeader);
    expect(Inspector.Body).toBe(InspectorBody);
    expect(Inspector.Actions).toBe(InspectorActions);
  });

  it("renders with automatic header when title and onClose are provided", () => {
    const onCloseMock = vi.fn();
    render(
      <Inspector title="Test Inspector" onClose={onCloseMock}>
        <div data-testid="test-content">Inner Content</div>
      </Inspector>,
    );

    expect(screen.getByText("Test Inspector")).toBeDefined();
    expect(screen.getByTestId("test-content")).toBeDefined();

    const closeBtn = screen.getByTestId("inspector-close-btn");
    expect(closeBtn).toBeDefined();
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("renders with compound components Inspector.Header, Inspector.Body, and Inspector.Actions", () => {
    const onCloseMock = vi.fn();
    render(
      <Inspector>
        <Inspector.Header
          title={<Typography variant="h6">Custom Header</Typography>}
          onClose={onCloseMock}
        />
        <Inspector.Body>
          <Typography>Compound Content</Typography>
        </Inspector.Body>
        <Inspector.Actions>
          <Button>Save</Button>
        </Inspector.Actions>
      </Inspector>,
    );

    expect(screen.getByText("Custom Header")).toBeDefined();
    expect(screen.getByText("Compound Content")).toBeDefined();
    expect(screen.getByText("Save")).toBeDefined();
    expect(screen.getByTestId("inspector-actions")).toBeDefined();
  });
});
