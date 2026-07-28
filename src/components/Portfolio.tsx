'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Github, Headphones, Loader2, Network, Plus, Search, Server, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ICONS = [Server, Headphones, Search, Network];

type Project = {
  id?: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  githubLabel?: string;
  status?: string;
};

type ProjectForm = {
  title: string;
  description: string;
  githubUrl: string;
  tech: string;
  status: string;
};

const EMPTY_FORM: ProjectForm = {
  title: '',
  description: '',
  githubUrl: '',
  tech: '',
  status: '',
};

export default function Portfolio() {
  const { t, locale } = useLanguage();
  const { data: session } = useSession();
  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const isAdmin = (session?.user as { isAdmin?: boolean } | undefined)?.isAdmin === true;

  const labels = {
    eyebrow: locale === 'vi' ? 'Dự án tiêu biểu' : locale === 'ja' ? '主なプロジェクト' : 'Selected work',
    repository: locale === 'vi' ? 'Xem mã nguồn' : locale === 'ja' ? 'ソースコードを見る' : 'View source',
  };

  const loadCustomProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/portfolio/projects');
      if (response.ok) setCustomProjects(await response.json() as Project[]);
    } catch {
      // The static portfolio remains usable if the database is temporarily unavailable.
    }
  }, []);

  useEffect(() => {
    loadCustomProjects();
  }, [loadCustomProjects]);

  const projects: Project[] = [...t.portfolio.projects, ...customProjects];

  const updateForm = (field: keyof ProjectForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setForm(EMPTY_FORM);
    setFormMessage(null);
  };

  const addProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const response = await fetch('/api/portfolio/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          githubUrl: form.githubUrl,
          tech: form.tech.split(',').map((item) => item.trim()).filter(Boolean),
          status: form.status,
        }),
      });
      const result = await response.json() as { project?: Project; error?: string };
      if (!response.ok || !result.project) throw new Error(result.error || 'Không thể thêm project');

      setCustomProjects((current) => [...current, result.project!]);
      closeAddForm();
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Không thể thêm project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="portfolio" className="bg-slate-50 py-20 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{labels.eyebrow}</p>
            <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">{t.portfolio.sectionTitle}</h2>
            <p className="text-slate-600 dark:text-slate-300">{t.portfolio.subtitle}</p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => { setShowAddForm((visible) => !visible); setFormMessage(null); }}
              aria-expanded={showAddForm}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-600 sm:self-auto dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:hover:text-slate-950"
            >
              {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showAddForm ? 'Đóng' : 'Thêm project'}
            </button>
          )}
        </div>

        {isAdmin && showAddForm && (
          <form onSubmit={addProject} className="mb-8 rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm dark:border-cyan-400/20 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Thêm project mới</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Project sẽ hiển thị ngay trên portfolio sau khi lưu.</p>
              </div>
              <button type="button" onClick={closeAddForm} aria-label="Đóng form thêm project" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Tên project<input required value={form.title} onChange={(event) => updateForm('title', event.target.value)} maxLength={120} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Link GitHub<input required type="url" value={form.githubUrl} onChange={(event) => updateForm('githubUrl', event.target.value)} placeholder="https://github.com/username/repository" className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label>
              <label className="md:col-span-2 text-sm font-medium text-slate-700 dark:text-slate-200">Mô tả<textarea required value={form.description} onChange={(event) => updateForm('description', event.target.value)} maxLength={600} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Công nghệ<input value={form.tech} onChange={(event) => updateForm('tech', event.target.value)} placeholder="Next.js, PostgreSQL, Docker" className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Trạng thái<input value={form.status} onChange={(event) => updateForm('status', event.target.value)} maxLength={80} placeholder="Đang phát triển" className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></label>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button disabled={isSubmitting} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{isSubmitting ? 'Đang lưu...' : 'Lưu project'}</button>
              {formMessage && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-300">{formMessage}</p>}
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <article key={project.id ?? project.title} className="flex min-h-[340px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300"><Icon className="h-5 w-5" /></div>
                  {project.status && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-right text-[11px] font-semibold leading-tight text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{project.status}</span>}
                </div>
                <h3 className="text-xl font-bold leading-snug text-slate-900 dark:text-white">{project.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 4).map((tech) => <span key={tech} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{tech}</span>)}
                </div>
                <a href={project.githubUrl ?? 'https://github.com/ducnb17'} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-sm font-bold text-slate-800 transition hover:text-cyan-600 dark:border-slate-700 dark:text-slate-100 dark:hover:text-cyan-300"><Github className="h-4 w-4" />{project.githubLabel ?? labels.repository}</a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
