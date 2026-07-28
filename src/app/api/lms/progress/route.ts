import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { canAccessLms } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (!(await canAccessLms(email))) return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { response: NextResponse.json({ error: 'User not found' }, { status: 401 }) };
  return { user };
}

export async function GET() {
  const auth = await getUser();
  if ('response' in auth) return auth.response;
  const rows = await prisma.lessonProgress.findMany({ where: { userId: auth.user.id } });
  const progress: Record<string, string[]> = {};
  for (const row of rows) (progress[row.courseId] ??= []).push(row.lessonId);
  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const auth = await getUser();
  if ('response' in auth) return auth.response;
  const body = await request.json().catch(() => null) as { courseId?: string; lessonId?: string } | null;
  if (!body?.courseId || !body.lessonId) {
    return NextResponse.json({ error: 'courseId and lessonId are required' }, { status: 400 });
  }
  await prisma.lessonProgress.upsert({
    where: { userId_courseId_lessonId: { userId: auth.user.id, courseId: body.courseId, lessonId: body.lessonId } },
    create: { userId: auth.user.id, courseId: body.courseId, lessonId: body.lessonId },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const auth = await getUser();
  if ('response' in auth) return auth.response;
  const body = await request.json().catch(() => null) as { courseId?: string } | null;
  if (!body?.courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
  await prisma.lessonProgress.deleteMany({ where: { userId: auth.user.id, courseId: body.courseId } });
  return NextResponse.json({ ok: true });
}
