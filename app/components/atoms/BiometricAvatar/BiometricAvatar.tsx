import { forwardRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { type BiometricAvatarProps } from "./BiometricAvatar.types";
import {
  BiometricAvatarRoot,
  BiometricReticle,
  FallbackAvatarHolder,
} from "./BiometricAvatar.styles";

export const BiometricAvatar = forwardRef<HTMLDivElement, BiometricAvatarProps>(
  function BiometricAvatar(
    {
      src,
      alt = "Biometric facial portrait",
      isPortrait,
      showReticle = true,
      height,
      width,
      aspectRatio,
      borderRadius,
      className,
      testId = "biometric-avatar",
    },
    ref,
  ) {
    return (
      <BiometricAvatarRoot
        ref={ref}
        isPortrait={isPortrait}
        customHeight={height}
        customWidth={width}
        customRatio={aspectRatio}
        customRadius={borderRadius}
        className={className}
        data-testid={testId}
      >
        {src ? (
          <img src={src} alt={alt} />
        ) : (
          <FallbackAvatarHolder>
            <PersonIcon sx={{ fontSize: "3rem", opacity: 0.5 }} />
          </FallbackAvatarHolder>
        )}
        {showReticle && <BiometricReticle />}
      </BiometricAvatarRoot>
    );
  },
);

BiometricAvatar.displayName = "BiometricAvatar";

export default BiometricAvatar;
