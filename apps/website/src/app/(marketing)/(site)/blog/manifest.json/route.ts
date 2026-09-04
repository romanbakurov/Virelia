import { getPublishedBlogArticles } from '@/blog';

const MANIFEST_SCHEMA_VERSION = 1;

export async function GET() {
  const articles = await getPublishedBlogArticles();
  const slugs = articles.map((article) => article.slug).sort();

  return Response.json(
    {
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      slugs,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=300',
      },
    }
  );
}
