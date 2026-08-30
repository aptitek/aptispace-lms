import { describe, it, expect } from "vitest";
import EcgTelemetry from "~/components/atoms/StatusCenter/EcgTelemetry";
import M3Snackbar from "./M3Snackbar";
import StatusGatewayTrigger from "./StatusGatewayTrigger";

describe("StatusCenter Molecule Components", () => {
  it("exports EcgTelemetry properly", () => {
    expect(EcgTelemetry).toBeDefined();
    expect(typeof EcgTelemetry).toBe("function");
  });

  it("exports M3Snackbar properly", () => {
    expect(M3Snackbar).toBeDefined();
    expect(typeof M3Snackbar).toBe("function");
  });

  it("exports StatusGatewayTrigger properly", () => {
    expect(StatusGatewayTrigger).toBeDefined();
    expect(typeof StatusGatewayTrigger).toBe("function");
  });
});
