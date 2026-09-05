import { describe, expect, it } from 'vitest';

import {
  deriveBlogTopicOptions,
  filterBlogArticlesByTopics,
  normalizeBlogTopicValue,
  selectCommonBlogTopicOptions,
} from '../../apps/website/src/blog/topicFilters';
import type { BlogArticleMetadata } from '../../apps/website/src/blog/types';

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

describe('blog topic filters', () => {
  it('normalizes URL values while preserving authored display labels', () => {
    expect(normalizeBlogTopicValue(' Réact Native ')).toBe('react-native');

    const topics = deriveBlogTopicOptions([
      createArticle({ tags: ['React', 'react', 'React Native'] }),
      createArticle({ tags: ['REACT', 'Tooling'] }),
    ]);

    expect(topics).toEqual([
      { value: 'react', label: 'React', count: 2 },
      { value: 'react-native', label: 'React Native', count: 1 },
      { value: 'tooling', label: 'Tooling', count: 1 },
    ]);
  });

  it('derives topics only from published articles', () => {
    const topics = deriveBlogTopicOptions([
      createArticle({ tags: ['React'] }),
      createArticle({ tags: ['Accessibility'] }),
      createArticle({ tags: ['Private Draft Topic'], draft: true }),
    ]);

    expect(topics.map((topic) => topic.label)).toEqual([
      'Accessibility',
      'React',
    ]);
  });

  it('selects common topics by frequency with an alphabetical tie-breaker', () => {
    const topics = deriveBlogTopicOptions([
      createArticle({ tags: ['React', 'Accessibility'] }),
      createArticle({ tags: ['React', 'Tooling'] }),
      createArticle({ tags: ['Tooling', 'Testing'] }),
      createArticle({ tags: ['Forms'] }),
    ]);

    expect(selectCommonBlogTopicOptions(topics, 4).map((topic) => topic.value)).toEqual([
      'react',
      'tooling',
      'accessibility',
      'forms',
    ]);
  });

  it('supports single-topic and multi-topic OR filtering', () => {
    const reactAccessibility = createArticle({
      slug: 'react-accessibility',
      tags: ['React', 'Accessibility'],
    });
    const tooling = createArticle({
      slug: 'tooling',
      tags: ['Tooling'],
    });
    const forms = createArticle({
      slug: 'forms',
      tags: ['Forms'],
    });
    const draft = createArticle({
      slug: 'draft',
      tags: ['React'],
      draft: true,
    });
    const articles = [reactAccessibility, tooling, forms, draft];

    expect(filterBlogArticlesByTopics(articles, ['react'])).toEqual([
      reactAccessibility,
    ]);
    expect(
      filterBlogArticlesByTopics(articles, ['accessibility', 'tooling'])
    ).toEqual([reactAccessibility, tooling]);
    expect(filterBlogArticlesByTopics(articles, [])).toEqual([
      reactAccessibility,
      tooling,
      forms,
    ]);
  });
});
