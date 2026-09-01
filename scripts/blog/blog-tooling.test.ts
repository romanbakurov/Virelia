import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  buildBlogArticleRegistry,
  checkBlogCorpus,
  createBlogArticle,
} from './tooling';

const roots: string[] = [];

async function createRepositoryFixture(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'vellira-blog-'));
  const contentDirectory = path.join(
    root,
    'apps',
    'website',
    'content',
    'blog'
  );
  const registryDirectory = path.join(root, 'apps', 'website', 'src', 'blog');

  roots.push(root);
  await mkdir(contentDirectory, { recursive: true });
  await mkdir(registryDirectory, { recursive: true });
  await writeFile(
    path.join(registryDirectory, 'article-modules.ts'),
    buildBlogArticleRegistry([]),
    'utf8'
  );

  return root;
}

async function writeArticle(
  root: string,
  directorySlug: string,
  metadata: Record<string, unknown>,
  body = '# Article\n'
): Promise<void> {
  const articleDirectory = path.join(
    root,
    'apps',
    'website',
    'content',
    'blog',
    directorySlug
  );

  await mkdir(articleDirectory, { recursive: true });
  await writeFile(
    path.join(articleDirectory, 'metadata.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8'
  );
  await writeFile(path.join(articleDirectory, 'article.mdx'), body, 'utf8');
}

afterEach(async () => {
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
  );
});

describe('Blog V1 authoring tooling', () => {
  it('creates a safe draft article and updates the static MDX registry', async () => {
    const root = await createRepositoryFixture();
    const result = await createBlogArticle({
      root,
      slug: 'building-component-apis',
      today: '2026-09-02',
    });
    const metadata = JSON.parse(await readFile(result.metadataPath, 'utf8')) as {
      draft: boolean;
      slug: string;
    };
    const registry = await readFile(result.registryPath, 'utf8');

    expect(metadata).toMatchObject({
      slug: 'building-component-apis',
      draft: true,
    });
    expect(registry).toContain(
      "'building-component-apis': () => import('../../content/blog/building-component-apis/article.mdx')"
    );
    await expect(checkBlogCorpus(root)).resolves.toEqual({
      articleCount: 1,
      issues: [],
    });
  });

  it('rejects invalid slugs before writing files', async () => {
    const root = await createRepositoryFixture();

    await expect(
      createBlogArticle({
        root,
        slug: 'Invalid Slug',
        today: '2026-09-02',
      })
    ).rejects.toThrow('lowercase letters, numbers, and single hyphens only');
  });

  it('refuses to overwrite an existing article', async () => {
    const root = await createRepositoryFixture();
    const options = {
      root,
      slug: 'existing-article',
      today: '2026-09-02',
    };

    await createBlogArticle(options);
    const metadataPath = path.join(
      root,
      'apps',
      'website',
      'content',
      'blog',
      'existing-article',
      'metadata.json'
    );
    const before = await readFile(metadataPath, 'utf8');

    await expect(createBlogArticle(options)).rejects.toThrow(
      'article already exists; refusing to overwrite'
    );
    await expect(readFile(metadataPath, 'utf8')).resolves.toBe(before);
  });

  it('generates byte-identical output for the same slug and date', async () => {
    const leftRoot = await createRepositoryFixture();
    const rightRoot = await createRepositoryFixture();
    const options = {
      slug: 'deterministic-authoring',
      today: '2026-09-02',
    };
    const left = await createBlogArticle({ root: leftRoot, ...options });
    const right = await createBlogArticle({ root: rightRoot, ...options });

    await expect(readFile(left.metadataPath, 'utf8')).resolves.toBe(
      await readFile(right.metadataPath, 'utf8')
    );
    await expect(readFile(left.articlePath, 'utf8')).resolves.toBe(
      await readFile(right.articlePath, 'utf8')
    );
    await expect(readFile(left.registryPath, 'utf8')).resolves.toBe(
      await readFile(right.registryPath, 'utf8')
    );
  });

  it('reports invalid corpus metadata', async () => {
    const root = await createRepositoryFixture();

    await writeArticle(root, 'broken-article', {
      title: 'Broken article',
      description: 'Broken metadata fixture.',
      slug: 'broken-article',
      publishedAt: 'not-a-date',
      author: 'Roman Bakurov',
      tags: ['Vellira'],
      draft: true,
    });

    const result = await checkBlogCorpus(root);

    expect(result.issues.some((issue) => issue.includes('publishedAt'))).toBe(true);
  });

  it('detects duplicate metadata slugs across article directories', async () => {
    const root = await createRepositoryFixture();
    const metadata = {
      title: 'Duplicate article',
      description: 'Duplicate slug fixture.',
      slug: 'duplicate-article',
      publishedAt: '2026-09-02',
      author: 'Roman Bakurov',
      tags: ['Vellira'],
      draft: true,
    };

    await writeArticle(root, 'first-article', metadata);
    await writeArticle(root, 'second-article', metadata);

    const result = await checkBlogCorpus(root);

    expect(result.issues).toContain(
      path.join(root, 'apps', 'website', 'content', 'blog') +
        ': duplicate slug duplicate-article'
    );
  });

  it('blocks obvious broken internal blog links', async () => {
    const root = await createRepositoryFixture();

    await writeArticle(
      root,
      'linked-article',
      {
        title: 'Linked article',
        description: 'Internal link fixture.',
        slug: 'linked-article',
        publishedAt: '2026-09-02',
        author: 'Roman Bakurov',
        tags: ['Vellira'],
        draft: true,
      },
      '# Linked article\n\n[Missing article](/blog/missing-article)\n'
    );

    const result = await checkBlogCorpus(root);

    expect(result.issues).toContain(
      'linked-article: internal blog link target does not exist: missing-article'
    );
  });
});
