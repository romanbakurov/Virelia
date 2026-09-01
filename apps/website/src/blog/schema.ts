import type { BlogArticleMetadata } from './types';

const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const REQUIRED_METADATA_KEYS = [
  'title',
  'description',
  'slug',
  'publishedAt',
  'author',
  'tags',
  'draft',
] as const;

const OPTIONAL_METADATA_KEYS = ['updatedAt', 'socialImage'] as const;
const ALLOWED_METADATA_KEYS = new Set<string>([
  ...REQUIRED_METADATA_KEYS,
  ...OPTIONAL_METADATA_KEYS,
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNonEmptyString(
  value: unknown,
  field: string,
  source: string
): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${source}: ${field} must be a non-empty string`);
  }

  return value;
}

function readISODate(value: unknown, field: string, source: string): string {
  const date = readNonEmptyString(value, field, source);

  if (!ISO_DATE_PATTERN.test(date)) {
    throw new Error(`${source}: ${field} must use YYYY-MM-DD format`);
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`${source}: ${field} must be a valid calendar date`);
  }

  return date;
}

export function assertBlogSlug(slug: string, source = 'blog slug'): string {
  if (!BLOG_SLUG_PATTERN.test(slug)) {
    throw new Error(
      `${source}: slug must contain lowercase letters, numbers, and single hyphens only`
    );
  }

  return slug;
}

export function parseBlogArticleMetadata(
  value: unknown,
  source = 'blog article metadata'
): BlogArticleMetadata {
  if (!isRecord(value)) {
    throw new Error(`${source}: metadata must be a JSON object`);
  }

  const unknownKeys = Object.keys(value)
    .filter((key) => !ALLOWED_METADATA_KEYS.has(key))
    .sort();

  if (unknownKeys.length > 0) {
    throw new Error(
      `${source}: unsupported metadata field${unknownKeys.length === 1 ? '' : 's'}: ${unknownKeys.join(', ')}`
    );
  }

  for (const key of REQUIRED_METADATA_KEYS) {
    if (!(key in value)) {
      throw new Error(`${source}: missing required field ${key}`);
    }
  }

  const title = readNonEmptyString(value.title, 'title', source);
  const description = readNonEmptyString(
    value.description,
    'description',
    source
  );
  const slug = assertBlogSlug(
    readNonEmptyString(value.slug, 'slug', source),
    source
  );
  const publishedAt = readISODate(value.publishedAt, 'publishedAt', source);
  const author = readNonEmptyString(value.author, 'author', source);

  if (!Array.isArray(value.tags) || value.tags.length === 0) {
    throw new Error(`${source}: tags must be a non-empty array of strings`);
  }

  const tags = value.tags.map((tag, index) =>
    readNonEmptyString(tag, `tags[${index}]`, source)
  );
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  if (new Set(normalizedTags).size !== normalizedTags.length) {
    throw new Error(`${source}: tags must not contain duplicates`);
  }

  if (typeof value.draft !== 'boolean') {
    throw new Error(`${source}: draft must be a boolean`);
  }

  const updatedAt =
    value.updatedAt === undefined
      ? undefined
      : readISODate(value.updatedAt, 'updatedAt', source);

  if (updatedAt !== undefined && updatedAt < publishedAt) {
    throw new Error(`${source}: updatedAt cannot be before publishedAt`);
  }

  const socialImage =
    value.socialImage === undefined
      ? undefined
      : readNonEmptyString(value.socialImage, 'socialImage', source);

  return {
    title,
    description,
    slug,
    publishedAt,
    ...(updatedAt === undefined ? {} : { updatedAt }),
    author,
    tags,
    draft: value.draft,
    ...(socialImage === undefined ? {} : { socialImage }),
  };
}

export function assertUniqueBlogSlugs(
  articles: readonly BlogArticleMetadata[],
  source = 'blog corpus'
): void {
  const seen = new Set<string>();

  for (const article of articles) {
    if (seen.has(article.slug)) {
      throw new Error(`${source}: duplicate slug ${article.slug}`);
    }

    seen.add(article.slug);
  }
}

export function sortBlogArticleMetadata(
  articles: readonly BlogArticleMetadata[]
): BlogArticleMetadata[] {
  return [...articles].sort((left, right) => {
    const byDate = right.publishedAt.localeCompare(left.publishedAt);

    if (byDate !== 0) {
      return byDate;
    }

    return left.slug.localeCompare(right.slug);
  });
}
