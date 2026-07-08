/**
 * API lưu tiến trình học — server-side, lưu vào file JSON trong /data/progress/
 * Mỗi user có một file riêng: {email-hash}.json
 * Dữ liệu: { courseId: [lessonId, ...], ... }
 *
 * GET  /api/lms/progress           — lấy toàn bộ tiến trình của user hiện tại
 * POST /api/lms/progress           — đánh dấu một bài đã xem
 * DELETE /api/lms/progress         — reset tiến trình một khóa học
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { isAllowedEmail } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Thư mục lưu file tiến trình — tạo tự động nếu chưa có
const DATA_DIR = path.join(process.cwd(), 'data', 'progress');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Hash email để làm tên file (tránh lộ email trong filesystem)
function emailToFilename(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex') + '.json';
}

function readProgress(email: string): Record<string, string[]> {
  ensureDir();
  const filePath = path.join(DATA_DIR, emailToFilename(email));
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

function writeProgress(email: string, data: Record<string, string[]>) {
  ensureDir();
  const filePath = path.join(DATA_DIR, emailToFilename(email));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ---- Auth helper ----
async function authenticate() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: 'Unauthorized', status: 401, session: null };
  if (!isAllowedEmail(session.user.email)) return { error: 'Forbidden', status: 403, session: null };
  return { error: null, status: 200, session };
}

// GET — trả về toàn bộ tiến trình
export async function GET() {
  const { error, status, session } = await authenticate();
  if (error) return NextResponse.json({ error }, { status });

  const progress = readProgress(session!.user!.email!);
  return NextResponse.json(progress);
}

// POST — đánh dấu bài học đã xem
// Body: { courseId: string, lessonId: string }
export async function POST(request: Request) {
  const { error, status, session } = await authenticate();
  if (error) return NextResponse.json({ error }, { status });

  let body: { courseId?: string; lessonId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { courseId, lessonId } = body;
  if (!courseId || !lessonId) {
    return NextResponse.json({ error: 'courseId và lessonId là bắt buộc' }, { status: 400 });
  }

  const email = session!.user!.email!;
  const progress = readProgress(email);

  if (!progress[courseId]) progress[courseId] = [];
  if (!progress[courseId].includes(lessonId)) {
    progress[courseId].push(lessonId);
  }

  writeProgress(email, progress);
  return NextResponse.json({ ok: true, progress });
}

// DELETE — reset tiến trình của một khóa học
// Body: { courseId: string }
export async function DELETE(request: Request) {
  const { error, status, session } = await authenticate();
  if (error) return NextResponse.json({ error }, { status });

  let body: { courseId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { courseId } = body;
  if (!courseId) {
    return NextResponse.json({ error: 'courseId là bắt buộc' }, { status: 400 });
  }

  const email = session!.user!.email!;
  const progress = readProgress(email);
  delete progress[courseId];
  writeProgress(email, progress);

  return NextResponse.json({ ok: true });
}
