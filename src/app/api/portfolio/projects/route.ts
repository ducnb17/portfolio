import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { isAdminEmail } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function asTrimmedString(value: unknown, maxLength: number): string | null {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength ? value.trim() : null;
}

function isGitHubRepositoryUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'github.com' || url.hostname === 'www.github.com') && url.pathname.split('/').filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json({ error: 'Unable to load portfolio projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Bạn không có quyền thêm project.' }, { status: 403 });
    }

    const body = await request.json() as Record<string, unknown>;
    const title = asTrimmedString(body.title, 120);
    const description = asTrimmedString(body.description, 600);
    const githubUrl = asTrimmedString(body.githubUrl, 300);
    const status = typeof body.status === 'string' ? body.status.trim().slice(0, 80) || null : null;
    const tech = Array.isArray(body.tech)
      ? Array.from(new Set(body.tech.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))).slice(0, 8).map((item) => item.slice(0, 40))
      : [];

    if (!title || !description || !githubUrl || !isGitHubRepositoryUrl(githubUrl)) {
      return NextResponse.json({ error: 'Nhập tên, mô tả và link repository GitHub hợp lệ.' }, { status: 400 });
    }

    const project = await prisma.portfolioProject.create({ data: { title, description, githubUrl, tech, status } });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json({ error: 'Không thể lưu project.' }, { status: 500 });
  }
}
