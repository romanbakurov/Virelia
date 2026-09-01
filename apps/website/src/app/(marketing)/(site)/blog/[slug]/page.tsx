import { notFound } from 'next/navigation';

import { getPublishedBlogArticle, getPublishedBlogArticles } from '@/blog';
import { BlogArticleView } from '@/blog/ui';

interface BlogArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getPublishedBlogArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedBlogArticle(slug);

  if (!article) {
    notFound();
  }

  return <BlogArticleView article={article} />;
}
