import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getPublishedBlogArticle,
  getPublishedBlogArticleMetadata,
  getPublishedBlogArticles,
} from '@/blog';
import {
  buildBlogArticleJsonLd,
  buildBlogArticleMetadata,
  serializeJsonLd,
} from '@/blog/seo';
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

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedBlogArticleMetadata(slug);

  if (article === null) {
    notFound();
  }

  return buildBlogArticleMetadata(article);
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedBlogArticle(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = buildBlogArticleJsonLd(article.metadata);

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <BlogArticleView article={article} />
    </>
  );
}
