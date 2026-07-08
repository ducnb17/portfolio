'use client';

/**
 * Context quản lý ngôn ngữ hiện tại cho toàn bộ app.
 * Lưu lựa chọn vào localStorage để giữ nguyên khi F5.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Locale } from './translations';

// Dùng kiểu chung để tránh lỗi literal type khi so sánh các ngôn ngữ khác nhau
type Translation = (typeof translations)[Locale];

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi');

  // Khởi tạo từ localStorage khi component mount
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && ['vi', 'en', 'ja'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    // Cập nhật lang attribute cho SEO và screen reader
    document.documentElement.lang = newLocale;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/** Hook tiện ích — dùng trong mọi component cần dịch */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
