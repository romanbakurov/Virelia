import { getPublishedBlogArticles } from '@/blog';
import { fetchBlogMetricsBatch, type BlogMetricsBySlug } from '@/blog/metrics';
import { BlogIndex } from '@/blog/ui';

export default async function BlogPage() {
  const articles = await getPublishedBlogArticles();
  let metricsBySlug: BlogMetricsBySlug = {};

  try {
    metricsBySlug = await fetchBlogMetricsBatch(
      articles.map((article) => article.slug)
    );
  } catch {
    metricsBySlug = {};
  }

  return <BlogIndex articles={articles} metricsBySlug={metricsBySlug} />;
}
