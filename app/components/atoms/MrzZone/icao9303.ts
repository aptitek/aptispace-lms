import type { Td1MrzData, MrzValidationResult } from "./MrzZone.types";

const ICAO_WEIGHTS = [7, 3, 1] as const;

export function calculateIcaoCheckDigit(input: string): string {
  let sum = 0;
  const upper = input.toUpperCase();

  for (let i = 0; i < upper.length; i += 1) {
    const char = upper[i];
    const weight = ICAO_WEIGHTS[i % ICAO_WEIGHTS.length];
    let charVal = 0;

    if (char >= "0" && char <= "9") {
      charVal = char.charCodeAt(0) - 48;
    } else if (char >= "A" && char <= "Z") {
      charVal = char.charCodeAt(0) - 55;
    }

    sum += charVal * weight;
  }

  return String(sum % 10);
}

function sanitizeField(input: string | undefined, length: number): string {
  if (!input) return "<".repeat(length);
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, "<");
  return clean.padEnd(length, "<").slice(0, length);
}

export function generateTd1Mrz(cardInput: Td1MrzData): {
  lines: [string, string, string];
} {
  const docCode = sanitizeField(cardInput.documentCode || "ID", 2);
  const state = sanitizeField(cardInput.issuingState || "APT", 3);
  const docNum = sanitizeField(cardInput.documentNumber, 9);
  const docCheck = calculateIcaoCheckDigit(docNum);
  const opt1 = sanitizeField(cardInput.optional1, 15);

  const line1 = `${docCode}${state}${docNum}${docCheck}${opt1}`.slice(0, 30);

  const bDate = sanitizeField(cardInput.birthDate || "900101", 6);
  const bCheck = calculateIcaoCheckDigit(bDate);
  const gender = sanitizeField(cardInput.sex || "X", 1);
  const expDate = sanitizeField(cardInput.expiryDate || "300101", 6);
  const expCheck = calculateIcaoCheckDigit(expDate);
  const nat = sanitizeField(cardInput.nationality || "APT", 3);
  const opt2 = sanitizeField(cardInput.optional2, 11);
  const compositeSource = `${docNum}${docCheck}${opt1}${bDate}${bCheck}${expDate}${expCheck}${opt2}`;
  const compositeCheck = calculateIcaoCheckDigit(compositeSource);

  const line2 =
    `${bDate}${bCheck}${gender}${expDate}${expCheck}${nat}${opt2}${compositeCheck}`.slice(
      0,
      30,
    );

  const surname = sanitizeField(cardInput.surname, cardInput.surname.length);
  const given = sanitizeField(cardInput.givenNames, 30);
  const nameField = `${surname}<<${given}`;
  const line3 = sanitizeField(nameField, 30);

  return { lines: [line1, line2, line3] };
}

export function validateTd1Mrz(
  mrzLines: [string, string, string],
): MrzValidationResult {
  const errors: string[] = [];
  if (mrzLines.length !== 3) {
    return { isValid: false, errors: ["TD-1 MRZ requires exactly 3 lines"] };
  }

  const [l1, l2, l3] = mrzLines;
  if (l1.length !== 30 || l2.length !== 30 || l3.length !== 30) {
    errors.push("Each line in TD-1 MRZ must be exactly 30 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
