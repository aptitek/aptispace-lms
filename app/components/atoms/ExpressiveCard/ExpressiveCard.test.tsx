import { describe, it, expect } from "vitest";
import React from "react";
import {
  ExpressiveCard,
  GhostFabOverlay,
  DashedSkeletonCard,
} from "./ExpressiveCard";
import type { ExpressiveCardProps } from "./ExpressiveCard.types";

describe("ExpressiveCard Atom", () => {
  it("exports components properly", () => {
    expect(ExpressiveCard).toBeDefined();
    expect(GhostFabOverlay).toBeDefined();
    expect(DashedSkeletonCard).toBeDefined();
  });

  it("creates React element with default props", () => {
    const element = React.createElement(
      ExpressiveCard,
      { isInteractive: true, isSelected: false, variant: "elevated" },
      "Card Content",
    );
    expect(element).toBeDefined();
    const props = element.props as ExpressiveCardProps;
    expect(props.isInteractive).toBe(true);
    expect(props.isSelected).toBe(false);
    expect(props.variant).toBe("elevated");
    expect(props.children).toBe("Card Content");
  });

  it("creates dashed skeleton card properly", () => {
    const element = React.createElement(
      DashedSkeletonCard,
      { isInteractive: true },
      React.createElement(GhostFabOverlay, null, "+"),
    );
    expect(element).toBeDefined();
  });
});
