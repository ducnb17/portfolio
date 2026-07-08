/**
 * Helper functions để gọi Google Drive API bằng OAuth access token của user.
 * Dùng user's own token (OAuth "on behalf of user") — chỉ truy cập được file
 * mà user đó sở hữu hoặc được chia sẻ.
 */

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;           // bytes, chỉ có với file (không có với Google Docs/Sheets)
  thumbnailLink?: string;  // thumbnail do Drive tạo
  webViewLink?: string;    // link xem trên web
  iconLink?: string;       // icon loại file
}

const DRIVE_API = 'https://www.googleapis.com/drive/v3';

// Fields cần lấy khi list file/folder
const FILE_FIELDS = 'files(id,name,mimeType,modifiedTime,size,thumbnailLink,webViewLink,iconLink)';

/**
 * Liệt kê các thư mục con trực tiếp trong một folder
 * Dùng cho: danh sách khóa học (level 1) hoặc chương (level 2)
 */
export async function listDriveFolders(
  folderId: string,
  accessToken: string
): Promise<DriveItem[]> {
  const q = encodeURIComponent(
    `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const url = `${DRIVE_API}/files?q=${q}&fields=${FILE_FIELDS}&orderBy=name&pageSize=100`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    // Không cache — luôn lấy dữ liệu mới nhất
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Drive API listFolders error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return (data.files ?? []) as DriveItem[];
}

/**
 * Liệt kê tất cả file (không phải folder) trong một folder
 * Dùng cho: danh sách bài học bên trong một chương/khóa học
 */
export async function listDriveFiles(
  folderId: string,
  accessToken: string
): Promise<DriveItem[]> {
  const q = encodeURIComponent(
    `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`
  );
  const url = `${DRIVE_API}/files?q=${q}&fields=${FILE_FIELDS}&orderBy=name&pageSize=200`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Drive API listFiles error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return (data.files ?? []) as DriveItem[];
}

/**
 * Liệt kê cả folder và file trong một folder (dùng cho cấu trúc lồng nhau)
 * Trả về: { folders: DriveItem[], files: DriveItem[] }
 */
export async function listDriveContents(
  folderId: string,
  accessToken: string
): Promise<{ folders: DriveItem[]; files: DriveItem[]; folderName: string }> {
  // Lấy tên folder và danh sách con song song
  const [metaRes, listRes] = await Promise.all([
    fetch(`${DRIVE_API}/files/${folderId}?fields=id,name`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }),
    fetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(`'${folderId}' in parents and trashed = false`)}&fields=${FILE_FIELDS}&orderBy=folder,name&pageSize=200`,
      { headers: { Authorization: `Bearer ${accessToken}` }, cache: 'no-store' }
    ),
  ]);

  // folderName — không throw nếu lỗi, chỉ để trống
  let folderName = '';
  if (metaRes.ok) {
    const meta = await metaRes.json();
    folderName = meta.name ?? '';
  }

  if (!listRes.ok) {
    const err = await listRes.text();
    throw new Error(`Drive API listContents error (${listRes.status}): ${err}`);
  }

  const data = await listRes.json();
  const items: DriveItem[] = data.files ?? [];

  return {
    folders: items.filter((i) => i.mimeType === 'application/vnd.google-apps.folder'),
    files: items.filter((i) => i.mimeType !== 'application/vnd.google-apps.folder'),
    folderName,
  };
}

/**
 * Lấy metadata của một file cụ thể (dùng để hiển thị thông tin chi tiết)
 */
export async function getDriveFile(
  fileId: string,
  accessToken: string
): Promise<DriveItem> {
  const fields = 'id,name,mimeType,modifiedTime,size,thumbnailLink,webViewLink,iconLink';
  const url = `${DRIVE_API}/files/${fileId}?fields=${fields}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Drive API getFile error (${res.status}): ${err}`);
  }

  return res.json() as Promise<DriveItem>;
}

/**
 * Upload file lên Google Drive vào một folder cụ thể
 * Dùng multipart upload — phù hợp với file nhỏ/vừa (< 5MB)
 * Với file lớn hơn nên dùng resumable upload (TODO)
 */
export async function uploadFileToDrive(
  folderId: string,
  fileName: string,
  mimeType: string,
  fileBuffer: Buffer,
  accessToken: string
): Promise<DriveItem> {
  // Metadata của file
  const metadata = JSON.stringify({ name: fileName, parents: [folderId] });

  // Tạo multipart/related body thủ công
  const boundary = '-------GoogleDriveUploadBoundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart =
    `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${metadata}` +
    `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

  const metaBuffer = Buffer.from(metadataPart, 'utf-8');
  const closeBuffer = Buffer.from(closeDelimiter, 'utf-8');
  const body = Buffer.concat([metaBuffer, fileBuffer, closeBuffer]);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': body.length.toString(),
      },
      body,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Drive API upload error (${res.status}): ${err}`);
  }

  return res.json() as Promise<DriveItem>;
}

/**
 * Xác định loại nội dung từ mimeType để render đúng viewer
 */
export function getContentType(mimeType: string): 'video' | 'pdf' | 'doc' | 'image' | 'other' {
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (
    mimeType === 'application/vnd.google-apps.document' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  )
    return 'doc';
  if (mimeType.startsWith('image/')) return 'image';
  return 'other';
}
