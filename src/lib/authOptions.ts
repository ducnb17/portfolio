// Cấu hình NextAuth — tách ra khỏi route file để tránh lỗi type App Router
import GoogleProvider from 'next-auth/providers/google';
import { allowedEmails } from '@/lib/auth';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          // drive.readonly: đọc file, drive.file: upload file do app tạo ra
          scope: 'openid email profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file',
        },
      },
    }),
  ],
  callbacks: {
    // Lưu access token vào JWT để dùng cho Google Drive API
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Expose access token trong session
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
    // Chặn đăng nhập nếu email không nằm trong whitelist
    async signIn({ user }) {
      const email = user.email ?? '';
      if (!allowedEmails.includes(email.toLowerCase())) {
        return '/lms?error=AccessDenied';
      }
      return true;
    },
  },
  pages: {
    signIn: '/lms',
    error: '/lms',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
