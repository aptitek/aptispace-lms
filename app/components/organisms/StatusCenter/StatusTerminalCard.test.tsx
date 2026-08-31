import { describe, it, expect } from "vitest";
import StatusTerminalCard from "./StatusTerminalCard";
import { StatusTerminalHeader } from "./StatusTerminalHeader";
import { StatusTerminalInfrastructure } from "./StatusTerminalInfrastructure";
import { StatusTerminalFilterChips } from "./StatusTerminalFilterChips";
import { StatusTerminalEventRow } from "./StatusTerminalEventRow";
import { StatusTerminalDetails } from "./StatusTerminalDetails";

describe("StatusTerminalCard Organism Components", () => {
  it("exports StatusTerminalCard properly", () => {
    expect(StatusTerminalCard).toBeDefined();
    expect(typeof StatusTerminalCard).toBe("function");
  });

  it("exports StatusTerminal subcomponents properly", () => {
    expect(StatusTerminalHeader).toBeDefined();
    expect(StatusTerminalInfrastructure).toBeDefined();
    expect(StatusTerminalFilterChips).toBeDefined();
    expect(StatusTerminalEventRow).toBeDefined();
    expect(StatusTerminalDetails).toBeDefined();
  });
});
