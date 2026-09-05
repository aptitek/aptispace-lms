import { describe, it, expect } from "vitest";
import React from "react";
import Mrz, { MrzZone } from "./Mrz";

describe("Mrz UI Atom Component", () => {
  it("exports Mrz component and backwards-compatible alias", () => {
    expect(Mrz).toBeDefined();
    expect(typeof Mrz).toBe("function");
    expect(MrzZone).toBe(Mrz);
  });

  it("instantiates default Mrz element properly", () => {
    const element = React.createElement(Mrz, {
      testId: "custom-mrz",
    });
    expect(element).toBeDefined();
    expect(element.props.testId).toBe("custom-mrz");
  });

  it("accepts custom MRZ lines and validation flags", () => {
    const customLines: [string, string, string] = [
      "IDAPT0942<<<<<4<<<<<<<<<<<<<<<",
      "2608284M3008287APT<<<<<<<<<<<4",
      "MERCER<<ALEX<<<<<<<<<<<<<<<<<<",
    ];

    const element = React.createElement(Mrz, {
      lines: customLines,
      showValidation: true,
      compact: true,
      darkOnLight: false,
    });

    expect(element.props.lines).toEqual(customLines);
    expect(element.props.showValidation).toBe(true);
    expect(element.props.compact).toBe(true);
    expect(element.props.darkOnLight).toBe(false);
  });
});
