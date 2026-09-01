import { styled, alpha, type Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";

export const HeaderAvatarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$size" && prop !== "$isOpen",
})<{ $size: number; $isOpen: boolean }>(({ $size }) => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  height: $size,
  width: $size + 44,
  minWidth: $size + 44,
  isolation: "isolate",
}));

export const HiddenSvgClipDefs = styled("svg")({
  position: "absolute",
  width: 0,
  height: 0,
  overflow: "hidden",
  pointerEvents: "none",
});

const ROLE_KEY_MAP: Record<string, "admin" | "instructor" | "student"> = {
  admin: "admin",
  administrator: "admin",
  instructor: "instructor",
  teacher: "instructor",
  faculty: "instructor",
  editingteacher: "instructor",
  student: "student",
};

export function getHeaderRoleColor(
  role: string | null | undefined,
  theme: Theme,
): string {
  const normalized = (role || "").toLowerCase().trim();
  const roleKey = ROLE_KEY_MAP[normalized] || "student";
  return theme.palette.roles[roleKey];
}

export const AvatarMorphTrigger = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    prop !== "$size" && prop !== "$clipId" && prop !== "$role",
})<{ $size: number; $clipId: string; $role?: string | null }>(({
  theme,
  $size,
  $clipId,
  $role,
}) => {
  const roleColor = getHeaderRoleColor($role, theme);

  return {
    position: "relative",
    zIndex: 2,
    width: $size,
    height: $size,
    borderRadius: "0px",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    clipPath: `url(#${$clipId})`,
    WebkitClipPath: `url(#${$clipId})`,
    backgroundColor: alpha(roleColor, 0.1),
    cursor: "pointer",
    transition: theme.transitions.create(["transform", "filter"], {
      duration: 350,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    }),
    "&:hover, &:focus-visible": {
      transform: "scale(1.05)",
      filter: `drop-shadow(0 2px 8px ${alpha(roleColor, 0.35)})`,
    },
    "&:focus-visible": {
      outline: `2px solid ${roleColor}`,
      outlineOffset: "2px",
    },
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      pointerEvents: "none",
    },
  };
});

export const AvatarInitialsFallback = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$role",
})<{ $role?: string | null }>(({ theme, $role }) => {
  const roleColor = getHeaderRoleColor($role, theme);

  return {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: roleColor,
    fontSize: "0.95rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    backgroundColor: alpha(roleColor, 0.15),
    userSelect: "none",
    "& svg": {
      width: "60%",
      height: "60%",
      fill: "currentColor",
    },
  };
});

export const SlidingPillTrack = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$isOpen" && prop !== "$size",
})<{ $isOpen: boolean; $size: number }>(({ theme, $isOpen, $size }) => ({
  position: "absolute",
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,
  height: $size,
  width: $isOpen ? $size + 44 : $size,
  borderRadius: 9999,
  backgroundColor: alpha(theme.palette.background.paper, 0.96),
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.12)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: theme.spacing(0.5),
  boxSizing: "border-box",
  overflow: "hidden",
  opacity: $isOpen ? 1 : 0,
  pointerEvents: $isOpen ? "auto" : "none",
  transition: theme.transitions.create(["width", "opacity", "box-shadow"], {
    duration: 350,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  }),

  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.paper, 0.94),
    boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.45)}`,
  }),
}));

export const RoundLogoutButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== "$isOpen" && prop !== "$isImpersonating" && prop !== "$role",
})<{ $isOpen: boolean; $isImpersonating?: boolean; $role?: string | null }>(({
  theme,
  $isOpen,
  $isImpersonating,
  $role,
}) => {
  const roleColor = getHeaderRoleColor($role, theme);
  const accentColor = $isImpersonating ? roleColor : theme.palette.error.main;

  return {
    width: 32,
    height: 32,
    borderRadius: "50%",
    color: $isImpersonating ? roleColor : theme.palette.text.primary,
    backgroundColor: alpha(accentColor, $isImpersonating ? 0.15 : 0.1),
    border: `1px solid ${alpha(accentColor, $isImpersonating ? 0.4 : 0.25)}`,
    transform: $isOpen
      ? "translateX(0) scale(1)"
      : "translateX(-28px) scale(0.6)",
    opacity: $isOpen ? 1 : 0,
    pointerEvents: $isOpen ? "auto" : "none",
    transition: theme.transitions.create(
      ["transform", "opacity", "background-color", "border-color", "color"],
      {
        duration: 300,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
      },
    ),
    "&:hover": {
      backgroundColor: alpha(accentColor, 0.25),
      borderColor: accentColor,
      color: accentColor,
      transform: "scale(1.1)",
    },
    "&:focus-visible": {
      outline: `2px solid ${
        $isImpersonating ? roleColor : theme.palette.primary.main
      }`,
      outlineOffset: "2px",
    },
  };
});
