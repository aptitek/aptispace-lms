import React, { useState, useRef, useId, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";
import LanguageSwitch from "~/components/molecules/LanguageSwitch/LanguageSwitch";
import ThemeSwitch from "~/components/molecules/ThemeSwitch/ThemeSwitch";
import DebugThemeSwitch from "~/components/molecules/ThemeSwitch/DebugThemeSwitch";
import StatusGatewayTrigger from "~/components/molecules/StatusCenter/StatusGatewayTrigger";
import {
  DEFAULT_HEADER_TABS,
  resolveVisibleTabs,
} from "~/components/molecules/HeaderTabs/HeaderTabs.config";
import type { HeaderTabItem } from "~/components/molecules/HeaderTabs/HeaderTabs.types";
import { logout, stopImpersonation } from "~/utils/auth";
import { M3_SPRINGS, M3_MOTION_DURATIONS } from "~/tokens/motion";
import {
  SidebarRail,
  SidebarHeader,
  LogoLink,
  LogoFaviconImg,
  LogoTextReveal,
  AptiSpan,
  SpaceSpan,
  SidebarNav,
  SidebarTabWrapper,
  SidebarTabButton,
  TabActivePill,
  TabIconSlot,
  TabLabelSlot,
  SidebarBottomSection,
  ToggleStackRow,
  StatusCenterSlot,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXTENDED_WIDTH,
  SIDEBAR_SPRING,
  TAB_SPRING,
} from "./Sidebar.styles";
import { SidebarProfileModal } from "./SidebarProfileModal";
import { SidebarUserSection } from "./SidebarUserSection";
import type { SidebarProps } from "./Sidebar.types";

export const DEFAULT_HOVER_EXPAND_DELAY_MS = 1200;

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

function SidebarLogoHeader({
  isExtended,
  onNavigate,
}: {
  isExtended: boolean;
  onNavigate: (to: string) => void;
}) {
  const { t } = useTranslation("common");

  return (
    <SidebarHeader>
      <LogoLink
        href="/planning"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/planning");
        }}
        data-testid="sidebar-logo-link"
        aria-label={t("meta.appName", "AptiSpace LMS")}
      >
        <LogoFaviconImg
          src="/favicon.svg"
          alt="AptiSpace"
          data-testid="sidebar-favicon"
        />
        <LogoTextReveal
          initial={false}
          animate={{
            opacity: isExtended ? 1 : 0,
            width: isExtended ? "auto" : 0,
            x: isExtended ? 0 : -8,
          }}
          transition={
            isExtended
              ? M3_SPRINGS.expressive.spatial.default
              : { duration: M3_MOTION_DURATIONS.s.short2 }
          }
          data-testid="sidebar-logo-text"
        >
          <AptiSpan>Apti</AptiSpan>
          <SpaceSpan>Space</SpaceSpan>
        </LogoTextReveal>
      </LogoLink>
    </SidebarHeader>
  );
}

interface SidebarTabItemProps {
  tab: HeaderTabItem;
  isActive: boolean;
  isExtended: boolean;
  layoutIdPrefix: string;
  onClick: () => void;
}

function SidebarTabItem({
  tab,
  isActive,
  isExtended,
  layoutIdPrefix,
  onClick,
}: SidebarTabItemProps) {
  const { t } = useTranslation("common");
  const label = t(tab.labelKey, tab.fallbackLabel);

  const buttonContent = (
    <SidebarTabButton
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={label}
      $active={isActive}
      $isExtended={isExtended}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      data-testid={tab.testId ?? `sidebar-tab-${tab.id}`}
    >
      <TabIconSlot>{tab.icon}</TabIconSlot>
      <TabLabelSlot
        initial={false}
        animate={{
          opacity: isExtended ? 1 : 0,
          width: isExtended ? "auto" : 0,
          x: isExtended ? 0 : -6,
        }}
        transition={
          isExtended
            ? M3_SPRINGS.expressive.spatial.default
            : { duration: M3_MOTION_DURATIONS.s.short2 }
        }
      >
        {label}
      </TabLabelSlot>
      {tab.badge}
    </SidebarTabButton>
  );

  return (
    <SidebarTabWrapper key={tab.id}>
      {isActive && (
        <TabActivePill
          layoutId={`sidebar-active-pill-${layoutIdPrefix}`}
          transition={TAB_SPRING}
          data-testid={`${tab.testId ?? tab.id}-active-pill`}
        />
      )}
      {isExtended ? (
        buttonContent
      ) : (
        <Tooltip title={label} placement="right" arrow>
          {buttonContent}
        </Tooltip>
      )}
    </SidebarTabWrapper>
  );
}

