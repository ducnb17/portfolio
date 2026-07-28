const DEFAULT_ADMIN_EMAIL = 'ducnb17@gmail.com';

export const adminEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();

export function isAdminEmail(email?: string | null): boolean {
  return !!email && email.trim().toLowerCase() === adminEmail;
}
