import { type ReactNode } from "react";
import { styled } from "@mui/material/styles";
import Galaxy from "~/components/atoms/Galaxy/Galaxy";

export interface AuthLayoutProps {
  children: ReactNode;
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
}));

const FooterBar = styled("footer")(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  width: "100%",
  padding: theme.spacing(2, 3),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: theme.typography.caption.fontSize ?? "0.75rem",
  color: theme.palette.text.secondary,
  boxSizing: "border-box",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(0.5),
    textAlign: "center",
  },
}));

const SystemStatus = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontFamily: "monospace",
}));

const StatusDot = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 8px ${theme.palette.success.main}`,
}));

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <LayoutRoot>
      <CanvasBackdrop>
        <Galaxy
          density={1.2}
          starSpeed={0.4}
          glowIntensity={0.35}
          mouseInteraction
          mouseRepulsion
          transparent
        />
      </CanvasBackdrop>

      <ContentWrapper>{children}</ContentWrapper>

      <FooterBar>
        <span>
          &copy; {new Date().getFullYear()} AptiSpace LMS. All rights reserved.
        </span>
        <SystemStatus>
          <StatusDot />
          <span>STATION GATEWAY: ONLINE</span>
        </SystemStatus>
      </FooterBar>
    </LayoutRoot>
  );
}
