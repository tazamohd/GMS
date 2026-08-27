import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Theme + language preferences for the Salis design system.
 *
 * The exported storage keys, the `dark` class on the root element and the
 * `ltr`/`rtl` direction all mirror what every `.dc.html` screen does inline:
 *
 *   const dark = (localStorage.getItem("salis-theme") ?? props.theme) === "dark";
 *   const lang =  localStorage.getItem("salis-lang")  ?? props.lang ?? "en";
 *   rootClass = dark ? "dark" : "";  dir = lang === "ar" ? "rtl" : "ltr";
 */
export const THEME_STORAGE_KEY = "salis-theme";
export const LANG_STORAGE_KEY = "salis-lang";

export type Theme = "light" | "dark";
export type Lang = "en" | "ar";

type SalisPrefs = {
  theme: Theme;
  lang: Lang;
  dark: boolean;
  rtl: boolean;
  dir: "ltr" | "rtl";
  setTheme: (theme: Theme) => void;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
  toggleLang: () => void;
};

const SalisPrefsContext = createContext<SalisPrefs | null>(null);

// localStorage throws in private-mode Safari and in SSR/test environments, so
// every access is guarded rather than assumed.
function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return allowed.includes(stored as T) ? (stored as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* preferences are best-effort — a failed write must not break the UI */
  }
}

export function SalisPrefsProvider({
  children,
  defaultTheme = "light",
  defaultLang = "en",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultLang?: Lang;
}) {
  const [theme, setThemeState] = useState<Theme>(() =>
    readStored(THEME_STORAGE_KEY, ["light", "dark"] as const, defaultTheme),
  );
  const [lang, setLangState] = useState<Lang>(() =>
    readStored(LANG_STORAGE_KEY, ["en", "ar"] as const, defaultLang),
  );

  const dark = theme === "dark";
  const rtl = lang === "ar";

  // Tailwind is configured with darkMode: ["class"], so the `dark` variant keys
  // off this class on <html>. `dir` and `lang` go on the same element so that
  // CSS logical properties (inset-inline-*, border-inline-*) resolve correctly.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.dir = rtl ? "rtl" : "ltr";
    root.lang = lang;
  }, [dark, rtl, lang]);

  const setTheme = useCallback((next: Theme) => {
    writeStored(THEME_STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const setLang = useCallback((next: Lang) => {
    writeStored(LANG_STORAGE_KEY, next);
    setLangState(next);
  }, []);

  const value = useMemo<SalisPrefs>(
    () => ({
      theme,
      lang,
      dark,
      rtl,
      dir: rtl ? "rtl" : "ltr",
      setTheme,
      setLang,
      toggleTheme: () => setTheme(dark ? "light" : "dark"),
      toggleLang: () => setLang(rtl ? "en" : "ar"),
    }),
    [theme, lang, dark, rtl, setTheme, setLang],
  );

  return <SalisPrefsContext.Provider value={value}>{children}</SalisPrefsContext.Provider>;
}

export function useSalisPrefs(): SalisPrefs {
  const ctx = useContext(SalisPrefsContext);
  if (!ctx) throw new Error("useSalisPrefs must be used within a SalisPrefsProvider");
  return ctx;
}
