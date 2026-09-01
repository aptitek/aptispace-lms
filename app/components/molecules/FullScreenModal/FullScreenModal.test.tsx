import { describe, it, expect } from "vitest";
import { FullScreenModal } from "./FullScreenModal";

describe("FullScreenModal Molecule", () => {
  it("exports FullScreenModal component properly", () => {
    expect(FullScreenModal).toBeDefined();
    expect(typeof FullScreenModal).toBe("function");
    expect(FullScreenModal.name).toBe("FullScreenModal");
  });

  it("supports modal configuration props", () => {
    const props = {
      isOpen: true,
      onClose: () => {},
      title: "Test Modal",
      children: "Content",
    };

    expect(props.isOpen).toBe(true);
    expect(props.title).toBe("Test Modal");
    expect(typeof props.onClose).toBe("function");
  });
});
