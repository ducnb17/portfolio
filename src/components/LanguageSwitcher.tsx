'use client';

/**
 * Dropdown chuyển đổi ngôn ngữ: Tiếng Việt / English / 日本語
 * Hiển thị cờ + tên viết tắt, click ngoài để đóng.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale } from '@/lib/i18n/translations';

const LANGUAGES: { code: Locale; flag: string; label: string; short: string }[] = [
  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt', short: 'VI' },
  { code: 'en', flag: '🇬🇧', label: 'English', short: 'EN' },
  { code: 'ja', flag: '🇯🇵', label: '日本語', short: 'JA' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === locale)!;

  return (
    <div ref={ref} className="relative">
      {/* Nút hiện tại */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
        aria-label="Chuyển đổi ngôn ngữ"
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.short}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                locale === lang.code
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-50 dark:bg-cyan-900/20'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {locale === lang.code && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
