import {
  useState,
  useRef,
  useId,
  useMemo,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import Box from "@mui/material/Box";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { useTranslation } from "react-i18next";
import {
  MaterialShapes,
  roundedPolygonToPath,
  animateExpressiveMorph,
  type MorphAnimation,
} from "~/tokens/shapes";
import Tooltip from "../../atoms/Tooltip/Tooltip";
import { isUnnamedUser } from "../../atoms/Avatar/Avatar";
import { getRoleConfig } from "~/tokens/roles";
import { M3_MOTION_DURATIONS } from "~/tokens/motion";
import {
  isDefaultGithubAvatarUrl,
  isDefaultGithubAvatarImage,
} from "~/utils/avatar";
import { type ProfileButtonProps } from "./ProfileButton.types";
import {
  ProfileButtonContainer,
  HiddenSvgClipDefs,
  AvatarMorphTrigger,
  AvatarInitialsFallback,
  SlidingPillTrack,
  RoundLogoutButton,
  LogoutOnlyActionButton,
} from "./ProfileButton.styles";

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
  fallbackAria?: string;
}

function AvatarMediaSlot({
  avatarUrl,
  name,
  role,
  fallbackAria: _fallbackAria,
}: AvatarMediaSlotProps) {
  const isKnownDefault = isDefaultGithubAvatarUrl(avatarUrl);
  const [hasImgError, setHasImgError] = useState(false);
  const [isDefaultGithub, setIsDefaultGithub] = useState(isKnownDefault);
  const initials = computeUserInitials(name);

  useEffect(() => {
    setHasImgError(false);
    setIsDefaultGithub(isDefaultGithubAvatarUrl(avatarUrl));
  }, [avatarUrl]);

  if (isDefaultGithub) {
    return (
      <AvatarInitialsFallback
        $role={role}
        data-testid="profile-mdi-placeholder"
      >
        <PersonRoundedIcon />
      </AvatarInitialsFallback>
    );
  }

  if (avatarUrl && !hasImgError) {
    return (
      <Box
        component="img"
        ref={(node: HTMLImageElement | null) => {
          if (!node) return;
          if (node.complete) {
            if (node.naturalWidth === 0) {
              setHasImgError(true);
            } else if (isDefaultGithubAvatarImage(node)) {
              setIsDefaultGithub(true);
            }
          }
        }}
        src={avatarUrl}
        alt=""
        aria-hidden="true"
        crossOrigin="anonymous"
        loading="lazy"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (isDefaultGithubAvatarImage(img)) {
            setIsDefaultGithub(true);
          }
        }}
        onError={() => setHasImgError(true)}
      />
    );
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
  testId?: string;
}

function HeaderActionButtonSlot({
  isOpen,
  isImpersonating,
  role,
  onClick,
  actionAria,
  testId,
}: HeaderActionButtonSlotProps) {
  const Icon = isImpersonating ? (
    <AdminPanelSettingsRoundedIcon sx={{ fontSize: "1.15rem" }} />
  ) : (
    <LogoutRoundedIcon sx={{ fontSize: "1.1rem" }} />
  );

  return (
    <RoundLogoutButton
      $isOpen={isOpen}
      $isImpersonating={isImpersonating}
      $role={role}
      onClick={onClick}
      aria-label={actionAria}
      data-testid={
        testId ||
        (isImpersonating
          ? "header-return-admin-button"
          : "header-logout-button")
      }
      data-action={isImpersonating ? "return-to-admin" : "logout"}
      size="small"
    >
      {Icon}
    </RoundLogoutButton>
  );
}

interface ProfileMorphOptions {
  role: string;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

function useProfileMorph({
  role,
  onMouseEnter,
  onMouseLeave,
}: ProfileMorphOptions) {
  const rawId = useId();
  const clipId = `profile-avatar-clip-${rawId.replace(/:/g, "")}`;

  const restPolygon = getRolePolygonShape(role);
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

      activeAnimationRef.current = animateExpressiveMorph(
        startShape,
        targetShape,
        {
          duration: towardsCircle
            ? M3_MOTION_DURATIONS.medium3
            : M3_MOTION_DURATIONS.medium2,
          easing: "emphasized",
          onFrame: (nextPathData) => {
            setCurrentPathD(nextPathData);
          },
        },
      );
    },
    [restPolygon],
  );

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    startMorph(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    if (!isFocused) startMorph(false);
    onMouseLeave?.(event);
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

  return {
    clipId,
    currentPathD,
    isMenuOpen: isHovered || isFocused,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleKeyDown,
  };
}

