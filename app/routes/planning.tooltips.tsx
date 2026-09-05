import React, { useState, useEffect, type RefObject } from "react";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";

const HiddenTooltipAnchor = styled("span")({
  position: "fixed",
  pointerEvents: "none",
  width: 0,
  height: 0,
  opacity: 0,
});

export interface CalendarHeaderTooltipsProps {
  containerRef: RefObject<HTMLElement | null>;
}

export interface ActiveButtonTooltip {
  type: "sidebar" | "settings";
  element: HTMLElement;
  isClose?: boolean;
}

export interface ActiveBadgeTooltip {
  type: "badge";
  isRemote: boolean;
  element: HTMLElement;
  virtualAnchor: {
    getBoundingClientRect: () => DOMRect;
    contextElement?: HTMLElement;
  };
}

export type ActiveTooltip = ActiveButtonTooltip | ActiveBadgeTooltip;

function extractCandidate(
  target: EventTarget | null,
): (HTMLElement | SVGElement) | null {
  if (!target || typeof target !== "object") return null;
  if (
    "closest" in target &&
    typeof (target as { closest?: unknown }).closest === "function"
  ) {
    return target as HTMLElement | SVGElement;
  }
  const parent = (target as { parentElement?: HTMLElement | null })
    .parentElement;
  if (parent && typeof parent.closest === "function") {
    return parent;
  }
  return null;
}

function isSidebarCloseAction(btn: HTMLElement): boolean {
  if (btn.getAttribute("aria-expanded") === "true") return true;
  const label = btn.getAttribute("aria-label")?.toLowerCase() || "";
  if (label.includes("close") || label.includes("fermer")) return true;
  return Boolean(btn.querySelector('svg[data-testid="MenuOpenIcon"]'));
}

export function resolveButtonTarget(
  target: EventTarget | null,
  container: HTMLElement,
): ActiveButtonTooltip | null {
  const candidate = extractCandidate(target);
  if (!candidate) return null;

  const btn = candidate.closest<HTMLElement>(
    ".MuiEventCalendar-headerToolbarSidePanelToggle, .MuiEventCalendar-preferencesMenuButton",
  );
  if (!btn || !container.contains(btn)) return null;

  if (btn.classList.contains("MuiEventCalendar-headerToolbarSidePanelToggle")) {
    return {
      type: "sidebar",
      element: btn,
      isClose: isSidebarCloseAction(btn),
    };
  }

  if (btn.classList.contains("MuiEventCalendar-preferencesMenuButton")) {
    return { type: "settings", element: btn };
  }

  return null;
}

interface BadgeLayout {
  width: number;
  height: number;
  right: number;
  top: number;
}

function getBadgeLayout(eventEl: HTMLElement, rect: DOMRect): BadgeLayout {
  if (eventEl.classList.contains("MuiEventCalendar-dayGridEvent")) {
    return {
      width: 14,
      height: 14,
      right: rect.right - 3,
      top: rect.top + (rect.height - 14) / 2,
    };
  }
  if (eventEl.closest(".MuiEventCalendar-agendaViewEventListItem")) {
    return {
      width: 22,
      height: 22,
      right: rect.right - 12,
      top: rect.top + (rect.height - 22) / 2,
    };
  }
  if (eventEl.getAttribute("data-under-hour") === "true") {
    return {
      width: 16,
      height: 16,
      right: rect.right - 4,
      top: rect.top + (rect.height - 16) / 2,
    };
  }
  return {
    width: 18,
    height: 18,
    right: rect.right - 5,
    top: rect.top + 5,
  };
}

interface BadgeHitArea {
  clientX: number;
  clientY: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  margin?: number;
}

function isPointInBadgeArea(area: BadgeHitArea): boolean {
  const margin = area.margin ?? 5;
  return (
    area.clientX >= area.left - margin &&
    area.clientX <= area.right + margin &&
    area.clientY >= area.top - margin &&
    area.clientY <= area.bottom + margin
  );
}

