"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import fr from "./fr.json";
import en from "./en.json";

type Locale = "fr" | "en";
type Translations = typeof fr;

const translations: Record<Locale, Translations> = { fr, en };

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "fr";
    const saved = localStorage.getItem("vb-lang") as Locale | null;
    if (saved && (saved === "fr" || saved === "en")) return saved;
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === "en" ? "en" : "fr";
  });

  const handleSetLocale = useCallback((l: Locale) => {
    setLocale(l);
    localStorage.setItem("vb-lang", l);
    document.documentElement.lang = l;
  }, []);

  const toggleLocale = useCallback(() => {
    handleSetLocale(locale === "fr" ? "en" : "fr");
  }, [locale, handleSetLocale]);

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], setLocale: handleSetLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
