'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, BrainCircuit, Network, ShieldCheck, TerminalSquare } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { categoryMeta, getLocalized, knowledgeArticles, type KnowledgeCategory } from '@/lib/knowledge';

const categories: Array<{ id: KnowledgeCategory; icon: typeof Network; color: string }> = [
  { id: 'ccna', icon: Network, color: 'from-blue-500 to-cyan-500' },
  { id: 'peh', icon: ShieldCheck, color: 'from-red-500 to-orange-500' },
  { id: 'lpi', icon: TerminalSquare, color: 'from-emerald-500 to-teal-500' },
  { id: 'ai-foundation', icon: BrainCircuit, color: 'from-violet-500 to-fuchsia-500' },
];

const copy = {
  vi: { eyebrow: 'Học và chia sẻ', title: 'Chia sẻ kiến thức', subtitle: 'Ghi chú thực hành về mạng, an toàn thông tin, Linux và nền tảng AI. Mỗi chủ đề gồm ba bài viết cô đọng, có thể áp dụng và kiểm chứng.', articles: '3 bài viết', read: 'Đọc bài' },
  en: { eyebrow: 'Learn and share', title: 'Knowledge Sharing', subtitle: 'Practical notes on networking, security, Linux, and AI foundations. Each topic contains three concise, actionable articles.', articles: '3 articles', read: 'Read article' },
  ja: { eyebrow: '学びと共有', title: 'ナレッジ共有', subtitle: 'ネットワーク、セキュリティ、Linux、AI基礎の実践ノート。各テーマに簡潔で実用的な3記事を掲載しています。', articles: '3記事', read: '記事を読む' },
};

export default function KnowledgeLibrary() {
  const { locale } = useLanguage();
  const ui = copy[locale];

  return (
    <section id="blog" className="bg-gray-50 py-20 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-2 font-semibold text-cyan-600 dark:text-cyan-300">
            <BookOpenCheck className="h-5 w-5" /> {ui.eyebrow}
          </span>
          <h2 className="mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">{ui.title}</h2>
          <div className="mx-auto mb-4 h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-600" />
          <p className="mx-auto max-w-3xl leading-7 text-gray-600 dark:text-gray-300">{ui.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          {categories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const meta = categoryMeta[category.id];
            const articles = knowledgeArticles.filter((article) => article.category === category.id);
            return (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: categoryIndex * 0.08 }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
              >
                <header className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="flex items-center gap-3 text-2xl font-bold"><Icon className="h-7 w-7" />{meta.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/90">{getLocalized(meta.description, locale)}</p>
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">{ui.articles}</span>
                  </div>
                </header>
                <div className="divide-y divide-gray-100 p-2 dark:divide-gray-800">
                  {articles.map((article, index) => (
                    <Link
                      key={article.slug}
                      href={`/knowledge/${article.slug}`}
                      className="group flex items-start gap-4 rounded-xl p-4 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 group-hover:bg-cyan-100 group-hover:text-cyan-700 dark:bg-gray-800 dark:text-gray-400">{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold leading-snug text-gray-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300">{getLocalized(article.title, locale)}</span>
                        <span className="mt-1 line-clamp-2 block text-sm leading-6 text-gray-600 dark:text-gray-400">{getLocalized(article.summary, locale)}</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">{ui.read} · {article.readTime} min <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
