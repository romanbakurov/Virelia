import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import type { BlogArticle } from '../types';
import { BlogArticleActions } from './BlogArticleActions';
import { formatBlogDate } from './BlogIndex';

import styles from './BlogExperience.module.css';

interface BlogArticleViewProps {
  article: BlogArticle;
}

export function BlogArticleView({ article }: BlogArticleViewProps) {
  const { metadata, Content } = article;

  return (
    <main className={styles.page}>
      <article className={styles.articlePage}>
        <Container size='wide' className={styles.articleShell}>
          <header className={styles.articleHeader}>
            <Link href='/blog' className={styles.backLink}>
              Back to blog
            </Link>

            <div className={styles.tags} aria-label='Article tags'>
              {metadata.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            <h1>{metadata.title}</h1>
            <p className={styles.articleDescription}>{metadata.description}</p>

            <div className={styles.articleMeta}>
              <span>{metadata.author}</span>
              <span className={styles.metaDivider} aria-hidden='true' />
              <span>
                Published{' '}
                <time dateTime={metadata.publishedAt}>
                  {formatBlogDate(metadata.publishedAt)}
                </time>
              </span>

              {metadata.updatedAt && (
                <>
                  <span className={styles.metaDivider} aria-hidden='true' />
                  <span>
                    Updated{' '}
                    <time dateTime={metadata.updatedAt}>
                      {formatBlogDate(metadata.updatedAt)}
                    </time>
                  </span>
                </>
              )}
            </div>
          </header>

          <div className={styles.articleBody}>
            <Content />
          </div>

          <BlogArticleActions slug={metadata.slug} title={metadata.title} />
        </Container>
      </article>
    </main>
  );
}
