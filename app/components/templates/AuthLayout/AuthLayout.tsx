import type { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import Galaxy from "~/components/atoms/Galaxy/Galaxy";
import Header, { type HeaderMode } from "~/components/organisms/Header/Header";
import Footer from "~/components/organisms/Footer/Footer";
import type { AuthUser } from "~/utils/auth";

export interface AuthLayoutProps {
  children: ReactNode;
  headerMode?: HeaderMode;
  user?: AuthUser | null;
  onLogout?: () => void;
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
  headerMode = "subtle",
  user,
  onLogout,
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

      <Header mode={headerMode} user={user} onLogout={onLogout}>
        {headerChildren}
      </Header>

      <ContentWrapper>{children}</ContentWrapper>

      <Footer />
    </LayoutRoot>
  );
}
