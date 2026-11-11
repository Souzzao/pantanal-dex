import React, { createContext, useContext, useLayoutEffect, useMemo } from 'react';
import { localeFor, setActiveLocale, translateUi, type Locale } from '@/shared/i18n';

const LanguageContext = createContext<{ locale: Locale; t: (text: string) => string }>({ locale: 'pt', t: text => text });
export function LanguageProvider({ language, children }: { language: string; children: React.ReactNode }) {
  const locale = localeFor(language);
  useLayoutEffect(() => { setActiveLocale(locale); }, [locale]);
  const value = useMemo(() => ({ locale, t: (text: string) => translateUi(text, locale) }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export const useI18n = () => useContext(LanguageContext);
