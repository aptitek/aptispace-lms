import { describe, it, expect } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";
import "~/i18n";
import {
  CalendarHeaderTooltips,
  resolveButtonTarget,
} from "./planning.tooltips";

describe("CalendarHeaderTooltips Component", () => {
  it("exports CalendarHeaderTooltips component", () => {
    expect(CalendarHeaderTooltips).toBeDefined();
    expect(typeof CalendarHeaderTooltips).toBe("function");
  });

  it("renders without error when containerRef is provided", () => {
    const containerRef = { current: null };
    const element = React.createElement(CalendarHeaderTooltips, {
      containerRef,
    });
    expect(element).toBeDefined();
    const html = ReactDOMServer.renderToString(element);
    expect(html).toBe("");
  });

  describe("resolveButtonTarget", () => {
    interface MockNode {
      className?: string;
      classList?: { contains: (name: string) => boolean };
      parentElement?: MockNode | MockContainer | null;
      getAttribute?: (attr: string) => string | null;
      querySelector?: (selector: string) => null;
      closest?: (selector: string) => MockNode | null;
    }

    interface MockContainer {
      contains: (target: unknown) => boolean;
    }

    function createMockElement(
      className = "",
      parent: MockNode | MockContainer | null = null,
      attrs: Record<string, string> = {},
    ): MockNode {
      const el: MockNode = {
        className,
        classList: {
          contains: (name: string) =>
            el.className?.split(" ").includes(name) ?? false,
        },
        parentElement: parent,
        getAttribute: (attr: string) => attrs[attr] || null,
        querySelector: () => null,
        closest: (selector: string): MockNode | null => {
          let cur: MockNode | MockContainer | null | undefined = el;
          while (cur) {
            const node = cur as MockNode;
            if (
              selector.includes(
                "MuiEventCalendar-headerToolbarSidePanelToggle",
              ) &&
              node.className?.includes(
                "MuiEventCalendar-headerToolbarSidePanelToggle",
              )
            ) {
              return node;
            }
            if (
              selector.includes("MuiEventCalendar-preferencesMenuButton") &&
              node.className?.includes("MuiEventCalendar-preferencesMenuButton")
            ) {
              return node;
            }
            cur = node.parentElement;
          }
          return null;
        },
      };
      return el;
    }

    function createMockContainer(): MockContainer {
      const container: MockContainer = {
        contains: (target: unknown) => {
          let cur = target as MockNode | null | undefined;
          while (cur) {
            if (cur === (container as unknown as MockNode)) return true;
            cur = cur.parentElement as MockNode | null | undefined;
          }
          return false;
        },
      };
      return container;
    }

    it("resolves target when hovering directly over the button", () => {
      const container = createMockContainer();
      const btn = createMockElement(
        "MuiEventCalendar-headerToolbarSidePanelToggle",
        container,
      );

      const resolved = resolveButtonTarget(
        btn as unknown as EventTarget,
        container as unknown as HTMLElement,
      );
      expect(resolved).not.toBeNull();
      expect(resolved?.type).toBe("sidebar");
      expect(resolved?.element).toBe(btn);
      expect(resolved?.isClose).toBe(false);
    });

    it("resolves target when hovering directly on the SVG icon itself", () => {
      const container = createMockContainer();
      const btn = createMockElement(
        "MuiEventCalendar-headerToolbarSidePanelToggle",
        container,
      );
      const svg = createMockElement("MuiSvgIcon-root", btn);

      const resolved = resolveButtonTarget(
        svg as unknown as EventTarget,
        container as unknown as HTMLElement,
      );
      expect(resolved).not.toBeNull();
      expect(resolved?.type).toBe("sidebar");
      expect(resolved?.element).toBe(btn);
    });

    it("resolves target when hovering directly on an SVG path inside the icon", () => {
      const container = createMockContainer();
      const btn = createMockElement(
        "MuiEventCalendar-preferencesMenuButton",
        container,
      );
      const svg = createMockElement("MuiSvgIcon-root", btn);
      const path = createMockElement("MuiSvgPath", svg);

      const resolved = resolveButtonTarget(
        path as unknown as EventTarget,
        container as unknown as HTMLElement,
      );
      expect(resolved).not.toBeNull();
      expect(resolved?.type).toBe("settings");
      expect(resolved?.element).toBe(btn);
    });

    it("detects expanded / close state for sidebar toggle", () => {
      const container = createMockContainer();
      const btn = createMockElement(
        "MuiEventCalendar-headerToolbarSidePanelToggle",
        container,
        { "aria-expanded": "true" },
      );

      const resolved = resolveButtonTarget(
        btn as unknown as EventTarget,
        container as unknown as HTMLElement,
      );
      expect(resolved?.isClose).toBe(true);
    });

    it("returns null for non-matching elements or outside targets", () => {
      const container = createMockContainer();
      const other = createMockElement("other-element", container);

      expect(
        resolveButtonTarget(
          other as unknown as EventTarget,
          container as unknown as HTMLElement,
        ),
      ).toBeNull();
      expect(
        resolveButtonTarget(null, container as unknown as HTMLElement),
      ).toBeNull();

      const outsideContainer = createMockContainer();
      const outsideBtn = createMockElement(
        "MuiEventCalendar-headerToolbarSidePanelToggle",
        outsideContainer,
      );
      expect(
        resolveButtonTarget(
          outsideBtn as unknown as EventTarget,
          container as unknown as HTMLElement,
        ),
      ).toBeNull();
    });
  });
});
