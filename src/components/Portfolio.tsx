'use client';

import { useCallback, useEffect, useRef } from 'react';
import { ArrowRight, Github, Headphones, Network, Search, Server } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ICONS = [Server, Headphones, Search, Network];
const AUTO_ADVANCE_DELAY = 10_000;

export default function Portfolio() {
  const { t, locale } = useLanguage();
  const { sectionTitle, subtitle, projects } = t.portfolio;
  const trackRef = useRef<HTMLDivElement>(null);
  const activeProjectRef = useRef(0);
  const mouseDragRef = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  const labels = {
    eyebrow: locale === 'vi' ? 'Dự án tiêu biểu' : locale === 'ja' ? '主なプロジェクト' : 'Selected work',
    repository: locale === 'vi' ? 'Xem mã nguồn' : locale === 'ja' ? 'ソースコードを見る' : 'View source',
  };

  const scrollToProject = useCallback((projectIndex: number) => {
    const track = trackRef.current;
    const cards = track?.querySelectorAll<HTMLElement>('[data-project-card]');
    const card = cards?.[projectIndex];
    if (!track || !card) return;

    activeProjectRef.current = projectIndex;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(() => scrollToProject(activeProjectRef.current));
    observer.observe(track);
    return () => observer.disconnect();
  }, [scrollToProject]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (mouseDragRef.current.active) return;
      const nextProject = (activeProjectRef.current + 1) % projects.length;
      scrollToProject(nextProject);
    }, AUTO_ADVANCE_DELAY);

    return () => window.clearInterval(timer);
  }, [projects.length, scrollToProject]);

  const syncActiveProject = () => {
    const track = trackRef.current;
    const cards = track?.querySelectorAll<HTMLElement>('[data-project-card]');
    if (!track || !cards?.length) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    activeProjectRef.current = Array.from(cards).reduce((closestIndex, card, index) => {
      const closestCard = cards[closestIndex];
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - trackCenter);
      const closestDistance = Math.abs(closestCard.offsetLeft + closestCard.offsetWidth / 2 - trackCenter);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !trackRef.current) return;
    if ((event.target as HTMLElement).closest('a')) return;

    mouseDragRef.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: trackRef.current.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!mouseDragRef.current.active || !trackRef.current) return;
    trackRef.current.scrollLeft = mouseDragRef.current.startScrollLeft - (event.clientX - mouseDragRef.current.startX);
  };

  const stopMouseDrag = () => {
    mouseDragRef.current.active = false;
    syncActiveProject();
  };

  return (
    <section id="portfolio" className="overflow-hidden bg-slate-50 py-20 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{labels.eyebrow}</p>
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">{sectionTitle}</h2>
          <p className="text-slate-600 dark:text-slate-300">{subtitle}</p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900 sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 sm:w-20" />
          <div
            ref={trackRef}
            onScroll={syncActiveProject}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopMouseDrag}
            onPointerCancel={stopMouseDrag}
            className="project-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 select-none"
            aria-label={sectionTitle}
          >
            {projects.map((project, index) => {
              const Icon = ICONS[index % ICONS.length];

              return (
                <article key={project.title} data-project-card className="flex min-h-[340px] w-[min(82vw,19rem)] shrink-0 snap-center cursor-grab flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300"><Icon className="h-5 w-5" /></div>
                    {project.status && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-right text-[11px] font-semibold leading-tight text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{project.status}</span>}
                  </div>
                  <h3 className="text-xl font-bold leading-snug text-slate-900 dark:text-white">{project.title}</h3>
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((tech) => <span key={tech} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{tech}</span>)}
                  </div>
                  <a href={project.githubUrl ?? 'https://github.com/ducnb17'} target="_blank" rel="noopener noreferrer" onPointerDown={(event) => event.stopPropagation()} className="mt-auto inline-flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-sm font-bold text-slate-800 transition hover:text-cyan-600 dark:border-slate-700 dark:text-slate-100 dark:hover:text-cyan-300">
                    <Github className="h-4 w-4" />{project.githubLabel ?? labels.repository}<ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
