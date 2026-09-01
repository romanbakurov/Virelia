import type { Metadata, MetadataRoute } from 'next';

import { sortBlogArticleMetadata } from './schema';
import type { BlogArticleMetadata } from './types';

export const SITE_URL = 'https://vellira.dev';
export const BLOG_URL = `${SITE_URL}/blog`;
export const BLOG_RSS_URL = `${BLOG_URL}/rss.xml`;

export const BLOG_TITLE = 'Vellira Engineering Blog';
export const BLOG_DESCRIPTION =
  'Practical engineering notes on design systems, React, React Native, and developer tooling.';

const DEFAULT_SOCIAL_IMAGE = '/brand/social/vellira-og-code-to-ui.png';

function toIsoDateTime(date: string): string {
  return `${date}T00:00:00.000Z`;
}

function resolveAbsoluteUrl(url: string): string {
  return new URL(url, SITE_URL).toString();
}

function getPublishedArticles(
  articles: readonly BlogArticleMetadata[]
): BlogArticleMetadata[] {
  return sortBlogArticleMetadata(articles.filter((article) => !article.draft));
}

export function getBlogArticleUrl(slug: string): string {
  return `${BLOG_URL}/${slug}`;
}

export function buildBlogIndexMetadata(): Metadata {
  const socialImage = resolveAbsoluteUrl(DEFAULT_SOCIAL_IMAGE);

  return {
    title: 'Blog',
    description: BLOG_DESCRIPTION,
    alternates: {
      canonical: BLOG_URL,
      types: {
        'application/rss+xml': BLOG_RSS_URL,
      },
    },
    openGraph: {
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      url: BLOG_URL,
      siteName: 'Vellira',
      type: 'website',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      images: [socialImage],
    },
  };
}

export function buildBlogArticleMetadata(
  article: BlogArticleMetadata
): Metadata {
  const canonicalUrl = getBlogArticleUrl(article.slug);
  const socialImage = resolveAbsoluteUrl(
    article.socialImage ?? DEFAULT_SOCIAL_IMAGE
  );

  return {
    title: article.title,
    description: article.description,
    authors: [{ name: article.author }],
    keywords: article.tags,
    alternates: {
      canonical: canonicalUrl,
      types: {
        'application/rss+xml': BLOG_RSS_URL,
      },
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonicalUrl,
      siteName: 'Vellira',
      type: 'article',
      publishedTime: toIsoDateTime(article.publishedAt),
      ...(article.updatedAt === undefined
        ? {}
        : { modifiedTime: toIsoDateTime(article.updatedAt) }),
      authors: [article.author],
      tags: article.tags,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [socialImage],
    },
  };
}

export function buildBlogArticleJsonLd(article: BlogArticleMetadata) {
  const canonicalUrl = getBlogArticleUrl(article.slug);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    headline: article.title,
    description: article.description,
    url: canonicalUrl,
    datePublished: article.publishedAt,
    ...(article.updatedAt === undefined
      ? {}
      : { dateModified: article.updatedAt }),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    ...(article.socialImage === undefined
      ? {}
      : { image: resolveAbsoluteUrl(article.socialImage) }),
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildBlogSitemapEntries(
  articles: readonly BlogArticleMetadata[]
): MetadataRoute.Sitemap {
  const publishedArticles = getPublishedArticles(articles);
  const latestArticle = publishedArticles[0];
  const blogLastModified =
    latestArticle === undefined
      ? undefined
      : new Date(
          toIsoDateTime(latestArticle.updatedAt ?? latestArticle.publishedAt)
        );

  return [
    {
      url: BLOG_URL,
      ...(blogLastModified === undefined
        ? {}
        : { lastModified: blogLastModified }),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...publishedArticles.map((article) => ({
      url: getBlogArticleUrl(article.slug),
      lastModified: new Date(
        toIsoDateTime(article.updatedAt ?? article.publishedAt)
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
