'use client';
/* eslint-disable react-hooks/set-state-in-effect */
// ===== Locale Context — Client-side i18n using next-intl =====
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';

type Locale = 'es' | 'en';

interface LocaleContextType {
          locale: Locale;
          setLocale: (locale: Locale) => void;
          toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextType>({
          locale: 'es',
          setLocale: () => { },
          toggleLocale: () => { },
});

export const useLocale = () => useContext(LocaleContext);

const messages: Record<Locale, typeof esMessages> = { es: esMessages, en: enMessages };

export function LocaleProvider({ children }: { children: React.ReactNode }) {
          const [locale, setLocaleState] = useState<Locale>('es');

          // Load saved locale from localStorage
          useEffect(() => {
                    try {
                              const saved = localStorage.getItem('orionix-locale') as Locale | null;
                              if (saved && (saved === 'es' || saved === 'en')) {
                                        setLocaleState(saved);
                              }
                    } catch { }
          }, []);

          const setLocale = useCallback((newLocale: Locale) => {
                    setLocaleState(newLocale);
                    try { localStorage.setItem('orionix-locale', newLocale); } catch { }
                    // Update html lang attribute
                    document.documentElement.lang = newLocale;
          }, []);

          const toggleLocale = useCallback(() => {
                    setLocale(locale === 'es' ? 'en' : 'es');
          }, [locale, setLocale]);

          return (
                    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
                              <NextIntlClientProvider locale={locale} messages={messages[locale]}>
                                        {children}
                              </NextIntlClientProvider>
                    </LocaleContext.Provider>
          );
}
