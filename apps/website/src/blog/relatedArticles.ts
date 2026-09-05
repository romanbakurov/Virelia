import { sortBlogArticleMetadata } from './schema';
import { normalizeBlogTopicValue } from './topicFilters';
import type { BlogArticleMetadata } from './types';

export const DEFAULT_RELATED_BLOG_ARTICLE_LIMIT = 3;

function normalizedTagSet(tags: readonly string[]): Set<string> {
  return new Set(tags.map(normalizeBlogTopicValue).filter(Boolean));
}

function countSharedTags(
  currentTags: ReadonlySet<string>,
  candidateTags: readonly string[]
): number {
  let shared = 0;

  for (const tag of normalizedTagSet(candidateTags)) {
    if (currentTags.has(tag)) {
      shared += 1;
    }
  }

  return shared;
}

function buildCanonicalPublishedCorpus(
  current: BlogArticleMetadata,
  articles: readonly BlogArticleMetadata[]
): BlogArticleMetadata[] {
  const bySlug = new Map<string, BlogArticleMetadata>();

  for (const article of articles) {
    if (!article.draft && !bySlug.has(article.slug)) {
      bySlug.set(article.slug, article);
    }
  }

  if (!current.draft && !bySlug.has(current.slug)) {
    bySlug.set(current.slug, current);
  }

  return sortBlogArticleMetadata([...bySlug.values()]);
}

export function getRelatedBlogArticles(
  current: BlogArticleMetadata,
  publishedArticles: readonly BlogArticleMetadata[],
  limit = DEFAULT_RELATED_BLOG_ARTICLE_LIMIT
): BlogArticleMetadata[] {
  if (limit <= 0) {
    return [];
  }

  const corpus = buildCanonicalPublishedCorpus(current, publishedArticles);
  const currentIndex = corpus.findIndex(
    (article) => article.slug === current.slug
  );
  const currentTags = normalizedTagSet(current.tags);

  const candidates = corpus
    .map((article, canonicalIndex) => ({
      article,
      canonicalIndex,
      sharedTags: countSharedTags(currentTags, article.tags),
    }))
    .filter(({ article }) => article.slug !== current.slug);

  const related = candidates
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort(
      (left, right) =>
        right.sharedTags - left.sharedTags ||
        left.canonicalIndex - right.canonicalIndex
    );

  const selected = related.slice(0, limit);

  if (selected.length >= limit) {
    return selected.map(({ article }) => article);
  }

  const selectedSlugs = new Set(selected.map(({ article }) => article.slug));
  const fallback = candidates
    .filter(
      ({ article, sharedTags }) =>
        sharedTags === 0 && !selectedSlugs.has(article.slug)
    )
    .sort((left, right) => {
      if (currentIndex < 0) {
        return left.canonicalIndex - right.canonicalIndex;
      }

      const leftDistance = Math.abs(left.canonicalIndex - currentIndex);
      const rightDistance = Math.abs(right.canonicalIndex - currentIndex);

      return (
        leftDistance - rightDistance ||
        left.canonicalIndex - right.canonicalIndex
      );
    });

  return [...selected, ...fallback]
    .slice(0, limit)
    .map(({ article }) => article);
}