function resolveActionDetails(
  isImpersonating: boolean,
  t: (key: string, defaultVal: string) => string,
) {
  const actionLabel = isImpersonating
    ? t("loginCard.returnToAdmin", "Return to Admin Account")
    : t("loginCard.logoutAria", "Sign out of your account");

  const actionAria = isImpersonating
    ? t(
        "loginCard.returnToAdminAria",
        "Exit impersonation and return to administrator account",
      )
    : t("loginCard.logoutAria", "Sign out of your account");

  return { actionLabel, actionAria };
}

function executeProfileAction(
  isImpersonating: boolean,
  onReturnToAdmin?: () => void,
  onLogout?: () => void,
) {
  if (isImpersonating && onReturnToAdmin) {
    onReturnToAdmin();
    return;
  }
  onLogout?.();
}

function LogoutOnlyProfileButton({
  user,
  size = 40,
  extended = false,
  className,
  testId = "profile-button",
  actionTestId,
  onLogout,
  onReturnToAdmin,
}: ProfileButtonProps) {
  const { t } = useTranslation("auth");
  const isImpersonating = Boolean(user.impersonating);
  const { actionLabel, actionAria } = resolveActionDetails(
    isImpersonating,
    (k, d) => String(t(k, d)),
  );

  const handleActionClick = () =>
    executeProfileAction(isImpersonating, onReturnToAdmin, onLogout);

  const defaultActionTestId = isImpersonating
    ? "header-return-admin-button"
    : "header-logout-button";

  const buttonContent = (
    <LogoutOnlyActionButton
      $size={size}
      $extended={extended}
      $isImpersonating={isImpersonating}
      $role={user.role}
      onClick={handleActionClick}
      aria-label={actionAria}
      data-testid={actionTestId || defaultActionTestId}
      data-action={isImpersonating ? "return-to-admin" : "logout"}
    >
      {isImpersonating ? (
        <AdminPanelSettingsRoundedIcon sx={{ fontSize: 20 }} />
      ) : (
        <LogoutRoundedIcon sx={{ fontSize: 20 }} />
      )}
      {extended && (
        <Box
          component="span"
          sx={{
            fontWeight: 600,
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {actionLabel}
        </Box>
      )}
    </LogoutOnlyActionButton>
  );

  return (
    <ProfileButtonContainer
      $size={size}
      $isOpen={false}
      $variant="logoutOnly"
      $extended={extended}
      className={className}
      data-testid={testId}
    >
      {extended ? (
        buttonContent
      ) : (
        <Tooltip title={actionLabel} arrow placement="right">
          {buttonContent}
        </Tooltip>
      )}
    </ProfileButtonContainer>
  );
}

function DefaultProfileButton({
  user,
  onLogout,
  onReturnToAdmin,
  onAvatarClick,
  size = 40,
  className,
  testId = "profile-button",
  avatarTestId,
  actionTestId,
  showSlidingPill = true,
  onMouseEnter,
  onMouseLeave,
}: ProfileButtonProps) {
  const { t } = useTranslation("auth");
  const isImpersonating = Boolean(user.impersonating);
  const { actionLabel, actionAria } = resolveActionDetails(
    isImpersonating,
    (k, d) => String(t(k, d)),
  );

  const handleActionClick = () =>
    executeProfileAction(isImpersonating, onReturnToAdmin, onLogout);

  const {
    clipId,
    currentPathD,
    isMenuOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleKeyDown,
  } = useProfileMorph({
    role: user.role,
    onMouseEnter,
    onMouseLeave,
  });

  const defaultAvatarTestId = "header-avatar-trigger";

  return (
    <ProfileButtonContainer
      $size={size}
      $isOpen={isMenuOpen}
      $variant="default"
      $showSlidingPill={showSlidingPill}
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
        data-testid={avatarTestId || defaultAvatarTestId}
        data-shape={resolveHeaderShapeName(user.role)}
      >
        <AvatarMediaSlot
          avatarUrl={user.avatarUrl}
          name={user.name}
          role={user.role}
          fallbackAria={actionAria}
        />
      </AvatarMorphTrigger>

      {showSlidingPill && (
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
                testId={actionTestId}
              />
            </div>
          </Tooltip>
        </SlidingPillTrack>
      )}
    </ProfileButtonContainer>
  );
}

export function ProfileButton(props: ProfileButtonProps) {
  if (props.variant === "logoutOnly") {
    return <LogoutOnlyProfileButton {...props} />;
  }

  return <DefaultProfileButton {...props} />;
}

export default ProfileButton;
