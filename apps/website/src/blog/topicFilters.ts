import { normalizeBlogSearchText } from './search';
import type { BlogArticleMetadata } from './types';

export interface BlogTopicOption {
  value: string;
  label: string;
  count: number;
}

export const DEFAULT_INLINE_BLOG_TOPIC_LIMIT = 5;

export function normalizeBlogTopicValue(value: string): string {
  return normalizeBlogSearchText(value).replace(/\s+/g, '-');
}

function compareTopicValues(left: string, right: string): number {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

export function deriveBlogTopicOptions(
  articles: readonly BlogArticleMetadata[]
): BlogTopicOption[] {
  const topics = new Map<string, BlogTopicOption>();

  for (const article of articles) {
    if (article.draft) {
      continue;
    }

    const seenArticleTopics = new Set<string>();

    for (const tag of article.tags) {
      const value = normalizeBlogTopicValue(tag);

      if (!value || seenArticleTopics.has(value)) {
        continue;
      }

      seenArticleTopics.add(value);

      const existing = topics.get(value);

      if (existing) {
        existing.count += 1;
      } else {
        topics.set(value, {
          value,
          label: tag,
          count: 1,
        });
      }
    }
  }

  return [...topics.values()].sort((left, right) =>
    compareTopicValues(left.value, right.value)
  );
}

export function selectCommonBlogTopicOptions(
  topics: readonly BlogTopicOption[],
  limit = DEFAULT_INLINE_BLOG_TOPIC_LIMIT
): BlogTopicOption[] {
  if (limit <= 0) {
    return [];
  }

  return [...topics]
    .sort(
      (left, right) =>
        right.count - left.count || compareTopicValues(left.value, right.value)
    )
    .slice(0, limit);
}

export function filterBlogArticlesByTopics(
  articles: readonly BlogArticleMetadata[],
  selectedTopics: readonly string[]
): BlogArticleMetadata[] {
  const normalizedSelection = new Set(
    selectedTopics.map(normalizeBlogTopicValue).filter(Boolean)
  );

  return articles.filter((article) => {
    if (article.draft) {
      return false;
    }

    if (normalizedSelection.size === 0) {
      return true;
    }

    return article.tags.some((tag) =>
      normalizedSelection.has(normalizeBlogTopicValue(tag))
    );
  });
}
