import { sortBlogArticleMetadata } from './schema';
import type { BlogArticleMetadata } from './types';
import {
  BLOG_DESCRIPTION,
  BLOG_RSS_URL,
  BLOG_TITLE,
  BLOG_URL,
  getBlogArticleUrl,
} from './seo';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRssDate(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toUTCString();
}

export function buildBlogRss(articles: readonly BlogArticleMetadata[]): string {
  const publishedArticles = sortBlogArticleMetadata(
    articles.filter((article) => !article.draft)
  );
  const latestArticle = publishedArticles[0];
  const lastBuildDate =
    latestArticle === undefined
      ? null
      : toRssDate(latestArticle.updatedAt ?? latestArticle.publishedAt);

  const items = publishedArticles
    .map((article) => {
      const articleUrl = getBlogArticleUrl(article.slug);
      const categories = article.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(articleUrl)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>`,
        `      <pubDate>${toRssDate(article.publishedAt)}</pubDate>`,
        `      <description>${escapeXml(article.description)}</description>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(BLOG_TITLE)}</title>`,
    `    <link>${escapeXml(BLOG_URL)}</link>`,
    `    <description>${escapeXml(BLOG_DESCRIPTION)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${escapeXml(BLOG_RSS_URL)}" rel="self" type="application/rss+xml" />`,
    ...(lastBuildDate === null
      ? []
      : [`    <lastBuildDate>${lastBuildDate}</lastBuildDate>`]),
    ...(items.length === 0 ? [] : [items]),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
