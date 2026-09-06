import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { ThemeMode } from "~/tokens/theme";

export interface ThemeContextValue {
  mode: ThemeMode;
  baseMode: "dark" | "light";
  isDebugTheme: boolean;
  toggleColorMode: () => void;
  setColorMode: (mode: ThemeMode) => void;
  setDebugTheme: (enabled: boolean) => void;
  toggleDebugTheme: () => void;
}

const ThemeModeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

const THEME_STORAGE_KEY = "aptispace_theme_mode";
const DEBUG_STORAGE_KEY = "aptispace_debug_theme";

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [baseMode, setBaseMode] = useState<"dark" | "light">("dark");
  const [isDebugTheme, setIsDebugTheme] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedMode = localStorage.getItem(THEME_STORAGE_KEY) as
        "dark" | "light" | null;
      if (storedMode === "dark" || storedMode === "light") {
        setBaseMode(storedMode);
      } else if (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
      ) {
        setBaseMode("light");
      }

      const storedDebug = localStorage.getItem(DEBUG_STORAGE_KEY);
      if (storedDebug === "true") {
        setIsDebugTheme(true);
      }
    } catch {
      // Ignore storage access errors
    }

    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
      const handleMediaChange = (e: MediaQueryListEvent) => {
        try {
          const stored = localStorage.getItem(THEME_STORAGE_KEY);
          if (!stored) {
            setBaseMode(e.matches ? "light" : "dark");
          }
        } catch {
          // Ignore storage access errors
        }
      };

      mediaQuery.addEventListener("change", handleMediaChange);
      return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }
  }, []);

  const resolvedMode: ThemeMode = isDebugTheme ? "debug" : baseMode;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark", "light", "debug");
      document.documentElement.classList.add(resolvedMode);
      document.documentElement.setAttribute("data-theme", resolvedMode);
      document.documentElement.style.colorScheme =
        resolvedMode === "light" ? "light" : "dark";
    }
  }, [resolvedMode]);

  const setColorMode = useCallback((newMode: ThemeMode) => {
    if (newMode === "debug") {
      setIsDebugTheme(true);
      try {
        localStorage.setItem(DEBUG_STORAGE_KEY, "true");
      } catch {
        // Ignore storage access errors
      }
    } else {
      setIsDebugTheme(false);
      setBaseMode(newMode);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newMode);
        localStorage.removeItem(DEBUG_STORAGE_KEY);
      } catch {
        // Ignore storage access errors
      }
    }
  }, []);

  const toggleColorMode = useCallback(() => {
    setBaseMode((prev) => {
      const nextMode = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextMode);
      } catch {
        // Ignore storage access errors
      }
      return nextMode;
    });
  }, []);

  const setDebugTheme = useCallback((enabled: boolean) => {
    setIsDebugTheme(enabled);
    try {
      if (enabled) {
        localStorage.setItem(DEBUG_STORAGE_KEY, "true");
      } else {
        localStorage.removeItem(DEBUG_STORAGE_KEY);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleDebugTheme = useCallback(() => {
    setIsDebugTheme((prev) => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem(DEBUG_STORAGE_KEY, "true");
        } else {
          localStorage.removeItem(DEBUG_STORAGE_KEY);
        }
      } catch {
        // Ignore storage access errors
      }
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      mode: resolvedMode,
      baseMode,
      isDebugTheme,
      toggleColorMode,
      setColorMode,
      setDebugTheme,
      toggleDebugTheme,
    }),
    [
      resolvedMode,
      baseMode,
      isDebugTheme,
      toggleColorMode,
      setColorMode,
      setDebugTheme,
      toggleDebugTheme,
    ],
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    return {
      mode: "dark",
      baseMode: "dark",
      isDebugTheme: false,
      toggleColorMode: () => {},
      setColorMode: () => {},
      setDebugTheme: () => {},
      toggleDebugTheme: () => {},
    };
  }
  return ctx;
}
