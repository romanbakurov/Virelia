import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import type { BlogMetricsBySlug } from '../metrics';
import type { BlogArticleMetadata } from '@/blog';
import { BlogMetricsDisplay } from './BlogMetricsDisplay';

import styles from './BlogExperience.module.css';

const blogDateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatBlogDate(date: string): string {
  return blogDateFormatter.format(new Date(`${date}T00:00:00.000Z`));
}

interface BlogIndexProps {
  articles: readonly BlogArticleMetadata[];
  metricsBySlug?: BlogMetricsBySlug;
}

export function BlogIndex({ articles, metricsBySlug = {} }: BlogIndexProps) {
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
          {articles.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.eyebrow}>Publishing soon</p>
              <h2>The foundation is ready.</h2>
              <p>
                The first engineering articles are being prepared. They will
                appear here once they have been reviewed and published.
              </p>
            </div>
          ) : (
            <div className={styles.articleGrid}>
              {articles.map((article) => (
                <article key={article.slug} className={styles.articleCard}>
                  <div className={styles.cardMeta}>
                    <time dateTime={article.publishedAt}>
                      {formatBlogDate(article.publishedAt)}
                    </time>
                    <span className={styles.metaDivider} aria-hidden='true' />
                    <span>{article.author}</span>
                  </div>

                  <h2>{article.title}</h2>
                  <p className={styles.cardDescription}>
                    {article.description}
                  </p>

                  <BlogMetricsDisplay metrics={metricsBySlug[article.slug]} />

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
          )}
        </Container>
      </section>
    </main>
  );
}
