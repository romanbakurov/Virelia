import { Eye, Heart } from '@vellira-ui/icons';

import type { BlogMetrics } from '../metrics';

import styles from './BlogExperience.module.css';

interface BlogMetricsDisplayProps {
  metrics: BlogMetrics | null | undefined;
  className?: string;
}

function formatMetricCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function BlogMetricsDisplay({
  metrics,
  className,
}: BlogMetricsDisplayProps) {
  const classNames = [styles.metrics, className].filter(Boolean).join(' ');

  if (!metrics) {
    return <div className={classNames} aria-hidden='true' />;
  }

  const views = formatMetricCount(metrics.views);
  const likes = formatMetricCount(metrics.likes);

  return (
    <div className={classNames} aria-label='Article metrics'>
      <span className={styles.metricItem} aria-label={`${views} views`}>
        <Eye size={16} aria-hidden='true' />
        <span aria-hidden='true'>{views}</span>
      </span>
      <span className={styles.metricItem} aria-label={`${likes} likes`}>
        <Heart size={16} aria-hidden='true' />
        <span aria-hidden='true'>{likes}</span>
      </span>
    </div>
  );
}
