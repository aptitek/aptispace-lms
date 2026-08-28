import { styled, alpha } from "@mui/material/styles";

export const BiometricAvatarRoot = styled("div")<{
  isPortrait?: boolean;
  customHeight?: number | string;
  customWidth?: number | string;
  customRatio?: string;
  customRadius?: number | string;
}>(
  ({
    theme,
    isPortrait,
    customHeight,
    customWidth,
    customRatio,
    customRadius,
  }) => ({
    position: "relative",
    height: customHeight ?? (isPortrait ? "140px" : "100%"),
    width: customWidth ?? (isPortrait ? "auto" : "auto"),
    aspectRatio: customRatio ?? "35 / 45", // ISO/IEC 19794-5:2011 standard 35mm x 45mm (7:9)
    borderRadius: customRadius ?? "10px",
    overflow: "hidden",
    border: `1.5px solid ${alpha(theme.palette.primary.main, 0.65)}`,
    boxShadow: `0 0 16px ${alpha(theme.palette.primary.main, 0.25)}, inset 0 0 12px ${alpha(theme.palette.common.black, 0.4)}`,
    flexShrink: 0,
    backgroundColor: alpha(theme.palette.background.default, 0.6),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  }),
);

export const BiometricReticle = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: "3px",
  pointerEvents: "none",
  border: `1px dashed ${alpha(theme.palette.primary.light, 0.3)}`,
  borderRadius: "7px",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -1,
    left: -1,
    width: "8px",
    height: "8px",
    borderTop: `2px solid ${theme.palette.primary.main}`,
    borderLeft: `2px solid ${theme.palette.primary.main}`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -1,
    right: -1,
    width: "8px",
    height: "8px",
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    borderRight: `2px solid ${theme.palette.primary.main}`,
  },
}));

export const FallbackAvatarHolder = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  fontSize: "2rem",
  fontWeight: 800,
  textTransform: "uppercase",
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
}));
