// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { BlogArticleMetadata } from '../../apps/website/src/blog/types';
import { BlogContinueReading } from '../../apps/website/src/blog/ui/BlogContinueReading';

function createArticle(
  slug: string,
  overrides: Partial<BlogArticleMetadata> = {}
): BlogArticleMetadata {
  return {
    title: `Article ${slug}`,
    description: `Description for ${slug}`,
    slug,
    publishedAt: '2026-09-05',
    author: 'Roman Bakurov',
    tags: ['React', 'Design Systems'],
    draft: false,
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
});

describe('blog continue reading experience', () => {
  it.each([1, 2, 3])('renders %i recommendation card(s)', (count) => {
    const articles = Array.from({ length: count }, (_, index) =>
      createArticle(`related-${index + 1}`)
    );

    render(<BlogContinueReading articles={articles} />);

    expect(
      screen.getByRole('region', { name: 'Continue reading' })
    ).toBeInTheDocument();

    for (const article of articles) {
      expect(
        screen.getByRole('link', { name: `Read ${article.title}` })
      ).toHaveAttribute('href', `/blog/${article.slug}`);
      expect(screen.getByText(article.description)).toBeInTheDocument();
    }

    expect(
      screen.getByRole('link', { name: 'View all articles' })
    ).toHaveAttribute('href', '/blog');
  });

  it('caps rendering at three recommendations', () => {
    const articles = [
      createArticle('one'),
      createArticle('two'),
      createArticle('three'),
      createArticle('four'),
    ];

    render(<BlogContinueReading articles={articles} />);

    expect(
      screen.getAllByRole('link', { name: /^Read Article / })
    ).toHaveLength(3);
    expect(
      screen.queryByRole('link', { name: 'Read Article four' })
    ).not.toBeInTheDocument();
  });

  it('renders nothing when no recommendations are available', () => {
    const { container } = render(<BlogContinueReading articles={[]} />);

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole('region', { name: 'Continue reading' })
    ).not.toBeInTheDocument();
  });
});
