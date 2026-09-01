import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import type { BlogArticleMetadata } from '../types';

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
}

export function BlogIndex({ articles }: BlogIndexProps) {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby='blog-heading'>
        <Container size='wide'>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Vellira Engineering Blog</p>
            <h1 id='blog-heading'>Notes from building Vellira.</h1>
            <p className={styles.heroDescription}>
              Practical writing about design systems, cross-platform component
              architecture, accessibility, developer tooling, and the
              engineering decisions behind Vellira.
            </p>
          </div>
        </Container>
      </section>

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
                  <p className={styles.cardDescription}>{article.description}</p>

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
