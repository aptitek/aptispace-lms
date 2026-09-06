import { describe, it, expect } from "vitest";
import React from "react";
import UserCardSkeleton, { EntityCardSkeleton } from "./UserCardSkeleton";

describe("UserCardSkeleton Molecule", () => {
  it("exports UserCardSkeleton and EntityCardSkeleton components properly", () => {
    expect(UserCardSkeleton).toBeDefined();
    expect(typeof UserCardSkeleton).toBe("function");
    expect(UserCardSkeleton.name).toBe("UserCardSkeleton");
    expect(EntityCardSkeleton).toBe(UserCardSkeleton);
  });

  it("creates React element with default shimmer props", () => {
    const element = React.createElement(UserCardSkeleton, {
      variant: "shimmer",
      animated: true,
      testId: "test-shimmer-skeleton",
    });

    expect(element).toBeDefined();
    expect(element.props.variant).toBe("shimmer");
    expect(element.props.animated).toBe(true);
    expect(element.props.testId).toBe("test-shimmer-skeleton");
  });

  it("creates React element with static placeholder props", () => {
    const element = React.createElement(UserCardSkeleton, {
      variant: "static",
      animated: false,
      opacity: 0.35,
      testId: "test-static-skeleton",
    });

    expect(element).toBeDefined();
    expect(element.props.variant).toBe("static");
    expect(element.props.animated).toBe(false);
    expect(element.props.opacity).toBe(0.35);
  });
});
