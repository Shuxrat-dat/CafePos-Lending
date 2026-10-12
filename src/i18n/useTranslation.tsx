'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { defaultLocale, type Locale } from './locales';
import { translations, type Translations } from './translations';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const STORAGE_KEY = 'cafepos-locale';
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function readStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'ru' || value === 'uz' ? value : null;
  } catch {
    return null;
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // The server always renders the default locale; the stored choice is applied
  // after hydration so server and client markup match.
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = readStoredLocale();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage after hydration
    if (stored && stored !== defaultLocale) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translations[locale].meta.title;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — the choice lasts for this visit only */
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale, t: translations[locale] }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useTranslation must be used within LocaleProvider');
  return context;
}

/** Locale-aware number formatting (spaces as thousand separators). */
export function useFormatNumber() {
  const { locale } = useTranslation();
  return useCallback((n: number) => new Intl.NumberFormat(locale === 'uz' ? 'uz-UZ' : 'ru-RU').format(n), [locale]);
}
