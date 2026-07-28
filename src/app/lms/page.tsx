'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Loader2, BookOpen, FileText, Video, File, LogOut,
  ChevronRight, CheckCircle, ChevronDown, Upload, Trash2, FolderOpen, Plus, X, ExternalLink, Pencil, Users, Volume2, ImageIcon,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DriveItem {
  id: string; name: string; mimeType: string;
  modifiedTime?: string; size?: string; thumbnailLink?: string;
}
interface Chapter { id: string; name: string; files: DriveItem[]; }
interface Course { id: string; name: string; mimeType?: string; group?: 'courses' | 'huyen-hoc'; urls?: string[]; isCustom?: boolean; }
interface CourseDetail {
  id: string; name: string;
  chapters: Chapter[]; files: DriveItem[]; lessons: DriveItem[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.includes('video')) return <Video className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
  if (mimeType.includes('audio')) return <Volume2 className="w-4 h-4 text-violet-400 flex-shrink-0" />;
  if (mimeType.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
  if (mimeType.includes('pdf'))   return <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />;
  return <File className="w-4 h-4 text-gray-400 flex-shrink-0" />;
}

function formatSize(bytes?: string) {
  if (!bytes) return '';
  const n = parseInt(bytes, 10);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

// ─── Progress API helpers ─────────────────────────────────────────────────────
async function fetchProgress(): Promise<Record<string, string[]>> {
  try {
    const r = await fetch('/api/lms/progress');
    if (!r.ok) return {};
    return r.json();
  } catch { return {}; }
}
async function markLesson(courseId: string, lessonId: string) {
  await fetch('/api/lms/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId, lessonId }),
  });
}
async function resetCourse(courseId: string) {
  await fetch('/api/lms/progress', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId }),
  });
}

// ─── Upload Panel ─────────────────────────────────────────────────────────────
function UploadPanel({ targetFolderId, courseId, onUploaded }: { targetFolderId: string; courseId: string; onUploaded: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMsg(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folderId', targetFolderId);
    fd.append('courseId', courseId);
    try {
      const r = await fetch('/api/lms/upload', { method: 'POST', body: fd });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Upload thất bại');
      setMsg({ type: 'ok', text: `✓ ${data.message}` });
      onUploaded();
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Lỗi không xác định' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Upload tài liệu vào chương này</p>
      <label className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}>
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? 'Đang tải...' : 'Chọn file'}
        <input ref={inputRef} type="file" className="hidden" disabled={uploading} onChange={handleUpload}
          accept="*/*" />
      </label>
      {msg && <p className={`mt-2 text-xs ${msg.type === 'ok' ? 'text-green-500' : 'text-red-500'}`}>{msg.text}</p>}
    </div>
  );
}

