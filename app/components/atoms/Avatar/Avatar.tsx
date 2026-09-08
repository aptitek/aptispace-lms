import { forwardRef, useState, useEffect, type ReactNode } from "react";
import Box from "@mui/material/Box";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { type AvatarProps } from "./Avatar.types";
import {
  AvatarRoot,
  BiometricReticle,
  FallbackAvatarHolder,
} from "./Avatar.styles";
import ShapeDefs from "./ShapeDefs";
import { getRoleAvatarShape } from "~/tokens/shapes";
import {
  isDefaultGithubAvatarUrl,
  isDefaultGithubAvatarImage,
} from "~/utils/avatar";

export function isUnnamedUser(name?: string): boolean {
  if (!name) return true;
  const trimmed = name.trim();
  if (!trimmed) return true;
  if (/^new\s+/i.test(trimmed)) return true;
  if (/\(pending\s+onboarding\)/i.test(trimmed)) return true;
  if (/^(student|teacher|admin|guest|user|unnamed|anonymous)$/i.test(trimmed)) {
    return true;
  }
  return false;
}

export function getAvatarInitials(name?: string, alt?: string): string | null {
  const target = name?.trim() || (alt && alt !== "Avatar" ? alt.trim() : "");
  if (!target || isUnnamedUser(target)) return null;
  const parts = target.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface RenderAvatarContentOptions {
  src?: string;
  alt?: string;
  hasImgError?: boolean;
  isDefaultGithub?: boolean;
  onImgError?: () => void;
  onDefaultGithubDetected?: () => void;
  children?: ReactNode;
  initials?: string | null;
  placeholderIcon?: ReactNode;
}

function renderAvatarContent(options: RenderAvatarContentOptions): ReactNode {
  const {
    src,
    alt,
    hasImgError,
    isDefaultGithub,
    onImgError,
    onDefaultGithubDetected,
    children,
    initials,
    placeholderIcon,
  } = options;

  if (isDefaultGithub) {
    return (
      <FallbackAvatarHolder data-testid="avatar-placeholder-holder">
        <PersonRoundedIcon data-testid="avatar-mdi-placeholder" />
      </FallbackAvatarHolder>
    );
  }

  if (src && !hasImgError) {
    return (
      <Box
        component="img"
        ref={(node: HTMLImageElement | null) => {
          if (!node) return;
          if (node.complete) {
            if (node.naturalWidth === 0) {
              onImgError?.();
            } else if (isDefaultGithubAvatarImage(node)) {
              onDefaultGithubDetected?.();
            }
          }
        }}
        src={src}
        alt={alt ?? "Avatar"}
        crossOrigin="anonymous"
        loading="lazy"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (isDefaultGithubAvatarImage(img)) {
            onDefaultGithubDetected?.();
          }
        }}
        onError={onImgError}
      />
    );
  }
  if (children) {
    return children;
  }
  if (initials) {
    return (
      <FallbackAvatarHolder data-testid="avatar-initials-holder">
        {initials}
      </FallbackAvatarHolder>
    );
  }
  if (placeholderIcon) {
    return <FallbackAvatarHolder>{placeholderIcon}</FallbackAvatarHolder>;
  }
  return (
    <FallbackAvatarHolder data-testid="avatar-placeholder-holder">
      <PersonRoundedIcon data-testid="avatar-mdi-placeholder" />
    </FallbackAvatarHolder>
  );
}

export function resolveAvatarShape(
  shape?: AvatarProps["shape"],
  role?: string | null,
) {
  if (shape !== undefined) return shape;
  if (role) return getRoleAvatarShape(role);
  return "circular";
}

export function resolveAvatarInitials(name?: string, alt?: string) {
  return getAvatarInitials(name, alt);
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(props, ref) {
    const {
      src,
      alt = "Avatar",
      name,
      role,
      isPortrait = true,
      showReticle = false,
      shape,
      height,
      width,
      aspectRatio,
      borderRadius,
      className,
      testId,
      "data-testid": dataTestId,
      objectFit,
      children,
      placeholderIcon,
      overlay,
    } = props;

    const [hasImgError, setHasImgError] = useState(false);
    const [isDefaultGithub, setIsDefaultGithub] = useState(() =>
      isDefaultGithubAvatarUrl(src),
    );

    useEffect(() => {
      setHasImgError(false);
      setIsDefaultGithub(isDefaultGithubAvatarUrl(src));
    }, [src]);

    const resolvedShape = resolveAvatarShape(shape, role);
    const initials = resolveAvatarInitials(name, alt);
    const resolvedTestId = testId ?? dataTestId ?? "avatar";
    const content = renderAvatarContent({
      src,
      alt,
      hasImgError,
      isDefaultGithub,
      onImgError: () => setHasImgError(true),
      onDefaultGithubDetected: () => setIsDefaultGithub(true),
      children,
      initials,
      placeholderIcon,
    });

    return (
      <>
        <ShapeDefs />
        <AvatarRoot
          ref={ref}
          isPortrait={isPortrait}
          customHeight={height}
          customWidth={width}
          customRatio={aspectRatio}
          customRadius={borderRadius}
          shapePreset={resolvedShape}
          customObjectFit={objectFit}
          className={className}
          data-testid={resolvedTestId}
          data-shape={resolvedShape}
        >
          {content}
          {overlay}
          {showReticle && <BiometricReticle />}
        </AvatarRoot>
      </>
    );
  },
);

Avatar.displayName = "Avatar";

export { ShapeDefs };
export default Avatar;
