import type { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Galaxy from "~/components/organisms/Galaxy/Galaxy";
import Sidebar, { type SidebarVariant } from "~/components/organisms/Sidebar";
import type { AuthUser } from "~/utils/auth";

export type HeaderMode = "subtle" | "full";

export interface AuthLayoutProps {
  children: ReactNode;
  headerMode?: HeaderMode;
  sidebarVariant?: SidebarVariant;
  user?: AuthUser | null;
  onLogout?: () => void;
  onReturnToAdmin?: () => void;
  headerChildren?: ReactNode;
  showGalaxy?: boolean;
}

const LayoutRoot = styled("div")(({ theme }) => ({
  position: "relative",
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create(
    ["background-color", "color", "border-color"],
    { duration: theme.transitions.duration.standard },
  ),
}));

const CanvasBackdrop = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  pointerEvents: "auto",
});

const ContentWrapper = styled("main")(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  flex: 1,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  boxSizing: "border-box",
  pointerEvents: "none",
  "& > *": {
    pointerEvents: "auto",
  },
}));

export default function AuthLayout({
  children,
  sidebarVariant = "ghost",
  user,
  onLogout,
  onReturnToAdmin,
  headerChildren,
  showGalaxy = true,
}: AuthLayoutProps) {
  return (
    <LayoutRoot>
      {showGalaxy && (
        <CanvasBackdrop>
          <Galaxy
            density={0.5}
            starSpeed={0.4}
            glowIntensity={0.2}
            mouseInteraction
            mouseRepulsion
            repulsionStrength={2}
          />
        </CanvasBackdrop>
      )}

      <Sidebar
        variant={sidebarVariant}
        user={user}
        onLogout={onLogout}
        onReturnToAdmin={onReturnToAdmin}
        data-testid="auth-sidebar"
      />

      {headerChildren && (
        <Box sx={{ position: "absolute", top: 16, right: 24, zIndex: 10 }}>
          {headerChildren}
        </Box>
      )}

      <ContentWrapper>{children}</ContentWrapper>
    </LayoutRoot>
  );
}
