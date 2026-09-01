import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  assertUniqueBlogSlugs,
  parseBlogArticleMetadata,
} from '../../apps/website/src/blog/schema';
import {
  getPublishedBlogArticleMetadataFromCorpus,
  readBlogArticleMetadataFromDirectory,
  readPublishedBlogArticleMetadataFromDirectory,
} from '../../apps/website/src/blog/store';
import type { BlogArticleMetadata } from '../../apps/website/src/blog/types';

const temporaryDirectories: string[] = [];

function createMetadata(
  overrides: Partial<BlogArticleMetadata> = {}
): BlogArticleMetadata {
  return {
    title: 'Example article',
    description: 'Example article description.',
    slug: 'example-article',
    publishedAt: '2026-09-01',
    author: 'Roman Bakurov',
    tags: ['Design Systems'],
    draft: false,
    ...overrides,
  };
}

async function createTemporaryCorpus(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), 'vellira-blog-'));
  temporaryDirectories.push(directory);
  return directory;
}

async function writeArticle(
  contentDirectory: string,
  directorySlug: string,
  metadata: unknown
): Promise<void> {
  const articleDirectory = path.join(contentDirectory, directorySlug);
  await mkdir(articleDirectory, { recursive: true });
  await writeFile(
    path.join(articleDirectory, 'metadata.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    path.join(articleDirectory, 'article.mdx'),
    '# Example article\n',
    'utf8'
  );
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true }))
  );
});

describe('Blog V1 metadata schema', () => {
  it('accepts the canonical metadata contract', () => {
    const metadata = createMetadata({
      updatedAt: '2026-09-02',
      socialImage: '/blog/example-article.png',
    });

    expect(parseBlogArticleMetadata(metadata)).toEqual(metadata);
  });

  it('rejects missing required fields', () => {
    const metadata = createMetadata() as Record<string, unknown>;
    delete metadata.description;

    expect(() => parseBlogArticleMetadata(metadata)).toThrow(
      'missing required field description'
    );
  });

  it('rejects malformed metadata and unsupported fields', () => {
    expect(() => parseBlogArticleMetadata('not-an-object')).toThrow(
      'metadata must be a JSON object'
    );

    expect(() =>
      parseBlogArticleMetadata({
        ...createMetadata(),
        category: 'Engineering',
      })
    ).toThrow('unsupported metadata field: category');
  });

  it('rejects invalid publication dates', () => {
    expect(() =>
      parseBlogArticleMetadata(createMetadata({ publishedAt: '2026-02-30' }))
    ).toThrow('publishedAt must be a valid calendar date');

    expect(() =>
      parseBlogArticleMetadata(
        createMetadata({
          publishedAt: '2026-09-02',
          updatedAt: '2026-09-01',
        })
      )
    ).toThrow('updatedAt cannot be before publishedAt');
  });

  it('detects duplicate slugs deterministically', () => {
    const metadata = createMetadata();

    expect(() => assertUniqueBlogSlugs([metadata, metadata])).toThrow(
      'duplicate slug example-article'
    );
  });
});

describe('Blog V1 filesystem content boundary', () => {
  it('requires directory and metadata slugs to agree', async () => {
    const contentDirectory = await createTemporaryCorpus();
    await writeArticle(
      contentDirectory,
      'different-directory',
      createMetadata()
    );

    await expect(
      readBlogArticleMetadataFromDirectory(contentDirectory)
    ).rejects.toThrow(
      'metadata slug example-article must match directory different-directory'
    );
  });

  it('excludes drafts and sorts published articles deterministically', async () => {
    const contentDirectory = await createTemporaryCorpus();

    await writeArticle(
      contentDirectory,
      'older-article',
      createMetadata({
        slug: 'older-article',
        publishedAt: '2026-08-30',
      })
    );
    await writeArticle(
      contentDirectory,
      'zeta-article',
      createMetadata({
        slug: 'zeta-article',
        publishedAt: '2026-09-01',
      })
    );
    await writeArticle(
      contentDirectory,
      'alpha-article',
      createMetadata({
        slug: 'alpha-article',
        publishedAt: '2026-09-01',
      })
    );
    await writeArticle(
      contentDirectory,
      'draft-article',
      createMetadata({
        slug: 'draft-article',
        publishedAt: '2026-09-02',
        draft: true,
      })
    );

    const published =
      await readPublishedBlogArticleMetadataFromDirectory(contentDirectory);

    expect(published.map((article) => article.slug)).toEqual([
      'alpha-article',
      'zeta-article',
      'older-article',
    ]);
  });

  it('keeps draft filtering fail-safe for in-memory corpus consumers', () => {
    const published = createMetadata({ slug: 'published' });
    const draft = createMetadata({ slug: 'draft', draft: true });

    expect(
      getPublishedBlogArticleMetadataFromCorpus([draft, published]).map(
        (article) => article.slug
      )
    ).toEqual(['published']);
  });

  it('rejects missing article bodies', async () => {
    const contentDirectory = await createTemporaryCorpus();
    const articleDirectory = path.join(contentDirectory, 'example-article');
    await mkdir(articleDirectory, { recursive: true });
    await writeFile(
      path.join(articleDirectory, 'metadata.json'),
      JSON.stringify(createMetadata()),
      'utf8'
    );

    await expect(
      readBlogArticleMetadataFromDirectory(contentDirectory)
    ).rejects.toThrow('missing required article body');
  });
});
