import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { isAdminEmail } from '@/lib/admin';
import { normalizeEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { email: session.user.email };
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;
  const emails = await prisma.lmsAccessEmail.findMany({ orderBy: { email: 'asc' } });
  return NextResponse.json({ adminEmail: auth.email.toLowerCase(), emails });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;
  const body = await request.json().catch(() => null) as { email?: string } | null;
  const email = body?.email ? normalizeEmail(body.email) : '';
  if (!validEmail(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  await prisma.lmsAccessEmail.upsert({ where: { email }, create: { email }, update: {} });
  return NextResponse.json({ ok: true, email });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;
  const body = await request.json().catch(() => null) as { email?: string; nextEmail?: string } | null;
  const email = body?.email ? normalizeEmail(body.email) : '';
  const nextEmail = body?.nextEmail ? normalizeEmail(body.nextEmail) : '';
  if (!validEmail(email) || !validEmail(nextEmail)) {
    return NextResponse.json({ error: 'Both emails must be valid' }, { status: 400 });
  }
  if (isAdminEmail(email) || isAdminEmail(nextEmail)) {
    return NextResponse.json({ error: 'The administrator email is managed by configuration' }, { status: 400 });
  }
  await prisma.lmsAccessEmail.update({ where: { email }, data: { email: nextEmail } });
  return NextResponse.json({ ok: true, email: nextEmail });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;
  const body = await request.json().catch(() => null) as { email?: string } | null;
  const email = body?.email ? normalizeEmail(body.email) : '';
  if (!validEmail(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  if (isAdminEmail(email)) {
    return NextResponse.json({ error: 'The administrator email cannot be removed' }, { status: 400 });
  }
  await prisma.lmsAccessEmail.delete({ where: { email } }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
