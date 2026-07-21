import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { canAccessLms } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Captures a refresh token once; future Drive token renewal is silent.
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        (session.user as typeof session.user & { isAdmin?: boolean }).isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
    async signIn({ user }) {
      const email = user.email ?? '';
      if (!(await canAccessLms(email))) return '/lms?error=AccessDenied';
      return true;
    },
  },
  pages: { signIn: '/lms', error: '/lms' },
  secret: process.env.NEXTAUTH_SECRET,
};
