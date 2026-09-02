'use client';

import { useEffect, useMemo, useState } from 'react';

import { Check, Copy, Heart, Share } from '@vellira-ui/icons';

import styles from './BlogArticleActions.module.css';

interface BlogArticleActionsProps {
  slug: string;
  title: string;
}

const SITE_URL = 'https://vellira.dev';

function buildShareUrl(baseUrl: string, params: Record<string, string>) {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

export function BlogArticleActions({ slug, title }: BlogArticleActionsProps) {
  const articleUrl = `${SITE_URL}/blog/${slug}`;
  const likeStorageKey = `vellira:blog:liked:${slug}`;
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setLiked(window.localStorage.getItem(likeStorageKey) === '1');
    } catch {
      setLiked(false);
    }
  }, [likeStorageKey]);

  const shareLinks = useMemo(
    () => [
      {
        label: 'LinkedIn',
        href: buildShareUrl('https://www.linkedin.com/sharing/share-offsite/', {
          url: articleUrl,
        }),
      },
      {
        label: 'X',
        href: buildShareUrl('https://twitter.com/intent/tweet', {
          text: title,
          url: articleUrl,
        }),
      },
      {
        label: 'Facebook',
        href: buildShareUrl('https://www.facebook.com/sharer/sharer.php', {
          u: articleUrl,
        }),
      },
      {
        label: 'Reddit',
        href: buildShareUrl('https://www.reddit.com/submit', {
          title,
          url: articleUrl,
        }),
      },
    ],
    [articleUrl, title]
  );

  function toggleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);

    try {
      if (nextLiked) {
        window.localStorage.setItem(likeStorageKey, '1');
      } else {
        window.localStorage.removeItem(likeStorageKey);
      }
    } catch {
      // Keep the interaction usable even when storage is unavailable.
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

  return (
    <aside className={styles.articleActions} aria-label='Article actions'>
      <div className={styles.articleActionsIntro}>
        <strong>Found this useful?</strong>
        <span>Like it or share it with another developer.</span>
      </div>

      <div className={styles.articleActionRow}>
        <button
          type='button'
          className={`${styles.articleActionButton} ${liked ? styles.articleActionButtonActive : ''}`}
          aria-pressed={liked}
          onClick={toggleLike}
        >
          <Heart size={17} aria-hidden='true' />
          {liked ? 'Liked' : 'Like'}
        </button>

        <button
          type='button'
          className={styles.articleActionButton}
          onClick={shareArticle}
        >
          <Share size={17} aria-hidden='true' />
          Share
        </button>

        <div className={styles.articleShareLinks} aria-label='Share this article'>
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target='_blank'
              rel='noreferrer noopener'
            >
              {link.label}
            </a>
          ))}

          <button type='button' onClick={copyArticleLink}>
            {copied ? (
              <Check size={15} aria-hidden='true' />
            ) : (
              <Copy size={15} aria-hidden='true' />
            )}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </aside>
  );
}
