import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  LanguageSwitch,
  ThemeSwitch,
  DebugThemeSwitch,
} from "~/components/molecules/FancySwitch";
import StatusGatewayTrigger from "~/components/molecules/StatusCenter/StatusGatewayTrigger";
import {
  DEFAULT_HEADER_TABS,
  resolveVisibleTabs,
} from "~/components/molecules/HeaderTabs/HeaderTabs.config";
import type { HeaderTabItem } from "~/components/molecules/HeaderTabs/HeaderTabs.types";
import { logout, stopImpersonation, type AuthUser } from "~/utils/auth";
import { M3_SPRINGS, M3_MOTION_DURATIONS } from "~/tokens/motion";
import { Tabs, Tab } from "~/components/atoms/Tabs";
import HoloDecorator from "~/components/molecules/HoloDecorator/HoloDecorator";
import {
  SidebarRail,
  SidebarHeader,
  LogoLink,
  LogoFaviconImg,
  LogoTextReveal,
  AptiSpan,
  SpaceSpan,
  SidebarNav,
  SidebarBottomSection,
  ToggleStackRow,
  StatusCenterSlot,
} from "./Sidebar.styles";
import { SidebarProfileModal } from "./SidebarProfileModal";
import { SidebarUserSection } from "./SidebarUserSection";
import type { SidebarProps, SidebarVariant } from "./Sidebar.types";

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
  onNavigate,
}: {
  onNavigate: (to: string) => void;
}) {
  const { t } = useTranslation("common");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SidebarHeader>
      <LogoLink
        href="/planning"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/planning");
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        $isHovered={isHovered}
        data-testid="sidebar-logo-link"
        aria-label={t("meta.appName", "AptiSpace LMS")}
        initial={false}
        animate={{
          width: isHovered ? 196 : 48,
          paddingLeft: 6,
          paddingRight: isHovered ? 18 : 6,
          paddingTop: 5,
          paddingBottom: 5,
        }}
        transition={M3_SPRINGS.expressive.spatial.default}
      >
        <LogoFaviconImg
          src="/favicon.svg"
          alt="AptiSpace"
          data-testid="sidebar-favicon"
          initial={false}
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={M3_SPRINGS.expressive.effects.fast}
        />
        <LogoTextReveal
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : -8,
            marginLeft: isHovered ? 10 : 0,
          }}
          transition={
            isHovered
              ? M3_SPRINGS.expressive.spatial.default
              : { duration: M3_MOTION_DURATIONS.s.short2 }
          }
          data-testid="sidebar-logo-text"
        >
          <HoloDecorator active={isHovered}>
            <AptiSpan>Apti</AptiSpan>
          </HoloDecorator>
          <HoloDecorator active={isHovered}>
            <SpaceSpan>Space</SpaceSpan>
          </HoloDecorator>
        </LogoTextReveal>
      </LogoLink>
    </SidebarHeader>
  );
}

function SidebarNavList({
  tabs,
  activeTabId,
  onTabClick,
}: {
  tabs: HeaderTabItem[];
  activeTabId: string;
  onTabClick: (tab: HeaderTabItem) => void;
}) {
  const { t } = useTranslation("common");

  if (tabs.length === 0) return null;

  return (
    <SidebarNav role="tablist" aria-label={t("nav.ariaLabel", "Tabs")}>
      <Tabs
        orientation="vertical"
        value={activeTabId}
        onChange={(_, nextTabId) => {
          const target = tabs.find((tab) => tab.id === nextTabId);
          if (target) onTabClick(target);
        }}
      >
        {tabs.map((tab) => {
          const label = t(tab.labelKey, tab.fallbackLabel);
          const testId = tab.testId || `header-tab-${tab.id}`;

          return (
            <Tab
              key={tab.id}
              value={tab.id}
              label={label}
              icon={tab.icon}
              onClick={() => onTabClick(tab)}
              data-testid={testId}
              id={`sidebar-tab-${tab.id}`}
              aria-controls={`sidebar-tabpanel-${tab.id}`}
            />
          );
        })}
      </Tabs>
    </SidebarNav>
  );
}

