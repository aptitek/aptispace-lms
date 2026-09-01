import { describe, it, expect } from "vitest";
import EcgTelemetry from "~/components/atoms/StatusCenter/EcgTelemetry";
import StatusSnackbar from "./StatusSnackbar";
import StatusGatewayTrigger from "./StatusGatewayTrigger";

describe("StatusCenter Molecule Components", () => {
  it("exports EcgTelemetry properly", () => {
    expect(EcgTelemetry).toBeDefined();
    expect(typeof EcgTelemetry).toBe("function");
  });

  it("exports StatusSnackbar properly", () => {
    expect(StatusSnackbar).toBeDefined();
    expect(typeof StatusSnackbar).toBe("function");
  });

  it("exports StatusGatewayTrigger properly", () => {
    expect(StatusGatewayTrigger).toBeDefined();
    expect(typeof StatusGatewayTrigger).toBe("function");
  });
});
