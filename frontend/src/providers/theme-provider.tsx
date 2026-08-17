"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark", disableTransitions: boolean) {
  const root = document.documentElement;
  let transitionStyle: HTMLStyleElement | undefined;

  if (disableTransitions) {
    transitionStyle = document.createElement("style");
    transitionStyle.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(transitionStyle);
  }

  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;

  if (transitionStyle) {
    void window.getComputedStyle(document.body).opacity;
    window.setTimeout(() => transitionStyle?.remove(), 1);
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: {
  children: React.ReactNode;
  attribute?: "class";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  // Keep the initial server and client render deterministic. The saved preference
  // is applied after hydration, avoiding next-themes' injected script warning in React 19.
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  const updateTheme = React.useCallback((nextTheme: Theme, persist: boolean) => {
    const safeTheme = nextTheme === "system" && !enableSystem ? "light" : nextTheme;
    const resolved = resolveTheme(safeTheme);
    setThemeState(safeTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved, disableTransitionOnChange);
    if (persist) window.localStorage.setItem("theme", safeTheme);
  }, [disableTransitionOnChange, enableSystem]);

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const initialTheme: Theme = savedTheme === "light" || savedTheme === "dark" || (savedTheme === "system" && enableSystem)
      ? savedTheme
      : defaultTheme;
    // This is the initial client-side reconciliation of a browser preference.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateTheme(initialTheme, false);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if ((window.localStorage.getItem("theme") ?? initialTheme) === "system") updateTheme("system", false);
    };
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, [defaultTheme, enableSystem, updateTheme]);

  React.useEffect(() => {
    const syncTheme = (event: StorageEvent) => {
      if (event.key === "theme" && event.newValue) updateTheme(event.newValue as Theme, false);
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, [updateTheme]);

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: (nextTheme) => updateTheme(nextTheme, true) }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
