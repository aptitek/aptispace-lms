import { describe, it, expect } from "vitest";
import { LoadingIndicator } from "./index";

describe("LoadingIndicator", () => {
  it("exports LoadingIndicator properly", () => {
    expect(LoadingIndicator).toBeDefined();
    expect(typeof LoadingIndicator).toBe("function");
  });
});
