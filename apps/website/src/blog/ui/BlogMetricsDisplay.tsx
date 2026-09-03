'use client';

import { Eye, Heart, HeartFilled } from '@vellira-ui/icons';
import { useEffect, useState } from 'react';

import { fetchBlogArticleLike, type BlogMetrics } from '../metrics';

import styles from './BlogExperience.module.css';

interface BlogMetricsDisplayProps {
  slug: string;
  metrics: BlogMetrics | null | undefined;
  className?: string;
}

function formatMetricCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function BlogMetricsDisplay({
  slug,
  metrics,
  className,
}: BlogMetricsDisplayProps) {
  const [liked, setLiked] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetchBlogArticleLike(slug)
      .then((state) => {
        if (!cancelled) {
          setLiked(state.liked);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLiked(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!metrics) {
    return null;
  }

  const classNames = [styles.metrics, className].filter(Boolean).join(' ');
  const views = formatMetricCount(metrics.views);
  const likes = formatMetricCount(metrics.likes);

  return (
    <div className={classNames} aria-label='Article metrics'>
      <span className={styles.metricItem} aria-label={`${views} views`}>
        <Eye size={16} aria-hidden='true' />
        <span aria-hidden='true'>{views}</span>
      </span>

      <span
        className={styles.metricItem}
        aria-label={
          liked === true ? `${likes} likes, liked by you` : `${likes} likes`
        }
      >
        {liked === true ? (
          <HeartFilled size={16} aria-hidden='true' />
        ) : (
          <Heart size={16} aria-hidden='true' />
        )}

        <span aria-hidden='true'>{likes}</span>
      </span>
    </div>
  );
}
