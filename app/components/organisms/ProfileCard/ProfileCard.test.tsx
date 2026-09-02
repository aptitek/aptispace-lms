import { describe, it, expect, vi } from "vitest";
import React from "react";
import ProfileCard from "./ProfileCard";
import type { ProfileCardProps } from "./ProfileCard.types";

describe("ProfileCard Organism", () => {
  it("exports ProfileCard component properly", () => {
    expect(ProfileCard).toBeDefined();
    expect(typeof ProfileCard).toBe("function");
    expect(ProfileCard.name).toBe("ProfileCard");
  });

  it("creates React element with student props including cohortName and year", () => {
    const onChangeMock = vi.fn();
    const onAvatarEditMock = vi.fn();

    const element = React.createElement(ProfileCard, {
      firstName: "Alex",
      familyName: "MERCER",
      emailPrefix: "alex.mercer",
      emailDomain: "@aptispace.com",
      role: "student",
      cohortName: "Web Development",
      year: "2026",
      institutionName: "AptiSpace Academy",
      onChange: onChangeMock,
      onAvatarEdit: onAvatarEditMock,
    });

    expect(element).toBeDefined();
    const props = element.props as ProfileCardProps;
    expect(props.firstName).toBe("Alex");
    expect(props.familyName).toBe("MERCER");
    expect(props.role).toBe("student");
    expect(props.cohortName).toBe("Web Development");
    expect(props.year).toBe("2026");
  });

  it("creates React element with instructor role", () => {
    const element = React.createElement(ProfileCard, {
      firstName: "Sarah",
      familyName: "CONNOR",
      role: "instructor",
      institutionName: "AptiSpace Academy",
    });

    expect(element).toBeDefined();
    const props = element.props as ProfileCardProps;
    expect(props.firstName).toBe("Sarah");
    expect(props.familyName).toBe("CONNOR");
    expect(props.role).toBe("instructor");
  });

  it("creates React element with admin role", () => {
    const element = React.createElement(ProfileCard, {
      firstName: "Ada",
      familyName: "LOVELACE",
      role: "admin",
      institutionName: "AptiSpace Academy",
    });

    expect(element).toBeDefined();
    const props = element.props as ProfileCardProps;
    expect(props.firstName).toBe("Ada");
    expect(props.familyName).toBe("LOVELACE");
    expect(props.role).toBe("admin");
  });
});