function SidebarNavList({
  tabs,
  activeTabId,
  isExtended,
  layoutIdPrefix,
  onTabClick,
}: {
  tabs: HeaderTabItem[];
  activeTabId: string;
  isExtended: boolean;
  layoutIdPrefix: string;
  onTabClick: (tab: HeaderTabItem) => void;
}) {
  const { t } = useTranslation("common");

  if (tabs.length === 0) return null;

  return (
    <SidebarNav role="tablist" aria-label={t("nav.ariaLabel", "Tabs")}>
      {tabs.map((tab) => (
        <SidebarTabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          isExtended={isExtended}
          layoutIdPrefix={layoutIdPrefix}
          onClick={() => onTabClick(tab)}
        />
      ))}
    </SidebarNav>
  );
}

function SidebarBottom({
  variant,
  user,
  isExtended,
  onOpenProfile,
  onAction,
}: {
  variant?: SidebarProps["variant"];
  user?: SidebarProps["user"];
  isExtended: boolean;
  onOpenProfile: () => void;
  onAction: () => void;
}) {
  return (
    <SidebarBottomSection data-testid="sidebar-bottom-section">
      <SidebarUserSection
        user={user}
        isExtended={isExtended}
        onOpenProfile={onOpenProfile}
        onAction={onAction}
      />
      <ToggleStackRow data-testid="sidebar-toggles-row">
        <LanguageSwitch size="small" data-testid="sidebar-language-toggle" />
        <ThemeSwitch size="small" data-testid="sidebar-theme-toggle" />
        <DebugThemeSwitch
          size="small"
          data-testid="sidebar-debug-theme-toggle"
        />
      </ToggleStackRow>
      {variant !== "auth" && (
        <StatusCenterSlot data-testid="sidebar-status-slot">
          <StatusGatewayTrigger showBadge={true} />
        </StatusCenterSlot>
      )}
    </SidebarBottomSection>
  );
}

function executeSidebarAction(
  user: AuthUser | null | undefined,
  onReturnToAdmin?: () => void,
  onLogout?: () => void,
) {
  if (user?.impersonating) {
    if (onReturnToAdmin) {
      onReturnToAdmin();
    } else {
      void stopImpersonation();
    }
    return;
  }
  if (onLogout) {
    onLogout();
  } else {
    void logout();
  }
}

function useSidebarInteractions(hoverDelay: number) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isClicked) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (railRef.current && !railRef.current.contains(event.target as Node)) {
        setIsClicked(false);
      }
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsClicked(false);
        setIsHovered(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isClicked]);

  const handleMouseEnter = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    if (hoverDelay <= 0) {
      setIsHovered(true);
      return;
    }
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, hoverDelay);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsHovered(false);
  };

  const handleClick = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsClicked(true);
  };

  return {
    railRef,
    isExtended: isHovered || isFocused || isClicked,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    setIsFocused,
  };
}

export default function Sidebar({
  variant = "default",
  user,
  tabs = DEFAULT_HEADER_TABS,
  showTabs,
  hoverDelay = DEFAULT_HOVER_EXPAND_DELAY_MS,
  onLogout,
  onReturnToAdmin,
  onUserUpdated,
  className,
  "data-testid": dataTestId = "app-sidebar",
}: SidebarProps) {
  const { t } = useTranslation("common");
  const location = useSafeLocation();
  const navigate = useSafeNavigate();
  const layoutIdPrefix = useId();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const {
    railRef,
    isExtended,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    setIsFocused,
  } = useSidebarInteractions(hoverDelay);

  const shouldShowTabs = showTabs !== undefined ? showTabs : variant !== "auth";
  const visibleTabs = shouldShowTabs ? resolveVisibleTabs(tabs, user) : [];
  const activeTabId = resolveActiveTabId(location.pathname, visibleTabs);

  const handleTabClick = (tab: HeaderTabItem) => {
    if (tab.id !== activeTabId) {
      navigate(tab.to);
    }
  };

  const handleAction = () => {
    executeSidebarAction(user, onReturnToAdmin, onLogout);
  };

  return (
    <>
      <SidebarRail
        ref={railRef}
        className={className}
        data-testid={dataTestId}
        $isExtended={isExtended}
        $variant={variant}
        initial={false}
        animate={{
          width: isExtended ? SIDEBAR_EXTENDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        }}
        transition={SIDEBAR_SPRING}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          if (!railRef.current?.contains(e.relatedTarget as Node)) {
            setIsFocused(false);
          }
        }}
        role="navigation"
        aria-label={t("nav.sidebarAria", "Primary navigation")}
      >
        <SidebarLogoHeader
          isExtended={isExtended}
          onNavigate={(to) => navigate(to)}
        />
        <SidebarNavList
          tabs={visibleTabs}
          activeTabId={activeTabId}
          isExtended={isExtended}
          layoutIdPrefix={layoutIdPrefix}
          onTabClick={handleTabClick}
        />
        <SidebarBottom
          variant={variant}
          user={user}
          isExtended={isExtended}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onAction={handleAction}
        />
      </SidebarRail>

      {user && (
        <SidebarProfileModal
          user={user}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onUserUpdated={onUserUpdated}
        />
      )}
    </>
  );
}
