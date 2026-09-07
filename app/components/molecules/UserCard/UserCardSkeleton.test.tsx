import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import UserCardSkeleton from "./UserCardSkeleton";

describe("UserCardSkeleton Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports UserCardSkeleton component properly", () => {
    expect(UserCardSkeleton).toBeDefined();
    expect(typeof UserCardSkeleton).toBe("function");
    expect(UserCardSkeleton.name).toBe("UserCardSkeleton");
  });

  it("renders loading shimmer skeleton by default", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <UserCardSkeleton testId="user-card-skeleton" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("user-card-skeleton");
    expect(skeletonCard).toBeDefined();
    expect(skeletonCard.getAttribute("role")).toBe("presentation");
    expect(skeletonCard.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByTestId("user-card-skeleton-fab")).toBeNull();
  });

  it("renders interactive ghost button when variant='ghost' and onClick is provided", () => {
    const onAdd = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <UserCardSkeleton
            variant="ghost"
            onClick={onAdd}
            tooltipTitle="Add New User"
            testId="user-skeleton-ghost"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("user-skeleton-ghost");
    expect(skeletonCard).toBeDefined();
    expect(skeletonCard.getAttribute("role")).toBe("button");
    expect(skeletonCard.getAttribute("aria-label")).toBe("Add New User");

    const fab = screen.getByTestId("user-skeleton-ghost-fab");
    expect(fab).toBeDefined();

    fireEvent.click(skeletonCard);
    expect(onAdd).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(skeletonCard, { key: "Enter" });
    expect(onAdd).toHaveBeenCalledTimes(2);
  });

  it("renders static placeholder variant without ghost controls", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <UserCardSkeleton
            variant="static"
            animated={false}
            opacity={0.35}
            testId="user-skeleton-static"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("user-skeleton-static");
    expect(skeletonCard).toBeDefined();
    expect(screen.queryByTestId("user-skeleton-static-fab")).toBeNull();
  });
});
