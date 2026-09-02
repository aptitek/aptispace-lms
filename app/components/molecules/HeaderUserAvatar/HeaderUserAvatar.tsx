import {
  useState,
  useRef,
  useId,
  useMemo,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useTranslation } from "react-i18next";
import {
  MaterialShapes,
  roundedPolygonToPath,
  animateMorph,
  type MorphAnimation,
} from "material-shapes-ts";
import Tooltip from "../../atoms/Tooltip/Tooltip";
import { isUnnamedUser } from "../../atoms/Avatar/Avatar";
import { getRoleConfig } from "~/tokens/roles";
import { type HeaderUserAvatarProps } from "./HeaderUserAvatar.types";
import {
  HeaderAvatarContainer,
  HiddenSvgClipDefs,
  AvatarMorphTrigger,
  AvatarInitialsFallback,
  SlidingPillTrack,
  RoundLogoutButton,
} from "./HeaderUserAvatar.styles";

function getRolePolygonShape(role?: string | null) {
  return getRoleConfig(role).polygonShape;
}

function computeUserInitials(name?: string): string | null {
  if (!name || isUnnamedUser(name)) return null;
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;
  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
}

interface AvatarMediaSlotProps {
  avatarUrl?: string;
  name?: string;
  role?: string | null;
  fallbackAria: string;
}

function AvatarMediaSlot({
  avatarUrl,
  name,
  role,
  fallbackAria,
}: AvatarMediaSlotProps) {
  const initials = computeUserInitials(name);

  if (avatarUrl) {
    return <img src={avatarUrl} alt={name || fallbackAria} loading="lazy" />;
  }

  if (initials) {
    return (
      <AvatarInitialsFallback $role={role}>{initials}</AvatarInitialsFallback>
    );
  }

  return (
    <AvatarInitialsFallback $role={role}>
      <PersonRoundedIcon />
    </AvatarInitialsFallback>
  );
}

function resolveHeaderShapeName(role?: string | null): string {
  if (role === "admin") return "9-sided-cookie";
  if (role === "instructor") return "ghost-ish";
  return "pill";
}

interface HeaderActionButtonSlotProps {
  isOpen: boolean;
  isImpersonating: boolean;
  role?: string | null;
  onClick: () => void;
  actionAria: string;
}

function HeaderActionButtonSlot({
  isOpen,
  isImpersonating,
  role,
  onClick,
  actionAria,
}: HeaderActionButtonSlotProps) {
  const Icon = isImpersonating ? (
    <AdminPanelSettingsIcon sx={{ fontSize: "1.15rem" }} />
  ) : (
    <LogoutIcon sx={{ fontSize: "1.1rem" }} />
  );

  return (
    <RoundLogoutButton
      $isOpen={isOpen}
      $isImpersonating={isImpersonating}
      $role={role}
      onClick={onClick}
      aria-label={actionAria}
      data-testid={
        isImpersonating ? "header-return-admin-button" : "header-logout-button"
      }
      data-action={isImpersonating ? "return-to-admin" : "logout"}
      size="small"
    >
      {Icon}
    </RoundLogoutButton>
  );
}

export function HeaderUserAvatar({
  user,
  onLogout,
  onReturnToAdmin,
  onAvatarClick,
  size = 40,
  className,
  testId = "header-user-avatar",
}: HeaderUserAvatarProps) {
  const { t } = useTranslation("auth");
  const rawId = useId();
  const clipId = `avatar-clip-${rawId.replace(/:/g, "")}`;

  const restPolygon = getRolePolygonShape(user.role);
  const restPath = useMemo(
    () => roundedPolygonToPath(restPolygon).toSvgPathData(),
    [restPolygon],
  );

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentPathD, setCurrentPathD] = useState(restPath);

  useEffect(() => {
    setCurrentPathD(restPath);
  }, [restPath]);

  const activeAnimationRef = useRef<MorphAnimation | null>(null);

  const startMorph = useCallback(
    (towardsCircle: boolean) => {
      if (activeAnimationRef.current) {
        activeAnimationRef.current.cancel();
        activeAnimationRef.current = null;
      }

      const startShape = towardsCircle ? restPolygon : MaterialShapes.Circle;
      const targetShape = towardsCircle ? MaterialShapes.Circle : restPolygon;

      activeAnimationRef.current = animateMorph(startShape, targetShape, {
        duration: towardsCircle ? 350 : 300,
        easing: "emphasized",
        onFrame: (nextPathData) => {
          setCurrentPathD(nextPathData);
        },
      });
    },
    [restPolygon],
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    startMorph(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isFocused) startMorph(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    startMorph(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
      if (!isHovered) startMorph(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setIsHovered(false);
      setIsFocused(false);
      startMorph(false);
    }
  };

  const isMenuOpen = isHovered || isFocused;
  const isImpersonating = Boolean(user.impersonating);

  const actionLabel = isImpersonating
    ? t("loginCard.returnToAdmin", "Return to Admin Account")
    : t("loginCard.logoutAria", "Sign out of your account");

  const actionAria = isImpersonating
    ? t(
        "loginCard.returnToAdminAria",
        "Exit impersonation and return to administrator account",
      )
    : t("loginCard.logoutAria", "Sign out of your account");

  const handleActionClick = () => {
    if (isImpersonating && onReturnToAdmin) {
      onReturnToAdmin();
      return;
    }
    onLogout?.();
  };

  return (
    <HeaderAvatarContainer
      $size={size}
      $isOpen={isMenuOpen}
      className={className}
      data-testid={testId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <HiddenSvgClipDefs aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={currentPathD} />
          </clipPath>
        </defs>
      </HiddenSvgClipDefs>

      <AvatarMorphTrigger
        $size={size}
        $clipId={clipId}
        $role={user.role}
        onClick={onAvatarClick}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        aria-label={user.name || actionAria}
        data-testid="header-avatar-trigger"
        data-shape={resolveHeaderShapeName(user.role)}
      >
        <AvatarMediaSlot
          avatarUrl={user.avatarUrl}
          name={user.name}
          role={user.role}
          fallbackAria={actionAria}
        />
      </AvatarMorphTrigger>

      <SlidingPillTrack
        $isOpen={isMenuOpen}
        $size={size}
        data-testid="header-avatar-sliding-pill"
        role="region"
        aria-label={actionAria}
      >
        <Tooltip title={actionLabel} arrow placement="bottom">
          <div>
            <HeaderActionButtonSlot
              isOpen={isMenuOpen}
              isImpersonating={isImpersonating}
              role={user.role}
              onClick={handleActionClick}
              actionAria={actionAria}
            />
          </div>
        </Tooltip>
      </SlidingPillTrack>
    </HeaderAvatarContainer>
  );
}

export default HeaderUserAvatar;
