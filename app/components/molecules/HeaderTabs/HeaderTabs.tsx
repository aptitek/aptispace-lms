import React, { useId } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  NavContainer,
  TabItemWrapper,
  TabButton,
  ActivePillIndicator,
  TabIconSlot,
  TabLabelSlot,
  MD3_TAB_SPRING,
} from "./HeaderTabs.styles";
import { DEFAULT_HEADER_TABS, resolveVisibleTabs } from "./HeaderTabs.config";
import type { HeaderTabItem, HeaderTabsProps } from "./HeaderTabs.types";

function isPathMatching(pathname: string, matchPaths: string[]): boolean {
  return matchPaths.some((target) => {
    if (target === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname === target || pathname.startsWith(`${target}/`);
  });
}

function resolveActiveTabId(pathname: string, tabs: HeaderTabItem[]): string {
  const matched = tabs.find((tab) => isPathMatching(pathname, tab.matchPaths));
  return matched ? matched.id : (tabs[0]?.id ?? "");
}

function useSafeLocation(): { pathname: string } {
  try {
    return useLocation();
  } catch {
    return { pathname: "/" };
  }
}

function useSafeNavigate() {
  try {
    return useNavigate();
  } catch {
    return () => {};
  }
}

export default function HeaderTabs({
  tabs = DEFAULT_HEADER_TABS,
  user,
  className,
  "data-testid": dataTestId = "header-tabs",
}: HeaderTabsProps) {
  const { t } = useTranslation(["common", "auth"]);
  const location = useSafeLocation();
  const navigate = useSafeNavigate();
  const layoutIdPrefix = useId();

  const visibleTabs = resolveVisibleTabs(tabs, user);
  const activeTabId = resolveActiveTabId(location.pathname, visibleTabs);

  if (visibleTabs.length === 0) {
    return null;
  }

  const handleTabClick = (tab: HeaderTabItem) => {
    if (tab.id !== activeTabId) {
      navigate(tab.to);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextTab = visibleTabs[(currentIndex + 1) % visibleTabs.length];
      if (nextTab) navigate(nextTab.to);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prevTab =
        visibleTabs[
          (currentIndex - 1 + visibleTabs.length) % visibleTabs.length
        ];
      if (prevTab) navigate(prevTab.to);
    }
  };

  return (
    <NavContainer
      className={className}
      data-testid={dataTestId}
      aria-label={t("common:nav.ariaLabel", "Primary application navigation")}
      role="tablist"
    >
      {visibleTabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        const label = t(tab.labelKey, tab.fallbackLabel);

        return (
          <TabItemWrapper key={tab.id}>
            {isActive && (
              <ActivePillIndicator
                layoutId={`header-active-pill-${layoutIdPrefix}`}
                transition={MD3_TAB_SPRING}
                data-testid={`${tab.testId ?? tab.id}-indicator`}
              />
            )}
            <TabButton
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              $active={isActive}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabClick(tab)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              data-testid={tab.testId ?? `header-tab-${tab.id}`}
            >
              <TabIconSlot>{tab.icon}</TabIconSlot>
              <TabLabelSlot>{label}</TabLabelSlot>
              {tab.badge}
            </TabButton>
          </TabItemWrapper>
        );
      })}
    </NavContainer>
  );
}
