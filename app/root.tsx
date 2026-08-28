import { useEffect, useMemo } from "react";
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
import { useTranslation } from "react-i18next";

import type { Route } from "./+types/root";
import { getThemeByMode } from "./tokens/theme";
import { ThemeModeProvider, useThemeMode } from "./utils/themeContext";
import { LANGUAGE_STORAGE_KEY } from "./i18n";
import "~/i18n";
import "./app.css";

export const links: Route.LinksFunction = () => [
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
      {children}
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
          <AppThemeContainer>{children}</AppThemeContainer>
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation("errors");
  let message = t("oops");
  let details = t("unexpected");
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? t("notFound") : "Error";
    details =
      error.status === 404 ? t("pageNotFound") : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
