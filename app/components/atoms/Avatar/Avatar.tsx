import { forwardRef, type ReactNode } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { type AvatarProps } from "./Avatar.types";
import {
  AvatarRoot,
  BiometricReticle,
  FallbackAvatarHolder,
} from "./Avatar.styles";
import M3ShapeDefs from "./M3ShapeDefs";

function getAvatarInitials(name?: string, alt?: string): string | null {
  const target = name?.trim() || (alt && alt !== "Avatar" ? alt.trim() : "");
  if (!target) return null;
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
      isPortrait = true,
      showReticle = false,
      shape = "medium",
      height,
      width,
      aspectRatio,
      borderRadius,
      className,
      testId,
      "data-testid": dataTestId,
      children,
      placeholderIcon,
    } = props;

    const initials = getAvatarInitials(name, alt);
    const content = renderAvatarContent({
      src,
      alt,
      children,
      initials,
      placeholderIcon,
    });

    return (
      <>
        <M3ShapeDefs />
        <AvatarRoot
          ref={ref}
          isPortrait={isPortrait}
          customHeight={height}
          customWidth={width}
          customRatio={aspectRatio}
          customRadius={borderRadius}
          shapePreset={shape}
          className={className}
          data-testid={testId ?? dataTestId ?? "avatar"}
          data-shape={shape}
        >
          {content}
          {showReticle && <BiometricReticle />}
        </AvatarRoot>
      </>
    );
  },
);

Avatar.displayName = "Avatar";

export { M3ShapeDefs };
export default Avatar;
