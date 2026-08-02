export type NewsCategory = 'domestic' | 'world' | 'business';

export interface NewsArticle {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  summary: string;
  category: NewsCategory;
}

export interface NewsResult {
  articles: NewsArticle[];
  updatedAt: string;
  unavailable: boolean;
}

const FEEDS: Array<{ url: string; category: NewsCategory; source: string }> = [
  { url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss', category: 'domestic', source: 'Tuổi Trẻ' },
  { url: 'https://news.google.com/rss?hl=vi&gl=VN&ceid=VN:vi', category: 'domestic', source: 'Google Tin tức' },
  { url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=vi&gl=VN&ceid=VN:vi', category: 'world', source: 'Google Tin tức' },
  { url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=vi&gl=VN&ceid=VN:vi', category: 'business', source: 'Google Tin tức' },
  { url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=vi&gl=VN&ceid=VN:vi', category: 'business', source: 'Google Tin tức' },
];

const decodeXml = (value: string) => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));

const textOnly = (value: string) => decodeXml(decodeXml(value))
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const field = (item: string, name: string) => {
  const match = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return match ? textOnly(match[1]) : '';
};

function parseFeed(xml: string, category: NewsCategory, fallbackSource: string): NewsArticle[] {
  const items = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? [];

  return items.slice(0, 20).flatMap((item) => {
    const rawTitle = field(item, 'title');
    const link = field(item, 'link');
    if (!rawTitle || !/^https?:\/\//i.test(link)) return [];

    const titleParts = rawTitle.split(' - ');
    const inferredSource = fallbackSource === 'Google Tin tức' && titleParts.length > 1
      ? titleParts.at(-1)!.trim()
      : '';
    const title = inferredSource
      ? titleParts.slice(0, -1).join(' - ').trim()
      : rawTitle;
    const date = new Date(field(item, 'pubDate'));
    const summary = field(item, 'description');

    return [{
      title,
      link,
      source: inferredSource || fallbackSource,
      publishedAt: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
      summary: summary && summary !== title ? summary.slice(0, 260) : '',
      category,
    }];
  });
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<NewsArticle[]> {
  try {
    const response = await fetch(feed.url, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'portfolio.ducnb.io.vn news reader/1.0' },
    });
    if (!response.ok) return [];
    return parseFeed(await response.text(), feed.category, feed.source);
  } catch {
    return [];
  }
}

export async function getDailyNews(): Promise<NewsResult> {
  const batches = await Promise.all(FEEDS.map(fetchFeed));
  const seen = new Set<string>();
  const counts: Record<NewsCategory, number> = { domestic: 0, world: 0, business: 0 };
  const articles = batches
    .flat()
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .filter((article) => {
      const key = article.title.toLocaleLowerCase('vi').replace(/\W/g, '');
      if (seen.has(key) || counts[article.category] >= 12) return false;
      seen.add(key);
      counts[article.category] += 1;
      return true;
    });

  return { articles, updatedAt: new Date().toISOString(), unavailable: articles.length === 0 };
}
