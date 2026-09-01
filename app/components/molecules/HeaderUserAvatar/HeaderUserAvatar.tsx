import {
  useState,
  useRef,
  useId,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import {
  MaterialShapes,
  roundedPolygonToPath,
  animateMorph,
  type MorphAnimation,
} from "material-shapes-ts";
import Tooltip from "../../atoms/Tooltip/Tooltip";
import { isUnnamedUser } from "../../atoms/Avatar/Avatar";
import { type HeaderUserAvatarProps } from "./HeaderUserAvatar.types";
import {
  HeaderAvatarContainer,
  HiddenSvgClipDefs,
  AvatarMorphTrigger,
  AvatarInitialsFallback,
  SlidingPillTrack,
  RoundLogoutButton,
} from "./HeaderUserAvatar.styles";

const INITIAL_REST_PATH = roundedPolygonToPath(
  MaterialShapes.Cookie6Sided,
).toSvgPathData();

function computeUserInitials(name?: string): string | null {
  if (!name || isUnnamedUser(name)) return null;
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;
  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
}

export function HeaderUserAvatar({
  user,
  onLogout,
  onAvatarClick,
  size = 40,
  className,
  testId = "header-user-avatar",
}: HeaderUserAvatarProps) {
  const { t } = useTranslation("auth");
  const rawId = useId();
  const clipId = `avatar-clip-${rawId.replace(/:/g, "")}`;

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentPathD, setCurrentPathD] = useState(INITIAL_REST_PATH);

  const activeAnimationRef = useRef<MorphAnimation | null>(null);

  const startMorph = useCallback((towardsCircle: boolean) => {
    if (activeAnimationRef.current) {
      activeAnimationRef.current.cancel();
      activeAnimationRef.current = null;
    }

    const startShape = towardsCircle
      ? MaterialShapes.Cookie6Sided
      : MaterialShapes.Circle;
    const targetShape = towardsCircle
      ? MaterialShapes.Circle
      : MaterialShapes.Cookie6Sided;

    activeAnimationRef.current = animateMorph(startShape, targetShape, {
      duration: towardsCircle ? 350 : 300,
      easing: "emphasized",
      onFrame: (nextPathData) => {
        setCurrentPathD(nextPathData);
      },
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    startMorph(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isFocused) {
      startMorph(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    startMorph(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
      if (!isHovered) {
        startMorph(false);
      }
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
  const initials = computeUserInitials(user.name);

  let avatarMedia: ReactNode;
  if (user.avatarUrl) {
    avatarMedia = (
      <img
        src={user.avatarUrl}
        alt={user.name || t("loginCard.logoutAria")}
        loading="lazy"
      />
    );
  } else if (initials) {
    avatarMedia = <AvatarInitialsFallback>{initials}</AvatarInitialsFallback>;
  } else {
    avatarMedia = (
      <AvatarInitialsFallback>
        <PersonRoundedIcon />
      </AvatarInitialsFallback>
    );
  }

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
        onClick={onAvatarClick}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        aria-label={user.name || t("loginCard.logoutAria")}
        data-testid="header-avatar-trigger"
        data-shape="6-sided-cookie"
      >
        {avatarMedia}
      </AvatarMorphTrigger>

      <SlidingPillTrack
        $isOpen={isMenuOpen}
        $size={size}
        data-testid="header-avatar-sliding-pill"
        role="region"
        aria-label={t("loginCard.logoutAria")}
      >
        <Tooltip title={t("loginCard.logoutAria")} arrow placement="bottom">
          <RoundLogoutButton
            $isOpen={isMenuOpen}
            onClick={onLogout}
            aria-label={t("loginCard.logoutAria")}
            data-testid="header-logout-button"
            size="small"
          >
            <LogoutIcon sx={{ fontSize: "1.1rem" }} />
          </RoundLogoutButton>
        </Tooltip>
      </SlidingPillTrack>
    </HeaderAvatarContainer>
  );
}

export default HeaderUserAvatar;
