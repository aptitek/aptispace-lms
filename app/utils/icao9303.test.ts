import { describe, it, expect } from "vitest";
import {
  calculateIcaoCheckDigit,
  generateTd1Mrz,
  validateTd1Mrz,
} from "./icao9303";

describe("ICAO 9303 TD-1 Data Parsing & Validation", () => {
  it("calculates correct check digits according to 7-3-1 weight pattern", () => {
    expect(calculateIcaoCheckDigit("520727")).toBe("3");
    expect(calculateIcaoCheckDigit("D23145890")).toBe("7");
  });

  it("generates formatted 3-line TD-1 MRZ data with exact 30 chars per line", () => {
    const generated = generateTd1Mrz({
      documentCode: "ID",
      issuingState: "APT",
      documentNumber: "0942",
      birthDate: "950412",
      sex: "M",
      expiryDate: "300828",
      nationality: "APT",
      surname: "MERCER",
      givenNames: "ALEX",
    });

    expect(generated.lines).toHaveLength(3);
    expect(generated.lines[0]).toHaveLength(30);
    expect(generated.lines[1]).toHaveLength(30);
    expect(generated.lines[2]).toHaveLength(30);
    expect(generated.lines[0].startsWith("IDAPT0942<<<<")).toBe(true);
    expect(generated.lines[2].startsWith("MERCER<<ALEX")).toBe(true);
  });

  it("validates line count and 30-character length constraints", () => {
    const validResult = validateTd1Mrz([
      "IDAPT0942<<<<<4<<<<<<<<<<<<<<<",
      "2608284M3008287APT<<<<<<<<<<<4",
      "MERCER<<ALEX<<<<<<<<<<<<<<<<<<",
    ]);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toHaveLength(0);

    const invalidResult = validateTd1Mrz([
      "SHORT_LINE",
      "2608284M3008287APT<<<<<<<<<<<4",
      "MERCER<<ALEX<<<<<<<<<<<<<<<<<<",
    ]);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);
  });
});
