import type { BlogArticleMetadata } from './types';

const SEARCH_SEPARATOR_PATTERN = /[^a-z0-9]+/g;
const COMBINING_MARKS_PATTERN = /[\u0300-\u036f]/g;

export function normalizeBlogSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(COMBINING_MARKS_PATTERN, '')
    .toLowerCase()
    .replace(SEARCH_SEPARATOR_PATTERN, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function getSearchTokens(normalizedQuery: string): string[] {
  return normalizedQuery ? normalizedQuery.split(' ') : [];
}

function containsAllTokens(value: string, tokens: readonly string[]): boolean {
  return tokens.every((token) => value.includes(token));
}

function getArticleSearchScore(
  article: BlogArticleMetadata,
  normalizedQuery: string,
  tokens: readonly string[]
): number | null {
  const title = normalizeBlogSearchText(article.title);
  const tags = article.tags.map(normalizeBlogSearchText);
  const description = normalizeBlogSearchText(article.description);
  const slug = normalizeBlogSearchText(article.slug);
  const searchableFields = [title, ...tags, description, slug];

  const everyTokenMatches = tokens.every((token) =>
    searchableFields.some((field) => field.includes(token))
  );

  if (!everyTokenMatches) {
    return null;
  }

  if (title === normalizedQuery) {
    return 700;
  }

  if (title.startsWith(normalizedQuery)) {
    return 650;
  }

  if (tags.some((tag) => tag === normalizedQuery)) {
    return 600;
  }

  if (containsAllTokens(title, tokens)) {
    return 500;
  }

  if (tokens.every((token) => tags.some((tag) => tag.includes(token)))) {
    return 400;
  }

  if (containsAllTokens(description, tokens)) {
    return 300;
  }

  if (containsAllTokens(slug, tokens)) {
    return 200;
  }

  return 100;
}

export function searchBlogArticles(
  articles: readonly BlogArticleMetadata[],
  query: string
): BlogArticleMetadata[] {
  const publishedArticles = articles.filter((article) => !article.draft);
  const normalizedQuery = normalizeBlogSearchText(query);

  if (!normalizedQuery) {
    return [...publishedArticles];
  }

  const tokens = getSearchTokens(normalizedQuery);

  return publishedArticles
    .map((article, index) => ({
      article,
      index,
      score: getArticleSearchScore(article, normalizedQuery, tokens),
    }))
    .filter(
      (
        candidate
      ): candidate is {
        article: BlogArticleMetadata;
        index: number;
        score: number;
      } => candidate.score !== null
    )
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ article }) => article);
}
