import { createContext, useContext, useEffect, useState } from 'react';
import en from './en.json';
import hi from './hi.json';

const DICTS = { en, hi };
const KEY = 'aether.lang';

const I18nContext = createContext({ lang: 'en', t: (k) => k, setLang: () => {} });

function detectLang() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(KEY);
    if (saved && DICTS[saved]) return saved;
  }
  if (typeof navigator !== 'undefined' && navigator.language?.startsWith('hi')) return 'hi';
  return 'en';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detectLang);

  useEffect(() => {
    try { localStorage.setItem(KEY, lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, fallback) => {
    const dict = DICTS[lang] || DICTS.en;
    return dict[key] ?? DICTS.en[key] ?? fallback ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() { return useContext(I18nContext); }
