import React, { useEffect, useMemo } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "./components/atoms/Chip/Chip";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import { useTranslation } from "react-i18next";

import type { Route } from "./+types/root";
import { getThemeByMode } from "./tokens/theme";
import { ThemeModeProvider, useThemeMode } from "./utils/themeContext";
import {
  StatusCenterProvider,
  useStatusCenter,
} from "./utils/statusCenterContext";
import StatusSnackbar from "./components/molecules/StatusCenter/StatusSnackbar";
import StatusTerminalCard from "./components/organisms/StatusCenter/StatusTerminalCard";
import ShapeDefs from "./components/atoms/Avatar/ShapeDefs";
import { LANGUAGE_STORAGE_KEY } from "./i18n";
import "~/i18n";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap",
  },
];

function AppThemeContainer({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const theme = useMemo(() => getThemeByMode(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ShapeDefs />
      {children}
      <StatusSnackbar />
      <StatusTerminalCard />
    </ThemeProvider>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || i18n.language || "en";

  // The first render must match the SSR'd snapshot, so i18n starts at "en" on both
  // sides. Apply the saved / browser-detected language preference only after mount.
  useEffect(() => {
    let detected: string | null = null;
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === "en" || stored === "fr") detected = stored;
    } catch {
      // Ignore storage access errors
    }
    if (!detected && typeof navigator !== "undefined") {
      const nav = navigator.language.toLowerCase();
      if (nav.startsWith("fr")) detected = "fr";
      else if (nav.startsWith("en")) detected = "en";
    }
    if (detected && detected !== i18n.language) {
      void i18n.changeLanguage(detected);
    }
  }, [i18n]);

  return (
    <html lang={currentLang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeModeProvider>
          <StatusCenterProvider>
            <AppThemeContainer>{children}</AppThemeContainer>
          </StatusCenterProvider>
        </ThemeModeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

interface ErrorDisplayDetails {
  title: string;
  details: string;
  statusCode?: number;
  stack?: string;
  isNotFound: boolean;
}

function resolveErrorDisplayDetails(
  error: unknown,
  t: (key: string, options?: Record<string, unknown>) => string,
): ErrorDisplayDetails {
  if (isRouteErrorResponse(error)) {
    const isNotFound = error.status === 404;
    return {
      title: isNotFound ? t("notFound") : "HTTP Error",
      details: isNotFound
        ? t("pageNotFound")
        : error.statusText || t("unexpected"),
      statusCode: error.status,
      isNotFound,
    };
  }

  const isDev = import.meta.env.DEV;
  const isErrInstance = error instanceof Error;

  return {
    title: t("oops"),
    details: isErrInstance ? error.message : t("unexpected"),
    statusCode: 500,
    stack: isDev && isErrInstance ? error.stack : undefined,
    isNotFound: false,
  };
}

function ErrorBoundaryContent({ error }: { error: unknown }) {
  const { t } = useTranslation("errors");
  const { notifyError, openTerminal } = useStatusCenter();
  const errorInfo = useMemo(
    () => resolveErrorDisplayDetails(error, t),
    [error, t],
  );

  useEffect(() => {
    notifyError(error, {
      title: errorInfo.title,
      message: errorInfo.details,
      statusCode: errorInfo.statusCode,
      source: "react-router.error-boundary",
      stack: errorInfo.stack,
    });
  }, [error, errorInfo, notifyError]);

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 4 },
        backgroundColor: "background.default",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          maxWidth: 600,
          width: "100%",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label={errorInfo.statusCode || "ERR"}
            color={errorInfo.isNotFound ? "warning" : "error"}
            variant="outlined"
            sx={{ fontWeight: 800, fontFamily: "monospace" }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            {errorInfo.title}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary">
          {errorInfo.details}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ pt: 1 }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeRoundedIcon />}
            href="/"
          >
            {t("returnHome", { defaultValue: "Return to Home" })}
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<TerminalRoundedIcon />}
            onClick={openTerminal}
          >
            {t("openTerminal", {
              defaultValue: "Open Diagnostic Terminal",
            })}
          </Button>
        </Stack>

        {errorInfo.stack && (
          <Box
            component="pre"
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1.5,
              backgroundColor: "action.hover",
              color: "text.primary",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              overflowX: "auto",
              maxHeight: 240,
            }}
          >
            <code>{errorInfo.stack}</code>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorBoundaryContent error={error} />;
}
