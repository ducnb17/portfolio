'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Github, Headphones, Search, Server, Network } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ICONS = [Server, Headphones, Search, Network];
const CARD_GAP = 20;

export default function Portfolio() {
  const { t, locale } = useLanguage();
  const { sectionTitle, subtitle, projects } = t.portfolio;
  const trackRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const mouseDragRef = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  const labels = {
    previous: locale === 'vi' ? 'Dự án trước' : locale === 'ja' ? '前のプロジェクト' : 'Previous project',
    next: locale === 'vi' ? 'Dự án tiếp theo' : locale === 'ja' ? '次のプロジェクト' : 'Next project',
    eyebrow: locale === 'vi' ? 'Dự án tiêu biểu' : locale === 'ja' ? '主なプロジェクト' : 'Selected work',
    hint: locale === 'vi' ? 'Kéo để khám phá - Danh sách lặp vô hạn' : locale === 'ja' ? 'ドラッグして探索 - 無限ループ' : 'Drag to explore - Infinite loop',
    repository: locale === 'vi' ? 'Xem mã nguồn' : locale === 'ja' ? 'ソースコードを見る' : 'View source',
  };

  const normalizeInfinitePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const thirdWidth = track.scrollWidth / 3;
    if (!thirdWidth) return;
    if (track.scrollLeft < 8) track.scrollLeft += thirdWidth;
    if (track.scrollLeft > thirdWidth * 2 - 8) track.scrollLeft -= thirdWidth;
  }, []);

  const move = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-project-card]');
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.offsetWidth + CARD_GAP), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const centerLoop = () => {
      if (!initializedRef.current && track.scrollWidth) {
        track.scrollLeft = track.scrollWidth / 3;
        initializedRef.current = true;
      }
    };
    centerLoop();
    const observer = new ResizeObserver(centerLoop);
    observer.observe(track);
    return () => observer.disconnect();
  }, [projects.length]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden) move(1);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [move]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !trackRef.current) return;
    mouseDragRef.current = { active: true, startX: event.clientX, startScrollLeft: trackRef.current.scrollLeft };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!mouseDragRef.current.active || !trackRef.current) return;
    trackRef.current.scrollLeft = mouseDragRef.current.startScrollLeft - (event.clientX - mouseDragRef.current.startX);
  };

  const stopMouseDrag = () => {
    mouseDragRef.current.active = false;
    normalizeInfinitePosition();
  };

  const loopedProjects = [...projects, ...projects, ...projects];

  return (
    <section id="portfolio" className="overflow-hidden bg-slate-50 py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{labels.eyebrow}</p>
            <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">{sectionTitle}</h2>
            <p className="text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 lg:block">{labels.hint}</span>
            <button type="button" onClick={() => move(-1)} aria-label={labels.previous} className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-500 hover:bg-cyan-500 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label={labels.next} className="grid h-11 w-11 place-items-center rounded-full bg-slate-900 text-white transition hover:bg-cyan-600 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:hover:text-slate-950">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900 sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 sm:w-20" />
          <div ref={trackRef} onScroll={normalizeInfinitePosition} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={stopMouseDrag} onPointerCancel={stopMouseDrag} className="project-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto px-[8vw] pb-5 pt-2 select-none sm:px-5" aria-label={sectionTitle}>
            {loopedProjects.map((project, index) => {
              const projectIndex = index % projects.length;
              const Icon = ICONS[projectIndex % ICONS.length];
              return (
                <motion.article key={`${project.title}-${index}`} data-project-card initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }} className="flex min-h-[350px] w-[min(82vw,21rem)] shrink-0 snap-center cursor-grab flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300"><Icon className="h-5 w-5" /></div>
                    {project.status && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-right text-[11px] font-semibold leading-tight text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{project.status}</span>}
                  </div>
                  <h3 className="text-xl font-bold leading-snug text-slate-900 dark:text-white">{project.title}</h3>
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((tech) => <span key={tech} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{tech}</span>)}
                  </div>
                  <a href={project.githubUrl ?? 'https://github.com/ducnb17'} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-sm font-bold text-slate-800 transition hover:text-cyan-600 dark:border-slate-700 dark:text-slate-100 dark:hover:text-cyan-300">
                    <Github className="h-4 w-4" />{project.githubLabel ?? labels.repository}<ArrowRight className="h-4 w-4" />
                  </a>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
