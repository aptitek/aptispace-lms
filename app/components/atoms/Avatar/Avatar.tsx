import { forwardRef, type ReactNode } from "react";
import { type AvatarProps } from "./Avatar.types";
import {
  AvatarRoot,
  BiometricReticle,
  FallbackAvatarHolder,
} from "./Avatar.styles";
import M3ShapeDefs from "./M3ShapeDefs";

function getAvatarInitials(name?: string, alt?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return alt ? alt.slice(0, 2).toUpperCase() : "AV";
}

function renderAvatarContent(
  src?: string,
  alt?: string,
  children?: ReactNode,
  initials?: string,
): ReactNode {
  if (src) {
    return <img src={src} alt={alt ?? "Avatar"} loading="lazy" />;
  }
  if (children) {
    return children;
  }
  return <FallbackAvatarHolder>{initials}</FallbackAvatarHolder>;
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
    } = props;

    const initials = getAvatarInitials(name, alt);
    const content = renderAvatarContent(src, alt, children, initials);

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
