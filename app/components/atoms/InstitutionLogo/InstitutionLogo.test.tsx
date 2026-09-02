import { describe, it, expect } from "vitest";
import React from "react";
import InstitutionLogo from "./InstitutionLogo";
import type { InstitutionLogoProps } from "./InstitutionLogo.types";

describe("InstitutionLogo Atom Component", () => {
  it("exports InstitutionLogo component properly", () => {
    expect(InstitutionLogo).toBeDefined();
    expect(typeof InstitutionLogo).toBe("function");
    expect(InstitutionLogo.name).toBe("InstitutionLogo");
  });

  it("creates React element with logoUrl and name", () => {
    const element = React.createElement(InstitutionLogo, {
      logoUrl: "/aptitek-logo.svg",
      name: "Aptitek",
      height: 40,
    });

    expect(element).toBeDefined();
    const props = element.props as InstitutionLogoProps;
    expect(props.logoUrl).toBe("/aptitek-logo.svg");
    expect(props.name).toBe("Aptitek");
    expect(props.height).toBe(40);
  });

  it("creates React element without logoUrl for fallback text", () => {
    const element = React.createElement(InstitutionLogo, {
      name: "Polytechnique",
      testId: "custom-inst-logo",
    });

    expect(element).toBeDefined();
    const props = element.props as InstitutionLogoProps;
    expect(props.logoUrl).toBeUndefined();
    expect(props.name).toBe("Polytechnique");
    expect(props.testId).toBe("custom-inst-logo");
  });
});
