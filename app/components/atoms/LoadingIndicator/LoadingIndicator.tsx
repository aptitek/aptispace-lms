import React from "react";
import { styled, type SxProps, type Theme } from "@mui/material/styles";
import {
  LoadingIndicator as RMELoadingIndicator,
  type LoadingIndicatorProps as RMELoadingIndicatorProps,
} from "react-material-expressive";

export interface LoadingIndicatorProps extends Omit<
  RMELoadingIndicatorProps,
  "className"
> {
  size?: number | string;
  className?: string;
  color?: string;
  sx?: SxProps<Theme>;
}

const StyledLoadingContainer = styled("span", {
  shouldForwardProp: (prop) => prop !== "size" && prop !== "customColor",
})<{ size?: number | string; customColor?: string }>(({
  size = 20,
  customColor,
}) => {
  const resolvedSize = typeof size === "number" ? `${size}px` : size;
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: resolvedSize,
    height: resolvedSize,
    color: customColor,
    "& svg": {
      width: resolvedSize,
      height: resolvedSize,
      color: customColor,
    },
  };
});

export default function LoadingIndicator({
  size = 20,
  color,
  className,
  sx,
  ...rest
}: LoadingIndicatorProps) {
  return (
    <StyledLoadingContainer
      size={size}
      customColor={color}
      className={className}
      sx={sx}
    >
      <RMELoadingIndicator {...rest} />
    </StyledLoadingContainer>
  );
}

export { LoadingIndicator };
