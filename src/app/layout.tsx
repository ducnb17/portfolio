import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SessionWrapper from '@/components/SessionWrapper';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Nguyễn Bá Đức - Kỹ thuật viên Hệ thống thông tin',
  description:
    'Portfolio cá nhân của Nguyễn Bá Đức - Kỹ thuật viên Hệ thống thông tin, chuyên về AI và Cybersecurity',
  keywords: ['Nguyễn Bá Đức', 'Portfolio', 'AI', 'Cybersecurity', 'Hệ thống thông tin'],
  authors: [{ name: 'Nguyễn Bá Đức' }],
  openGraph: {
    title: 'Nguyễn Bá Đức - Portfolio',
    description: 'Kỹ thuật viên Hệ thống thông tin - AI & Cybersecurity',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* SessionWrapper bọc SessionProvider của NextAuth (client component) */}
        <SessionWrapper>
          <LanguageProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LanguageProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
