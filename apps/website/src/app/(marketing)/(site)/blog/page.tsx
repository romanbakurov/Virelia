import { getPublishedBlogArticles } from '@/blog';
import { BlogIndex } from '@/blog/ui';

export default async function BlogPage() {
  const articles = await getPublishedBlogArticles();

  return <BlogIndex articles={articles} />;
}
