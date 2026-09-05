'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Search } from '@vellira-ui/icons';

import { Container } from '@/components/layout/Container';
import type { BlogArticleMetadata } from '@/blog';
import { fetchBlogMetricsBatch, type BlogMetricsBySlug } from '../metrics';
import {
  normalizeBlogSearchText,
  searchBlogArticles,
} from '../search';
import { BlogMetricsDisplay } from './BlogMetricsDisplay';
import { formatBlogDate } from './formatBlogDate';

import styles from './BlogExperience.module.css';

interface BlogIndexProps {
  articles: readonly BlogArticleMetadata[];
  metricsBySlug?: BlogMetricsBySlug;
}

function readSearchQueryFromUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get('q') ?? '';
}

function replaceSearchQueryInUrl(query: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  const nextQuery = query.trim();

  if (nextQuery) {
    url.searchParams.set('q', nextQuery);
  } else {
    url.searchParams.delete('q');
  }

  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`
  );
}

export function BlogIndex({ articles, metricsBySlug = {} }: BlogIndexProps) {
  const [query, setQuery] = useState('');
  const [resolvedMetricsBySlug, setResolvedMetricsBySlug] =
    useState<BlogMetricsBySlug>(metricsBySlug);
  const publishedArticles = useMemo(
    () => searchBlogArticles(articles, ''),
    [articles]
  );
  const filteredArticles = useMemo(
    () => searchBlogArticles(publishedArticles, query),
    [publishedArticles, query]
  );
  const normalizedQuery = normalizeBlogSearchText(query);

  useEffect(() => {
    const syncQueryFromUrl = () => setQuery(readSearchQueryFromUrl());

    syncQueryFromUrl();
    window.addEventListener('popstate', syncQueryFromUrl);

    return () => window.removeEventListener('popstate', syncQueryFromUrl);
  }, []);

  useEffect(() => {
    const slugs = publishedArticles.map((article) => article.slug);

    if (
      slugs.length === 0 ||
      slugs.every((slug) => resolvedMetricsBySlug[slug] !== undefined)
    ) {
      return;
    }

    let cancelled = false;

    void fetchBlogMetricsBatch(slugs)
      .then((metrics) => {
        if (!cancelled) {
          setResolvedMetricsBySlug(metrics);
        }
      })
      .catch(() => {
        // Metrics are supplemental and must never block or break the blog index.
      });

    return () => {
      cancelled = true;
    };
  }, [publishedArticles]);

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    replaceSearchQueryInUrl(nextQuery);
  };

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <Container size='wide'>
          <div className={styles.heroContent}>
            <div className={styles.heroEyebrow}>Blog</div>

            <h1>Blog</h1>

            <p className={styles.heroDescription}>
              Practical engineering notes on design systems, React, React
              Native, and developer tooling.
            </p>
          </div>
        </Container>
      </header>

      <section className={styles.indexSection} aria-label='Published articles'>
        <Container size='wide'>
          {publishedArticles.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.eyebrow}>Publishing soon</p>
              <h2>The foundation is ready.</h2>
              <p>
                The first engineering articles are being prepared. They will
                appear here once they have been reviewed and published.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.discoveryToolbar}>
                <label className={styles.search}>
                  <Search aria-hidden='true' className={styles.searchIcon} />

                  <input
                    type='search'
                    value={query}
                    onChange={(event) => updateQuery(event.target.value)}
                    placeholder='Search articles...'
                    aria-label='Search articles'
                    className={styles.searchInput}
                  />

                  {query && (
                    <button
                      type='button'
                      className={styles.clearSearch}
                      aria-label='Clear search'
                      onClick={() => updateQuery('')}
                    >
                      ×
                    </button>
                  )}
                </label>
              </div>

              {normalizedQuery && (
                <div
                  className={styles.resultsMeta}
                  role='status'
                  aria-live='polite'
                >
                  {filteredArticles.length === 1
                    ? '1 article'
                    : `${filteredArticles.length} articles`}
                </div>
              )}

              {filteredArticles.length > 0 ? (
                <div className={styles.articleGrid}>
                  {filteredArticles.map((article) => (
                    <article key={article.slug} className={styles.articleCard}>
                      <div className={styles.cardMeta}>
                        <time dateTime={article.publishedAt}>
                          {formatBlogDate(article.publishedAt)}
                        </time>
                        <span
                          className={styles.metaDivider}
                          aria-hidden='true'
                        />
                        <span>{article.author}</span>
                      </div>

                      <h2>{article.title}</h2>
                      <p className={styles.cardDescription}>
                        {article.description}
                      </p>

                      <BlogMetricsDisplay
                        slug={article.slug}
                        metrics={resolvedMetricsBySlug[article.slug]}
                      />

                      <div className={styles.tags} aria-label='Article tags'>
                        {article.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/blog/${article.slug}`}
                        className={styles.cardLink}
                        aria-label={`Read ${article.title}`}
                      >
                        Read article
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.eyebrow}>No matches</p>
                  <h2>No articles found.</h2>
                  <p>Try another search or clear the current query.</p>
                  <button
                    type='button'
                    className={styles.resetSearch}
                    onClick={() => updateQuery('')}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </main>
  );
}
