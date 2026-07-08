'use client';

// SessionProvider phải chạy ở client — tách ra component riêng
// để layout.tsx (server component) có thể import được
import { SessionProvider } from 'next-auth/react';

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
