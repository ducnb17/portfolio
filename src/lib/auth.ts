import { isAdminEmail } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function canAccessLms(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (isAdminEmail(normalized)) return true;
  const access = await prisma.lmsAccessEmail.findUnique({ where: { email: normalized } });
  return !!access;
}
