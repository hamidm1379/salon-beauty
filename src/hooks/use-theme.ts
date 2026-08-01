"use client";

import { useCallback, useSyncExternalStore } from "react";

function applyTheme(t: "light" | "dark") {
  document.documentElement.classList.toggle("dark", t === "dark");
}

function readTheme(): "light" | "dark" {
  const stored = localStorage.getItem("theme") as "light" | "dark" | null;
  if (stored) return stored;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    () => "light" as const,
  );
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const setTheme = useCallback((t: "light" | "dark") => {
    localStorage.setItem("theme", t);
    applyTheme(t);
  }, []);

  return { theme, setTheme, mounted };
}
