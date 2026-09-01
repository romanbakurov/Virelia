import type { ComponentType } from 'react';

import { getPublishedBlogArticleMetadata } from './store';
import type { BlogArticle } from './types';

export {
  BLOG_CONTENT_DIRECTORY,
  getPublishedBlogArticleMetadata,
  getPublishedBlogArticles,
} from './store';
export type { BlogArticle, BlogArticleMetadata } from './types';

interface BlogMDXModule {
  default: ComponentType;
}

export async function getPublishedBlogArticle(
  slug: string
): Promise<BlogArticle | null> {
  const metadata = await getPublishedBlogArticleMetadata(slug);

  if (metadata === null) {
    return null;
  }

  const module = (await import(
    `../../content/blog/${metadata.slug}/article.mdx`
  )) as BlogMDXModule;

  if (typeof module.default !== 'function') {
    throw new Error(
      `Blog article ${metadata.slug}: MDX module has no default component export`
    );
  }

  return {
    metadata,
    Content: module.default,
  };
}
