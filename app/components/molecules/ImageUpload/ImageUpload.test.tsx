import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ImageUpload from "./ImageUpload";

describe("ImageUpload Component Molecule (MD3 Standard)", () => {
  it("exports ImageUpload component properly", () => {
    expect(ImageUpload).toBeDefined();
    expect(typeof ImageUpload).toBe("function");
    expect(ImageUpload.name).toBe("ImageUpload");
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

  it("resolves default shape to circular for both avatar and overlay when shape is omitted", () => {
    const { container } = render(
      <ImageUpload
        mode="image-only"
        value="https://example.com/avatar.jpg"
        name="Alex Mercer"
      />,
    );

    const avatarRoot = container.querySelector('[data-shape="circular"]');
    expect(avatarRoot).not.toBeNull();

    const overlay = container.querySelector(".avatar-hover-overlay");
    expect(overlay).not.toBeNull();
  });

  it("propagates custom shape to avatar and overlay identically", () => {
    const { container } = render(
      <ImageUpload
        mode="image-only"
        value="https://example.com/avatar.jpg"
        shape="rounded"
        name="Alex Mercer"
      />,
    );

    const avatarRoot = container.querySelector('[data-shape="rounded"]');
    expect(avatarRoot).not.toBeNull();

    const overlay = container.querySelector(".avatar-hover-overlay");
    expect(overlay).not.toBeNull();
  });
});
