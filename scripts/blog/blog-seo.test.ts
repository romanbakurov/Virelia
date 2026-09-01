import { describe, expect, it } from 'vitest';

import { buildBlogRss } from '../../apps/website/src/blog/rss';
import {
  BLOG_RSS_URL,
  BLOG_URL,
  buildBlogArticleJsonLd,
  buildBlogArticleMetadata,
  buildBlogIndexMetadata,
  buildBlogSitemapEntries,
  getBlogArticleUrl,
  serializeJsonLd,
} from '../../apps/website/src/blog/seo';
import type { BlogArticleMetadata } from '../../apps/website/src/blog/types';

function createArticle(
  overrides: Partial<BlogArticleMetadata> = {}
): BlogArticleMetadata {
  return {
    title: 'Building reliable component APIs',
    description: 'Practical notes on APIs & cross-platform behavior.',
    slug: 'building-reliable-component-apis',
    publishedAt: '2026-09-01',
    author: 'Roman Bakurov',
    tags: ['Design Systems', 'React Native'],
    draft: false,
    ...overrides,
  };
}

describe('Blog V1 metadata', () => {
  it('uses vellira.dev as the canonical source for the blog and articles', () => {
    const indexMetadata = buildBlogIndexMetadata();
    const articleMetadata = buildBlogArticleMetadata(createArticle());

    expect(indexMetadata.alternates?.canonical).toBe(BLOG_URL);
    expect(indexMetadata.alternates?.types?.['application/rss+xml']).toBe(
      BLOG_RSS_URL
    );
    expect(articleMetadata.alternates?.canonical).toBe(
      getBlogArticleUrl('building-reliable-component-apis')
    );
    expect(articleMetadata.openGraph?.type).toBe('article');
  });

  it('falls back to the Vellira social image without inventing article data', () => {
    const article = createArticle();
    const metadata = buildBlogArticleMetadata(article);
    const jsonLd = buildBlogArticleJsonLd(article);

    expect(metadata.openGraph?.images).toBeDefined();
    expect(metadata.twitter?.images).toBeDefined();
    expect(jsonLd).not.toHaveProperty('image');
    expect(jsonLd).not.toHaveProperty('dateModified');
  });

  it('emits configured social image and update date deterministically', () => {
    const article = createArticle({
      updatedAt: '2026-09-03',
      socialImage: '/blog/social/component-apis.png',
    });
    const metadata = buildBlogArticleMetadata(article);
    const jsonLd = buildBlogArticleJsonLd(article);

    expect(metadata.openGraph).toMatchObject({
      publishedTime: '2026-09-01T00:00:00.000Z',
      modifiedTime: '2026-09-03T00:00:00.000Z',
    });
    expect(jsonLd).toMatchObject({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      datePublished: '2026-09-01',
      dateModified: '2026-09-03',
      image: 'https://vellira.dev/blog/social/component-apis.png',
      publisher: {
        '@id': 'https://vellira.dev/#organization',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': getBlogArticleUrl(article.slug),
      },
    });
  });

  it('serializes JSON-LD without leaving raw less-than characters', () => {
    const serialized = serializeJsonLd({ headline: '<script>' });

    expect(serialized).toContain('\\u003cscript>');
    expect(serialized).not.toContain('<script>');
  });
});

describe('Blog V1 sitemap', () => {
  it('includes only published articles in deterministic order and dates', () => {
    const entries = buildBlogSitemapEntries([
      createArticle({
        slug: 'older-article',
        publishedAt: '2026-08-10',
      }),
      createArticle({
        slug: 'draft-article',
        publishedAt: '2026-09-05',
        draft: true,
      }),
      createArticle({
        slug: 'newer-article',
        publishedAt: '2026-09-02',
        updatedAt: '2026-09-04',
      }),
    ]);

    expect(entries.map((entry) => entry.url)).toEqual([
      BLOG_URL,
      getBlogArticleUrl('newer-article'),
      getBlogArticleUrl('older-article'),
    ]);
    expect(entries.map((entry) => entry.url)).not.toContain(
      getBlogArticleUrl('draft-article')
    );
    expect(entries[0]?.lastModified).toEqual(
      new Date('2026-09-04T00:00:00.000Z')
    );
    expect(entries[1]?.lastModified).toEqual(
      new Date('2026-09-04T00:00:00.000Z')
    );
    expect(entries[2]?.lastModified).toEqual(
      new Date('2026-08-10T00:00:00.000Z')
    );
  });
});

describe('Blog V1 RSS', () => {
  it('escapes XML, excludes drafts, and orders published articles by date', () => {
    const rss = buildBlogRss([
      createArticle({
        title: 'Older <article>',
        slug: 'older-article',
        publishedAt: '2026-08-10',
      }),
      createArticle({
        title: 'Draft article',
        slug: 'draft-article',
        publishedAt: '2026-09-05',
        draft: true,
      }),
      createArticle({
        title: 'Newer & safer',
        slug: 'newer-article',
        publishedAt: '2026-09-02',
      }),
    ]);

    expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(rss).toContain('Newer &amp; safer');
    expect(rss).toContain('Older &lt;article&gt;');
    expect(rss).toContain(
      'Practical notes on APIs &amp; cross-platform behavior.'
    );
    expect(rss).not.toContain('Draft article');
    expect(rss.indexOf('newer-article')).toBeLessThan(
      rss.indexOf('older-article')
    );
    expect(rss).toContain(`href="${BLOG_RSS_URL}"`);
  });
});