function AccessPanel({ onClose }: { onClose: () => void }) {
  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch('/api/lms/access');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Không thể tải danh sách email');
    setEmails(data.emails.map((item: { email: string }) => item.email));
  }, []);

  useEffect(() => { load().catch((error) => setMessage(error.message)); }, [load]);

  const submit = async () => {
    const method = editing ? 'PATCH' : 'POST';
    const body = editing ? { email: editing, nextEmail: email } : { email };
    try {
      const response = await fetch('/api/lms/access', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lưu email');
      setEmail(''); setEditing(null); setMessage('Đã lưu quyền truy cập.'); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Lỗi không xác định'); }
  };

  const remove = async (target: string) => {
    if (!confirm(`Xóa quyền truy cập của ${target}?`)) return;
    const response = await fetch('/api/lms/access', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: target }),
    });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || 'Không thể xóa email'); return; }
    await load();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="font-bold text-gray-800 dark:text-white">Quyền truy cập LMS</h2><p className="text-xs text-gray-500">Admin: ducnb17@gmail.com</p></div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-red-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 mb-3">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="email@example.com"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
          <button onClick={submit} className="px-3 py-2 text-sm rounded-lg bg-cyan-500 text-white hover:bg-cyan-600">{editing ? 'Lưu' : 'Thêm'}</button>
        </div>
        {editing && <button onClick={() => { setEditing(null); setEmail(''); }} className="mb-3 text-xs text-gray-500 hover:text-red-500">Hủy sửa</button>}
        {message && <p className="mb-3 text-xs text-cyan-600 dark:text-cyan-400">{message}</p>}
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 border rounded-lg">
          {emails.length === 0 ? <p className="p-3 text-sm text-gray-500">Chưa có email nào được thêm trong database.</p> : emails.map((item) => (
            <div key={item} className="flex items-center gap-2 p-3 text-sm">
              <span className="flex-1 truncate text-gray-700 dark:text-gray-200">{item}</span>
              <button onClick={() => { setEditing(item); setEmail(item); }} title="Sửa"><Pencil className="w-4 h-4 text-cyan-500" /></button>
              <button onClick={() => remove(item)} title="Xóa"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LMSPage() {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as { isAdmin?: boolean } | undefined)?.isAdmin === true;
  const [courses, setCourses]           = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detail, setDetail]             = useState<CourseDetail | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<DriveItem | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [progress, setProgress]         = useState<Record<string, string[]>>({});
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showUpload, setShowUpload]     = useState<string | null>(null); // chapterId being uploaded to
  // Thêm khóa học mới
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [addName, setAddName]   = useState('');
  const [addUrl, setAddUrl]     = useState('');
  const [addGroup, setAddGroup] = useState<'courses' | 'huyen-hoc'>('huyen-hoc');
  const [addLoading, setAddLoading] = useState(false);
  const [addMsg, setAddMsg]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAccess, setShowAccess] = useState(false);

  // Tải tiến trình từ server
  const loadProgress = useCallback(async () => {
    const p = await fetchProgress();
    setProgress(p);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'AccessDenied') {
      setError('Email của bạn không có trong danh sách được phép truy cập LMS.');
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/lms/courses');
      if (r.status === 403) { setError('Email không có quyền truy cập LMS.'); return; }
      if (!r.ok) throw new Error('Lỗi tải danh sách khóa học');
      setCourses(await r.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') { fetchCourses(); loadProgress(); }
  }, [status, fetchCourses, loadProgress]);

  const openCourse = async (course: Course) => {
    setSelectedCourse(course); setSelectedLesson(null); setDetail(null);
    setDetailLoading(true);
    try {
      const r = await fetch(`/api/lms/courses/${course.id}`);
      if (!r.ok) throw new Error('Lỗi tải nội dung khóa học');
      const data: CourseDetail = await r.json();
      setDetail(data);
      // Tự động mở chapter đầu tiên
      if (data.chapters.length > 0) {
        setExpandedChapters(new Set([data.chapters[0].id]));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi tải nội dung');
    } finally { setDetailLoading(false); }
  };

  const handleLessonSelect = async (lesson: DriveItem) => {
    setSelectedLesson(lesson);
    if (selectedCourse) {
      await markLesson(selectedCourse.id, lesson.id);
      setProgress(prev => {
        const arr = prev[selectedCourse.id] ?? [];
        if (arr.includes(lesson.id)) return prev;
        return { ...prev, [selectedCourse.id]: [...arr, lesson.id] };
      });
    }
  };

  // Thêm khóa học mới qua API POST
  const handleAddCourse = async () => {
    if (!addName.trim() || !addUrl.trim()) {
      setAddMsg({ type: 'err', text: 'Vui lòng nhập tên và link Drive' });
      return;
    }
    setAddLoading(true); setAddMsg(null);
    try {
      const r = await fetch('/api/lms/courses', {
        method: editingCourse ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCourse?.id, name: addName.trim(), url: addUrl.trim(), group: addGroup }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Lỗi lưu khóa học');
      setAddMsg({ type: 'ok', text: editingCourse ? '✓ Đã cập nhật!' : '✓ Đã thêm!' });
      setAddName(''); setAddUrl(''); setEditingCourse(null);
      setTimeout(() => { setShowAddCourse(false); setAddMsg(null); fetchCourses(); }, 800);
    } catch (e) {
      setAddMsg({ type: 'err', text: e instanceof Error ? e.message : 'Lỗi không xác định' });
    } finally { setAddLoading(false); }
  };

  const startEditCourse = (course: Course) => {
    setEditingCourse(course); setAddName(course.name); setAddUrl(course.urls?.[0] ?? '');
    setAddGroup(course.group ?? 'huyen-hoc'); setAddMsg(null); setShowAddCourse(true);
  };

  const deleteCourse = async (course: Course) => {
    if (!confirm(`Xóa ${course.name} khỏi LMS? File trên Google Drive không bị xóa.`)) return;
    const response = await fetch('/api/lms/courses', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: course.id }),
    });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'Không thể xóa khóa học'); return; }
    if (selectedCourse?.id === course.id) { setSelectedCourse(null); setDetail(null); }
    fetchCourses();
  };

  const handleResetProgress = async () => {
    if (!selectedCourse) return;
    if (!confirm('Xóa toàn bộ tiến trình của khóa học này?')) return;
    await resetCourse(selectedCourse.id);
    setProgress(prev => { const n = { ...prev }; delete n[selectedCourse.id]; return n; });
  };

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  // ── Loading session ──
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Loader2 className="w-10 h-10 animate-spin text-cyan-500" /></div>;
  }

  // ── Chưa đăng nhập ──
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 text-center">
          <BookOpen className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">LMS — Khóa học</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Đăng nhập bằng tài khoản Google để truy cập khóa học.</p>
          {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">{error}</div>}
          <button onClick={() => signIn('google')}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Đăng nhập với Google
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Bị từ chối ──
  if (error && status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-3xl">🔒</span></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Không có quyền truy cập</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Đang đăng nhập với: <strong>{session?.user?.email}</strong></p>
          <button onClick={() => signOut()} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Đăng xuất</button>
        </motion.div>
      </div>
    );
  }

  // ── Progress stats ──
  const completedInCourse = selectedCourse ? (progress[selectedCourse.id] ?? []) : [];
  const totalLessons = detail?.lessons.length ?? 0;
  const completedCount = completedInCourse.length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-cyan-500" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">LMS — Khóa học</h1>
        </div>
        <div className="flex items-center gap-4">
          <img src={session?.user?.image ?? ''} alt="" className="w-8 h-8 rounded-full hidden sm:block" />
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{session?.user?.email}</span>
          {isAdmin && <button onClick={() => setShowAccess(true)} title="Quản lý email LMS" className="p-2 text-cyan-600 hover:text-cyan-500">
            <Users className="w-4 h-4" />
          </button>}
          <button onClick={() => signOut()} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>

      {showAccess && isAdmin && <AccessPanel onClose={() => setShowAccess(false)} />}

      <div className="flex h-[calc(100vh-112px)]">
        {/* Sidebar — course list */}
        <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">Danh sách khóa học</h2>
            <button onClick={() => { setShowAddCourse(v => !v); setAddMsg(null); if (showAddCourse) { setEditingCourse(null); setAddName(''); setAddUrl(''); } }} title="Thêm khóa học"
              className={`${isAdmin ? '' : 'hidden '}p-1 rounded-lg text-gray-400 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}>
              {showAddCourse ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
          {/* Panel thêm khóa học */}
          {showAddCourse && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-2">
              <p className="text-xs font-semibold text-cyan-600">{editingCourse ? 'Sửa khóa học đã thêm' : 'Thêm khóa học mới'}</p>
              <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Tên khóa học"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <input value={addUrl} onChange={e => setAddUrl(e.target.value)} placeholder="Link Google Drive"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <select value={addGroup} onChange={e => setAddGroup(e.target.value as 'courses' | 'huyen-hoc')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="huyen-hoc">🔮 Huyền học</option>
                <option value="courses">📚 Khóa học</option>
              </select>
              <button onClick={handleAddCourse} disabled={addLoading}
                className="w-full px-3 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {editingCourse ? 'Lưu thay đổi' : 'Thêm khóa học'}
              </button>
              {addMsg && <p className={`text-xs ${addMsg.type === 'ok' ? 'text-green-500' : 'text-red-500'}`}>{addMsg.text}</p>}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>
          ) : (
            <nav className="p-3 space-y-1">
              {/* Nhóm Khóa học */}
              {courses.filter(c => c.group === 'courses').length > 0 && (
                <div className="mb-2">
                  <p className="px-2 py-1 text-xs font-bold text-amber-500 uppercase tracking-wider">📚 Khóa học</p>
                  {courses.filter(c => c.group === 'courses').map((course) => {
                    const done = progress[course.id]?.length ?? 0;
                    const active = selectedCourse?.id === course.id;
                    return (
                      <button key={course.id} onClick={() => openCourse(course)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${active ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}>
                        <span className="text-sm font-medium leading-snug">{course.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {done > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>{done}</span>}
                          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {/* Nhóm Huyền học */}
              {courses.filter(c => c.group === 'huyen-hoc').length > 0 && (
                <div>
                  <p className="px-2 py-1 text-xs font-bold text-purple-500 uppercase tracking-wider">🔮 Huyền học</p>
                  {courses.filter(c => c.group === 'huyen-hoc').map((course) => {
                    const done = progress[course.id]?.length ?? 0;
                    const active = selectedCourse?.id === course.id;
                    return (
                      <button key={course.id} onClick={() => openCourse(course)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${active ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <span className="text-sm font-medium leading-snug">{course.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {done > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300'}`}>{done}</span>}
                          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {/* Fallback: khóa không có nhóm */}
              {courses.filter(c => !c.group).map((course) => {
                const done = progress[course.id]?.length ?? 0;
                const active = selectedCourse?.id === course.id;
                return (
                  <button key={course.id} onClick={() => openCourse(course)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${active ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <span className="text-sm font-medium leading-snug">{course.name}</span>
                    <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />
                  </button>
                );
              })}
            </nav>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedCourse ? (
            <>
              {/* Course header + progress bar */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{selectedCourse.name}</h2>
                  <div className="flex items-center gap-3">
                    {isAdmin && selectedCourse.isCustom && <>
                      <button onClick={() => startEditCourse(selectedCourse)} title="Sửa khóa học" className="text-xs text-cyan-600 hover:text-cyan-500"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteCourse(selectedCourse)} title="Xóa khóa học khỏi LMS" className="text-xs text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </>}
                    {completedCount > 0 && (
                      <button onClick={handleResetProgress} title="Reset tiến trình"
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3" /> Reset
                      </button>
                    )}
                  </div>
                </div>
                {totalLessons > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>{completedCount}/{totalLessons} bài hoàn thành</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Lesson list — chapters + files */}
                <div className="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
                  {detailLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
                  ) : detail ? (
                    <div className="p-2">
                      {/* Root-level files (no chapter) */}
                      {detail.files.length > 0 && (
                        <div className="mb-2">
                          <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tài liệu chung</p>
                          {detail.files.map((f, idx) => (
                            <LessonButton key={f.id} lesson={f} index={idx} selected={selectedLesson?.id === f.id}
                              done={completedInCourse.includes(f.id)} onClick={() => handleLessonSelect(f)} />
                          ))}
                        </div>
                      )}
                      {isAdmin && !selectedCourse.id.startsWith('mock-') && (
                        <div className="mx-3 mb-2">
                          <button onClick={() => setShowUpload(showUpload === selectedCourse.id ? null : selectedCourse.id)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-500 transition-colors">
                            <Upload className="w-3 h-3" /> Upload vào thư mục gốc khóa học
                          </button>
                          {showUpload === selectedCourse.id && (
                            <UploadPanel targetFolderId={selectedCourse.id} courseId={selectedCourse.id} onUploaded={() => { openCourse(selectedCourse); setShowUpload(null); }} />
                          )}
                        </div>
                      )}
                      {/* Chapters */}
                      {detail.chapters.map((ch) => {
                        const expanded = expandedChapters.has(ch.id);
                        const doneCh = ch.files.filter(f => completedInCourse.includes(f.id)).length;
                        return (
                          <div key={ch.id} className="mb-1">
                            <button onClick={() => toggleChapter(ch.id)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                              <div className="flex items-center gap-2 min-w-0">
                                <FolderOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{ch.name}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-1">
                                {doneCh > 0 && <span className="text-xs text-cyan-600 dark:text-cyan-400">{doneCh}/{ch.files.length}</span>}
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                              </div>
                            </button>
                            {expanded && (
                              <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                                {ch.files.map((f, idx) => (
                                  <LessonButton key={f.id} lesson={f} index={idx} selected={selectedLesson?.id === f.id}
                                    done={completedInCourse.includes(f.id)} onClick={() => handleLessonSelect(f)} />
                                ))}
                                {ch.files.length === 0 && (
                                  <p className="px-3 py-2 text-xs text-gray-400 italic">Chưa có bài học</p>
                                )}
                                {/* Upload button — chỉ khi có Drive thực (không phải mock) */}
                                {isAdmin && !selectedCourse.id.startsWith('mock-') && (
                                  <div>
                                    <button onClick={() => setShowUpload(showUpload === ch.id ? null : ch.id)}
                                      className="mt-1 mx-3 flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-500 transition-colors">
                                      <Upload className="w-3 h-3" /> Thêm tài liệu
                                    </button>
                                    {showUpload === ch.id && (
                                      <div className="mx-3">
                                        <UploadPanel targetFolderId={ch.id} courseId={selectedCourse.id} onUploaded={() => { openCourse(selectedCourse); setShowUpload(null); }} />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {/* Viewer */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                  {selectedLesson ? (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{selectedLesson.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {selectedLesson.modifiedTime && <span>Cập nhật: {new Date(selectedLesson.modifiedTime).toLocaleDateString('vi-VN')}</span>}
                        {selectedLesson.size && <span>Kích thước: {formatSize(selectedLesson.size)}</span>}
                        <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{selectedLesson.mimeType}</code>
                      </div>
                      <div className={`bg-black rounded-xl overflow-hidden shadow-2xl ${selectedLesson.mimeType.startsWith('video/') ? 'aspect-video' : 'min-h-[480px]'}`}>
                        <iframe
                          src={`https://drive.google.com/file/d/${selectedLesson.id}/preview`}
                          className="w-full h-full" allow="autoplay" allowFullScreen
                          title={selectedLesson.name}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-gray-400">Video, audio, ảnh và tài liệu được xem trực tiếp khi Google Drive hỗ trợ preview. File ZIP, ISO hoặc codec không hỗ trợ sẽ mở trên Google Drive để tải xuống.</p>
                        <a href={`https://drive.google.com/file/d/${selectedLesson.id}/view`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400">
                          <ExternalLink className="w-3 h-3" /> Mở Drive
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Chọn một bài học từ danh sách bên trái để bắt đầu</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <BookOpen className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Chào mừng đến LMS</h2>
              <p className="text-gray-500 dark:text-gray-400">Chọn một khóa học từ danh sách bên trái để bắt đầu học</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── LessonButton component ────────────────────────────────────────────────────
function LessonButton({ lesson, index, selected, done, onClick }: {
  lesson: DriveItem; index: number; selected: boolean; done: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-start gap-2 ${selected ? 'bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-300 dark:border-cyan-700' : 'hover:bg-white dark:hover:bg-gray-800'}`}>
      <span className="text-xs text-gray-400 w-4 text-right flex-shrink-0 mt-0.5">{index + 1}</span>
      <FileIcon mimeType={lesson.mimeType} />
      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 leading-snug text-left">{lesson.name}</span>
      {done && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
    </button>
  );
}
