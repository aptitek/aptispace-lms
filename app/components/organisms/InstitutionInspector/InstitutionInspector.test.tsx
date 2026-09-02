import { describe, it, expect, vi } from "vitest";
import React from "react";
import InstitutionInspector from "./InstitutionInspector";
import type { SchoolConfig } from "~/types/institution";

describe("InstitutionInspector Organism", () => {
  const mockInstitution: SchoolConfig = {
    id: "school-1",
    name: "Aptitek Institute",
    slug: "aptitek",
    logoUrl: "/aptitek-logo.svg",
  };

  it("exports InstitutionInspector component properly", () => {
    expect(InstitutionInspector).toBeDefined();
    expect(typeof InstitutionInspector).toBe("function");
    expect(InstitutionInspector.name).toBe("InstitutionInspector");
  });

  it("creates React element with institution props for editing", () => {
    const onCloseMock = vi.fn();
    const onSaveMock = vi.fn();

    const element = React.createElement(InstitutionInspector, {
      institution: mockInstitution,
      onClose: onCloseMock,
      onSave: onSaveMock,
      isSubmitting: false,
    });

    expect(element).toBeDefined();
    expect(element.props.institution).toEqual(mockInstitution);
    expect(element.props.onClose).toBe(onCloseMock);
    expect(element.props.onSave).toBe(onSaveMock);
    expect(element.props.isSubmitting).toBe(false);
  });

  it("creates React element with add institution mode (no id)", () => {
    const newInstitution = {
      name: "",
      slug: "",
    } as unknown as SchoolConfig;

    const element = React.createElement(InstitutionInspector, {
      institution: newInstitution,
      onClose: vi.fn(),
      onSave: vi.fn(),
      isSubmitting: true,
    });

    expect(element).toBeDefined();
    expect(element.props.institution?.id).toBeUndefined();
    expect(element.props.isSubmitting).toBe(true);
  });
});
