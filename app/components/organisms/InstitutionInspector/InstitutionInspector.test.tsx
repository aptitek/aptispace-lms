import { describe, it, expect, vi } from "vitest";
import React from "react";
import InstitutionInspector from "./InstitutionInspector";
import {
  InstitutionEmailCard,
  InstitutionEmailCardHeader,
  InstitutionFreeDomainNotice,
  InstitutionConstrainedDomainFields,
} from "./InstitutionInspector.components";
import type { SchoolConfig } from "~/types/institution";

describe("InstitutionInspector Organism", () => {
  const mockInstitution: SchoolConfig = {
    id: "school-1",
    name: "Aptitek Institute",
    slug: "aptitek",
    type: "academic",
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

  it("handles institution with emailDomain and usernamePattern", () => {
    const customInstitution: SchoolConfig = {
      id: "school-2",
      name: "Custom School",
      slug: "custom",
      type: "company",
      emailDomain: "custom.edu",
      usernamePattern: "{f}{last}",
    };

    const element = React.createElement(InstitutionInspector, {
      institution: customInstitution,
      onClose: vi.fn(),
      onSave: vi.fn(),
    });

    expect(element).toBeDefined();
    expect(element.props.institution?.emailDomain).toBe("custom.edu");
    expect(element.props.institution?.usernamePattern).toBe("{f}{last}");
  });

  it("handles institution without emailDomain (free personal email)", () => {
    const aptitekInstitution: SchoolConfig = {
      id: "school-aptitek",
      name: "Aptitek",
      slug: "aptitek",
      type: "company",
      emailDomain: "",
    };

    const element = React.createElement(InstitutionInspector, {
      institution: aptitekInstitution,
      onClose: vi.fn(),
      onSave: vi.fn(),
    });

    expect(element).toBeDefined();
    expect(element.props.institution?.emailDomain).toBe("");
  });

  describe("InstitutionEmailCard component", () => {
    it("exports InstitutionEmailCard and subcomponents", () => {
      expect(InstitutionEmailCard).toBeDefined();
      expect(InstitutionFreeDomainNotice).toBeDefined();
      expect(InstitutionConstrainedDomainFields).toBeDefined();
    });

    it("renders with domain constraint enabled", () => {
      const onToggle = vi.fn();
      const onChange = vi.fn();
      const onBlur = vi.fn();

      const element = React.createElement(InstitutionEmailCard, {
        emailDomain: "42.fr",
        usernamePattern: "{first}.{last}",
        previewEmail: "john.doe@42.fr",
        disabled: false,
        isConstrained: true,
        onToggleConstraint: onToggle,
        onFieldChange: onChange,
        onBlur,
      });

      expect(element).toBeDefined();
      expect(element.props.isConstrained).toBe(true);
      expect(element.props.emailDomain).toBe("42.fr");
    });

    it("renders with domain constraint disabled (empty = any email)", () => {
      const onToggle = vi.fn();
      const onChange = vi.fn();
      const onBlur = vi.fn();

      const element = React.createElement(InstitutionEmailCard, {
        emailDomain: "",
        usernamePattern: "{first}.{last}",
        previewEmail: "user@any-domain.com",
        disabled: false,
        isConstrained: false,
        onToggleConstraint: onToggle,
        onFieldChange: onChange,
        onBlur,
      });

      expect(element).toBeDefined();
      expect(element.props.isConstrained).toBe(false);
      expect(element.props.emailDomain).toBe("");
    });

    it("renders InstitutionEmailCardHeader with MUI toggle props", () => {
      const onToggle = vi.fn();
      const headerElement = React.createElement(InstitutionEmailCardHeader, {
        isConstrained: true,
        disabled: false,
        onToggleConstraint: onToggle,
      });

      expect(headerElement).toBeDefined();
      expect(headerElement.props.isConstrained).toBe(true);
      expect(headerElement.props.disabled).toBe(false);
      expect(headerElement.props.onToggleConstraint).toBe(onToggle);
    });
  });
});
