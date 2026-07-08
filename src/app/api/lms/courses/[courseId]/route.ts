/**
 * GET /api/lms/courses/[courseId]
 * Trả về nội dung của một khóa học: { id, name, chapters, files, lessons }
 *
 * Hỗ trợ:
 *  - courseId = mock-*              → mock data (dev)
 *  - courseId = khoahoc-group-*     → gộp nhiều folder Drive (group courses)
 *  - courseId = <Drive folder ID>   → folder Drive thực đơn lẻ
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { isAllowedEmail } from '@/lib/auth';
import { listDriveContents, DriveItem } from '@/lib/drive';

export const dynamic = 'force-dynamic';

interface Chapter {
  id: string;
  name: string;
  files: DriveItem[];
}

interface CourseDetail {
  id: string;
  name: string;
  chapters: Chapter[];
  files: DriveItem[];
  lessons: DriveItem[];
}

// ── Map group courses → danh sách folder IDs thực trên Drive ──────────────────
// Mỗi folder trong group = 1 chapter trong UI (tên lấy từ Drive API)
const GROUP_COURSE_FOLDERS: Record<string, { name: string; folderIds: string[] }> = {
  'khoahoc-group-1': {
    name: 'Khóa học giá hời 1',
    folderIds: [
      '13AKCXOOp3bQw7zFePZ4rGKLlBeTFCfSa',
      '1yZCqXlU9j4OQTkMwYn2qTehnQd9rfows',
      '1GwuGmZuGk04LuvgwLUl9ahdZ1NW-2xqF',
      '1hZSyiHEiumz6SODJpkIsonVR3GJNuIKs',
      '12j3S595E6ElUw0ds-9eWqbjvL6B_sOsV',
      '1gl0XINqe2WFXacs1lQid5ON7BC2Tbwo3',
      '1hfb5yO0PhWYARf2uBUfVmdph3ssuFCr7',
      '10kdtVUNpid2TJgRAC45AxuPGqgBaS9aB',
      '12imov_TqJ7SitW4pmeJy63hSoJkarUNh',
      '1yWEG_87Qqfi41RRwuqucWM5D6wkOSt_3',
      '1_dXDGm1pnRLbKSE-Z6mYfnF8ml6z3nkm',
      '16IpDbOlxJRZruMQ2nzdYFh51N9DRU6vl',
      '1kQnEFGmanDo07-XUffO_6ZrvoO1DK_oB',
      '1J3NzVoU6GeTUhCaiO9HZE6hsHa1nRa_n',
      '1oQsN5WPoKUnRHWbRew23XqbEy7syILDI',
      '1A9baK2sh5aM4YSStauX-xfo7lTRtkqz3',
      '1t6Jftg3zGasQ8zAxlr8l6xsdr9FZ8rtt',
      '1AOrzAjxqThV03L3SWrx62AkIvImRMfnF',
      '1_3jNT62R-e9LL--fwpZijHTP3y7nAMrq',
      '1Ehbb2qdrn_gMhLnwN0Dh26JfbqgdfsAs',
      '1p4_ksj2zORF4bzFZX0C-SxrCIrxcq0qv',
      '1-WR_ZcAOTv-OMa_IrUOhNLqik_hb-_1S',
      '1ggJhCt8jlNzgWCDN0Fg2cZ2Qebt5gMBh',
    ],
  },
  'khoahoc-group-2': {
    name: 'Khóa học giá hời 2',
    folderIds: [
      '1pjNn2Wc_f5dLEfF023m5jvMEyF2s2fWj',
      '1lZtmFmLx2qpOGI8K3Gn9vp00NWHEzs3J',
      // Bổ sung thêm khi có link
    ],
  },
};

// ── Mock data (dev) ───────────────────────────────────────────────────────────
const MOCK_COURSES: Record<string, CourseDetail> = {
  'mock-1': {
    id: 'mock-1', name: 'Khóa học AI Cơ bản',
    chapters: [
      { id: 'mock-1-ch1', name: 'Chương 1 - Giới thiệu Machine Learning', files: [
        { id: 'f101', name: 'Giới thiệu Machine Learning.pdf', mimeType: 'application/pdf', modifiedTime: '2024-01-15T10:00:00Z' },
        { id: 'f102', name: 'Bài 1 - Linear Regression.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-14T10:00:00Z' },
      ]},
      { id: 'mock-1-ch2', name: 'Chương 2 - Mô hình nâng cao', files: [
        { id: 'f103', name: 'Bài 2 - Decision Trees.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-13T10:00:00Z' },
        { id: 'f104', name: 'Bài 3 - Neural Networks.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-12T10:00:00Z' },
        { id: 'f105', name: 'Tài liệu tổng hợp.pdf', mimeType: 'application/pdf', modifiedTime: '2024-01-11T10:00:00Z' },
      ]},
    ],
    files: [{ id: 'f100', name: 'Hướng dẫn học tập.pdf', mimeType: 'application/pdf', modifiedTime: '2024-01-16T10:00:00Z' }],
    lessons: [],
  },
  'mock-2': {
    id: 'mock-2', name: 'Cybersecurity Fundamentals',
    chapters: [
      { id: 'mock-2-ch1', name: 'Chương 1 - Nền tảng bảo mật', files: [
        { id: 'f201', name: 'Tổng quan bảo mật mạng.pdf', mimeType: 'application/pdf', modifiedTime: '2024-01-13T10:00:00Z' },
        { id: 'f202', name: 'Bài 1 - Network Security.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-12T10:00:00Z' },
      ]},
      { id: 'mock-2-ch2', name: 'Chương 2 - Ethical Hacking', files: [
        { id: 'f203', name: 'Bài 2 - Ethical Hacking Intro.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-11T10:00:00Z' },
        { id: 'f204', name: 'Bài 3 - Vulnerability Assessment.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-10T10:00:00Z' },
      ]},
    ],
    files: [], lessons: [],
  },
  'mock-3': {
    id: 'mock-3', name: 'Python cho Data Science',
    chapters: [
      { id: 'mock-3-ch1', name: 'Chương 1 - Python cơ bản', files: [
        { id: 'f301', name: 'Cài đặt môi trường Python.pdf', mimeType: 'application/pdf', modifiedTime: '2024-01-10T10:00:00Z' },
        { id: 'f302', name: 'Bài 1 - Python cơ bản.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-09T10:00:00Z' },
      ]},
      { id: 'mock-3-ch2', name: 'Chương 2 - Data Analysis', files: [
        { id: 'f303', name: 'Bài 2 - Pandas & NumPy.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-08T10:00:00Z' },
        { id: 'f304', name: 'Bài 3 - Data Visualization.mp4', mimeType: 'video/mp4', modifiedTime: '2024-01-07T10:00:00Z' },
        { id: 'f305', name: 'Dataset mẫu.csv', mimeType: 'text/csv', modifiedTime: '2024-01-06T10:00:00Z' },
      ]},
    ],
    files: [], lessons: [],
  },
};

// Flatten chapters + root files → lessons[]
function flattenLessons(detail: CourseDetail): DriveItem[] {
  const all: DriveItem[] = [...detail.files];
  for (const ch of detail.chapters) all.push(...ch.files);
  return all;
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAllowedEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { courseId } = params;
    const accessToken = (session as any).accessToken as string;

    // ── Mock data ──
    if (courseId.startsWith('mock-')) {
      const course = MOCK_COURSES[courseId];
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      course.lessons = flattenLessons(course);
      return NextResponse.json(course);
    }

    // ── Group courses (nhiều folder Drive) ──
    if (courseId.startsWith('khoahoc-group-')) {
      const group = GROUP_COURSE_FOLDERS[courseId];
      if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

      // Mỗi folder trong group → một chapter; files bên trong chapter là sub-folders + files
      const chapters: Chapter[] = [];
      for (const folderId of group.folderIds) {
        try {
          // Lấy tên folder trước
          const { folders: subFolders, files: rootFiles, folderName } = await listDriveContents(folderId, accessToken);

          if (subFolders.length > 0) {
            // Folder có sub-folder → mỗi sub-folder là một chapter con
            for (const sub of subFolders) {
              try {
                const { files: subFiles } = await listDriveContents(sub.id, accessToken);
                chapters.push({ id: sub.id, name: sub.name, files: subFiles });
              } catch {
                chapters.push({ id: sub.id, name: sub.name, files: [] });
              }
            }
            // Files ở gốc folder → chapter riêng mang tên folder
            if (rootFiles.length > 0) {
              chapters.push({ id: folderId, name: folderName || folderId, files: rootFiles });
            }
          } else {
            // Folder phẳng — files ở gốc → một chapter
            chapters.push({ id: folderId, name: folderName || folderId, files: rootFiles });
          }
        } catch (err) {
          console.error(`Error fetching folder ${folderId}:`, err);
          // Vẫn thêm chapter trống để người dùng biết folder tồn tại
          chapters.push({ id: folderId, name: folderId, files: [] });
        }
      }

      const detail: CourseDetail = { id: courseId, name: group.name, chapters, files: [], lessons: [] };
      detail.lessons = flattenLessons(detail);
      return NextResponse.json(detail);
    }

    // ── Drive folder đơn thông thường ──
    const { folders, files, folderName } = await listDriveContents(courseId, accessToken);

    // Nếu folder gốc chỉ có sub-folder mà không có file ở gốc, và sub-folder đó
    // lại chứa toàn sub-folder → cấu trúc 3 lớp (wrapper → khóa học → bài học)
    // Xử lý: đi sâu thêm 1 lớp vào wrapper folder
    let workingFolders = folders;
    let workingFiles = files;

    if (folders.length === 1 && files.length === 0) {
      // Có thể là wrapper folder — kiểm tra bên trong
      try {
        const inner = await listDriveContents(folders[0].id, accessToken);
        if (inner.folders.length > 0) {
          // Đây là wrapper → dùng nội dung bên trong
          workingFolders = inner.folders;
          workingFiles = inner.files;
        }
      } catch { /* giữ nguyên nếu lỗi */ }
    }

    const chapters: Chapter[] = await Promise.all(
      workingFolders.map(async (folder) => {
        try {
          const { files: chapterFiles, folders: subFolders } = await listDriveContents(folder.id, accessToken);
          // Nếu chapter con lại có sub-folder, flatten tất cả vào chapter
          if (subFolders.length > 0) {
            const allFiles = [...chapterFiles];
            for (const sub of subFolders) {
              try {
                const { files: subFiles } = await listDriveContents(sub.id, accessToken);
                allFiles.push(...subFiles);
              } catch { /* bỏ qua */ }
            }
            return { id: folder.id, name: folder.name, files: allFiles };
          }
          return { id: folder.id, name: folder.name, files: chapterFiles };
        } catch {
          return { id: folder.id, name: folder.name, files: [] };
        }
      })
    );

    const detail: CourseDetail = { id: courseId, name: folderName || '', chapters, files: workingFiles, lessons: [] };
    detail.lessons = flattenLessons(detail);
    return NextResponse.json(detail);

  } catch (error) {
    console.error('Error fetching course content:', error);
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
