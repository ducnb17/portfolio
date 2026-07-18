import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { isAllowedEmail } from '@/lib/auth';
import { listDriveFolders } from '@/lib/drive';

export const dynamic = 'force-dynamic';

export interface CourseEntry {
  id: string;
  name: string;
  mimeType: string;
  group: 'courses' | 'huyen-hoc'; // nhóm hiển thị
  urls?: string[]; // link Google Drive bổ sung (nếu có nhiều folder)
}

// Danh sách khóa học cố định — nhóm "Khóa học" (giá hời) lên đầu
const STATIC_COURSES: CourseEntry[] = [
  // ── Nhóm: Khóa học (giá hời — hiển thị đầu tiên) ──
  {
    id: 'khoahoc-group',
    name: 'Khóa học giá hời',
    mimeType: 'application/vnd.google-apps.folder',
    group: 'courses',
    urls: [
      'https://docs.google.com/spreadsheets/d/1-C8RJ9TnacsHNdnFHMUUeWqY3Q-GdW35/edit?gid=1095799787#gid=1095799787',
      ],
  },
  { id: '13AKCXOOp3bQw7zFePZ4rGKLlBeTFCfSa', name: 'Khóa Học Giá Hời (Full Course)', mimeType: 'application/vnd.google-apps.folder', group: 'courses', urls: ['https://drive.google.com/drive/folders/13AKCXOOp3bQw7zFePZ4rGKLlBeTFCfSa'] },
  { id: '1yZCqXlU9j4OQTkMwYn2qTehnQd9rfows', name: 'Khóa Học Giá Hời 2026', mimeType: 'application/vnd.google-apps.folder', group: 'courses', urls: ['https://drive.google.com/drive/folders/1yZCqXlU9j4OQTkMwYn2qTehnQd9rfows'] },
  { id: '1GwuGmZuGk04LuvgwLUl9ahdZ1NW-2xqF', name: 'Khóa Học Giá Hời 2026', mimeType: 'application/vnd.google-apps.folder', group: 'courses', urls: ['https://drive.google.com/drive/folders/1GwuGmZuGk04LuvgwLUl9ahdZ1NW-2xqF'] },
  // ... Hàng ngàn dòng khác đã được xử lý

  // ── Nhóm: Huyền học (sắp xếp theo tên) ──
  { id: '1ZjFtzFbqcLpHsuaReBiCWvTOcgN96t-A', name: '3.09 Khóa Luận Phong Thủy Nhà Cửa Thực Chiến - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1miGAChJKa55NaN17aYCSagWWQQJVPE_i', name: '3.13 Khóa PT Cấp Tốc - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1rn-ZMCZiyeS-FB7EptHfkfrxysVP7V-9', name: '3.15 Khóa HKPT Lý Thuyết Cơ Bản - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1gg50mI_S5DD7fHMPqTiyznShRAHF7BOZ', name: '3.16 Khóa HKPT Thực Hành Nâng Cao - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1PRvUEg9jNfDalRGwiwduPXNlRjp1aEgd', name: '3.17 Khóa Bát Trạch - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1Yb_KhgwG2O3_zksCFeb8d-18rwA451eo', name: '3.03 Khóa Phong Thủy Tam Hợp Phái Minh Việt - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1gGDG_Z0Yk6H0E85xHyupZ7NIKIrkuvM2', name: '3.01 Khóa HKDQ Minh Việt - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1x26EVXzXMArIoXmem_ayySQv_2J_V46j', name: '2.01 Khóa Bát Tự Mạnh Phái Sơ Cấp - Thầy Đoàn', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1XaE1ZqCr6Mi648PYG1NB76VluhznjOaA', name: '2.08 Khóa Bát Tự Tứ Trụ K1 Tam Nguyên', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1SFMRgIEMiVOdrlK-KqhyZPrE5wyCsUYh', name: '2.12 Khóa Bát Tự Cơ Bản - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1Fi0iPalj9u-_4euRRHZO5b5fkupi4KsN', name: '1.18 Khóa Tử Vi NP 33 Video - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '17nfMzEa4BgccS45wtAKOtkMxlIUf711c', name: '1.32 Khóa Tử Vi NP Cơ Bản - Thầy Nguyễn Trọng Tuệ', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1tGz7lgPCExvjjvA9b9GHDowQzgXt3FsF', name: '1.09 Hành Trình Tử Vi (Mộc Đầu) - 54 Video', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1cPA4kpT-Se4Z_gX0I3FWG7QpPL2cyzAW', name: '1.20 Tử Vi Cơ Bản - Tống Nguyên Trung', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: 'doc-1-33', name: '1.33 Tử Vi Nâng Cao - Nguyễn Trọng Tuệ 2025', mimeType: 'application/vnd.google-apps.document', group: 'huyen-hoc', urls: ['https://docs.google.com/document/d/19DrFweqydyB2K6Gkmm7Os5oE-ItlZZn0/edit'] },
  { id: '1vz5Xv4iNmpUtT71a6CsKNUY99h6bpCxm', name: '4.01 Khóa KD Lục Hào Cơ Bản - Minh Việt', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1uuRgX7Js_s6Z35xuvXRPlvgKLIyNVNkW', name: '4.13 Khóa Bốc Dịch - Thầy Tuệ', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1WXH7ZFc0OEhSz-KN7jtYit5FIJszyonf', name: '5.05 Khóa Học KMĐG - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1tX_5m3HveFjfkgBS7WZ3S-tL2cNtsgsx', name: '5.11 Khóa Kỳ Môn Toàn Thư - Nguyễn Tấn Công', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1tpqbkgS4AFOSS5-ZrXPjOnIzgzLVuzJj', name: '6.02 Khóa Trạch Nhật Dụng Sự - Thầy Tuệ', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1_qqtQsmFNGiK9s-X-q3MEPSpQbYL2AXq', name: '6.04 Khóa Xem Ngày Tốt - Nam Việt', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '18pVehh8ABNkhrhJ8B4o33l7jbiVBmDfc', name: '7.08 Khóa Nhân Tướng Sơ Cấp - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1v40wFmbUBu2e4s5fYzqjopEKEgJVijrI', name: '8.17 Thần Số Học - Thầy Cường', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1Oso0nnoxC0IZw1fYgsq2_0n7tiY0H9hL', name: 'Khóa Tự Học Bói Bài Tây - Cô Moon', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1G_vx-wvqTsMTwnNl8l7vjwOdgCftEp2a', name: 'Khóa Bói Bài Tây Nâng Cao', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },

  // ── Các khóa bổ sung ──
  { id: '1LMNdG5DDPp1mW403bgLU24oIW7c89Bxh', name: '1.27 Khâm Thiên Tứ Hóa Phái - Chiến Nguyễn (17 Video)', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '1rmO1MvNP7Tif1PFpZFCeszllBZo6UBpH', name: '2.09 Khóa Master Bát Tự - Nguyễn Dũng', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
  { id: '19ghqBqRZxHc0nhgWXzanNyjks29i1jh5', name: '5.02 Khóa Kỳ Môn Độn Giáp Cơ Bản - Thầy Dũng', mimeType: 'application/vnd.google-apps.folder', group: 'huyen-hoc' },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAllowedEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Sắp xếp nhóm huyen-hoc theo tên
    const sorted = [
      ...STATIC_COURSES.filter(c => c.group === 'courses'),
      ...STATIC_COURSES.filter(c => c.group === 'huyen-hoc').sort((a, b) => a.name.localeCompare(b.name, 'vi')),
    ];

    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — thêm khóa học mới (lưu vào custom-courses.json trên server)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAllowedEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const { name, url, group } = body as { name: string; url: string; group: 'courses' | 'huyen-hoc' };
    if (!name || !url) {
      return NextResponse.json({ error: 'name và url là bắt buộc' }, { status: 400 });
    }

    // Trích ID từ URL Drive
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    const id = match ? match[1] : `custom-${Date.now()}`;

    const newEntry: CourseEntry = {
      id, name,
      mimeType: 'application/vnd.google-apps.folder',
      group: group ?? 'huyen-hoc',
      urls: [url],
    };

    // Đọc file custom nếu có, append, ghi lại
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'custom-courses.json');
    let existing: CourseEntry[] = [];
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      existing = JSON.parse(raw);
    } catch { /* file chưa tồn tại */ }

    existing.push(newEntry);
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8');

    return NextResponse.json({ success: true, course: newEntry });
  } catch (error) {
    console.error('POST courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
