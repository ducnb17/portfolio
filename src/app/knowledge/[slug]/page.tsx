import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import KnowledgeArticlePage from '@/components/KnowledgeArticlePage';
import { getKnowledgeArticle, knowledgeArticles } from '@/lib/knowledge';

export const dynamicParams = false;

export function generateStaticParams() {
  return knowledgeArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getKnowledgeArticle(params.slug);
  if (!article) return {};
  return {
    title: `${article.title.vi} | Nguyễn Bá Đức`,
    description: article.summary.vi,
    alternates: { canonical: `https://portfolio.ducnb.io.vn/knowledge/${article.slug}` },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const article = getKnowledgeArticle(params.slug);
  if (!article) notFound();
  return <KnowledgeArticlePage article={article} />;
}
