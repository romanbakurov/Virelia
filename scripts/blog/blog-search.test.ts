import { describe, expect, it } from 'vitest';

import {
  normalizeBlogSearchText,
  searchBlogArticles,
} from '../../apps/website/src/blog/search';
import type { BlogArticleMetadata } from '../../apps/website/src/blog';

function createArticle(
  overrides: Partial<BlogArticleMetadata> = {}
): BlogArticleMetadata {
  return {
    title: 'Design systems in production',
    description: 'Practical engineering notes for cross-platform UI.',
    slug: 'design-systems-production',
    publishedAt: '2026-09-05',
    author: 'Roman Bakurov',
    tags: ['Design Systems', 'React'],
    draft: false,
    ...overrides,
  };
}

describe('blog metadata search', () => {
  it('normalizes search text', () => {
    const normalized = normalizeBlogSearchText('  Réact---Native   UI ');

    expect(normalized).toBe('react native ui');
  });

  it('matches searchable metadata with multiple tokens', () => {
    const articles = [
      createArticle({
        title: 'React Native accessibility patterns',
        slug: 'native-accessibility',
        tags: ['React Native', 'Accessibility'],
      }),
      createArticle({
        title: 'Form composition',
        slug: 'form-composition',
        description:
          'Accessibility guidance for React Native forms with shared state.',
        tags: ['Forms'],
      }),
      createArticle({
        title: 'Metadata architecture',
        slug: 'react-native-metadata-source',
        description: 'Machine-readable component contracts.',
        tags: ['Tooling'],
      }),
    ];

    const multiTokenResults = searchBlogArticles(articles, 'react native');
    const accessibilityResults = searchBlogArticles(articles, 'accessibility');
    const slugResults = searchBlogArticles(articles, 'metadata source');

    expect(multiTokenResults).toEqual(articles);
    expect(accessibilityResults).toEqual([articles[0], articles[1]]);
    expect(slugResults).toEqual([articles[2]]);
  });

  it('ranks matches deterministically', () => {
    const exactTitle = createArticle({
      title: 'React Native',
      slug: 'react-native-exact',
      tags: ['Cross Platform'],
    });
    const prefixTitle = createArticle({
      title: 'React Native forms',
      slug: 'react-native-forms',
      tags: ['Forms'],
    });
    const exactTag = createArticle({
      title: 'Overlay architecture',
      slug: 'overlay-architecture',
      tags: ['React Native'],
    });
    const description = createArticle({
      title: 'Design system notes',
      slug: 'design-system-notes',
      description: 'React Native implementation details.',
      tags: ['Design Systems'],
    });
    const candidates = [description, exactTag, prefixTitle, exactTitle];

    const results = searchBlogArticles(candidates, 'react native');

    expect(results).toEqual([exactTitle, prefixTitle, exactTag, description]);
  });

  it('preserves tie order and excludes drafts', () => {
    const first = createArticle({
      title: 'First article',
      slug: 'first-article',
      description: 'Testing quality gates.',
    });
    const second = createArticle({
      title: 'Second article',
      slug: 'second-article',
      description: 'Testing quality gates.',
    });
    const draft = createArticle({
      title: 'Testing quality gates draft',
      slug: 'testing-quality-gates-draft',
      draft: true,
    });

    const results = searchBlogArticles([first, second, draft], 'quality gates');

    expect(results).toEqual([first, second]);
    expect(searchBlogArticles([draft], '')).toEqual([]);
  });
});