export function resolveBadgeTarget(
  target: EventTarget | null,
  clientX: number,
  clientY: number,
  container: HTMLElement,
): ActiveBadgeTooltip | null {
  const candidate = extractCandidate(target);
  if (!candidate) return null;

  const eventEl = candidate.closest<HTMLElement>(
    ".event-remote, .event-in-person, [data-palette='blue'], [data-palette='green']",
  );
  if (!eventEl || !container.contains(eventEl)) return null;

  const isRemote =
    eventEl.classList.contains("event-remote") ||
    eventEl.getAttribute("data-palette") === "blue";

  const rect = eventEl.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;

  const layout = getBadgeLayout(eventEl, rect);
  const badgeLeft = layout.right - layout.width;
  const badgeBottom = layout.top + layout.height;

  if (
    !isPointInBadgeArea({
      clientX,
      clientY,
      left: badgeLeft,
      right: layout.right,
      top: layout.top,
      bottom: badgeBottom,
    })
  ) {
    return null;
  }

  return {
    type: "badge",
    isRemote,
    element: eventEl,
    virtualAnchor: {
      getBoundingClientRect: () =>
        ({
          top: layout.top,
          bottom: badgeBottom,
          left: badgeLeft,
          right: layout.right,
          width: layout.width,
          height: layout.height,
          x: badgeLeft,
          y: layout.top,
          toJSON: () => {},
        }) as DOMRect,
      contextElement: eventEl,
    },
  };
}

export function CalendarHeaderTooltips({
  containerRef,
}: CalendarHeaderTooltipsProps) {
  const { t } = useTranslation("common");
  const [active, setActive] = useState<ActiveTooltip | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      // If hovering near a badge, resolve it
      const badgeMatch = resolveBadgeTarget(
        e.target,
        e.clientX,
        e.clientY,
        container,
      );
      if (badgeMatch) {
        setActive((prev) => {
          if (
            prev &&
            prev.type === "badge" &&
            prev.element === badgeMatch.element &&
            prev.isRemote === badgeMatch.isRemote
          ) {
            return prev;
          }
          return badgeMatch;
        });
        return;
      }

      // If mouse moved away from badge zone, clear active badge tooltip
      setActive((prev) => (prev?.type === "badge" ? null : prev));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const buttonMatch = resolveButtonTarget(e.target, container);
      if (buttonMatch) {
        setActive((prev) => {
          if (
            prev &&
            prev.type === buttonMatch.type &&
            prev.element === buttonMatch.element &&
            prev.isClose === buttonMatch.isClose
          ) {
            return prev;
          }
          return buttonMatch;
        });
        return;
      }

      const badgeMatch = resolveBadgeTarget(
        e.target,
        e.clientX,
        e.clientY,
        container,
      );
      if (badgeMatch) {
        setActive(badgeMatch);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as EventTarget | null;
      if (related && resolveButtonTarget(related, container)) return;
      if (
        related &&
        resolveBadgeTarget(related, e.clientX, e.clientY, container)
      )
        return;
      setActive(null);
    };

    const handleFocusIn = (e: FocusEvent) => {
      const match = resolveButtonTarget(e.target, container);
      if (match) setActive(match);
    };

    const handleClear = () => setActive(null);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    container.addEventListener("focusin", handleFocusIn);
    container.addEventListener("focusout", handleClear);
    container.addEventListener("click", handleClear);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("focusin", handleFocusIn);
      container.removeEventListener("focusout", handleClear);
      container.removeEventListener("click", handleClear);
    };
  }, [containerRef]);

  if (!active) return null;

  let tooltipTitle = "";
  if (active.type === "sidebar") {
    tooltipTitle = active.isClose
      ? t("planning.tooltips.collapseSidebar", "Collapse sidebar")
      : t("planning.tooltips.expandSidebar", "Expand sidebar");
  } else if (active.type === "settings") {
    tooltipTitle = t("planning.tooltips.settings", "Calendar settings");
  } else if (active.type === "badge") {
    tooltipTitle = active.isRemote
      ? t("planning.tooltips.remoteBadge", "Remote Class")
      : t("planning.tooltips.inPersonBadge", "In-Person Class");
  }

  const anchorEl =
    active.type === "badge" ? active.virtualAnchor : active.element;
  const placement = active.type === "badge" ? "top" : "bottom";

  return (
    <Tooltip
      open={Boolean(active)}
      title={tooltipTitle}
      arrow
      placement={placement}
      slotProps={{
        popper: {
          anchorEl: anchorEl as unknown as HTMLElement,
          sx: { pointerEvents: "none" },
        },
      }}
    >
      <HiddenTooltipAnchor />
    </Tooltip>
  );
}

export { CalendarHeaderTooltips as CalendarTooltips };
