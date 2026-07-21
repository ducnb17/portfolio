# Portfolio cá nhân — Nguyễn Bá Đức

## LMS database and persistent sign-in

The LMS now uses PostgreSQL for NextAuth users, sessions and Google OAuth tokens,
course entries, learning progress, and uploaded-video metadata. Videos remain in
Google Drive, which avoids putting large media files in a relational database.

1. Copy `.env.database.example` values into `.env.local` and hosting settings.
2. Run `node node_modules/prisma/build/index.js migrate deploy` with `DATABASE_URL` set.
3. Sign in once with Google to grant offline Drive permission. Later Drive tokens refresh automatically.

Only `ADMIN_EMAIL` (default `ducnb17@gmail.com`) can add courses or upload files.
`ALLOWED_EMAILS` controls who may view the LMS.

Website portfolio cá nhân + LMS tích hợp Google Drive, xây dựng bằng **Next.js 14 App Router**, **TypeScript**, **TailwindCSS**, **NextAuth.js**.

---

## 🚀 Chạy local

### Yêu cầu
- Node.js 18+
- npm 9+

### Cài đặt

```bash
git clone <repo-url>
cd portfolio
npm install --legacy-peer-deps
```

### Cấu hình biến môi trường

```bash
cp .env.example .env.local
```

Sau đó điền các giá trị vào `.env.local` (xem hướng dẫn bên dưới).

### Chạy dev server

```bash
npm run dev
# Mở http://localhost:3000
```

### Build production

```bash
npm run build
npm start
```

---

## 🔐 Cấu hình Google OAuth + Drive API

Các bước này cần làm **thủ công** trên Google Cloud Console.

### Bước 1 — Tạo project trên Google Cloud Console

1. Vào [https://console.cloud.google.com](https://console.cloud.google.com)
2. Tạo project mới (ví dụ: `portfolio-lms`)

### Bước 2 — Bật Google Drive API

1. Vào **APIs & Services → Library**
2. Tìm **"Google Drive API"** → bấm **Enable**

### Bước 3 — Cấu hình OAuth Consent Screen

1. Vào **APIs & Services → OAuth consent screen**
2. Chọn **External** → bấm Create
3. Điền:
   - App name: `Portfolio LMS`
   - User support email: `ducnb17@gmail.com`
   - Developer contact: `ducnb17@gmail.com`
4. Ở bước **Scopes**, thêm:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/drive.readonly`
5. Ở bước **Test users**, thêm email `ducnb17@gmail.com`
6. Lưu lại

> ⚠️ Khi app ở chế độ **Testing**, chỉ các email trong danh sách Test users mới đăng nhập được.
> Khi muốn publish cho người khác, cần verify app với Google.

### Bước 4 — Tạo OAuth 2.0 Client ID

1. Vào **APIs & Services → Credentials**
2. Bấm **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Tên: `portfolio-lms-client`
5. Thêm **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
6. Bấm **Create**
7. Copy **Client ID** và **Client Secret** → điền vào `.env.local`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

### Bước 5 — Tạo NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Điền kết quả vào `.env.local`:
```
NEXTAUTH_SECRET=<giá trị vừa tạo>
```

### Bước 6 — Lấy Google Drive Root Folder ID

1. Mở Google Drive → vào thư mục chứa các khóa học
2. Copy ID từ URL: `https://drive.google.com/drive/folders/**FOLDER_ID_Ở_ĐÂY**`
3. Điền vào `.env.local`:
   ```
   GOOGLE_DRIVE_ROOT_FOLDER_ID=<folder-id>
   ```

---

## 📁 Cấu trúc thư mục Google Drive cho LMS

```
📁 [Root Folder — GOOGLE_DRIVE_ROOT_FOLDER_ID]
  📁 Khóa học 1 — AI Cơ bản
    📄 Bài 1 - Giới thiệu.pdf
    🎬 Bài 2 - Machine Learning.mp4
    ...
  📁 Khóa học 2 — Cybersecurity Fundamentals
    📄 Tài liệu.pdf
    🎬 Video bài học.mp4
    ...
```

Mỗi **subfolder** = một khóa học. Các **file** bên trong = bài học.

---

## 🌐 Deploy lên Vercel

1. Push code lên GitHub
2. Vào [https://vercel.com](https://vercel.com) → **New Project** → import repo
3. Thêm tất cả biến môi trường trong **Settings → Environment Variables**:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → đặt là `https://your-app.vercel.app`
   - `ALLOWED_EMAILS`
   - `GOOGLE_DRIVE_ROOT_FOLDER_ID`
4. Thêm domain Vercel vào **Authorized redirect URIs** trong Google Cloud Console (xem Bước 4)
5. Bấm **Deploy**

---

## 🛠 Tech stack

| Công nghệ | Mục đích |
|-----------|----------|
| Next.js 14 (App Router) | Framework chính |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| NextAuth.js v4 | Authentication (Google OAuth) |
| Framer Motion | Animation |
| Lucide React | Icons |
| Google Drive API | Lưu trữ khóa học |

---

## ✏️ Cập nhật nội dung

- **Thông tin cá nhân**: sửa trong từng component ở `src/components/`
- **Dự án Portfolio**: sửa trong `src/components/Portfolio.tsx`
- **Bài viết blog**: thêm MDX file vào `src/content/blog/` (tính năng đầy đủ đang phát triển)
- **Khóa học LMS**: upload file vào Google Drive theo cấu trúc ở trên
