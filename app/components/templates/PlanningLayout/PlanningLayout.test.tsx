import { describe, it, expect } from "vitest";
import React from "react";
import { PlanningLayout } from "./PlanningLayout";

describe("PlanningLayout Template", () => {
  it("exports component properly", () => {
    expect(PlanningLayout).toBeDefined();
    expect(typeof PlanningLayout).toBe("function");
  });

  it("creates React element with slotted sections", () => {
    const element = React.createElement(PlanningLayout, {
      hero: React.createElement("div", null, "Hero"),
      calendar: React.createElement("div", null, "Calendar"),
      dialogs: React.createElement("div", null, "Dialogs"),
      feedback: React.createElement("div", null, "Feedback"),
    });

    expect(element).toBeDefined();
    expect(element.props.hero).toBeDefined();
    expect(element.props.calendar).toBeDefined();
    expect(element.props.dialogs).toBeDefined();
    expect(element.props.feedback).toBeDefined();
  });
});
