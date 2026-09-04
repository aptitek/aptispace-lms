import { describe, it, expect } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";
import "~/i18n";
import {
  CalendarHeaderTooltips,
  CalendarTooltips,
  resolveButtonTarget,
  resolveBadgeTarget,
} from "./planning.tooltips";

interface MockNode {
  className?: string;
  classList?: { contains: (name: string) => boolean };
  parentElement?: MockNode | MockContainer | null;
  getAttribute?: (attr: string) => string | null;
  querySelector?: (selector: string) => null;
  closest?: (selector: string) => MockNode | null;
  getBoundingClientRect?: () => {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
}

interface MockContainer {
  contains: (target: unknown) => boolean;
}

function matchesSelectorPart(node: MockNode, part: string): boolean {
  const trimmed = part.trim();
  if (trimmed.startsWith(".")) {
    return Boolean(node.className?.split(" ").includes(trimmed.slice(1)));
  }
  if (trimmed.startsWith("[")) {
    const match = trimmed.match(/\[([a-zA-Z0-9_-]+)(?:=['"]([^'"]+)['"])?\]/);
    if (!match) return false;
    const [, attr, val] = match;
    const attrVal = node.getAttribute?.(attr);
    return val ? attrVal === val : Boolean(attrVal);
  }
  return Boolean(trimmed && node.className?.includes(trimmed));
}

function matchesSelector(node: MockNode, selector: string): boolean {
  return selector.split(",").some((part) => matchesSelectorPart(node, part));
}

function createMockElement(
  className = "",
  parent: MockNode | MockContainer | null = null,
  attrs: Record<string, string> = {},
  rect: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
  } = {},
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
    getBoundingClientRect: () => ({
      top: rect.top ?? 100,
      bottom: rect.bottom ?? (rect.top ?? 100) + (rect.height ?? 80),
      left: rect.left ?? 200,
      right: rect.right ?? (rect.left ?? 200) + (rect.width ?? 150),
      width: rect.width ?? 150,
      height: rect.height ?? 80,
    }),
    closest: (selector: string): MockNode | null => {
      let cur: MockNode | MockContainer | null | undefined = el;
      while (cur) {
        const node = cur as MockNode;
        if (matchesSelector(node, selector)) return node;
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

describe("CalendarHeaderTooltips Component", () => {
  it("exports CalendarHeaderTooltips and CalendarTooltips components", () => {
    expect(CalendarHeaderTooltips).toBeDefined();
    expect(CalendarTooltips).toBeDefined();
    expect(typeof CalendarHeaderTooltips).toBe("function");
    expect(CalendarTooltips).toBe(CalendarHeaderTooltips);
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
});

describe("resolveButtonTarget", () => {
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

describe("resolveBadgeTarget", () => {
  it("resolves remote badge when mouse is within the badge hit zone", () => {
    const container = createMockContainer();
    const eventEl = createMockElement(
      "MuiEventCalendar-timeGridEvent event-remote",
      container,
      {},
      { left: 200, top: 100, width: 150, height: 80 },
    );

    // Hover at center of badge: x = 336, y = 114
    const resolved = resolveBadgeTarget(
      eventEl as unknown as EventTarget,
      336,
      114,
      container as unknown as HTMLElement,
    );

    expect(resolved).not.toBeNull();
    expect(resolved?.type).toBe("badge");
    expect(resolved?.isRemote).toBe(true);
    expect(resolved?.element).toBe(eventEl);

    const anchorRect = resolved?.virtualAnchor.getBoundingClientRect();
    expect(anchorRect?.width).toBe(18);
    expect(anchorRect?.height).toBe(18);
    expect(anchorRect?.right).toBe(345);
    expect(anchorRect?.left).toBe(327);
    expect(anchorRect?.top).toBe(105);
    expect(anchorRect?.bottom).toBe(123);
  });

  it("resolves in-person badge when mouse is within the badge hit zone", () => {
    const container = createMockContainer();
    const eventEl = createMockElement(
      "MuiEventCalendar-timeGridEvent event-in-person",
      container,
      {},
      { left: 200, top: 100, width: 150, height: 80 },
    );

    const resolved = resolveBadgeTarget(
      eventEl as unknown as EventTarget,
      336,
      114,
      container as unknown as HTMLElement,
    );

    expect(resolved).not.toBeNull();
    expect(resolved?.type).toBe("badge");
    expect(resolved?.isRemote).toBe(false);
  });

  it("resolves badge when mouse targets an internal child element inside the event", () => {
    const container = createMockContainer();
    const eventEl = createMockElement(
      "MuiEventCalendar-timeGridEvent event-remote",
      container,
      {},
      { left: 200, top: 100, width: 150, height: 80 },
    );
    const titleEl = createMockElement(
      "MuiEventCalendar-timeGridEventTitle",
      eventEl,
    );

    const resolved = resolveBadgeTarget(
      titleEl as unknown as EventTarget,
      336,
      114,
      container as unknown as HTMLElement,
    );

    expect(resolved).not.toBeNull();
    expect(resolved?.type).toBe("badge");
    expect(resolved?.element).toBe(eventEl);
  });

  it("returns null when mouse is on the event but outside the badge hit zone", () => {
    const container = createMockContainer();
    const eventEl = createMockElement(
      "MuiEventCalendar-timeGridEvent event-remote",
      container,
      {},
      { left: 200, top: 100, width: 150, height: 80 },
    );

    const resolved = resolveBadgeTarget(
      eventEl as unknown as EventTarget,
      250,
      140,
      container as unknown as HTMLElement,
    );

    expect(resolved).toBeNull();
  });

  it("resolves 14px badge in DayGrid (month view)", () => {
    const container = createMockContainer();
    const eventEl = createMockElement(
      "MuiEventCalendar-dayGridEvent event-remote",
      container,
      {},
      { left: 200, top: 100, width: 150, height: 26 },
    );

    const resolved = resolveBadgeTarget(
      eventEl as unknown as EventTarget,
      340,
      113,
      container as unknown as HTMLElement,
    );

    expect(resolved).not.toBeNull();
    const rect = resolved?.virtualAnchor.getBoundingClientRect();
    expect(rect?.width).toBe(14);
    expect(rect?.height).toBe(14);
  });

  it("resolves 22px badge in Agenda view", () => {
    const container = createMockContainer();
    const listItem = createMockElement(
      "MuiEventCalendar-agendaViewEventListItem",
      container,
    );
    const eventEl = createMockElement(
      "event-remote",
      listItem,
      {},
      { left: 200, top: 100, width: 500, height: 48 },
    );

    const resolved = resolveBadgeTarget(
      eventEl as unknown as EventTarget,
      677,
      124,
      container as unknown as HTMLElement,
    );

    expect(resolved).not.toBeNull();
    const rect = resolved?.virtualAnchor.getBoundingClientRect();
    expect(rect?.width).toBe(22);
    expect(rect?.height).toBe(22);
  });

  it("resolves 16px badge for short under-hour events", () => {
    const container = createMockContainer();
    const eventEl = createMockElement(
      "MuiEventCalendar-timeGridEvent event-in-person",
      container,
      { "data-under-hour": "true" },
      { left: 200, top: 100, width: 150, height: 28 },
    );

    const resolved = resolveBadgeTarget(
      eventEl as unknown as EventTarget,
      338,
      114,
      container as unknown as HTMLElement,
    );

    expect(resolved).not.toBeNull();
    const rect = resolved?.virtualAnchor.getBoundingClientRect();
    expect(rect?.width).toBe(16);
    expect(rect?.height).toBe(16);
  });

  it("returns null when element has 0 dimensions or is outside container", () => {
    const container = createMockContainer();
    const zeroEl = createMockElement(
      "MuiEventCalendar-timeGridEvent event-remote",
      container,
      {},
      { width: 0, height: 0 },
    );

    expect(
      resolveBadgeTarget(
        zeroEl as unknown as EventTarget,
        10,
        10,
        container as unknown as HTMLElement,
      ),
    ).toBeNull();

    const outsideContainer = createMockContainer();
    const outsideEl = createMockElement(
      "MuiEventCalendar-timeGridEvent event-remote",
      outsideContainer,
    );

    expect(
      resolveBadgeTarget(
        outsideEl as unknown as EventTarget,
        336,
        114,
        container as unknown as HTMLElement,
      ),
    ).toBeNull();
  });
});
