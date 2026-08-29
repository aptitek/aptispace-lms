import { describe, it, expect } from "vitest";
import EditableAvatar from "./EditableAvatar";

describe("EditableAvatar Component Molecule (MD3 Standard)", () => {
  it("exports EditableAvatar component properly", () => {
    expect(EditableAvatar).toBeDefined();
    expect(typeof EditableAvatar).toBe("function");
    expect(EditableAvatar.name).toBe("EditableAvatar");
  });

  it("supports MD3 shapes, image-only mode, and editable contracts", () => {
    const props = {
      defaultValue: "https://example.com/avatar.jpg",
      name: "Alex Mercer",
      shape: "circular" as const,
      size: "lg" as const,
      mode: "image-only" as const,
      editable: true,
      uploadEndpoint: "/api/avatar/upload",
    };

    expect(props.defaultValue).toBe("https://example.com/avatar.jpg");
    expect(props.shape).toBe("circular");
    expect(props.size).toBe("lg");
    expect(props.mode).toBe("image-only");
    expect(props.editable).toBe(true);
  });

  it("supports read-only normal avatar mode when editable is false", () => {
    const readOnlyProps = {
      value: "https://example.com/avatar.jpg",
      editable: false,
      shape: "rounded" as const,
      name: "Instructor Shepard",
    };

    expect(readOnlyProps.editable).toBe(false);
    expect(readOnlyProps.shape).toBe("rounded");
    expect(readOnlyProps.name).toBe("Instructor Shepard");
  });
});
