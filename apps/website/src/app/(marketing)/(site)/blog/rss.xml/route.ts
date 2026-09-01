import { getPublishedBlogArticles } from '@/blog';
import { buildBlogRss } from '@/blog/rss';

export async function GET() {
  const articles = await getPublishedBlogArticles();
  const feed = buildBlogRss(articles);

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
