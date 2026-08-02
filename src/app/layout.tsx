import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SessionWrapper from '@/components/SessionWrapper';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Nguyễn Bá Đức - IT Support & System Operations',
  description:
    'Portfolio Nguyễn Bá Đức - Kỹ thuật viên CNTT, IT Support và System Operations; vận hành VPS, web, ảo hóa và triển khai dự án với AI hỗ trợ.',
  keywords: ['Nguyễn Bá Đức', 'IT Support', 'System Operations', 'VPS Linux', 'AI-assisted projects', 'Portfolio'],
  authors: [{ name: 'Nguyễn Bá Đức' }],
  openGraph: {
    title: 'Nguyễn Bá Đức - Portfolio',
    description: 'IT Technician, IT Support & System Operations - AI-Assisted Projects',
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