function SidebarBottom({
  variant,
  user,
  isOnboarding,
  onOpenProfile,
  onAction,
}: {
  variant?: SidebarProps["variant"];
  user?: SidebarProps["user"];
  isOnboarding?: boolean;
  onOpenProfile: () => void;
  onAction: () => void;
}) {
  return (
    <SidebarBottomSection
      $variant={variant}
      data-testid="sidebar-bottom-section"
    >
      <SidebarUserSection
        user={user}
        variant={variant}
        isOnboarding={isOnboarding}
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
      <StatusCenterSlot data-testid="sidebar-status-slot">
        <StatusGatewayTrigger showBadge={true} />
      </StatusCenterSlot>
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

function resolveIsOnboarding(propIsOnboarding?: boolean, pathname = "") {
  if (propIsOnboarding !== undefined) return propIsOnboarding;
  return pathname === "/onboarding" || pathname.startsWith("/onboarding");
}

function resolveSidebarDisplay(
  variant: SidebarVariant,
  user?: AuthUser | null,
  showTabs?: boolean,
  tabs: HeaderTabItem[] = DEFAULT_HEADER_TABS,
) {
  const isConnected = Boolean(user);
  const resolvedVariant: SidebarVariant = isConnected ? "default" : variant;
  const isGhost = resolvedVariant === "ghost";
  const shouldShowTabs = showTabs !== undefined ? showTabs : !isGhost;
  const visibleTabs = shouldShowTabs ? resolveVisibleTabs(tabs, user) : [];

  return {
    resolvedVariant,
    isGhost,
    visibleTabs,
  };
}

export default function Sidebar({
  variant = "default",
  user,
  tabs = DEFAULT_HEADER_TABS,
  showTabs,
  isOnboarding: propIsOnboarding,
  onLogout,
  onReturnToAdmin,
  onUserUpdated,
  className,
  "data-testid": dataTestId = "app-sidebar",
}: SidebarProps) {
  const { t } = useTranslation("common");
  const location = useSafeLocation();
  const navigate = useSafeNavigate();

  const [currentUser, setCurrentUser] = useState<AuthUser | null | undefined>(
    user,
  );

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const currentUserId = currentUser?.id;
  useEffect(() => {
    if (!currentUserId) return;
    const handleGlobalUserUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<
        Partial<AuthUser> & { id: string }
      >;
      if (customEvent.detail && customEvent.detail.id === currentUserId) {
        setCurrentUser((prev) =>
          prev ? { ...prev, ...customEvent.detail } : prev,
        );
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("app:user-updated", handleGlobalUserUpdated);
      return () => {
        window.removeEventListener("app:user-updated", handleGlobalUserUpdated);
      };
    }
  }, [currentUserId]);

  const handleUserUpdated = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    onUserUpdated?.(updatedUser);
  };

  const isOnboarding = resolveIsOnboarding(propIsOnboarding, location.pathname);
  const { resolvedVariant, isGhost, visibleTabs } = resolveSidebarDisplay(
    variant,
    currentUser,
    showTabs,
    tabs,
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const activeTabId = resolveActiveTabId(location.pathname, visibleTabs);

  const handleTabClick = (tab: HeaderTabItem) => {
    if (tab.id !== activeTabId) {
      navigate(tab.to);
    }
  };

  const handleAction = () => {
    executeSidebarAction(currentUser, onReturnToAdmin, onLogout);
  };

  return (
    <>
      <SidebarRail
        className={className}
        data-testid={dataTestId}
        $variant={resolvedVariant}
        role="navigation"
        aria-label={t("nav.sidebarAria", "Primary navigation")}
      >
        {!isGhost && <SidebarLogoHeader onNavigate={(to) => navigate(to)} />}
        <SidebarNavList
          tabs={visibleTabs}
          activeTabId={activeTabId}
          onTabClick={handleTabClick}
        />
        <SidebarBottom
          variant={resolvedVariant}
          user={currentUser}
          isOnboarding={isOnboarding}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onAction={handleAction}
        />
      </SidebarRail>

      {currentUser && !isOnboarding && (
        <SidebarProfileModal
          user={currentUser}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </>
  );
}

export { Sidebar };
