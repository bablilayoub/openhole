"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  applyTheme,
  getSystemTheme,
  readThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  type Theme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Fired after this tab writes the preference; `storage` only fires in other tabs. */
const PREFERENCE_EVENT = "openhole:theme";

function subscribeSystemTheme(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function subscribePreference(onStoreChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(PREFERENCE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PREFERENCE_EVENT, onStoreChange);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    () => "light" as Theme
  );
  const preference = useSyncExternalStore(
    subscribePreference,
    readThemePreference,
    () => "system" as ThemePreference
  );

  const theme = preference === "system" ? systemTheme : preference;

  // Keep the <html> class in sync — the inline init script handles first paint.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === "system") {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch {
      /* storage unavailable */
    }
    applyTheme(resolveTheme(next));
    window.dispatchEvent(new Event(PREFERENCE_EVENT));
  }, []);

  const toggle = useCallback(() => {
    setPreference(resolveTheme(preference) === "dark" ? "light" : "dark");
  }, [preference, setPreference]);

  const value = useMemo(
    () => ({ theme, preference, setPreference, toggle }),
    [theme, preference, setPreference, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
