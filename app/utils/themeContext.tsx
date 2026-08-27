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
  toggleColorMode: () => void;
  setColorMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

const THEME_STORAGE_KEY = "aptispace_theme_mode";

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        THEME_STORAGE_KEY,
      ) as ThemeMode | null;
      if (stored === "dark" || stored === "light") {
        setModeState(stored);
      } else if (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
      ) {
        setModeState("light");
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
            setModeState(e.matches ? "light" : "dark");
          }
        } catch {
          // Ignore storage access errors
        }
      };

      mediaQuery.addEventListener("change", handleMediaChange);
      return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(mode);
      document.documentElement.style.colorScheme = mode;
    }
  }, [mode]);

  const setColorMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleColorMode = useCallback(() => {
    setModeState((prev) => {
      const nextMode = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextMode);
      } catch {
        // Ignore storage access errors
      }
      return nextMode;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
      setColorMode,
    }),
    [mode, toggleColorMode, setColorMode],
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
      toggleColorMode: () => {},
      setColorMode: () => {},
    };
  }
  return ctx;
}
