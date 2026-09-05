import { describe, expect, it } from 'vitest';

import { getRelatedBlogArticles } from '../../apps/website/src/blog/relatedArticles';
import type { BlogArticleMetadata } from '../../apps/website/src/blog/types';

function createArticle(
  overrides: Partial<BlogArticleMetadata> = {}
): BlogArticleMetadata {
  return {
    title: 'Article',
    description: 'Article description',
    slug: 'article',
    publishedAt: '2026-09-03',
    author: 'Roman Bakurov',
    tags: ['React'],
    draft: false,
    ...overrides,
  };
}

describe('related blog articles', () => {
  it('excludes the current article and drafts', () => {
    const current = createArticle({ slug: 'current' });
    const draft = createArticle({
      slug: 'draft',
      tags: ['React'],
      draft: true,
    });
    const published = createArticle({ slug: 'published', tags: ['React'] });

    expect(
      getRelatedBlogArticles(current, [current, draft, published]).map(
        (article) => article.slug
      )
    ).toEqual(['published']);
  });

  it('prefers stronger normalized tag overlap over recency', () => {
    const current = createArticle({
      slug: 'current',
      tags: ['React Native', 'Accessibility'],
    });
    const newerWeakMatch = createArticle({
      slug: 'newer-weak-match',
      publishedAt: '2026-09-05',
      tags: ['Accessibility'],
    });
    const olderStrongMatch = createArticle({
      slug: 'older-strong-match',
      publishedAt: '2026-09-01',
      tags: ['react-native', 'ACCESSIBILITY'],
    });

    expect(
      getRelatedBlogArticles(current, [current, newerWeakMatch, olderStrongMatch])
        .map((article) => article.slug)
    ).toEqual(['older-strong-match', 'newer-weak-match']);
  });

  it('uses canonical publication ordering to break equal relevance ties', () => {
    const current = createArticle({ slug: 'current', tags: ['Tooling'] });
    const older = createArticle({
      slug: 'older',
      publishedAt: '2026-09-01',
      tags: ['Tooling'],
    });
    const sameDateB = createArticle({
      slug: 'same-date-b',
      publishedAt: '2026-09-04',
      tags: ['Tooling'],
    });
    const sameDateA = createArticle({
      slug: 'same-date-a',
      publishedAt: '2026-09-04',
      tags: ['Tooling'],
    });

    expect(
      getRelatedBlogArticles(current, [older, sameDateB, current, sameDateA]).map(
        (article) => article.slug
      )
    ).toEqual(['same-date-a', 'same-date-b', 'older']);
  });

  it(
    'fills remaining slots from articles adjacent to the current publication position',
    () => {
      const current = createArticle({
        slug: 'current',
        publishedAt: '2026-09-03',
        tags: ['Unique topic'],
      });
      const newest = createArticle({
        slug: 'newest',
        publishedAt: '2026-09-05',
        tags: ['A'],
      });
      const newer = createArticle({
        slug: 'newer',
        publishedAt: '2026-09-04',
        tags: ['B'],
      });
      const older = createArticle({
        slug: 'older',
        publishedAt: '2026-09-02',
        tags: ['C'],
      });
      const oldest = createArticle({
        slug: 'oldest',
        publishedAt: '2026-09-01',
        tags: ['D'],
      });

      expect(
        getRelatedBlogArticles(current, [oldest, newest, older, current, newer]).map(
          (article) => article.slug
        )
      ).toEqual(['newer', 'older', 'newest']);
    }
  );

  it(
    'keeps related results first and uses adjacency only for remaining slots',
    () => {
      const current = createArticle({
        slug: 'current',
        publishedAt: '2026-09-03',
        tags: ['React'],
      });
      const related = createArticle({
        slug: 'related',
        publishedAt: '2026-08-01',
        tags: ['React'],
      });
      const newer = createArticle({
        slug: 'newer',
        publishedAt: '2026-09-04',
        tags: ['Tooling'],
      });
      const older = createArticle({
        slug: 'older',
        publishedAt: '2026-09-02',
        tags: ['Accessibility'],
      });

      expect(
        getRelatedBlogArticles(current, [current, newer, older, related]).map(
          (article) => article.slug
        )
      ).toEqual(['related', 'newer', 'older']);
    }
  );

  it('never returns duplicate slugs and respects a custom limit', () => {
    const current = createArticle({ slug: 'current' });
    const first = createArticle({ slug: 'first', publishedAt: '2026-09-04' });
    const duplicate = createArticle({
      slug: 'first',
      publishedAt: '2026-09-02',
    });
    const second = createArticle({ slug: 'second', publishedAt: '2026-09-01' });

    expect(
      getRelatedBlogArticles(current, [current, duplicate, second, first], 2).map(
        (article) => article.slug
      )
    ).toEqual(['first', 'second']);
  });

  it('gracefully handles small and empty corpora', () => {
    const current = createArticle({ slug: 'current' });
    const onlyOther = createArticle({ slug: 'only-other' });

    expect(getRelatedBlogArticles(current, [current])).toEqual([]);
    expect(
      getRelatedBlogArticles(current, [current, onlyOther]).map(
        (article) => article.slug
      )
    ).toEqual(['only-other']);
    expect(getRelatedBlogArticles(current, [], 0)).toEqual([]);
  });
});
