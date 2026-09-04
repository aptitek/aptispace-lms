import React, { useState, useEffect, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";

export interface CalendarHeaderTooltipsProps {
  containerRef: RefObject<HTMLElement | null>;
}

interface ActiveButtonTooltip {
  type: "sidebar" | "settings";
  element: HTMLElement;
  isClose?: boolean;
}

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

export function CalendarHeaderTooltips({
  containerRef,
}: CalendarHeaderTooltipsProps) {
  const { t } = useTranslation("common");
  const [active, setActive] = useState<ActiveButtonTooltip | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseOver = (e: MouseEvent) => {
      const match = resolveButtonTarget(e.target, container);
      if (match) {
        setActive((prev) => {
          if (
            prev &&
            prev.element === match.element &&
            prev.type === match.type &&
            prev.isClose === match.isClose
          ) {
            return prev;
          }
          return match;
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as EventTarget | null;
      if (related && resolveButtonTarget(related, container)) return;
      setActive(null);
    };

    const handleFocusIn = (e: FocusEvent) => {
      const match = resolveButtonTarget(e.target, container);
      if (match) setActive(match);
    };

    const handleClear = () => setActive(null);

    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    container.addEventListener("focusin", handleFocusIn);
    container.addEventListener("focusout", handleClear);
    container.addEventListener("click", handleClear);

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("focusin", handleFocusIn);
      container.removeEventListener("focusout", handleClear);
      container.removeEventListener("click", handleClear);
    };
  }, [containerRef]);

  if (!active) return null;

  const tooltipTitle =
    active.type === "sidebar"
      ? active.isClose
        ? t("planning.tooltips.collapseSidebar", "Collapse sidebar")
        : t("planning.tooltips.expandSidebar", "Expand sidebar")
      : t("planning.tooltips.settings", "Calendar settings");

  return (
    <Tooltip
      open={Boolean(active)}
      title={tooltipTitle}
      arrow
      placement="bottom"
      slotProps={{
        popper: {
          anchorEl: active.element,
          sx: { pointerEvents: "none" },
        },
      }}
    >
      <span
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: 0,
          height: 0,
          opacity: 0,
        }}
      />
    </Tooltip>
  );
}
