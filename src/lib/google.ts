import { prisma } from '@/lib/prisma';

type RefreshResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
};

/** Returns a usable Google Drive token, refreshing it before it expires. */
export async function getGoogleAccessToken(email: string): Promise<string> {
  const account = await prisma.account.findFirst({
    where: { user: { email }, provider: 'google' },
    orderBy: { id: 'desc' },
  });

  if (!account?.access_token) {
    throw new Error('Google Drive has not been authorized. Please sign in again.');
  }

  const expiresAtMs = (account.expires_at ?? 0) * 1000;
  if (expiresAtMs > Date.now() + 60_000) return account.access_token;
  if (!account.refresh_token) {
    throw new Error('Google Drive authorization expired. Please sign in again once to renew it.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      grant_type: 'refresh_token',
      refresh_token: account.refresh_token,
    }),
  });

  if (!response.ok) throw new Error('Google Drive authorization expired. Please sign in again.');

  const refreshed = (await response.json()) as RefreshResponse;
  const expires_at = Math.floor(Date.now() / 1000 + refreshed.expires_in);
  await prisma.account.update({
    where: { id: account.id },
    data: {
      access_token: refreshed.access_token,
      expires_at,
      refresh_token: refreshed.refresh_token ?? account.refresh_token,
    },
  });
  return refreshed.access_token;
}
