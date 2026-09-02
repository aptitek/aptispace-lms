import { describe, it, expect, vi } from "vitest";
import React from "react";
import { GhostActionButton } from "./GhostActionButton";
import type { GhostActionButtonProps } from "./GhostActionButton.types";

describe("GhostActionButton Atom", () => {
  it("exports GhostActionButton component properly", () => {
    expect(GhostActionButton).toBeDefined();
    expect(typeof GhostActionButton).toBe("function");
  });

  it("creates React element with tooltip and testId", () => {
    const onClick = vi.fn();
    const element = React.createElement(GhostActionButton, {
      tooltip: "Add Item",
      testId: "my-ghost-fab",
      onClick,
    });

    expect(element).toBeDefined();
    const props = element.props as GhostActionButtonProps;
    expect(props.tooltip).toBe("Add Item");
    expect(props.testId).toBe("my-ghost-fab");
    expect(props.onClick).toBe(onClick);
  });
});
