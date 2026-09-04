import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPublishedBlogArticles } from '../../apps/website/src/blog';
import { fetchBlogMetricsBatch } from '../../apps/website/src/blog/metrics';
import {
  GET as getPublishedManifest,
} from '../../apps/website/src/app/(marketing)/(site)/blog/manifest.json/route';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Blog V1 metrics freshness', () => {
  it('uses one uncached batch request for index metrics', async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) =>
        ({
          ok: true,
          status: 200,
          json: async () => ({
            items: [
              { slug: 'one-runtime', views: 4, likes: 1 },
              { slug: 'two-runtimes', views: 7, likes: 2 },
            ],
          }),
          init,
        }) as Response
    );

    vi.stubGlobal('fetch', fetchMock);

    const metrics = await fetchBlogMetricsBatch([
      'one-runtime',
      'two-runtimes',
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ cache: 'no-store' });
    expect(metrics['one-runtime']).toEqual({
      slug: 'one-runtime',
      views: 4,
      likes: 1,
    });
    expect(metrics['two-runtimes']).toEqual({
      slug: 'two-runtimes',
      views: 7,
      likes: 2,
    });
  });
});

describe('Blog V1 public publication manifest', () => {
  it('matches canonical published slugs in deterministic order', async () => {
    const articles = await getPublishedBlogArticles();
    const response = await getPublishedManifest();

    await expect(response.json()).resolves.toEqual({
      schemaVersion: 1,
      slugs: articles.map((article) => article.slug).sort(),
    });
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=0, s-maxage=30, stale-while-revalidate=300'
    );
  });
});
