// NextAuth v4 route handler — chỉ export GET và POST (App Router yêu cầu)
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
