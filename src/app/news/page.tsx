import type { Metadata } from 'next';
import { ArrowUpRight, Briefcase, Clock3, Globe2, Newspaper } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDailyNews, type NewsArticle, type NewsCategory } from '@/lib/news';

// Rebuild the server-rendered news page at most once every four hours.
export const revalidate = 14400;

export const metadata: Metadata = {
  title: 'Tin tức hôm nay | Nguyễn Bá Đức',
  description: 'Tổng hợp ngắn gọn tin tức trong nước, thế giới, công nghệ và kinh doanh được cập nhật hằng ngày.',
  alternates: { canonical: 'https://portfolio.ducnb.io.vn/news' },
};

const sections: Array<{
  id: NewsCategory;
  title: string;
  description: string;
  icon: typeof Newspaper;
}> = [
  { id: 'domestic', title: 'Trong nước', description: 'Các diễn biến đáng chú ý tại Việt Nam', icon: Newspaper },
  { id: 'world', title: 'Thế giới', description: 'Tin quốc tế nổi bật trong ngày', icon: Globe2 },
  { id: 'business', title: 'Công nghệ & Kinh doanh', description: 'Thị trường, doanh nghiệp và xu hướng công nghệ', icon: Briefcase },
];

const formatTime = (date: string) => new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Asia/Ho_Chi_Minh',
}).format(new Date(date));

function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-cyan-700 dark:text-cyan-300">{article.source}</span>
        <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{formatTime(article.publishedAt)}</span>
      </div>
      <h3 className="text-lg font-bold leading-snug text-gray-900 transition group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300">
        {article.title}
      </h3>
      {article.summary && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{article.summary}</p>
      )}
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-cyan-700 hover:text-blue-700 dark:text-cyan-300"
      >
        Đọc tại nguồn <ArrowUpRight className="h-4 w-4" />
      </a>
    </article>
  );
}

export default async function NewsPage() {
  const news = await getDailyNews();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <header className="border-b border-gray-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 px-4 pb-14 pt-32 dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/40">
        <div className="container mx-auto max-w-6xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200">
            <Newspaper className="h-4 w-4" /> Tự động cập nhật mỗi 4 giờ
          </span>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-white">Tin tức hôm nay</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Điểm tin trong nước và thế giới, tổng hợp ngắn gọn để bạn nắm bắt nhanh những diễn biến đáng chú ý.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Cập nhật: {formatTime(news.updatedAt)}</span>
            <span>Tiêu đề và liên kết thuộc nguồn báo gốc.</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl space-y-16 px-4 py-14">
        {news.unavailable ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            Chưa thể tải nguồn tin lúc này. Vui lòng quay lại sau ít phút.
          </div>
        ) : sections.map((section) => {
          const articles = news.articles.filter((article) => article.category === section.id);
          if (!articles.length) return null;
          const Icon = section.icon;
          return (
            <section key={section.id} id={section.id}>
              <div className="mb-7 flex items-start gap-4">
                <span className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 text-white shadow-lg"><Icon className="h-6 w-6" /></span>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{section.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => <ArticleCard key={`${article.title}-${article.publishedAt}`} article={article} />)}
              </div>
            </section>
          );
        })}
      </div>
      <Footer />
    </main>
  );
}
