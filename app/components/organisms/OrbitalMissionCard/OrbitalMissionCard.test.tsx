import { describe, it, expect } from "vitest";
import OrbitalMissionCard from "./OrbitalMissionCard";

describe("OrbitalMissionCard component", () => {
  it("exports OrbitalMissionCard component", () => {
    expect(OrbitalMissionCard).toBeDefined();
    expect(typeof OrbitalMissionCard).toBe("function");
  });
});
