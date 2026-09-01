import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { BlogArticleView, BlogIndex } from '../../apps/website/src/blog/ui';
import type {
  BlogArticle,
  BlogArticleMetadata,
} from '../../apps/website/src/blog/types';

function createMetadata(
  overrides: Partial<BlogArticleMetadata> = {}
): BlogArticleMetadata {
  return {
    title: 'Building reliable component APIs',
    description: 'A practical article about component API design.',
    slug: 'building-reliable-component-apis',
    publishedAt: '2026-09-01',
    author: 'Roman Bakurov',
    tags: ['Design Systems', 'TypeScript'],
    draft: false,
    ...overrides,
  };
}

describe('Blog V1 index experience', () => {
  it('renders an explicit empty state when there are no published articles', () => {
    const html = renderToStaticMarkup(<BlogIndex articles={[]} />);

    expect(html).toContain('Publishing soon');
    expect(html).toContain('The foundation is ready.');
    expect(html).not.toContain('/blog/building-reliable-component-apis');
  });

  it('renders published article metadata and stable article links', () => {
    const html = renderToStaticMarkup(
      <BlogIndex articles={[createMetadata()]} />
    );

    expect(html).toContain('Building reliable component APIs');
    expect(html).toContain('September 1, 2026');
    expect(html).toContain('Roman Bakurov');
    expect(html).toContain('Design Systems');
    expect(html).toContain('href="/blog/building-reliable-component-apis"');
  });
});

describe('Blog V1 article experience', () => {
  it('renders semantic article metadata, content, and back navigation', () => {
    function Content() {
      return (
        <>
          <h2>Shared contracts</h2>
          <p>Article body.</p>
          <pre>
            <code>{'const platform = "web";'}</code>
          </pre>
        </>
      );
    }

    const article: BlogArticle = {
      metadata: createMetadata({ updatedAt: '2026-09-02' }),
      Content,
    };
    const html = renderToStaticMarkup(<BlogArticleView article={article} />);

    expect(html).toContain('href="/blog"');
    expect(html).toContain('Building reliable component APIs');
    expect(html).toContain('Published');
    expect(html).toContain('September 1, 2026');
    expect(html).toContain('Updated');
    expect(html).toContain('September 2, 2026');
    expect(html).toContain('<h2>Shared contracts</h2>');
    expect(html).toContain('const platform = &quot;web&quot;;');
  });
});
