/**
 * API upload tài liệu học tập lên Google Drive
 * POST /api/lms/upload
 *
 * Nhận multipart/form-data với:
 *   - file: File (video, PDF, tài liệu...)
 *   - folderId: string (ID thư mục đích trên Drive)
 *
 * Yêu cầu:
 *   - Đã đăng nhập Google OAuth
 *   - Email trong whitelist
 *   - Access token của user phải có scope drive (không phải drive.readonly)
 *     → Cần thêm scope 'https://www.googleapis.com/auth/drive.file' vào authOptions
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { uploadFileToDrive } from '@/lib/drive';
import { isAdminEmail } from '@/lib/admin';
import { getGoogleAccessToken } from '@/lib/google';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Giới hạn kích thước file upload: 100MB
export const maxDuration = 60; // seconds (Vercel hobby limit)

export async function POST(request: Request) {
  try {
    // 1. Xác thực session + whitelist
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const accessToken = await getGoogleAccessToken(session.user.email);

    // 2. Parse multipart form
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: 'Không thể đọc form data' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    const folderId = formData.get('folderId') as string | null;
    const courseId = formData.get('courseId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Thiếu file' }, { status: 400 });
    }
    if (!folderId) {
      return NextResponse.json({ error: 'Thiếu folderId' }, { status: 400 });
    }

    // 3. Kiểm tra loại file được phép upload
    // Every MIME type is accepted: video, audio, images, archives, ISO and documents.
    // Browsers/Google Drive decide whether a particular format can be previewed.
    const MAX_SIZE = Number(process.env.LMS_MAX_UPLOAD_BYTES || 500 * 1024 * 1024);
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File is too large. Maximum upload size is ${Math.floor(MAX_SIZE / 1024 / 1024)} MB.` },
        { status: 400 }
      );
    }

    // 4. Đọc file buffer và upload lên Drive
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await uploadFileToDrive(
      folderId,
      file.name,
      file.type || 'application/octet-stream',
      buffer,
      accessToken
    );

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });
    await prisma.uploadedMedia.upsert({
      where: { driveFileId: uploaded.id },
      create: {
        driveFileId: uploaded.id,
        courseId: courseId || null,
        folderId,
        fileName: uploaded.name,
        mimeType: uploaded.mimeType,
        sizeBytes: BigInt(uploaded.size ?? file.size),
        driveViewUrl: uploaded.webViewLink ?? null,
        uploadedById: user.id,
      },
      update: {
        courseId: courseId || null,
        folderId,
        fileName: uploaded.name,
        mimeType: uploaded.mimeType,
        sizeBytes: BigInt(uploaded.size ?? file.size),
        driveViewUrl: uploaded.webViewLink ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      file: uploaded,
      message: `Upload thành công: ${file.name}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
