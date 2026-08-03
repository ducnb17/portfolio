'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { categoryMeta, getLocalized, type KnowledgeArticle } from '@/lib/knowledge';

const copy = {
  vi: { back: 'Quay lại Chia sẻ kiến thức', read: 'phút đọc', contents: 'Nội dung chính', related: 'Khám phá các bài khác trong thư viện kiến thức.' },
  en: { back: 'Back to Knowledge Sharing', read: 'min read', contents: 'In this article', related: 'Explore other articles in the knowledge library.' },
  ja: { back: 'ナレッジ共有へ戻る', read: '分で読めます', contents: 'この記事の内容', related: 'ナレッジライブラリの他の記事もご覧ください。' },
};

export default function KnowledgeArticlePage({ article }: { article: KnowledgeArticle }) {
  const { locale } = useLanguage();
  const ui = copy[locale];
  const category = categoryMeta[article.category];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <header className="border-b border-gray-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 px-4 pb-14 pt-32 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/40">
        <div className="container mx-auto max-w-4xl">
          <Link href="/#blog" className="mb-7 inline-flex items-center gap-2 font-semibold text-cyan-700 hover:text-blue-700 dark:text-cyan-300"><ArrowLeft className="h-4 w-4" />{ui.back}</Link>
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-cyan-100 px-3 py-1 font-semibold text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200">{category.title}</span>
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400"><Clock3 className="h-4 w-4" />{article.readTime} {ui.read}</span>
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-white">{getLocalized(article.title, locale)}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">{getLocalized(article.summary, locale)}</p>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-14">
        <aside className="mb-12 rounded-2xl border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-900 dark:bg-cyan-950/30">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white"><BookOpen className="h-5 w-5 text-cyan-600" />{ui.contents}</h2>
          <ol className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {article.sections.map((item, index) => <li key={index}>{index + 1}. {getLocalized(item.heading, locale)}</li>)}
          </ol>
        </aside>

        <article className="space-y-12">
          {article.sections.map((item, index) => (
            <section key={index}>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{index + 1}. {getLocalized(item.heading, locale)}</h2>
              <div className="space-y-4 text-base leading-8 text-gray-700 dark:text-gray-300">
                {item.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{getLocalized(paragraph, locale)}</p>)}
              </div>
            </section>
          ))}
        </article>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 p-7 text-white">
          <p className="mb-4">{ui.related}</p>
          <Link href="/#blog" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-blue-700"><ArrowLeft className="h-4 w-4" />{ui.back}</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
