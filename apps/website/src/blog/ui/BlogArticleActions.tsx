'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Check,
  Copy,
  Eye,
  Facebook,
  Heart,
  HeartFilled,
  LinkedIn,
  Reddit,
  Share,
  X,
} from '@vellira-ui/icons';

import {
  fetchBlogArticleLike,
  fetchBlogMetrics,
  likeBlogArticle,
  registerBlogArticleView,
  unlikeBlogArticle,
  type BlogMetrics,
} from '../metrics';

import styles from './BlogArticleActions.module.css';

interface BlogArticleActionsProps {
  slug: string;
  title: string;
}

const SITE_URL = 'https://vellira.dev';
const pendingViewRegistrations = new Map<string, Promise<BlogMetrics | null>>();

function buildShareUrl(baseUrl: string, params: Record<string, string>) {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

function formatMetricCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

async function registerArticleViewOnce(
  slug: string
): Promise<BlogMetrics | null> {
  const pendingRegistration = pendingViewRegistrations.get(slug);

  if (pendingRegistration) {
    return pendingRegistration;
  }

  const registration = registerBlogArticleView(slug)
    .then((response) => response.metrics)
    .catch(() => null)
    .finally(() => {
      pendingViewRegistrations.delete(slug);
    });

  pendingViewRegistrations.set(slug, registration);

  return registration;
}

export function BlogArticleActions({ slug, title }: BlogArticleActionsProps) {
  const articleUrl = `${SITE_URL}/blog/${slug}`;
  const [metrics, setMetrics] = useState<BlogMetrics | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likePending, setLikePending] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrateMetrics() {
      try {
        const likeResult = await fetchBlogArticleLike(slug);

        if (cancelled) {
          return;
        }

        setLiked(likeResult.liked);
      } catch {
        // Leave actor-specific state unknown when the backend is unavailable.
      }

      const viewMetrics = await registerArticleViewOnce(slug);

      if (cancelled) {
        return;
      }

      if (viewMetrics) {
        setMetrics(viewMetrics);
        return;
      }

      try {
        const metricsResult = await fetchBlogMetrics(slug);

        if (!cancelled) {
          setMetrics(metricsResult);
        }
      } catch {
        // Keep the article readable without inventing a metric count.
      }
    }

    void hydrateMetrics();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const shareLinks = useMemo(
    () => [
      {
        label: 'LinkedIn',
        icon: <LinkedIn size={17} aria-hidden='true' />,
        href: buildShareUrl('https://www.linkedin.com/sharing/share-offsite/', {
          url: articleUrl,
        }),
      },
      {
        label: 'X',
        icon: <X size={17} aria-hidden='true' />,
        href: buildShareUrl('https://twitter.com/intent/tweet', {
          text: title,
          url: articleUrl,
        }),
      },
      {
        label: 'Facebook',
        icon: <Facebook size={17} aria-hidden='true' />,
        href: buildShareUrl('https://www.facebook.com/sharer/sharer.php', {
          u: articleUrl,
        }),
      },
      {
        label: 'Reddit',
        icon: <Reddit size={17} aria-hidden='true' />,
        href: buildShareUrl('https://www.reddit.com/submit', {
          title,
          url: articleUrl,
        }),
      },
    ],
    [articleUrl, title]
  );

  async function toggleLike() {
    if (likePending) {
      return;
    }

    try {
      setLikePending(true);

      const result =
        liked === true
          ? await unlikeBlogArticle(slug)
          : await likeBlogArticle(slug);

      setMetrics(result.metrics);
      setLiked(result.liked);
    } catch {
      // Preserve the last known state instead of inventing a metric count.
    } finally {
      setLikePending(false);
    }
  }

  async function copyArticleLink() {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function shareArticle() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: articleUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    await copyArticleLink();
  }

  const likes = metrics ? formatMetricCount(metrics.likes) : null;
  const views = metrics ? formatMetricCount(metrics.views) : null;

  return (
    <aside className={styles.articleActions} aria-label='Article actions'>
      <div className={styles.articleActionsIntro}>
        <strong>Found this useful?</strong>
        <span>Like it or share it with another developer.</span>
      </div>

      <div className={styles.articleActionRow}>
        <button
          type='button'
          className={`${styles.articleActionButton} ${styles.articleMetricButton} ${styles.articleTooltip} ${
            liked ? styles.articleActionButtonActive : ''
          }`}
          aria-label={liked ? 'Unlike this article' : 'Like this article'}
          aria-pressed={liked === true}
          data-tooltip={liked ? 'Unlike' : 'Like'}
          disabled={likePending}
          onClick={toggleLike}
        >
          {liked ? (
            <HeartFilled size={17} aria-hidden='true' />
          ) : (
            <Heart size={17} aria-hidden='true' />
          )}
          {likes !== null ? (
            <span aria-label={`${likes} likes`} aria-live='polite'>
              {likes}
            </span>
          ) : null}
          <span className={styles.visuallyHidden}>
            {liked ? 'Liked' : 'Like'}
          </span>
        </button>

        {views !== null ? (
          <span
            className={`${styles.articleMetricPill} ${styles.articleTooltip}`}
            aria-label={`${views} views`}
            data-tooltip='Views'
          >
            <Eye size={17} aria-hidden='true' />
            <span aria-hidden='true'>{views}</span>
          </span>
        ) : null}

        <button
          type='button'
          className={`${styles.articleActionButton} ${styles.articleIconButton} ${styles.articleTooltip}`}
          aria-label='Share'
          data-tooltip='Share'
          onClick={shareArticle}
        >
          <Share size={17} aria-hidden='true' />
        </button>

        <div
          className={styles.articleShareLinks}
          aria-label='Share this article'
        >
          {shareLinks.map((link) => (
            <a
              key={link.label}
              className={`${styles.articleIconButton} ${styles.articleTooltip}`}
              href={link.href}
              target='_blank'
              rel='noreferrer noopener'
              aria-label={link.label}
              data-tooltip={link.label}
            >
              {link.icon}
            </a>
          ))}

          <button
            type='button'
            className={`${styles.articleIconButton} ${styles.articleTooltip}`}
            aria-label={copied ? 'Copied' : 'Copy link'}
            data-tooltip={copied ? 'Copied' : 'Copy link'}
            onClick={copyArticleLink}
          >
            {copied ? (
              <Check size={15} aria-hidden='true' />
            ) : (
              <Copy size={15} aria-hidden='true' />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
