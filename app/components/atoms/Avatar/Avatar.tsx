import { forwardRef, type ReactNode } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { type AvatarProps } from "./Avatar.types";
import {
  AvatarRoot,
  BiometricReticle,
  FallbackAvatarHolder,
} from "./Avatar.styles";
import ShapeDefs from "./ShapeDefs";
import { getRoleAvatarShape } from "./shapes";

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

function getAvatarInitials(name?: string, alt?: string): string | null {
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
  children?: ReactNode;
  initials?: string | null;
  placeholderIcon?: ReactNode;
}

function renderAvatarContent(options: RenderAvatarContentOptions): ReactNode {
  const { src, alt, children, initials, placeholderIcon } = options;
  if (src) {
    return <img src={src} alt={alt ?? "Avatar"} loading="lazy" />;
  }
  if (children) {
    return children;
  }
  if (initials) {
    return <FallbackAvatarHolder>{initials}</FallbackAvatarHolder>;
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
    } = props;

    const resolvedShape =
      shape !== undefined ? shape : role ? getRoleAvatarShape(role) : "medium";

    const initials =
      resolvedShape === "landscape" && name
        ? name
        : getAvatarInitials(name, alt);
    const content = renderAvatarContent({
      src,
      alt,
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
          data-testid={testId ?? dataTestId ?? "avatar"}
          data-shape={resolvedShape}
        >
          {content}
          {showReticle && <BiometricReticle />}
        </AvatarRoot>
      </>
    );
  },
);

Avatar.displayName = "Avatar";

export { ShapeDefs };
export default Avatar;
