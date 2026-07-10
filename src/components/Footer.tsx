'use client';

import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{t.footer.contact}</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <a href="mailto:ducnb17@gmail.com" className="hover:text-cyan-400">
                  ducnb17@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>0984-611-191</span>
              </p>
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{t.footer.address}</h3>
            <p>{t.footer.addressLine1}</p>
            <p>{t.footer.addressLine2}</p>
          </div>

          {/* Mạng xã hội */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{t.footer.social}</h3>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-gray-800 hover:bg-cyan-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
<a
  href="https://github.com/ducnb17"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="GitHub"
  className="p-2 rounded-lg bg-gray-800 hover:bg-cyan-600 transition-colors"
>
  <Github className="w-5 h-5" />
</a>
              <a
                href="mailto:ducnb17@gmail.com"
                aria-label="Email"
                className="p-2 rounded-lg bg-gray-800 hover:bg-cyan-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
